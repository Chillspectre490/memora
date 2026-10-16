import { test, expect } from '@playwright/test';

test('Memora loads', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Memora — Study anything');
  await expect(page.locator('#app')).not.toBeEmpty();
});
