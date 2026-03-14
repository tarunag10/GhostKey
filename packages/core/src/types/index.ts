/** A DOM element identified as a potential login/signup blocker */
export interface CandidateBlocker {
  element: Element;
  scores: DetectorScores;
  signature: string; // unique identifier for loop detection
}

export interface DetectorScores {
  viewportCoverage: number;  // 0-1, fraction of viewport covered
  zIndex: number;            // raw z-index value
  isFixed: boolean;
  isRecentlyInserted: boolean;
  textMatchScore: number;    // 0-1, login/signup phrase match confidence
  hasScrollLock: boolean;
  hasBackdrop: boolean;
  hasBlurOverlay: boolean;
  hasPointerBlock: boolean;
}

export interface ClassificationResult {
  shouldSuppress: boolean;
  reason: string;
  actions: SuppressionAction[];
  confidence: number; // 0-1
}

export enum SuppressionActionType {
  HIDE_ELEMENT = 'HIDE_ELEMENT',
  REMOVE_ELEMENT = 'REMOVE_ELEMENT',
  UNLOCK_SCROLL = 'UNLOCK_SCROLL',
  REMOVE_BACKDROP = 'REMOVE_BACKDROP',
  REMOVE_BLUR = 'REMOVE_BLUR',
  RESTORE_POINTER_EVENTS = 'RESTORE_POINTER_EVENTS',
}

export interface SuppressionAction {
  type: SuppressionActionType;
  target?: Element;
}

export interface SuppressionRecord {
  candidate: CandidateBlocker;
  actions: AppliedAction[];
  timestamp: number;
}

export interface AppliedAction {
  type: SuppressionActionType;
  target: Element;
  originalState: Record<string, string>; // saved CSS/attrs for restoration
}

export interface RulePack {
  id: string;
  name: string;
  hostPatterns: string[];  // glob patterns, e.g. "*.linkedin.com"
  priority: number;        // higher = checked first
  selectors: SelectorRule[];
  safeSelectors: string[]; // never suppress these
  scrollLockSelectors: string[];
  backdropSelectors: string[];
}

export interface SelectorRule {
  selector: string;
  weight: number; // added to detection score
  description?: string;
}

export interface Settings {
  globalEnabled: boolean;
  aggressiveMode: boolean;
  debugMode: boolean;
  disabledSites: string[];
  allowlist: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  globalEnabled: true,
  aggressiveMode: false,
  debugMode: false,
  disabledSites: [],
  allowlist: [],
};
