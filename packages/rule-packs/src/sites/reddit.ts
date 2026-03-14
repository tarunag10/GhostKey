import type { RulePack } from '@ghostkey/core/types';

export const reddit: RulePack = {
  id: 'reddit',
  name: 'Reddit',
  hostPatterns: ['*.reddit.com', 'reddit.com', 'old.reddit.com'],
  priority: 10,
  selectors: [
    { selector: '[id*="login-modal"]', weight: 9 },
    { selector: 'shreddit-signup-drawer', weight: 9 },
    { selector: '[class*="login-prompt"]', weight: 8 },
    { selector: '.XPromoPopup', weight: 8 },
    { selector: '[class*="BottomSheet"]', weight: 6 },
    { selector: '[bundlename="login"]', weight: 9 },
    { selector: 'shreddit-async-loader[bundlename="login"]', weight: 9 },
  ],
  safeSelectors: ['nav', 'header', '[data-testid="subreddit-sidebar"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]'],
  backdropSelectors: ['[class*="overlay"]', '[class*="Overlay"]'],
};
