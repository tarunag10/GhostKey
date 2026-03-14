const MAX_SUPPRESSIONS = 5;
const COOLDOWN_MS = 10_000;

interface SuppressionEntry {
  count: number;
  lastSuppressed: number;
}

export class LoopProtector {
  private entries = new Map<string, SuppressionEntry>();

  record(signature: string): void {
    const existing = this.entries.get(signature);
    if (existing) {
      existing.count++;
      existing.lastSuppressed = Date.now();
    } else {
      this.entries.set(signature, { count: 1, lastSuppressed: Date.now() });
    }
  }

  isThrottled(signature: string): boolean {
    const entry = this.entries.get(signature);
    if (!entry) return false;

    // Allow again after cooldown
    if (Date.now() - entry.lastSuppressed > COOLDOWN_MS) {
      this.entries.delete(signature);
      return false;
    }

    return entry.count >= MAX_SUPPRESSIONS;
  }

  reset(): void {
    this.entries.clear();
  }
}
