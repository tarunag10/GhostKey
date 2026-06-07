import type { RulePack } from '@ghostkey/core/types';

export const forbes: RulePack = {
  id: 'forbes',
  name: 'Forbes',
  hostPatterns: ['*.forbes.com', 'forbes.com'],
  priority: 10,
  selectors: [
    { selector: '[class*="login-modal"]', weight: 9 },
    { selector: '[class*="signup-modal"]', weight: 9 },
    { selector: '[class*="auth-modal"]', weight: 9 },
    { selector: '[id*="login-modal"]', weight: 9 },
    { selector: '[id*="signup-modal"]', weight: 9 },
    { selector: '[class*="overlay"]', weight: 5 },
    { selector: '[class*="gate"]', weight: 7 },
    { selector: '[class*="paywall"]', weight: 7 },
    { selector: '[class*="reg-wall"]', weight: 8 },
    { selector: '.close-btn', weight: 4 },
    { selector: '[data-testid="modal"]', weight: 7 },
  ],
  safeSelectors: ['nav', 'header', '[role="navigation"]', '[role="banner"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]', 'body.modal-open'],
  backdropSelectors: ['[class*="overlay"]', '[class*="backdrop"]'],
};
