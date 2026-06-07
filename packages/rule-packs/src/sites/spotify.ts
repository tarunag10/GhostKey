import type { RulePack } from '@ghostkey/core/types';

export const spotify: RulePack = {
  id: 'spotify',
  name: 'Spotify',
  hostPatterns: ['*.spotify.com', 'spotify.com', 'open.spotify.com'],
  priority: 10,
  selectors: [
    { selector: '[data-testid="login-modal"]', weight: 9 },
    { selector: '[data-testid="signup-modal"]', weight: 9 },
    { selector: '[class*="LoginModal"]', weight: 9 },
    { selector: '[class*="SignupModal"]', weight: 9 },
    { selector: '[data-encore-id="modal"]', weight: 8 },
    { selector: '[class*="overlay"]', weight: 5 },
    { selector: '[class*="modal"]', weight: 5 },
    { selector: '[class*="auth"]', weight: 7 },
    { selector: '#onboarding', weight: 8 },
    { selector: '[data-testid="cookie-consent-banner"]', weight: 4 },
  ],
  safeSelectors: ['nav', 'header', '[role="navigation"]', '[data-testid="top-bar"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]'],
  backdropSelectors: ['[class*="overlay"]', '[class*="backdrop"]'],
};
