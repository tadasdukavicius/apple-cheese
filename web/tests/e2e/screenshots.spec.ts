import { test } from '@playwright/test';
import { addCurrentProductToCart, CHILLI_ID, CLASSIC_ID, resetBackend, signIn, selectSize } from './helpers';

// Regenerates the README screenshots from the mock backend:  npm run screenshots
// Skipped in normal test runs.
test.skip(!process.env.SCREENSHOTS, 'Set SCREENSHOTS=1 (or run npm run screenshots) to regenerate docs/screenshots');

const OUT = 'docs/screenshots';
const shot = { type: 'jpeg', quality: 82 } as const;

async function settle(page: import('@playwright/test').Page) {
  await page.waitForLoadState('networkidle');
  // Let lazy images and web fonts finish
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 860 } });

  test('public pages', async ({ page }) => {
    await resetBackend();

    await page.goto('/');
    await settle(page);
    await page.screenshot({ path: `${OUT}/home.jpg`, ...shot });

    await page.goto('/products');
    await settle(page);
    await page.screenshot({ path: `${OUT}/catalogue.jpg`, ...shot });

    await page.goto(`/products/${CLASSIC_ID}`);
    await selectSize(page, '300 g');
    await settle(page);
    await page.screenshot({ path: `${OUT}/product.jpg`, ...shot });
  });

  test('cart and checkout', async ({ page }) => {
    await resetBackend();
    await signIn(page);
    await page.goto(`/products/${CLASSIC_ID}`);
    await selectSize(page, '300 g');
    await addCurrentProductToCart(page);
    await page.goto(`/products/${CHILLI_ID}`);
    await addCurrentProductToCart(page);

    await page.goto('/cart');
    await page.getByRole('button', { name: 'Padidinti kiekį: Klasikinis obuolių sūris (300 g)' }).click();
    await settle(page);
    await page.screenshot({ path: `${OUT}/cart.jpg`, ...shot });

    await page.goto('/checkout');
    await page.getByRole('button', { name: 'Pateikti užsakymą' }).click();
    await settle(page);
    await page.screenshot({ path: `${OUT}/checkout.jpg`, ...shot });
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

  test('home, product and menu', async ({ page }) => {
    await resetBackend();

    await page.goto('/');
    await settle(page);
    await page.screenshot({ path: `${OUT}/mobile-home.jpg`, ...shot });

    await page.goto(`/products/${CLASSIC_ID}`);
    await settle(page);
    await page.screenshot({ path: `${OUT}/mobile-product.jpg`, ...shot });

    await page.getByRole('button', { name: 'Atidaryti meniu' }).click();
    await settle(page);
    await page.screenshot({ path: `${OUT}/mobile-menu.jpg`, ...shot });
  });
});
