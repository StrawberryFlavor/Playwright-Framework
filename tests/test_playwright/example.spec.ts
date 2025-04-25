import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { PlaywrightHome } from '../../src/pages/playwright-home';  
import { configureLogger } from '../../src/framework/utils/log-config';
import { testConfig } from '../../config/test.config';
import { getLogConfigFromEnv } from '../../src/framework/utils/cli-args';

// 加载环境变量
dotenv.config();

// 配置日志系统，优先使用环境变量
const envLogConfig = getLogConfigFromEnv();
configureLogger({ ...testConfig.logger, ...envLogConfig });

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
