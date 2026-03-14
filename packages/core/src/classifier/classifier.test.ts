import { describe, it, expect } from 'vitest';
import { Classifier } from './index.js';
import { isSafeElement } from './safetyRules.js';
import { LoopProtector } from './loopProtector.js';
import type { CandidateBlocker, DetectorScores } from '../types/index.js';

function makeCandidate(overrides: Partial<DetectorScores> = {}): CandidateBlocker {
  const div = document.createElement('div');
  return {
    element: div,
    ruleWeight: 0,
    signature: 'test-sig',
    scores: {
      viewportCoverage: 0.8,
      zIndex: 9999,
      isFixed: true,
      isRecentlyInserted: true,
      textMatchScore: 0.9,
      hasScrollLock: true,
      hasBackdrop: false,
      hasBlurOverlay: false,
      hasPointerBlock: false,
      ...overrides,
    },
  };
}

describe('Classifier', () => {
  it('suppresses high-score candidates in conservative mode', () => {
    const classifier = new Classifier(false);
    const result = classifier.classify(makeCandidate());
    expect(result.shouldSuppress).toBe(true);
    expect(result.actions.length).toBeGreaterThan(0);
  });

  it('does not suppress low-score candidates in conservative mode', () => {
    const classifier = new Classifier(false);
    const result = classifier.classify(makeCandidate({
      viewportCoverage: 0.1,
      zIndex: 50,
      isFixed: false,
      textMatchScore: 0,
      hasScrollLock: false,
    }));
    expect(result.shouldSuppress).toBe(false);
  });

  it('aggressive mode has lower threshold', () => {
    const classifier = new Classifier(true);
    const result = classifier.classify(makeCandidate({
      viewportCoverage: 0.3,
      zIndex: 5000,
      isFixed: true,
      textMatchScore: 0.3,
      hasScrollLock: false,
    }));
    expect(result.shouldSuppress).toBe(true);
  });
});

describe('safetyRules', () => {
  it('marks payment forms as safe', () => {
    const div = document.createElement('div');
    div.className = 'payment-modal';
    expect(isSafeElement(div)).toBe(true);
  });

  it('marks nav elements as safe', () => {
    const nav = document.createElement('nav');
    expect(isSafeElement(nav)).toBe(true);
  });

  it('does not mark login modals as safe', () => {
    const div = document.createElement('div');
    div.className = 'login-modal';
    div.textContent = 'Sign in to continue';
    expect(isSafeElement(div)).toBe(false);
  });
});

describe('LoopProtector', () => {
  it('throttles after max suppressions', () => {
    const lp = new LoopProtector();
    for (let i = 0; i < 5; i++) {
      expect(lp.isThrottled('sig')).toBe(false);
      lp.record('sig');
    }
    expect(lp.isThrottled('sig')).toBe(true);
  });

  it('resets', () => {
    const lp = new LoopProtector();
    for (let i = 0; i < 5; i++) lp.record('sig');
    lp.reset();
    expect(lp.isThrottled('sig')).toBe(false);
  });
});
