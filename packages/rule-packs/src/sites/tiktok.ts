import type { RulePack } from '@ghostkey/core/types';

export const tiktok: RulePack = {
  id: 'tiktok',
  name: 'TikTok',
  hostPatterns: ['*.tiktok.com', 'tiktok.com'],
  priority: 10,
  selectors: [
    { selector: '[class*="DivLoginContainer"]', weight: 9, description: 'Login overlay' },
    { selector: '[class*="DivVerifyLoginContainer"]', weight: 9 },
    { selector: '[class*="login-container"]', weight: 9 },
    { selector: '[class*="DivModalDialog"]', weight: 8 },
    { selector: '[class*="DivMaskWrapper"]', weight: 7 },
    { selector: '[data-e2e="modal-inner"]', weight: 8 },
    { selector: '[class*="DivAuthModal"]', weight: 9 },
    { selector: '[class*="login-guide"]', weight: 9 },
    { selector: '[class*="DivSignIn"]', weight: 8 },
    { selector: '[class*="DivSignUp"]', weight: 8 },
    { selector: 'div[class*="Modal"]:has([class*="login"])', weight: 9 },
    { selector: '[class*="DivLoginGuide"]', weight: 9 },
  ],
  safeSelectors: ['nav', 'header', '[data-e2e="nav-list"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]', 'body[class*="overflow"]'],
  backdropSelectors: ['[class*="DivMaskWrapper"]', '[class*="DivOverlay"]'],
};
