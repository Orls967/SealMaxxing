// Lighthouse accessibility audit of every page.
// Usage: npm run a11y [-- <base-url>]   (default: the live site)
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] ?? 'https://orls967.github.io/SealMaxxing/';
const pages = {
  Garasi: '#/',
  Bedah: '#/bedah/seal',
  Banding: '#/banding/energy?xray=1',
  Data: '#/data',
  Adu: '#/adu',
  'Adu energi': '#/adu?mode=energy',
  Glosarium: '#/glosarium',
  Tentang: '#/tentang',
};
const dir = mkdtempSync(join(tmpdir(), 'a11y-'));
let worst = 100;
for (const [name, hash] of Object.entries(pages)) {
  const out = join(dir, 'report.json');
  execFileSync(
    'npx',
    [
      'lighthouse',
      base + hash,
      '--only-categories=accessibility',
      '--output=json',
      `--output-path=${out}`,
      '--quiet',
      '--chrome-flags=--headless=new --enable-unsafe-swiftshader --ignore-gpu-blocklist',
      '--max-wait-for-load=60000',
    ],
    { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, stdio: 'ignore' },
  );
  const r = JSON.parse(readFileSync(out, 'utf8'));
  const score = Math.round(r.categories.accessibility.score * 100);
  const notes = Object.values(r.audits)
    .filter((a) => a.scoreDisplayMode === 'binary' && a.score !== null && a.score < 1)
    .map((a) => a.id);
  worst = Math.min(worst, score);
  console.log(`${name.padEnd(12)} ${score}${notes.length ? `  (${notes.join(', ')})` : ''}`);
}
process.exit(worst >= 95 ? 0 : 1);
