/** Elements that should NEVER be suppressed */

const SAFE_SELECTORS = [
  // Payment / checkout
  '[class*="payment"]', '[class*="checkout"]', '[class*="billing"]',
  '[id*="payment"]', '[id*="checkout"]', '[id*="billing"]',
  'form[action*="pay"]', 'form[action*="checkout"]',
  // File picker / upload
  '[class*="upload"]', '[class*="file-picker"]', 'input[type="file"]',
  // Cookie consent (separate concern)
  '[class*="cookie"]', '[class*="consent"]', '[id*="cookie"]', '[id*="consent"]',
  // Navigation / app shell
  'nav', 'header', 'footer', '[role="navigation"]', '[role="banner"]',
  // Native dialogs
  'dialog[open]',
];

const SAFE_TEXT_PATTERNS = [
  /pay(ment)?/i, /checkout/i, /billing/i, /credit card/i, /debit card/i,
  /shipping/i, /order summary/i, /purchase/i,
  /upload/i, /file picker/i, /choose file/i,
  /cookie/i, /consent/i, /privacy/i, /gdpr/i,
];

export function isSafeElement(element: Element): boolean {
  // Check selectors
  for (const sel of SAFE_SELECTORS) {
    try {
      if (element.matches(sel) || element.querySelector(sel)) {
        return true;
      }
    } catch { /* invalid selector */ }
  }

  // Check text content for payment/checkout keywords
  const text = (element.textContent || '').slice(0, 2000).toLowerCase();
  for (const pattern of SAFE_TEXT_PATTERNS) {
    if (pattern.test(text)) {
      // Only safe if it looks like a real payment form, not just a mention
      if (element.querySelector('input[type="text"], input[name*="card"], input[name*="cvv"]')) {
        return true;
      }
    }
  }

  return false;
}
