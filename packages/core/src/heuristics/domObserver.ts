export class DomObserver {
  private observer: MutationObserver;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly DEBOUNCE_MS = 300;

  constructor(private onMutation: () => void) {
    this.observer = new MutationObserver((mutations) => {
      // Only trigger on meaningful changes
      const hasNewNodes = mutations.some(
        (m) => m.addedNodes.length > 0 && Array.from(m.addedNodes).some((n) => n.nodeType === Node.ELEMENT_NODE)
      );
      const hasStyleChange = mutations.some(
        (m) => m.type === 'attributes' && (m.attributeName === 'style' || m.attributeName === 'class')
      );

      if (hasNewNodes || hasStyleChange) {
        this.debouncedCallback();
      }
    });
  }

  observe(target: Node): void {
    this.observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }

  disconnect(): void {
    this.observer.disconnect();
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  private debouncedCallback(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.onMutation(), this.DEBOUNCE_MS);
  }
}
