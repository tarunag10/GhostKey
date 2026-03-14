export interface TextScanResult {
  textMatchScore: number;
}

const LOGIN_PHRASES = [
  'sign in', 'log in', 'login', 'signin',
  'sign up', 'signup', 'register', 'create account', 'create an account',
  'join now', 'join for free', 'get started',
  'continue with google', 'continue with facebook', 'continue with apple',
  'sign in with', 'log in with',
  'already have an account', 'don\'t have an account',
  'forgot password', 'reset password',
];

const STRONG_PHRASES = [
  'sign in to continue', 'log in to continue', 'create an account to continue',
  'sign up to continue', 'join to see', 'sign in to see',
  'you need to log in', 'please sign in', 'please log in',
];

export function scanText(element: Element): TextScanResult {
  const text = (element.textContent || '').toLowerCase().trim();
  if (!text || text.length > 5000) return { textMatchScore: 0 };

  let score = 0;

  for (const phrase of STRONG_PHRASES) {
    if (text.includes(phrase)) {
      score = Math.max(score, 0.9);
    }
  }

  let phraseCount = 0;
  for (const phrase of LOGIN_PHRASES) {
    if (text.includes(phrase)) {
      phraseCount++;
    }
  }

  // Multiple login phrases = high confidence
  if (phraseCount >= 3) score = Math.max(score, 0.85);
  else if (phraseCount >= 2) score = Math.max(score, 0.6);
  else if (phraseCount >= 1) score = Math.max(score, 0.3);

  // Check for login form inputs
  const inputs = element.querySelectorAll('input[type="email"], input[type="password"], input[name*="password"], input[name*="email"], input[name*="username"]');
  if (inputs.length > 0) {
    score = Math.max(score, 0.5);
    if (phraseCount >= 1) score = Math.max(score, 0.8);
  }

  return { textMatchScore: Math.min(score, 1) };
}
