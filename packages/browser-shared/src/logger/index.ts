const PREFIX = '[GhostKey]';

let debugEnabled = false;

export const logger = {
  setDebug(enabled: boolean) {
    debugEnabled = enabled;
  },

  info(...args: unknown[]) {
    console.log(PREFIX, ...args);
  },

  debug(...args: unknown[]) {
    if (debugEnabled) {
      console.log(PREFIX, '[DEBUG]', ...args);
    }
  },

  warn(...args: unknown[]) {
    console.warn(PREFIX, ...args);
  },

  error(...args: unknown[]) {
    console.error(PREFIX, ...args);
  },
};
