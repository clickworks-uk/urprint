/* Stamp a content hash onto every local CSS/JS reference in the HTML.
 *
 * Without this, assets/js/app.js is a stable URL, so a returning visitor keeps
 * whatever copy their browser cached until it expires — and since app.js draws
 * the header and footer, a stale copy shows a stale site. With a ?v=<hash> that
 * changes whenever the file changes, a new deploy is always picked up at once
 * and unchanged files stay cached.
 *
 * Runs as the Vercel build command, so it cannot be forgotten. No dependencies.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const hashes = new Map();

function hashOf(rel) {
  if (hashes.has(rel)) return hashes.get(rel);
  const file = join(root, rel);
  if (!existsSync(file)) return null;
  const h = createHash('md5').update(readFileSync(file)).digest('hex').slice(0, 8);
  hashes.set(rel, h);
  return h;
}

const htmlFiles = readdirSync(root).filter(f => f.endsWith('.html'));
let changed = 0;

for (const name of htmlFiles) {
  const path = join(root, name);
  const before = readFileSync(path, 'utf8');
  const after = before.replace(
    /(src|href)="(assets\/(?:css|js)\/[A-Za-z0-9._-]+\.(?:css|js))(\?v=[a-f0-9]+)?"/g,
    (match, attr, rel) => {
      const h = hashOf(rel);
      return h ? `${attr}="${rel}?v=${h}"` : match;
    }
  );
  if (after !== before) { writeFileSync(path, after); changed++; }
}

console.log(`stamp-assets: ${hashes.size} assets hashed, ${changed}/${htmlFiles.length} pages updated`);
for (const [rel, h] of hashes) console.log(`  ${h}  ${rel}`);
