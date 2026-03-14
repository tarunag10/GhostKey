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
    // Scroll-triggered login wall
    { selector: '[role="presentation"] [role="dialog"]', weight: 8, description: 'Scroll-triggered dialog' },
    { selector: '[class*="x1n2onr6"][role="dialog"]', weight: 8 },
    { selector: '[role="dialog"]:not([aria-label*="Comment"]):not([aria-label*="Share"])', weight: 6 },
    { selector: '[class*="x1qjc9v5"]', weight: 5, description: 'Common IG modal wrapper class' },
    { selector: '[class*="xdt5ytf"] [role="dialog"]', weight: 8 },
    { selector: 'div[style*="height: 100%"][style*="width: 100%"][role="presentation"]', weight: 7 },
    // "Continue watching" scroll-triggered wall (no role="dialog", just nested divs)
    { selector: 'div.html-div a[href*="help.instagram.com"]', weight: 8, description: 'IG login wall with T&C links' },
    { selector: 'div.html-div a[href*="privacycenter.instagram.com"]', weight: 8 },
    { selector: 'div.x1qjc9v5.x1oa3qoh.x1nhvcw1', weight: 7, description: 'IG scroll-triggered login wrapper' },
  ],
  safeSelectors: ['nav', 'header'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]', 'html[style*="overflow: hidden"]'],
  backdropSelectors: ['[class*="Overlay"]', '[role="presentation"] > div:first-child'],
};
