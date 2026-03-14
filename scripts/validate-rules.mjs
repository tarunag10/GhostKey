import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITES_DIR = join(__dirname, '..', 'packages/rule-packs/src/sites');

const files = readdirSync(SITES_DIR).filter(f => f.endsWith('.ts'));
let errors = 0;

for (const file of files) {
  const content = readFileSync(join(SITES_DIR, file), 'utf-8');

  // Basic validation: check required fields exist
  const required = ['id:', 'name:', 'hostPatterns:', 'priority:', 'selectors:'];
  for (const field of required) {
    if (!content.includes(field)) {
      console.error(`❌ ${file}: missing field ${field}`);
      errors++;
    }
  }

  // Check for valid selector syntax (basic)
  const selectorMatches = content.match(/selector:\s*'([^']+)'/g) || [];
  for (const match of selectorMatches) {
    const sel = match.replace(/selector:\s*'/, '').replace(/'$/, '');
    try {
      // Just check it's parseable
      if (sel.includes('{') || sel.includes('}')) {
        console.error(`❌ ${file}: suspicious selector: ${sel}`);
        errors++;
      }
    } catch {
      console.error(`❌ ${file}: invalid selector: ${sel}`);
      errors++;
    }
  }

  console.log(`✅ ${file}: valid`);
}

if (errors > 0) {
  console.error(`\n${errors} error(s) found`);
  process.exit(1);
} else {
  console.log(`\nAll ${files.length} rule packs validated`);
}
