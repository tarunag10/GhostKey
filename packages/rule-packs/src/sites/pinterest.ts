import type { RulePack } from '@ghostkey/core/types';

export const pinterest: RulePack = {
  id: 'pinterest',
  name: 'Pinterest',
  hostPatterns: ['*.pinterest.com', 'pinterest.com'],
  priority: 10,
  selectors: [
    { selector: '[class*="UnauthBanner"]', weight: 8 },
    { selector: '[data-test-id="signup-modal"]', weight: 9 },
    { selector: '[class*="loginModal"]', weight: 9 },
    { selector: '[class*="SignupModal"]', weight: 9 },
    { selector: '[class*="UnauthOverlay"]', weight: 8 },
    { selector: '[class*="nux-modal"]', weight: 7 },
  ],
  safeSelectors: ['nav', 'header', '[data-test-id="pinboard"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]'],
  backdropSelectors: ['[class*="Modal__overlay"]'],
};
