import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['packages/*/src/**/*.test.ts', 'tests/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@ghostkey/core': '/packages/core/src',
      '@ghostkey/browser-shared': '/packages/browser-shared/src',
      '@ghostkey/rule-packs': '/packages/rule-packs/src',
    },
  },
});
