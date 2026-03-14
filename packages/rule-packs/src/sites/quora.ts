import type { RulePack } from '@ghostkey/core/types';

export const quora: RulePack = {
  id: 'quora',
  name: 'Quora',
  hostPatterns: ['*.quora.com', 'quora.com'],
  priority: 10,
  selectors: [
    { selector: '.q-box.qu-zIndex--overlay', weight: 8 },
    { selector: '[class*="SignupModal"]', weight: 9 },
    { selector: '[class*="LoginModal"]', weight: 9 },
    { selector: '.modal_signup', weight: 9 },
    { selector: '[class*="signup_wall"]', weight: 9 },
    { selector: '.qu-overflowY--hidden', weight: 4, description: 'Scroll lock class' },
  ],
  safeSelectors: ['nav', '[class*="SiteHeader"]'],
  scrollLockSelectors: ['body.qu-overflowY--hidden'],
  backdropSelectors: ['[class*="ModalOverlay"]'],
};
