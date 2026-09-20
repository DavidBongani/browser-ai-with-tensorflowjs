import { test, expect } from '@playwright/test';

test('browser test harness is operational', async ({ page }) => {
  await page.setContent(
    '<main><h1>Browser AI Lab</h1><p id="status">ready</p></main>',
  );

  await expect(page.getByRole('heading')).toHaveText('Browser AI Lab');
  await expect(page.locator('#status')).toHaveText('ready');
});
