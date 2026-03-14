import {
  type CandidateBlocker,
  type ClassificationResult,
  SuppressionActionType,
  type SuppressionAction,
} from '../types/index.js';
import { isSafeElement } from './safetyRules.js';
import { LoopProtector } from './loopProtector.js';

const CONSERVATIVE_THRESHOLD = 7;
const AGGRESSIVE_THRESHOLD = 4;

export class Classifier {
  private loopProtector = new LoopProtector();

  constructor(private aggressive: boolean = false) {}

  classify(candidate: CandidateBlocker): ClassificationResult {
    // Safety check first
    if (isSafeElement(candidate.element)) {
      return { shouldSuppress: false, reason: 'Safe element (payment/checkout/nav)', actions: [], confidence: 0 };
    }

    // Loop protection
    if (this.loopProtector.isThrottled(candidate.signature)) {
      return { shouldSuppress: false, reason: 'Loop protection: recently suppressed', actions: [], confidence: 0 };
    }

    const scores = candidate.scores;
    const totalScore =
      scores.viewportCoverage * 3 +
      (scores.isFixed ? 2 : 0) +
      (scores.zIndex > 999 ? 2 : 0) +
      scores.textMatchScore * 3 +
      (scores.hasScrollLock ? 2 : 0) +
      (scores.hasBackdrop ? 1.5 : 0) +
      (scores.hasBlurOverlay ? 1.5 : 0) +
      (scores.hasPointerBlock ? 1 : 0);

    const threshold = this.aggressive ? AGGRESSIVE_THRESHOLD : CONSERVATIVE_THRESHOLD;
    const shouldSuppress = totalScore >= threshold;
    const confidence = Math.min(totalScore / 15, 1);

    if (!shouldSuppress) {
      return { shouldSuppress: false, reason: `Score ${totalScore.toFixed(1)} below threshold ${threshold}`, actions: [], confidence };
    }

    // Build actions
    const actions = this.buildActions(candidate);

    // Record suppression
    this.loopProtector.record(candidate.signature);

    return {
      shouldSuppress: true,
      reason: `Score ${totalScore.toFixed(1)} >= threshold ${threshold}`,
      actions,
      confidence,
    };
  }

  private buildActions(candidate: CandidateBlocker): SuppressionAction[] {
    const actions: SuppressionAction[] = [];
    const s = candidate.scores;

    // Always hide the modal element
    actions.push({ type: SuppressionActionType.HIDE_ELEMENT, target: candidate.element });

    if (s.hasScrollLock) {
      actions.push({ type: SuppressionActionType.UNLOCK_SCROLL });
    }
    if (s.hasBackdrop) {
      actions.push({ type: SuppressionActionType.REMOVE_BACKDROP, target: candidate.element });
    }
    if (s.hasBlurOverlay) {
      actions.push({ type: SuppressionActionType.REMOVE_BLUR });
    }
    if (s.hasPointerBlock) {
      actions.push({ type: SuppressionActionType.RESTORE_POINTER_EVENTS });
    }

    return actions;
  }
}
