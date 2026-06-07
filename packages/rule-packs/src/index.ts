import type { RulePack } from '@ghostkey/core/types';
import { linkedin } from './sites/linkedin.js';
import { quora } from './sites/quora.js';
import { reddit } from './sites/reddit.js';
import { pinterest } from './sites/pinterest.js';
import { twitter } from './sites/twitter.js';
import { instagram } from './sites/instagram.js';
import { medium } from './sites/medium.js';
import { youtube } from './sites/youtube.js';
import { facebook } from './sites/facebook.js';
import { tiktok } from './sites/tiktok.js';
import { stackoverflow } from './sites/stackoverflow.js';
import { tumblr } from './sites/tumblr.js';
import { forbes } from './sites/forbes.js';
import { spotify } from './sites/spotify.js';
import { generic } from './generic/index.js';

const ALL_PACKS: RulePack[] = [
  linkedin, quora, reddit, pinterest, twitter, instagram, medium,
  youtube, facebook, tiktok, stackoverflow, tumblr, forbes, spotify,
  generic,
];

/** Returns matching rule packs for a hostname, sorted by priority (highest first) */
export function loadRulesForHost(hostname: string): RulePack[] {
  const matched = ALL_PACKS.filter((pack) =>
    pack.hostPatterns.some((pattern) => matchHostPattern(pattern, hostname))
  );
  return matched.sort((a, b) => b.priority - a.priority);
}

function matchHostPattern(pattern: string, hostname: string): boolean {
  if (pattern === '*') return true;
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(2);
    return hostname === suffix || hostname.endsWith('.' + suffix);
  }
  return hostname === pattern;
}

export { ALL_PACKS };
