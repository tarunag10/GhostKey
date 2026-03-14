import { describe, it, expect, beforeEach } from 'vitest';
import { Detector } from './index.js';
import { scanText } from './textScanner.js';
import { computeSignature } from './signature.js';
import type { RulePack } from '../types/index.js';

const emptyRules: RulePack[] = [];

describe('Detector', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('detects a login modal with high z-index and login text', () => {
    document.body.innerHTML = `
      <div id="login-modal" role="dialog" style="position: fixed; z-index: 9999; top: 0; left: 0; width: 100vw; height: 100vh;">
        <h2>Sign in to continue</h2>
        <input type="email" name="email">
        <input type="password" name="password">
        <button>Log in</button>
      </div>
    `;
    const detector = new Detector(emptyRules);
    const candidates = detector.scan(document);
    expect(candidates.length).toBeGreaterThanOrEqual(1);
    const modal = candidates.find(c => (c.element as HTMLElement).id === 'login-modal');
    expect(modal).toBeDefined();
    expect(modal!.scores.textMatchScore).toBeGreaterThan(0.5);
    expect(modal!.scores.isFixed).toBe(true);
  });

  it('ignores regular content', () => {
    document.body.innerHTML = `
      <div style="position: static;">
        <p>Welcome to our site. Read this article about cooking.</p>
      </div>
    `;
    const detector = new Detector(emptyRules);
    const candidates = detector.scan(document);
    expect(candidates.length).toBe(0);
  });

  it('detects elements matching rule pack selectors', () => {
    document.body.innerHTML = `
      <div class="auth-wall" style="position: fixed; z-index: 5000; width: 100%; height: 100%;">
        <p>Please sign up</p>
      </div>
    `;
    const rules: RulePack[] = [{
      id: 'test',
      name: 'Test',
      hostPatterns: ['*'],
      priority: 1,
      selectors: [{ selector: '.auth-wall', weight: 5 }],
      safeSelectors: [],
      scrollLockSelectors: [],
      backdropSelectors: [],
    }];
    const detector = new Detector(rules);
    const candidates = detector.scan(document);
    expect(candidates.length).toBeGreaterThanOrEqual(1);
  });
});

describe('textScanner', () => {
  it('scores login text highly', () => {
    const div = document.createElement('div');
    div.textContent = 'Sign in to continue reading. Already have an account? Log in.';
    const result = scanText(div);
    expect(result.textMatchScore).toBeGreaterThanOrEqual(0.8);
  });

  it('scores non-login text at 0', () => {
    const div = document.createElement('div');
    div.textContent = 'This is a regular article about technology trends.';
    const result = scanText(div);
    expect(result.textMatchScore).toBe(0);
  });

  it('detects login form inputs', () => {
    const div = document.createElement('div');
    div.innerHTML = '<p>Welcome</p><input type="password" name="password"><button>Sign in</button>';
    const result = scanText(div);
    expect(result.textMatchScore).toBeGreaterThan(0);
  });
});

describe('computeSignature', () => {
  it('produces stable signatures', () => {
    const div = document.createElement('div');
    div.id = 'modal';
    div.className = 'overlay big';
    document.body.appendChild(div);
    const sig1 = computeSignature(div);
    const sig2 = computeSignature(div);
    expect(sig1).toBe(sig2);
    expect(sig1).toContain('#modal');
  });
});
