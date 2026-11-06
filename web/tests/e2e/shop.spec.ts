import { expect, test } from '@playwright/test';
import { addCurrentProductToCart, CHILLI_ID, CLASSIC_ID, euro, MOCK_URL, PASSWORD, resetBackend, signIn, selectSize } from './helpers';

test.beforeEach(resetBackend);

test.describe('catalogue', () => {
  test('browse, filter, sort and search', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Pirkti obuolių sūrį' }).click();
    await expect(page).toHaveURL('/products');

    const cards = page.locator('article');
    await expect(cards).toHaveCount(6);
    await expect(cards.first()).toContainText('Klasikinis obuolių sūris');
    await expect(cards.first()).toContainText('150 g · 300 g · 600 g');
    await expect(cards.first()).toContainText(/nuo\s+5,90/);

    await page.getByRole('navigation', { name: 'Kategorijos' }).getByRole('link', { name: 'Dovanų rinkiniai' }).click();
    await expect(page).toHaveURL(/category=gift_sets/);
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Degustacinė dovanų dėžutė');

    await page.goto('/products');
    await page.getByLabel('Rūšiuoti').selectOption('price_desc');
    await expect(page).toHaveURL(/sort=price_desc/);
    await expect(cards.first()).toContainText('Degustacinė dovanų dėžutė');

    const search = page.getByLabel('Ieškoti produktų');
    await search.fill('čili');
    await search.press('Enter');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Obuolių sūris su čili');

    await search.fill('zzzz');
    await search.press('Enter');
    await expect(page.getByText('Pagal jūsų paiešką produktų nerasta.')).toBeVisible();
    await page.getByRole('link', { name: 'Išvalyti filtrus' }).click();
    await expect(cards).toHaveCount(6);
  });

  test('choosing a size updates the price', async ({ page }) => {
    await page.goto('/products');
    await page.locator('article').first().getByRole('link').click();

    await expect(page).toHaveTitle(/Klasikinis obuolių sūris/);
    const price = page.locator('p[aria-live="polite"]');
    await expect(price).toHaveText(euro('5.90'));

    await selectSize(page, '600 g');
    await expect(price).toHaveText(euro('19.00'));
    await selectSize(page, '300 g');
    await expect(price).toHaveText(euro('10.50'));

    await expect(page.getByText('Visoje Lietuvoje, 5,99')).toBeVisible();
  });

  test('an unknown product shows the not-found page', async ({ page }) => {
    await page.goto('/products/00000099-0000-4000-8000-000000000000');
    await expect(page.getByRole('heading', { name: 'Puslapis nerastas' })).toBeVisible();
  });
});

test.describe('accounts', () => {
  test('a signed-out visitor is sent to sign in and returned to the product', async ({ page }) => {
    await page.goto(`/products/${CLASSIC_ID}`);
    await expect(page.getByText('Norėdami pirkti,')).toBeVisible();
    await page.getByRole('button', { name: 'Į krepšelį' }).click();

    await expect(page).toHaveURL(/\/login\?next=/);
    await page.getByLabel('El. paštas').fill('jonas@example.lt');
    await page.getByLabel('Slaptažodis').fill(PASSWORD);
    await page.getByRole('button', { name: 'Prisijungti' }).click();

    await expect(page).toHaveURL(new RegExp(`/products/${CLASSIC_ID}$`));
    await addCurrentProductToCart(page);
    await expect(page.getByRole('link', { name: 'Krepšelis, prekių: 1' })).toBeVisible();
  });

  test('wrong credentials show a Lithuanian error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('El. paštas').fill('jonas@example.lt');
    await page.getByLabel('Slaptažodis').fill('neteisingas');
    await page.getByRole('button', { name: 'Prisijungti' }).click();
    await expect(page.locator('p[role="alert"]')).toHaveText('Neteisingas el. paštas arba slaptažodis.');
    await expect(page).toHaveURL(/\/login/);
  });

  test('sign-up creates an account, and reports an existing email', async ({ page }) => {
    await page.goto('/signup');
    await page.getByLabel('El. paštas').fill('existing@example.lt');
    await page.getByLabel('Slaptažodis').fill(PASSWORD);
    await page.getByRole('button', { name: 'Registruotis' }).click();
    await expect(page.locator('p[role="alert"]')).toHaveText('Vartotojas su tokiu el. paštu jau egzistuoja.');

    await page.getByLabel('El. paštas').fill('naujas@example.lt');
    await page.getByRole('button', { name: 'Registruotis' }).click();
    await expect(page).toHaveURL(/\/products$/);
  });

  test('private pages redirect to sign-in and sign-out works', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/login\?next=%2Fcart/);

    await signIn(page);
    await page.goto('/account');
    await expect(page.getByRole('heading', { name: 'Paskyra' })).toBeVisible();
    await expect(page.getByText('jonas@example.lt')).toBeVisible();
    await page.getByRole('button', { name: 'Atsijungti' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Prisijungti' }).first()).toBeVisible();
  });
});

test.describe('cart and checkout', () => {
  test('a signed-in customer buys two products and sees a paid order', async ({ page }) => {
    await signIn(page);

    await page.goto(`/products/${CLASSIC_ID}`);
    await selectSize(page, '300 g');
    await addCurrentProductToCart(page);

    await page.goto(`/products/${CHILLI_ID}`);
    await addCurrentProductToCart(page);

    await page.getByRole('link', { name: 'Krepšelis, prekių: 2' }).click();
    await expect(page).toHaveURL('/cart');
    await expect(page.locator('main li')).toHaveCount(2);

    await page.getByRole('button', { name: 'Padidinti kiekį: Klasikinis obuolių sūris (300 g)' }).click();
    const summary = page.getByRole('complementary').locator('.card');
    await expect(summary.getByText(euro('27.50'))).toBeVisible(); // 2 × 10,50 + 6,50
    await expect(summary.getByText(euro('5.99'))).toBeVisible();
    await expect(summary.getByText(euro('5.78'))).toBeVisible();
    await expect(summary.getByText(euro('39.27'))).toBeVisible();

    await page.getByRole('link', { name: 'Pereiti prie apmokėjimo' }).click();
    await expect(page).toHaveURL('/checkout');

    await page.getByRole('button', { name: 'Pateikti užsakymą' }).click();
    for (const message of ['Įveskite gatvę', 'Įveskite namo numerį', 'Įveskite miestą', 'Įveskite pašto kodą']) {
      await expect(page.getByText(message)).toBeVisible();
    }
    await expect(page.getByText('Įveskite teisingą telefono numerį, pvz., +370 600 00000')).toBeVisible();

    await page.getByLabel('Gatvė', { exact: true }).fill('Gedimino pr.');
    await page.getByLabel('Namo numeris').fill('12');
    await page.getByLabel('Miestas').fill('Vilnius');
    await page.getByLabel('Pašto kodas').fill('LT-01103');
    await page.getByLabel('Telefono numeris').fill('+370 600 00000');
    await page.getByRole('button', { name: 'Pateikti užsakymą' }).click();

    await expect(page).toHaveURL(/\/orders\/.+\?placed=1/);
    await expect(page.getByRole('heading', { name: 'Ačiū už jūsų užsakymą!' })).toBeVisible();
    await expect(page.getByText('Apmokėta', { exact: true })).toBeVisible();
    await expect(page.getByText('Gedimino pr. 12')).toBeVisible();
    await expect(page.getByText('300 g · 2 ×')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Krepšelis, prekių: 0' })).toBeVisible();

    await page.getByRole('link', { name: '← Visi užsakymai' }).click();
    await expect(page.getByText(/Užsakymas Nr\./)).toBeVisible();
    await expect(page.getByText('Apmokėta', { exact: true })).toBeVisible();
  });

  test('quantities can be lowered and items removed', async ({ page }) => {
    await signIn(page);
    await page.goto(`/products/${CHILLI_ID}`);
    await addCurrentProductToCart(page);
    await page.goto('/cart');

    await page.getByRole('button', { name: 'Padidinti kiekį: Obuolių sūris su čili (150 g)' }).click();
    await expect(page.getByRole('link', { name: 'Krepšelis, prekių: 2' })).toBeVisible();
    await page.getByRole('button', { name: 'Sumažinti kiekį: Obuolių sūris su čili (150 g)' }).click();
    await expect(page.getByRole('link', { name: 'Krepšelis, prekių: 1' })).toBeVisible();

    await page.getByRole('button', { name: 'Pašalinti: Obuolių sūris su čili (150 g)' }).click();
    await expect(page.getByText('Jūsų krepšelis tuščias')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pereiti prie apmokėjimo' })).toHaveCount(0);
  });

  test('an empty cart cannot be checked out', async ({ page }) => {
    await signIn(page);
    await page.goto('/checkout');
    await expect(page.getByRole('button', { name: 'Pateikti užsakymą' })).toBeDisabled();
  });

  test('a cart that fails to load offers a retry instead of looking empty', async ({ page }) => {
    await signIn(page);
    await page.route('**/api/cart', (route) =>
      route.fulfill({ status: 500, json: { error: { code: 'INTERNAL_ERROR', message: 'Vidinė serverio klaida' } } })
    );
    await page.goto('/cart');
    await expect(page.getByText('Vidinė serverio klaida')).toBeVisible();
    await expect(page.getByText('Jūsų krepšelis tuščias')).toHaveCount(0);

    await page.unroute('**/api/cart');
    await page.getByRole('button', { name: 'Bandyti dar kartą' }).click();
    await expect(page.getByText('Jūsų krepšelis tuščias')).toBeVisible();
  });
});

test.describe('content pages', () => {
  test('contact form validates, sends and confirms', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Siųsti žinutę' }).click();
    await expect(page.getByText('Įveskite savo vardą')).toBeVisible();

    await page.getByLabel('Vardas ir pavardė').fill('Jonas Jonaitis');
    await page.getByLabel('El. pašto adresas').fill('jonas@example.lt');
    await page.getByLabel('Tema').fill('Klausimas');
    await page.getByLabel('Žinutė').fill('Ar turite sūrio be cukraus?');
    await page.getByRole('button', { name: 'Siųsti žinutę' }).click();

    await expect(page.getByText('Ačiū! Jūsų žinutė išsiųsta.')).toBeVisible();
    const stored = await (await fetch(`${MOCK_URL}/__contact`)).json();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ email: 'jonas@example.lt', subject: 'Klausimas' });
  });

  for (const [path, heading] of [
    ['/about', /Šimtmečių senumo receptas/],
    ['/delivery', 'Pristatymas ir grąžinimas'],
    ['/faq', 'Dažniausiai užduodami klausimai'],
    ['/credits', 'Nuotraukų autoriai'],
  ] as const) {
    test(`${path} renders a single heading`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
    });
  }

  test('FAQ answers expand and collapse', async ({ page }) => {
    await page.goto('/faq');
    const question = page.getByText('Ar obuolių sūryje yra pieno?');
    const answer = page.getByText('Obuolių sūris gaminamas tik iš obuolių');
    await expect(answer).toBeHidden();
    await question.click();
    await expect(answer).toBeVisible();
  });

  test('the site is clearly marked as a demonstration', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Demonstracinė parduotuvė: užsakymai nevykdomi')).toBeVisible();
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('the menu opens, closes and keeps the cart visible', async ({ page }) => {
    await page.goto('/');
    const cart = page.getByRole('link', { name: /Krepšelis, prekių/ });
    await expect(cart).toBeVisible();

    await page.getByRole('button', { name: 'Atidaryti meniu' }).click();
    const menu = page.locator('#mobile-menu');
    for (const name of ['Parduotuvė', 'Dovanų rinkiniai', 'Mūsų istorija', 'Kontaktai', 'Pristatymas ir grąžinimas', 'DUK']) {
      await expect(menu.getByRole('link', { name })).toBeVisible();
    }
    await expect(cart).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);

    await page.getByRole('button', { name: 'Atidaryti meniu' }).click();
    await menu.getByRole('link', { name: 'Parduotuvė' }).click();
    await expect(page).toHaveURL('/products');
    await expect(menu).toHaveCount(0);
  });

  for (const path of ['/', '/products', `/products/${CLASSIC_ID}`, '/about', '/contact', '/faq']) {
    test(`${path} has no horizontal scrolling`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
