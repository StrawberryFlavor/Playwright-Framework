import { Page, Locator, ElementHandle, FrameLocator, LocatorScreenshotOptions } from '@playwright/test';
import { kStringMaxLength } from 'buffer';
import { log } from 'console';

/**
 * 页面操作工具类，对Playwright的Page方法进行二次包装，增加日志等功能
 */
export class PageUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * 增强版的goto方法，添加日志
   * @param url 要访问的URL
   * @param options 原始goto方法的选项
   */
  async goto(url: string, options?: Parameters<Page['goto']>[1]) {
    console.log(`🚀 正在访问页面: ${url}`);
    const startTime = Date.now();
    
    try {
      const response = await this.page.goto(url, options);
      const loadTime = Date.now() - startTime;
      console.log(`✅ 页面加载完成: ${url}, 耗时: ${loadTime}ms`);
      return response;
    } catch (error) {
      console.error(`❌ 页面加载失败: ${url}, 错误: ${error}`);
      throw error;
    }
  }

  async getRole(role: string, options?: Parameters<Page['getByRole']>[1]) {
    console.log(`🔍 正在获取元素: ${role}`) 
    try {
      const element = await this.page.getByRole(role as any, options);
      console.log(`✅ 获取元素成功: ${role}`);
      return element;
    } catch (error) {
      console.error(`❌ 获取元素失败: ${role}, 错误: ${error}`);
      throw error;
    }
  }

  /**
   * 增强版的click方法，添加日志
   * @param selector 要点击的元素选择器或Locator对象
   */
  async click(selector: string | Locator) {
    console.log(`👆 正在点击元素`);
    try {
      if (typeof selector === 'string') {
        await this.page.click(selector);
      } else {
        // 如果传入的是Locator对象
        await selector.click();
      }
      console.log(`✅ 点击元素成功`);
    } catch (error) {
      console.error(`❌ 点击元素失败, 错误: ${error}`);
      throw error;
    }
  }

  /**
   * 增强版的fill方法，添加日志
   * @param selector 要填充的元素选择器
   * @param value 要填充的值
   * @param options 填充选项
   */
  async fill(selector: string, value: string, options?: Parameters<Page['fill']>[2]) {
    console.log(`✏️ 正在填充元素: ${selector}, 值: ${value}`);
    try {
      await this.page.fill(selector, value, options);
      console.log(`✅ 填充元素成功: ${selector}`);
    } catch (error) {
      console.error(`❌ 填充元素失败: ${selector}, 错误: ${error}`);
      throw error;
    }
  }

  /**
   * 增强版的screenshot方法，添加日志和自动命名
   * @param options 截图选项
   */
  async screenshot(options?: Parameters<Page['screenshot']>[0] & { name?: string }) {
    const name = options?.name || `screenshot-${Date.now()}`;
    console.log(`📸 正在截取页面截图: ${name}`);
    try {
      const path = options?.path || `./screenshots/${name}.png`;
      const finalOptions = { ...options, path };
      await this.page.screenshot(finalOptions);
      console.log(`✅ 截图成功: ${path}`);
      return path;
    } catch (error) {
      console.error(`❌ 截图失败, 错误: ${error}`);
      throw error;
    }
  }

  /**
   * 增强版的waitForSelector方法，添加日志和超时处理
   * @param selector 要等待的元素选择器
   * @param options 等待选项
   */
  async waitForSelector(selector: string, options: Parameters<Page['waitForSelector']>[1] = {}): Promise<ElementHandle<SVGElement | HTMLElement> | null> {
    const timeout = options?.timeout || 30000;
    console.log(`⏳ 等待元素出现: ${selector}, 超时: ${timeout}ms`);
    const startTime = Date.now();
    
    try {
      const element = await this.page.waitForSelector(selector, options);
      const waitTime = Date.now() - startTime;
      console.log(`✅ 元素已出现: ${selector}, 等待时间: ${waitTime}ms`);
      return element;
    } catch (error) {
      const waitTime = Date.now() - startTime;
      console.error(`❌ 等待元素超时: ${selector}, 已等待: ${waitTime}ms, 错误: ${error}`);
      throw error;
    }
  }

  /**
   * 等待页面加载完成
   * @param options 等待选项
   */
  async waitForLoadState(state?: 'load' | 'domcontentloaded' | 'networkidle', options?: { timeout?: number }) {
    const stateType = state || 'load';
    const timeout = options?.timeout || 30000;
    console.log(`⏳ 等待页面加载状态: ${stateType}, 超时: ${timeout}ms`);
    const startTime = Date.now();
    
    try {
      await this.page.waitForLoadState(stateType, options);
      const waitTime = Date.now() - startTime;
      console.log(`✅ 页面加载完成: ${stateType}, 等待时间: ${waitTime}ms`);
    } catch (error) {
      const waitTime = Date.now() - startTime;
      console.error(`❌ 页面加载超时: ${stateType}, 已等待: ${waitTime}ms, 错误: ${error}`);
      throw error;
    }
  }

  /**
   * 获取元素文本内容
   * @param selector 元素选择器
   */
  async getText(selector: string): Promise<string> {
    console.log(`📖 正在获取元素文本: ${selector}`);
    try {
      const text = await this.page.locator(selector).innerText();
      console.log(`✅ 获取元素文本成功: ${selector}, 文本: ${text}`);
      return text;
    } catch (error) {
      console.error(`❌ 获取元素文本失败: ${selector}, 错误: ${error}`);
      throw error;
    }
  }

  /**
   * 执行JavaScript代码并返回结果
   * @param pageFunction 要执行的JavaScript函数
   * @param arg 传递给函数的参数
   */
  async evaluate<R>(pageFunction: Function | string, arg?: any): Promise<R> {
    console.log(`🔄 正在执行JavaScript`);
    try {
      const result = await this.page.evaluate(pageFunction as any, arg);
      console.log(`✅ JavaScript执行成功`);
      return result as R;
    } catch (error) {
      console.error(`❌ JavaScript执行失败, 错误: ${error}`);
      throw error;
    }
  }
}

/**
 * 创建PageUtils实例的工厂函数
 */
export function createPageUtils(page: Page): PageUtils {
  return new PageUtils(page);
} 