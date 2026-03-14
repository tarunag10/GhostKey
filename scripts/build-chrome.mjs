import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, existsSync, accessSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const EXT = join(ROOT, 'apps/chrome-extension');
const DIST = join(ROOT, 'dist/chrome');

// Ensure dist exists
mkdirSync(DIST, { recursive: true });

/** Resolve @ghostkey/* imports to local source */
const ghostkeyPlugin = {
  name: 'ghostkey-resolve',
  setup(build) {
    build.onResolve({ filter: /^@ghostkey\// }, (args) => {
      const parts = args.path.replace('@ghostkey/', '').split('/');
      const pkg = parts.shift();
      const rest = parts.length > 0 ? parts.join('/') : 'index';
      const direct = join(ROOT, 'packages', pkg, 'src', rest + '.ts');
      const asIndex = join(ROOT, 'packages', pkg, 'src', rest, 'index.ts');
      // Try direct file first, fall back to directory/index.ts
      try { accessSync(direct); return { path: direct }; } catch {}
      return { path: asIndex };
    });
  },
};

const shared = {
  bundle: true,
  format: 'esm',
  target: 'chrome120',
  sourcemap: false,
  minify: true,
  logLevel: 'info',
  plugins: [ghostkeyPlugin],
};

async function build() {
  // Content script
  await esbuild.build({
    ...shared,
    entryPoints: [join(EXT, 'src/content/index.ts')],
    outfile: join(DIST, 'content.js'),
    format: 'iife', // content scripts can't use ESM
  });

  // Background service worker
  await esbuild.build({
    ...shared,
    entryPoints: [join(EXT, 'src/background/index.ts')],
    outfile: join(DIST, 'background.js'),
  });

  // Popup
  await esbuild.build({
    ...shared,
    entryPoints: [join(EXT, 'src/popup/popup.ts')],
    outfile: join(DIST, 'popup.js'),
    format: 'iife',
  });

  // Options
  await esbuild.build({
    ...shared,
    entryPoints: [join(EXT, 'src/options/options.ts')],
    outfile: join(DIST, 'options.js'),
    format: 'iife',
  });

  // Copy static files
  cpSync(join(EXT, 'manifest.json'), join(DIST, 'manifest.json'));
  cpSync(join(EXT, 'src/popup/popup.html'), join(DIST, 'popup.html'));
  cpSync(join(EXT, 'src/options/options.html'), join(DIST, 'options.html'));

  // Copy icons (create placeholders if not exist)
  const iconsDir = join(DIST, 'icons');
  mkdirSync(iconsDir, { recursive: true });
  const srcIcons = join(EXT, 'src/assets/icons');
  if (existsSync(srcIcons)) {
    cpSync(srcIcons, iconsDir, { recursive: true });
  }

  console.log('✅ Chrome extension built to dist/chrome/');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
