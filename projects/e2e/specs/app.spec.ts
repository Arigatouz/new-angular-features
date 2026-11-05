import { expect, test } from '@playwright/test';

test('has the app title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/NewAngularFeatures/);
});

test('root redirects to /home and renders the hero', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/home$/);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toContainText(/Experimenting with/);
  await expect(heading).toContainText(/Angular's Future/);
});

test('navigates to examples via the hero CTA', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'See the Experiments' }).click();

  await expect(page).toHaveURL(/\/examples/);
});
