import type { RulePack } from '@ghostkey/core/types';

export const facebook: RulePack = {
  id: 'facebook',
  name: 'Facebook',
  hostPatterns: ['*.facebook.com', 'facebook.com'],
  priority: 10,
  selectors: [
    { selector: '[role="dialog"]', weight: 8 },
    { selector: '[aria-modal="true"]', weight: 8 },
    { selector: '[data-testid="cookie-policy-manage-dialog"]', weight: 5 },
    { selector: '[data-nosnippet][role="dialog"]', weight: 9 },
    { selector: '#login_popup', weight: 9 },
    { selector: '[data-testid="login_popup_container"]', weight: 9 },
    { selector: 'div[class*="login"]', weight: 6 },
    { selector: 'div[class*="signup"]', weight: 6 },
    { selector: '[aria-label="Close"] + div[class*="login"]', weight: 9 },
    { selector: 'div[class*="overlay"]', weight: 5 },
    { selector: 'div[class*="modal"]', weight: 5 },
  ],
  safeSelectors: ['nav', '[role="navigation"]', '[role="banner"]', '#header'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]', 'html[style*="overflow: hidden"]'],
  backdropSelectors: ['div[class*="overlay"]', 'div[class*="backdrop"]'],
};
