import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * 读取环境变量
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* 并行执行测试 */
  fullyParallel: true,
  /* 在CI环境中禁止使用test.only */
  forbidOnly: !!process.env.CI,
  /* 仅在CI环境中重试 */
  retries: process.env.CI ? 2 : 0,
  /* 禁用CI环境中的并行测试 */
  workers: process.env.CI ? 1 : undefined,
  /* 测试报告器 */
  reporter: 'html',
  /* 所有项目的共享设置 */
  use: {
    /* 基础URL */
    baseURL: process.env.BASE_URL,
    /* 失败重试时收集跟踪 */
    trace: 'on-first-retry',
    /* 启用自动截图 */
    screenshot: 'only-on-failure',
  },

  /* 配置不同的浏览器项目 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 移动视口测试 */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* 测试品牌浏览器 */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
