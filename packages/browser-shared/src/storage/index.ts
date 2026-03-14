import { type Settings, DEFAULT_SETTINGS } from '@ghostkey/core/types';

export const storageFacade = {
  async getSettings(): Promise<Settings> {
    const result = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
    return { ...DEFAULT_SETTINGS, ...result } as Settings;
  },

  async setSettings(partial: Partial<Settings>): Promise<void> {
    await chrome.storage.local.set(partial);
  },

  async getSuppressedCount(hostname: string): Promise<number> {
    const key = `count_${hostname}`;
    const result = await chrome.storage.local.get(key);
    return result[key] ?? 0;
  },

  async incrementSuppressedCount(hostname: string): Promise<void> {
    const key = `count_${hostname}`;
    const current = await this.getSuppressedCount(hostname);
    await chrome.storage.local.set({ [key]: current + 1 });
  },
};
