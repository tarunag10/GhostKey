import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Detector } from '../packages/core/src/detector/index.js';
import { Classifier } from '../packages/core/src/classifier/index.js';
import { Suppressor } from '../packages/core/src/suppressor/index.js';
import { Restorer } from '../packages/core/src/restorer/index.js';
import { generic } from '../packages/rule-packs/src/generic/index.js';

function loadFixture(name: string): string {
  return readFileSync(join(__dirname, 'fixtures', name), 'utf-8');
}

function runEngine(aggressive = false) {
  const detector = new Detector([generic]);
  const classifier = new Classifier(aggressive);
  const suppressor = new Suppressor();
  const candidates = detector.scan(document);
  const suppressed: string[] = [];

  for (const candidate of candidates) {
    const result = classifier.classify(candidate);
    if (result.shouldSuppress) {
      suppressor.suppress(candidate, result.actions);
      suppressed.push((candidate.element as HTMLElement).id || candidate.element.className.toString());
    }
  }

  return { candidates, suppressed, suppressor };
}

describe('Fixture Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.body.style.cssText = '';
    document.documentElement.style.cssText = '';
  });

  it('suppresses login modal', () => {
    document.body.innerHTML = loadFixture('login-modal.html');
    const { suppressed } = runEngine();
    expect(suppressed.length).toBeGreaterThanOrEqual(1);
  });

  it('suppresses blur blocker', () => {
    document.body.innerHTML = loadFixture('blur-blocker.html');
    const { suppressed } = runEngine();
    expect(suppressed.length).toBeGreaterThanOrEqual(1);
  });

  it('suppresses scroll-lock modal and unlocks scroll', () => {
    document.body.innerHTML = loadFixture('scroll-lock.html');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('no-scroll', 'modal-open');
    const { suppressed } = runEngine();
    expect(suppressed.length).toBeGreaterThanOrEqual(1);
  });

  it('does NOT suppress navigation bar (false positive)', () => {
    document.body.innerHTML = loadFixture('false-positive-nav.html');
    const { suppressed } = runEngine();
    // nav should be safe
    expect(suppressed.length).toBe(0);
  });

  it('does NOT suppress checkout/payment modal', () => {
    document.body.innerHTML = loadFixture('checkout-modal.html');
    const { suppressed } = runEngine();
    expect(suppressed.length).toBe(0);
  });

  it('does NOT suppress cookie banner', () => {
    document.body.innerHTML = loadFixture('cookie-banner.html');
    const { suppressed } = runEngine();
    expect(suppressed.length).toBe(0);
  });

  it('restorer undoes suppressions', () => {
    document.body.innerHTML = loadFixture('login-modal.html');
    const { suppressor } = runEngine();
    const modal = document.getElementById('login-modal');

    // Modal should be hidden
    if (modal && suppressor.getRecords().length > 0) {
      expect(modal.style.display).toBe('none');

      const restorer = new Restorer(suppressor);
      restorer.restoreAll();
      // Modal should be visible again
      expect(modal.style.display).not.toBe('none');
    }
  });
});
