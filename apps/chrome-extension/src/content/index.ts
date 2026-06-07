import { Detector } from '@ghostkey/core/detector';
import { Classifier } from '@ghostkey/core/classifier';
import { Suppressor } from '@ghostkey/core/suppressor';
import { Restorer } from '@ghostkey/core/restorer';
import { DomObserver } from '@ghostkey/core/heuristics/domObserver';
import { loadRulesForHost } from '@ghostkey/rule-packs';
import { storageFacade } from '@ghostkey/browser-shared/storage';
import { logger } from '@ghostkey/browser-shared/logger';
import { MessageType, type Message } from '@ghostkey/browser-shared/messaging/types';

let suppressor: Suppressor;
let restorer: Restorer;
let observer: DomObserver;
let enabled = true;

async function init() {
  try {
    const settings = await storageFacade.getSettings();
    logger.setDebug(settings.debugMode);
    enabled = settings.globalEnabled
      && !settings.disabledSites.includes(location.hostname)
      && !settings.allowlist.includes(location.hostname);

    if (!enabled) {
      logger.info('GhostKey disabled for', location.hostname);
      return;
    }

    if (observer) {
      observer.disconnect();
    }

    const rules = loadRulesForHost(location.hostname);
    const detector = new Detector(rules);
    const classifier = new Classifier(settings.aggressiveMode);
    suppressor = new Suppressor();
    restorer = new Restorer(suppressor);

    function scan() {
      const candidates = detector.scan(document);
      const seen = new Set<string>();
      let didSuppress = false;
      for (const candidate of candidates) {
        if (seen.has(candidate.signature)) continue;
        seen.add(candidate.signature);
        const decision = classifier.classify(candidate);
        if (decision.shouldSuppress) {
          logger.debug('Suppressing', candidate.element, 'reason:', decision.reason);
          suppressor.suppress(candidate, decision.actions);
          didSuppress = true;
        }
      }
      if (didSuppress) {
        restorePageInteractivity();
      }
    }

    function restorePageInteractivity() {
      for (const el of [document.body, document.documentElement]) {
        if (el.style.overflow === 'hidden') el.style.overflow = '';
        if (el.style.overflowY === 'hidden') el.style.overflowY = '';
      }
      document.querySelectorAll('[style*="pointer-events: none"], [style*="pointer-events:none"]').forEach((el) => {
        const htmlEl = el as HTMLElement;
        const rect = el.getBoundingClientRect();
        if (rect.width > window.innerWidth * 0.5 && rect.height > window.innerHeight * 0.5) {
          htmlEl.style.pointerEvents = '';
        }
      });
    }

    scan();

    observer = new DomObserver(() => {
      if (enabled) scan();
    });
    observer.observe(document.body);
  } catch (err) {
    logger.error('Init failed:', err);
  }
}

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  if (message.type === MessageType.UNDO_SUPPRESSION) {
    restorer?.restoreAll();
    sendResponse({ success: true });
  }
  return false;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.disabledSites || changes.globalEnabled || changes.allowlist || changes.debugMode) {
    storageFacade.getSettings().then((settings) => {
      logger.setDebug(settings.debugMode);
      const shouldBeEnabled = settings.globalEnabled
        && !settings.disabledSites.includes(location.hostname)
        && !settings.allowlist.includes(location.hostname);
      if (!shouldBeEnabled && enabled) {
        restorer?.restoreAll();
        observer?.disconnect();
        enabled = false;
      } else if (shouldBeEnabled && !enabled) {
        enabled = true;
        init();
      }
    });
  }
});

init();
