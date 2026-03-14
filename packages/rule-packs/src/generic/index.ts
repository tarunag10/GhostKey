import type { RulePack } from '@ghostkey/core/types';

export const generic: RulePack = {
  id: 'generic',
  name: 'Generic Heuristic',
  hostPatterns: ['*'],
  priority: 0, // lowest priority, used as fallback
  selectors: [
    { selector: '[role="dialog"]', weight: 4 },
    { selector: '[aria-modal="true"]', weight: 5 },
    { selector: '.modal', weight: 3 },
    { selector: '[class*="modal"]', weight: 2 },
    { selector: '[class*="popup"]', weight: 2 },
    { selector: '[class*="overlay"]', weight: 2 },
    { selector: '[class*="login"]', weight: 3 },
    { selector: '[class*="signin"]', weight: 3 },
    { selector: '[class*="signup"]', weight: 3 },
    { selector: '[class*="auth-wall"]', weight: 5 },
    { selector: '[class*="gate"]', weight: 3 },
    { selector: '[class*="paywall"]', weight: 3 },
  ],
  safeSelectors: [
    'nav', 'header', 'footer',
    '[role="navigation"]', '[role="banner"]',
    '[class*="cookie"]', '[class*="consent"]',
    '[class*="payment"]', '[class*="checkout"]',
  ],
  scrollLockSelectors: [
    'body[style*="overflow: hidden"]',
    'html[style*="overflow: hidden"]',
  ],
  backdropSelectors: [
    '[class*="backdrop"]',
    '[class*="overlay"]',
    '[class*="mask"]',
  ],
};
