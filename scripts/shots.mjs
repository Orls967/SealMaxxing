// Screenshot helper for visual self-review.
// Usage: node scripts/shots.mjs <out.png> '<hash e.g. #/?cut=90>' [WxH] [steps...]
// Steps: click:<selector> | wait:<ms> | key:<Key> | drag:x1,y1,x2,y2 | wheel:dy | hover:x,y | eval:<js>
import { chromium } from '@playwright/test';

const [out, hash = '#/', size = '1440x900', ...steps] = process.argv.slice(2);
const [width, height] = size.split('x').map(Number);
const base = process.env.BASE_URL ?? 'http://localhost:5173/';
const browser = await chromium.launch({
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const mobile = width < 600;
const ctx = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: mobile ? 2 : 1,
  hasTouch: mobile,
  isMobile: mobile,
  colorScheme: process.env.SCHEME ?? 'dark',
});
const page = await ctx.newPage();
page.on('console', (m) => m.type() === 'error' && console.log('[console.error]', m.text().slice(0, 300)));
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 300)));
await page.addInitScript(() => localStorage.setItem('cs-onboarded', '1'));
await page.goto(base + hash);
await page.waitForTimeout(Number(process.env.WAIT ?? 3500));
for (const s of steps) {
  const i = s.indexOf(':');
  const kind = s.slice(0, i);
  const arg = s.slice(i + 1);
  if (kind === 'click') await page.locator(arg).first().click();
  else if (kind === 'wait') await page.waitForTimeout(Number(arg));
  else if (kind === 'key') await page.keyboard.press(arg);
  else if (kind === 'wheel') await page.mouse.wheel(0, Number(arg));
  else if (kind === 'hover') {
    const [x, y] = arg.split(',').map(Number);
    await page.mouse.move(x, y);
  } else if (kind === 'drag') {
    const [x1, y1, x2, y2] = arg.split(',').map(Number);
    await page.mouse.move(x1, y1);
    await page.mouse.down();
    await page.mouse.move((x1 + x2) / 2, (y1 + y2) / 2, { steps: 6 });
    await page.mouse.move(x2, y2, { steps: 6 });
    await page.mouse.up();
  } else if (kind === 'eval') console.log(await page.evaluate(arg));
}
await page.screenshot({ path: out });
await browser.close();
console.log('saved', out);
