import type { RulePack } from '@ghostkey/core/types';

export const instagram: RulePack = {
  id: 'instagram',
  name: 'Instagram',
  hostPatterns: ['*.instagram.com', 'instagram.com'],
  priority: 10,
  selectors: [
    { selector: '[class*="LoginAndSignup"]', weight: 9 },
    { selector: '[role="dialog"][class*="login"]', weight: 9 },
    { selector: '[class*="RightSideLogin"]', weight: 7 },
    { selector: '[class*="LoginForm"]', weight: 9 },
    { selector: '[class*="SignUpForm"]', weight: 9 },
  ],
  safeSelectors: ['nav', 'header', '[role="main"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]'],
  backdropSelectors: ['[class*="Overlay"]'],
};
