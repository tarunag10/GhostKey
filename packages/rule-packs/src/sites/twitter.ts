import type { RulePack } from '@ghostkey/core/types';

export const twitter: RulePack = {
  id: 'twitter',
  name: 'Twitter / X',
  hostPatterns: ['*.twitter.com', 'twitter.com', '*.x.com', 'x.com'],
  priority: 10,
  selectors: [
    { selector: '[data-testid="loginButton"]', weight: 5 },
    { selector: '[data-testid="signupButton"]', weight: 5 },
    { selector: '[data-testid="sheetDialog"]', weight: 7 },
    { selector: '[aria-label="Sign up"]', weight: 8 },
    { selector: '[class*="LoginForm"]', weight: 9 },
    { selector: '#layers > div', weight: 6, description: 'Twitter overlay layers' },
  ],
  safeSelectors: ['nav', 'header[role="banner"]', '[data-testid="primaryColumn"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]'],
  backdropSelectors: ['#layers [data-testid="mask"]'],
};
