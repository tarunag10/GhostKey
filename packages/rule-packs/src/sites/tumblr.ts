import type { RulePack } from '@ghostkey/core/types';

export const tumblr: RulePack = {
  id: 'tumblr',
  name: 'Tumblr',
  hostPatterns: ['*.tumblr.com', 'tumblr.com'],
  priority: 10,
  selectors: [
    { selector: '[data-testid="login-modal"]', weight: 9 },
    { selector: '[data-testid="signup-modal"]', weight: 9 },
    { selector: '[class*="loginModal"]', weight: 9 },
    { selector: '[class*="signupModal"]', weight: 9 },
    { selector: '[class*="authModal"]', weight: 9 },
    { selector: '.modal.signup-dialog', weight: 9 },
    { selector: '.modal.login-dialog', weight: 9 },
    { selector: '[class*="registration"]', weight: 7 },
    { selector: '#signup_dock', weight: 8 },
    { selector: '[class*="overlay"]', weight: 5 },
  ],
  safeSelectors: ['nav', 'header', '[role="navigation"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]', 'body.modal-open'],
  backdropSelectors: ['[class*="overlay"]', '.modal-backdrop'],
};
