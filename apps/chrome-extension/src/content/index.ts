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
  const settings = await storageFacade.getSettings();
  enabled = settings.globalEnabled && !settings.disabledSites.includes(location.hostname);

  if (!enabled) {
    logger.info('GhostKey disabled for', location.hostname);
    return;
  }

  const rules = loadRulesForHost(location.hostname);
  const detector = new Detector(rules);
  const classifier = new Classifier(settings.aggressiveMode);
  suppressor = new Suppressor();
  restorer = new Restorer(suppressor);

  function scan() {
    const candidates = detector.scan(document);
    for (const candidate of candidates) {
      const decision = classifier.classify(candidate);
      if (decision.shouldSuppress) {
        logger.debug('Suppressing', candidate.element, 'reason:', decision.reason);
        suppressor.suppress(candidate, decision.actions);
      }
    }
  }

  // Initial scan
  scan();

  // Watch for new elements
  observer = new DomObserver(() => {
    if (enabled) scan();
  });
  observer.observe(document.body);
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  if (message.type === MessageType.UNDO_SUPPRESSION) {
    restorer?.restoreAll();
    sendResponse({ success: true });
  }
  return false;
});

// Listen for storage changes (e.g., site toggled)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.disabledSites || changes.globalEnabled) {
    // Reload behavior
    storageFacade.getSettings().then((settings) => {
      const shouldBeEnabled = settings.globalEnabled && !settings.disabledSites.includes(location.hostname);
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
