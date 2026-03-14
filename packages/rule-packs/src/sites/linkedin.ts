import type { RulePack } from '@ghostkey/core/types';

export const linkedin: RulePack = {
  id: 'linkedin',
  name: 'LinkedIn',
  hostPatterns: ['*.linkedin.com', 'linkedin.com'],
  priority: 10,
  selectors: [
    { selector: '.authentication-outlet', weight: 8, description: 'Main auth wall' },
    { selector: '[data-test-modal-id="join-now-modal"]', weight: 9 },
    { selector: '.artdeco-modal-overlay', weight: 7 },
    { selector: '.artdeco-modal', weight: 6 },
    { selector: '.contextual-sign-in-modal', weight: 9 },
    { selector: '.sign-in-modal', weight: 9 },
    { selector: '[class*="join-form"]', weight: 7 },
    { selector: '[class*="login-form"]', weight: 7 },
    { selector: '.scaffold-layout-toolbar__content [data-control-name="nav.join"]', weight: 3 },
  ],
  safeSelectors: [
    '.msg-overlay-conversation-bubble',
    '.scaffold-layout__sidebar',
    'nav',
  ],
  scrollLockSelectors: ['body.overflow-hidden'],
  backdropSelectors: ['.artdeco-modal-overlay'],
};
