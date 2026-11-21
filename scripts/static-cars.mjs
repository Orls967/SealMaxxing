// Renders one still picture per car for the no-WebGL fallback.
// Usage: node scripts/static-cars.mjs   (dev server must be running on BASE_URL)
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const base = process.env.BASE_URL ?? 'http://localhost:5173/';
const cars = ['seal', 'laferrari', 'p1', 'senna'];
await mkdir('public/static', { recursive: true });
const browser = await chromium.launch({
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
for (const id of cars) {
  await page.goto(`${base}#/bedah/${id}`);
  await page.reload();
  await page.waitForTimeout(8000);
  const png = await page.locator('canvas').first().screenshot();
  await sharp(png).resize({ width: 800 }).webp({ quality: 78 }).toFile(`public/static/${id}.webp`);
  console.log('saved', id);
}
await browser.close();
