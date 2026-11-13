import { expect, test } from '@playwright/test';

const ROUTES: [string, RegExp][] = [
  ['#/', /Empat mobil/i],
  ['#/bedah/seal', /Bedah BYD Seal/i],
  ['#/banding', /Banding/i],
  ['#/banding/energy?xray=1', /Penyimpan energi/i],
  ['#/data', /Data/i],
  ['#/adu', /Adu/i],
  ['#/glosarium', /Glosarium/i],
  ['#/tentang', /Tentang/i],
];

test.describe('routes', () => {
  for (const [hash, heading] of ROUTES) {
    test(`loads ${hash}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(`/${hash}`);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeAttached();
      expect(errors).toEqual([]);
    });
  }
});

test('a part can be selected with the keyboard only', async ({ page }) => {
  await page.goto('/#/bedah/p1');
  const button = page.locator('button[data-part="battery"]');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { level: 2, name: 'Baterai traksi' })).toBeVisible();
  await expect(page).toHaveURL(/part=battery/);
  await expect(page).toHaveURL(/xray=1/);
});

test('an absent part explains why instead of showing a zero', async ({ page }) => {
  await page.goto('/#/bedah/senna?part=battery');
  await expect(page.getByText('Tidak ada pada mobil ini.').first()).toBeVisible();
});

test('the hash restores a dissect view', async ({ page }) => {
  await page.goto('/#/bedah/seal?part=motor-front&xray=1&peel=2&ex=40&cut=x&cp=30');
  await expect(page.getByRole('heading', { level: 2, name: 'Motor listrik depan' })).toBeVisible();
  await expect(page.getByRole('slider', { name: /Kupas lapisan/ })).toHaveValue('2');
  await expect(page.getByRole('slider', { name: /Ledak/ })).toHaveValue('40');
  await expect(page.getByRole('checkbox', { name: 'Sinar-X' })).toBeChecked();
  await expect(page.getByRole('button', { name: 'Memanjang' })).toHaveAttribute('aria-pressed', 'true');
});

test('switching system in Banding keeps the canvas mounted', async ({ page }) => {
  await page.goto('/#/banding/energy?xray=1');
  const canvas = page.locator('canvas').first();
  await expect(canvas).toBeAttached();
  await canvas.evaluate((el) => el.setAttribute('data-keep', '1'));
  await page.getByRole('link', { name: 'Rem', exact: true }).click();
  await expect(page).toHaveURL(/banding\/brakes/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Rem');
  await expect(page.locator('canvas[data-keep="1"]')).toBeAttached();
  await expect(page.getByText('Dasar ukur').or(page.getByText('Cakram depan')).first()).toBeVisible();
});

test('Banding shows the measurement basis and no winner for mixed bases', async ({ page }) => {
  await page.goto('/#/banding/energy?xray=1');
  const row = page.getByRole('region', { name: 'Jarak listrik murni' });
  await expect(row.getByText('WLTP')).toBeVisible();
  await expect(row.getByText(/Dasar ukur berbeda/)).toBeVisible();
  await expect(row.getByText('terbaik')).toHaveCount(0);
});

test('Data and Banding keep working without WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type.startsWith('webgl')) return null;
      return Reflect.apply(original, this, [type, ...rest]);
    } as typeof original;
  });
  await page.goto('/#/data');
  await expect(page.getByRole('rowheader', { name: 'Daya gabungan (kW)' })).toBeVisible();
  await page.goto('/#/banding/energy');
  await expect(page.getByText('Tampilan 3D tidak tersedia')).toBeVisible();
  await expect(page.getByRole('img', { name: /Gambar statis BYD Seal/ })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Kapasitas baterai traksi' })).toBeVisible();
});

test('the Adu page reports model results next to the claims', async ({ page }) => {
  await page.goto('/#/adu?mode=accel&dist=100');
  const row = page.getByRole('row', { name: /Seal/ });
  await expect(row).toContainText('3,8 dtk');
  await expect(page.getByRole('columnheader', { name: /Klaim pabrikan/ })).toBeVisible();
});
