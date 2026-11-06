import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { addCurrentProductToCart, CLASSIC_ID, resetBackend, signIn } from './helpers';

test.beforeEach(resetBackend);

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const summary = results.violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    help: v.help,
    targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
  }));
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
}

test.describe('accessibility (axe, WCAG 2.1 A and AA)', () => {
  for (const [name, path] of [
    ['home', '/'],
    ['catalogue', '/products'],
    ['product page', `/products/${CLASSIC_ID}`],
    ['about', '/about'],
    ['delivery', '/delivery'],
    ['FAQ', '/faq'],
    ['contact', '/contact'],
    ['sign in', '/login'],
    ['sign up', '/signup'],
  ] as const) {
    test(name, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expectNoViolations(page);
    });
  }

  test('contact form with validation errors', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Siųsti žinutę' }).click();
    await expect(page.getByText('Įveskite savo vardą')).toBeVisible();
    await expectNoViolations(page);
  });

  test('cart, checkout and order pages when signed in', async ({ page }) => {
    await signIn(page);
    await page.goto(`/products/${CLASSIC_ID}`);
    await addCurrentProductToCart(page);

    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Užsakymo suvestinė' })).toBeVisible();
    await expectNoViolations(page);

    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: 'Pristatymo adresas' })).toBeVisible();
    await expectNoViolations(page);
  });

  test('mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Atidaryti meniu' }).click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await expectNoViolations(page);
  });
});
