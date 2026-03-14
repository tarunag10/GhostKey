import type { RulePack } from '@ghostkey/core/types';

export const medium: RulePack = {
  id: 'medium',
  name: 'Medium',
  hostPatterns: ['*.medium.com', 'medium.com'],
  priority: 10,
  selectors: [
    { selector: '[class*="meteredContent"]', weight: 7, description: 'Paywall/login blur' },
    { selector: '[class*="upsell"]', weight: 8 },
    { selector: '[class*="overlay-base"]', weight: 7 },
    { selector: '[aria-label*="sign in"]', weight: 8 },
    { selector: '[aria-label*="Sign in"]', weight: 8 },
    { selector: '[class*="signup-modal"]', weight: 9 },
    { selector: '[id*="paywall"]', weight: 7 },
  ],
  safeSelectors: ['nav', 'header', '[role="navigation"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]'],
  backdropSelectors: ['[class*="overlay"]'],
};
