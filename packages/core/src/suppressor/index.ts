import {
  type CandidateBlocker,
  type SuppressionAction,
  type SuppressionRecord,
  type AppliedAction,
  SuppressionActionType,
} from '../types/index.js';

export class Suppressor {
  private records: SuppressionRecord[] = [];

  suppress(candidate: CandidateBlocker, actions: SuppressionAction[]): void {
    const applied: AppliedAction[] = [];

    for (const action of actions) {
      const result = this.applyAction(action, candidate);
      if (result) applied.push(result);
    }

    if (applied.length > 0) {
      this.records.push({ candidate, actions: applied, timestamp: Date.now() });
    }
  }

  getRecords(): SuppressionRecord[] {
    return this.records;
  }

  getLastRecord(): SuppressionRecord | undefined {
    return this.records[this.records.length - 1];
  }

  private applyAction(action: SuppressionAction, candidate: CandidateBlocker): AppliedAction | null {
    switch (action.type) {
      case SuppressionActionType.HIDE_ELEMENT:
        return this.hideElement(action.target ?? candidate.element);
      case SuppressionActionType.REMOVE_ELEMENT:
        return this.removeElement(action.target ?? candidate.element);
      case SuppressionActionType.UNLOCK_SCROLL:
        return this.unlockScroll();
      case SuppressionActionType.REMOVE_BACKDROP:
        return this.removeBackdrop(action.target ?? candidate.element);
      case SuppressionActionType.REMOVE_BLUR:
        return this.removeBlur();
      case SuppressionActionType.RESTORE_POINTER_EVENTS:
        return this.restorePointerEvents();
      default:
        return null;
    }
  }

  private hideElement(el: Element): AppliedAction {
    const htmlEl = el as HTMLElement;
    const original = {
      display: htmlEl.style.display,
      visibility: htmlEl.style.visibility,
      opacity: htmlEl.style.opacity,
    };
    htmlEl.style.setProperty('display', 'none', 'important');
    return { type: SuppressionActionType.HIDE_ELEMENT, target: el, originalState: original };
  }

  private removeElement(el: Element): AppliedAction {
    const parent = el.parentElement;
    const nextSibling = el.nextSibling;
    const original = {
      _parentTag: parent?.tagName ?? '',
      _nextSiblingExists: nextSibling ? 'true' : 'false',
    };
    // Store reference for restoration
    (el as any).__ghostkey_parent = parent;
    (el as any).__ghostkey_next = nextSibling;
    el.remove();
    return { type: SuppressionActionType.REMOVE_ELEMENT, target: el, originalState: original };
  }

  private unlockScroll(): AppliedAction {
    const body = document.body;
    const html = document.documentElement;
    const original = {
      bodyOverflow: body.style.overflow,
      bodyOverflowY: body.style.overflowY,
      htmlOverflow: html.style.overflow,
      htmlOverflowY: html.style.overflowY,
      bodyClass: body.className,
    };
    body.style.overflow = '';
    body.style.overflowY = '';
    html.style.overflow = '';
    html.style.overflowY = '';
    body.classList.remove('no-scroll', 'modal-open', 'overflow-hidden');
    return { type: SuppressionActionType.UNLOCK_SCROLL, target: body, originalState: original };
  }

  private removeBackdrop(modalEl: Element): AppliedAction {
    const parent = modalEl.parentElement;
    if (!parent) return { type: SuppressionActionType.REMOVE_BACKDROP, target: modalEl, originalState: {} };

    const original: Record<string, string> = {};
    for (const sibling of Array.from(parent.children)) {
      if (sibling === modalEl) continue;
      const cls = sibling.className?.toString().toLowerCase() || '';
      if (cls.includes('backdrop') || cls.includes('overlay') || cls.includes('mask')) {
        const htmlSib = sibling as HTMLElement;
        original[`${sibling.tagName}_display`] = htmlSib.style.display;
        htmlSib.style.setProperty('display', 'none', 'important');
      }
    }
    return { type: SuppressionActionType.REMOVE_BACKDROP, target: modalEl, originalState: original };
  }

  private removeBlur(): AppliedAction {
    const original: Record<string, string> = {};
    const selectors = ['main', '#root', '#app', '#__next', '[role="main"]', '.content'];
    for (const sel of selectors) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) continue;
      original[`${sel}_filter`] = el.style.filter;
      original[`${sel}_opacity`] = el.style.opacity;
      el.style.filter = '';
      el.style.opacity = '';
    }
    return { type: SuppressionActionType.REMOVE_BLUR, target: document.body, originalState: original };
  }

  private restorePointerEvents(): AppliedAction {
    const original: Record<string, string> = {};
    const body = document.body;
    original.bodyPointerEvents = body.style.pointerEvents;
    body.style.pointerEvents = '';

    const selectors = ['main', '#root', '#app', '#__next', '[role="main"]', '.App', '[data-test-id="app"]', '#__nuxt', '#___gatsby'];
    for (const sel of selectors) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) continue;
      original[`${sel}_pe`] = el.style.pointerEvents;
      el.style.pointerEvents = '';
    }

    // Also restore any element with inline pointer-events: none that covers most of viewport
    const allFixed = document.querySelectorAll('[style*="pointer-events"]');
    for (const el of allFixed) {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.pointerEvents === 'none') {
        const rect = el.getBoundingClientRect();
        if (rect.width > window.innerWidth * 0.5 && rect.height > window.innerHeight * 0.5) {
          original[`dynamic_${el.tagName}_${el.className.slice(0, 30)}_pe`] = htmlEl.style.pointerEvents;
          htmlEl.style.pointerEvents = '';
        }
      }
    }

    return { type: SuppressionActionType.RESTORE_POINTER_EVENTS, target: body, originalState: original };
  }
}
