import { describe, it, expect, beforeEach } from 'vitest';
import { Suppressor } from './index.js';
import { Restorer } from '../restorer/index.js';
import { SuppressionActionType, type CandidateBlocker, type DetectorScores } from '../types/index.js';

function makeCandidate(el?: Element): CandidateBlocker {
  const element = el ?? document.createElement('div');
  return {
    element,
    signature: 'test',
    scores: {
      viewportCoverage: 0.8, zIndex: 9999, isFixed: true, isRecentlyInserted: false,
      textMatchScore: 0.9, hasScrollLock: false, hasBackdrop: false, hasBlurOverlay: false, hasPointerBlock: false,
    },
  };
}

describe('Suppressor', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.cssText = '';
    document.documentElement.style.cssText = '';
  });

  it('hides elements', () => {
    const div = document.createElement('div');
    div.style.display = 'block';
    document.body.appendChild(div);

    const suppressor = new Suppressor();
    suppressor.suppress(makeCandidate(div), [
      { type: SuppressionActionType.HIDE_ELEMENT, target: div },
    ]);

    expect(div.style.display).toBe('none');
  });

  it('unlocks scroll', () => {
    document.body.style.overflow = 'hidden';

    const suppressor = new Suppressor();
    suppressor.suppress(makeCandidate(), [
      { type: SuppressionActionType.UNLOCK_SCROLL },
    ]);

    expect(document.body.style.overflow).toBe('');
  });

  it('records can be used for restoration', () => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    document.body.appendChild(div);
    document.body.style.overflow = 'hidden';

    const suppressor = new Suppressor();
    suppressor.suppress(makeCandidate(div), [
      { type: SuppressionActionType.HIDE_ELEMENT, target: div },
      { type: SuppressionActionType.UNLOCK_SCROLL },
    ]);

    expect(div.style.display).toBe('none');
    expect(document.body.style.overflow).toBe('');

    const restorer = new Restorer(suppressor);
    restorer.restoreAll();

    expect(div.style.display).toBe('flex');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('removes elements and restores them', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    child.textContent = 'modal';
    parent.appendChild(child);
    document.body.appendChild(parent);

    const suppressor = new Suppressor();
    suppressor.suppress(makeCandidate(child), [
      { type: SuppressionActionType.REMOVE_ELEMENT, target: child },
    ]);

    expect(parent.contains(child)).toBe(false);

    const restorer = new Restorer(suppressor);
    restorer.restoreAll();
    expect(parent.contains(child)).toBe(true);
  });
});
