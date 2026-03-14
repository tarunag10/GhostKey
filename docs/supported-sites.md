# Supported Sites

| Site | Rule Pack | Key Selectors |
|------|-----------|---------------|
| LinkedIn | `linkedin` | `.authentication-outlet`, `.artdeco-modal`, `.contextual-sign-in-modal` |
| Quora | `quora` | `[class*="SignupModal"]`, `.modal_signup`, `[class*="signup_wall"]` |
| Reddit | `reddit` | `shreddit-signup-drawer`, `[bundlename="login"]`, `.XPromoPopup` |
| Pinterest | `pinterest` | `[data-test-id="signup-modal"]`, `[class*="UnauthBanner"]` |
| Twitter/X | `twitter` | `#layers > div`, `[data-testid="sheetDialog"]` |
| Instagram | `instagram` | `[class*="LoginAndSignup"]`, `[class*="LoginForm"]` |
| Medium | `medium` | `[class*="meteredContent"]`, `[class*="upsell"]`, `[id*="paywall"]` |
| All others | `generic` | `[role="dialog"]`, `[aria-modal="true"]`, `[class*="login"]` |
