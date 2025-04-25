import { Page } from '@playwright/test';
import { createPageUtils } from '../framework/utils/page-utils';
import { testData } from '../data/test-data';

export class PlaywrightHome {
  private pageUtils;
  private data = testData.playwright;
  
  constructor(private page: Page) {
    this.pageUtils = createPageUtils(page);
  }

  async getStartedLink() {
    const element = await this.pageUtils.getRole('link', { name: this.data.links.getStarted });
    await this.pageUtils.click(element);
  }

  async docsLink() {
    const element = await this.pageUtils.getRole('link', { name: this.data.links.docs });
    await this.pageUtils.click(element);
  }
}