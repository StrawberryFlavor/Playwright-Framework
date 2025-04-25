import { Page } from '@playwright/test';
import { createPageUtils } from '../../framework/utils/page-utils';

export class PlaywrightHome {
  private pageUtils;
  
  constructor(private page: Page) {
    this.pageUtils = createPageUtils(page);
  }

  async getStartedLink() {
    const element = await this.pageUtils.getRole('link', { name: 'Get started' });
    await this.pageUtils.click(element);
  }

  async docsLink() {
    const element = await this.pageUtils.getRole('link', { name: 'Docs' });
    await this.pageUtils.click(element);
  }
}