import type { CandidateBlocker, DetectorScores, RulePack } from '../types/index.js';
import { scanText } from './textScanner.js';
import { scanBehavior } from './behaviorScanner.js';
import { scanDom } from './domScanner.js';
import { computeSignature } from './signature.js';

export class Detector {
  constructor(private rules: RulePack[]) {}

  scan(doc: Document): CandidateBlocker[] {
    const candidates: CandidateBlocker[] = [];

    // Collect potential blockers: fixed/absolute high-z elements, rule-matched selectors
    const elements = this.gatherCandidateElements(doc);

    for (const element of elements) {
      const domScores = scanDom(element, doc);
      const textScores = scanText(element);
      const behaviorScores = scanBehavior(element, doc);

      const scores: DetectorScores = {
        ...domScores,
        ...textScores,
        ...behaviorScores,
      };

      // Only include if there's enough signal
      const totalScore =
        scores.viewportCoverage * 3 +
        (scores.isFixed ? 2 : 0) +
        (scores.zIndex > 999 ? 2 : 0) +
        scores.textMatchScore * 3 +
        (scores.hasScrollLock ? 2 : 0) +
        (scores.hasBackdrop ? 1.5 : 0) +
        (scores.hasBlurOverlay ? 1.5 : 0) +
        (scores.hasPointerBlock ? 1 : 0);

      if (totalScore >= 3) {
        candidates.push({
          element,
          scores,
          signature: computeSignature(element),
        });
      }
    }

    return candidates;
  }

  private gatherCandidateElements(doc: Document): Element[] {
    const seen = new Set<Element>();
    const result: Element[] = [];

    const add = (el: Element) => {
      if (!seen.has(el)) {
        seen.add(el);
        result.push(el);
      }
    };

    // 1. Rule-pack selectors
    for (const rule of this.rules) {
      for (const selectorRule of rule.selectors) {
        try {
          doc.querySelectorAll(selectorRule.selector).forEach(add);
        } catch { /* invalid selector */ }
      }
    }

    // 2. High z-index fixed/absolute elements
    const allElements = doc.querySelectorAll('*');
    for (const el of allElements) {
      const computed = getComputedStyle(el);
      const inline = (el as HTMLElement).style;
      const pos = computed.position || inline?.position || '';
      if (pos === 'fixed' || pos === 'sticky' || pos === 'absolute') {
        const z = parseInt(computed.zIndex, 10) || parseInt(inline?.zIndex, 10) || 0;
        if (z > 100) {
          add(el);
        }
      }
    }

    // 3. Common modal patterns
    const modalSelectors = [
      '[role="dialog"]', '[aria-modal="true"]',
      '.modal', '.overlay', '.popup', '.lightbox',
      '[class*="modal"]', '[class*="overlay"]', '[class*="popup"]',
      '[id*="modal"]', '[id*="overlay"]', '[id*="popup"]',
    ];
    for (const sel of modalSelectors) {
      try {
        doc.querySelectorAll(sel).forEach(add);
      } catch { /* invalid selector */ }
    }

    return result;
  }
}
