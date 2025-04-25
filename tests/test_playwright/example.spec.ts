import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { PlaywrightHome } from '../../src/pages/playwright-home';  
dotenv.config();

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.BASE_URL as any);
});

test.describe('go to Playwright', () => {
  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link', async ({ page }) => {
    const playwrightHome = new PlaywrightHome(page);
    await playwrightHome.getStartedLink();
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('get docs', async ({ page }) => {
    const playwrightHome = new PlaywrightHome(page);
    await playwrightHome.docsLink();
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });
})
