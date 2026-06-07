import type { RulePack } from '@ghostkey/core/types';

export const stackoverflow: RulePack = {
  id: 'stackoverflow',
  name: 'Stack Overflow',
  hostPatterns: ['*.stackoverflow.com', 'stackoverflow.com',
    '*.stackexchange.com', 'stackexchange.com',
    '*.superuser.com', 'superuser.com',
    '*.serverfault.com', 'serverfault.com',
    '*.askubuntu.com', 'askubuntu.com',
    '*.mathoverflow.net', 'mathoverflow.net'],
  priority: 10,
  selectors: [
    { selector: '#login-modal', weight: 9 },
    { selector: '[data-controller="login-modal"]', weight: 9 },
    { selector: '.js-login-modal', weight: 9 },
    { selector: '#modal-login', weight: 9 },
    { selector: '.js-signup-modal', weight: 9 },
    { selector: '[class*="signup-modal"]', weight: 9 },
    { selector: '.js-join-login-modal', weight: 9 },
    { selector: '#overlay-header', weight: 7 },
    { selector: '.js-stacks-login', weight: 8 },
    { selector: '[data-testid="login-modal"]', weight: 9 },
  ],
  safeSelectors: ['nav', '.topbar', '#header', '[role="navigation"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]'],
  backdropSelectors: ['.modal-backdrop', '.js-modal-backdrop'],
};
