import type { RulePack } from '@ghostkey/core/types';

export const youtube: RulePack = {
  id: 'youtube',
  name: 'YouTube',
  hostPatterns: ['*.youtube.com', 'youtube.com'],
  priority: 10,
  selectors: [
    { selector: 'tp-yt-paper-dialog', weight: 8, description: 'YouTube modal dialog' },
    { selector: 'ytd-popup-container', weight: 8 },
    { selector: '[dialog][dialog-type="SIGN_IN"]', weight: 9 },
    { selector: 'tp-yt-iron-overlay-backdrop', weight: 7 },
    { selector: '#signin-link', weight: 7 },
    { selector: 'ytd-enforcement-message-view-model', weight: 8, description: 'Age/sign-in enforcement' },
    { selector: '#message[role="alertdialog"]', weight: 8 },
    { selector: 'ytd-watch-next-secondary-results-renderer ytd-compact-promoted-video-renderer', weight: 6 },
    { selector: '#ytd-watch-flexy[theater] #player-wide-container', weight: 5 },
    { selector: 'tp-yt-paper-dialog[style*="transform"]', weight: 7 },
  ],
  safeSelectors: ['ytd-masthead', '#header', '#container[role="banner"]'],
  scrollLockSelectors: ['body[style*="overflow: hidden"]'],
  backdropSelectors: ['tp-yt-iron-overlay-backdrop'],
};
