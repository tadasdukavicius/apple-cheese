import { expect, type Page } from '@playwright/test';

export const MOCK_URL = 'http://localhost:8110';
export const PASSWORD = 'slaptazodis123';

// Product ids from tests/e2e/mock-api.mjs
export const CLASSIC_ID = '00000001-0000-4000-8000-000000000000';
export const CHILLI_ID = '00000002-0000-4000-8000-000000000000';

/** The mock backend keeps its state in memory, so each test starts from a clean slate. */
export async function resetBackend() {
  const res = await fetch(`${MOCK_URL}/__reset`);
  if (!res.ok) throw new Error('Could not reset the mock backend. Is it running?');
}

export async function signIn(page: Page, email = 'jonas@example.lt') {
  await page.goto('/login');
  await page.getByLabel('El. paštas').fill(email);
  await page.getByLabel('Slaptažodis').fill(PASSWORD);
  await page.getByRole('button', { name: 'Prisijungti' }).click();
  await expect(page).toHaveURL(/\/products$/);
}

/** Matches a euro amount regardless of the (non-breaking) space Intl puts before the sign. */
export const euro = (amount: string) => new RegExp(`${amount.replace('.', ',')}\\s?€`);

export async function addCurrentProductToCart(page: Page) {
  await page.getByRole('button', { name: 'Į krepšelį' }).click();
  await expect(page.getByText('Prekė įdėta į krepšelį')).toBeVisible();
}

/**
 * Picks a size on a product page. Right after navigation the streamed server copy and the hydrated copy of the
 * page can briefly coexist, so wait until exactly one matching label exists before clicking it.
 */
export async function selectSize(page: Page, label: string) {
  const option = page.locator('label', { hasText: label });
  await expect(option).toHaveCount(1);
  await option.click();
}
