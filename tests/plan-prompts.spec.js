import { test, expect } from '@playwright/test';

test('first profile setup asks for a study plan', async ({ page }) => {
  await page.goto('/?fresh=plan-prompt');
  await page.getByLabel('First name').fill('Test');
  await page.getByLabel('Username').fill('plan-test');
  await page.getByRole('button', { name: 'Create local profile' }).click();

  await expect(page.getByRole('dialog')).toContainText('Choose your study plan');
  await expect(page.getByRole('button', { name: /Monthly membership/ })).toBeVisible();
  await page.getByRole('button', { name: /^Free/ }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
