import { Page, Locator, ElementHandle, FrameLocator, LocatorScreenshotOptions } from '@playwright/test';
import { log } from './logger';

/**
 * 页面操作工具类，对Playwright的Page方法进行二次包装，增加日志等功能
 */
export class PageUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * 记录步骤日志
   */
  async logStep(message: string): Promise<void> {
    log.step(message);
  }

  /**
   * 获取元素的详细描述信息
   * @param selector 元素选择器或Locator对象
   * @returns 元素的详细描述
   */
  private async getElementDescription(selector: string | Locator): Promise<string> {
    if (typeof selector === 'string') {
      return selector;
    }
    
    try {
      // 尝试获取元素文本作为标识
      const text = await selector.textContent() || '';
      
      // 尝试获取元素的属性
      try {
        const attr = await this.page.evaluate(el => {
          return {
            tagName: el.tagName?.toLowerCase() || '',
            role: el.getAttribute('role') || '',
            name: el.getAttribute('name') || '',
            id: el.id || '',
            className: el.className || '',
            type: el.getAttribute('type') || '',
            placeholder: el.getAttribute('placeholder') || ''
          };
        }, selector as any);
        
        // 构建更详细的选择器描述
        if (text.trim()) {
          return `"${text.trim().substring(0, 20)}${text.length > 20 ? '...' : ''}"`;
        } else if (attr.placeholder) {
          return `${attr.tagName}[placeholder="${attr.placeholder}"]`;
        } else if (attr.role || attr.name) {
          return `${attr.tagName}${attr.role ? `[role=${attr.role}]` : ''}${attr.name ? `[name=${attr.name}]` : ''}`;
        } else if (attr.id) {
          return `${attr.tagName}#${attr.id}`;
        } else if (attr.className) {
          return `${attr.tagName}.${attr.className.split(' ')[0]}`;
        } else if (attr.type) {
          return `${attr.tagName}[type=${attr.type}]`;
        }
      } catch (e) {
        // 如果无法获取属性，尝试使用文本
        if (text.trim()) {
          return `"${text.trim().substring(0, 20)}${text.length > 20 ? '...' : ''}"`;
        }
      }
    } catch (e) {
      // 任何错误发生，都使用默认描述
    }
    
    return 'Locator对象';
  }

  /**
   * 增强版的goto方法，添加日志
   * @param url 要访问的URL
   * @param options 原始goto方法的选项
   */
  async goto(url: string, options?: Parameters<Page['goto']>[1]) {
    log.info(`🚀 正在访问页面: ${url}`);
    const startTime = Date.now();
    
    try {
      const response = await this.page.goto(url, options);
      const loadTime = Date.now() - startTime;
      log.info(`✅ 页面加载完成: ${url}, 耗时: ${loadTime}ms`);
      log.performance('页面加载', loadTime);
      return response;
    } catch (error) {
      log.error(`❌ 页面加载失败: ${url}`, error);
      throw error;
    }
  }

  async getRole(role: string, options?: Parameters<Page['getByRole']>[1]) {
    const roleDescription = options?.name ? `${role}[name="${options.name}"]` : role;
    log.debug(`🔍 正在获取元素: ${roleDescription}`);
    try {
      const element = await this.page.getByRole(role as any, options);
      log.debug(`✅ 获取元素成功: ${roleDescription}`);
      return element;
    } catch (error) {
      log.error(`❌ 获取元素失败: ${roleDescription}`, error);
      throw error;
    }
  }

  /**
   * 增强版的click方法，添加日志
   * @param selector 要点击的元素选择器或Locator对象
   */
  async click(selector: string | Locator) {
    const selectorInfo = await this.getElementDescription(selector);
    
    log.info(`👆 正在点击元素: ${selectorInfo}`);
    const startTime = Date.now();
    
    try {
      if (typeof selector === 'string') {
        await this.page.click(selector);
      } else {
        // 如果传入的是Locator对象
        await selector.click();
      }
      const clickTime = Date.now() - startTime;
      log.elementSuccess(`✅ 点击元素成功: ${selectorInfo}`);
      log.performance('元素点击', clickTime);
    } catch (error) {
      log.error(`❌ 点击元素失败: ${selectorInfo}`, error);
      throw error;
    }
  }

  /**
   * 增强版的fill方法，添加日志
   * @param selector 要填充的元素选择器或Locator对象
   * @param value 要填充的值
   * @param options 填充选项
   */
  async fill(selector: string | Locator, value: string, options?: Parameters<Page['fill']>[2]) {
    const selectorInfo = await this.getElementDescription(selector);
    
    log.info(`✏️ 正在填充元素: ${selectorInfo}, 值: ${value}`);
    const startTime = Date.now();
    
    try {
      if (typeof selector === 'string') {
        await this.page.fill(selector, value, options as any);
      } else {
        await selector.fill(value);
      }
      const fillTime = Date.now() - startTime;
      log.elementSuccess(`✅ 填充元素成功: ${selectorInfo}`);
      log.performance('表单填充', fillTime);
    } catch (error) {
      log.error(`❌ 填充元素失败: ${selectorInfo}`, error);
      throw error;
    }
  }

  /**
   * 增强版的screenshot方法，添加日志和自动命名
   * @param options 截图选项
   */
  async screenshot(options?: Parameters<Page['screenshot']>[0] & { name?: string }) {
    const name = options?.name || `screenshot-${Date.now()}`;
    log.info(`📸 正在截取页面截图: ${name}`);
    
    try {
      const path = options?.path || `./screenshots/${name}.png`;
      const finalOptions = { ...options, path };
      await this.page.screenshot(finalOptions);
      log.elementSuccess(`✅ 截图成功: ${path}`);
      return path;
    } catch (error) {
      log.error(`❌ 截图失败`, error);
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
    log.info(`⏳ 等待元素出现: ${selector}, 超时: ${timeout}ms`);
    const startTime = Date.now();
    
    try {
      const element = await this.page.waitForSelector(selector, options);
      const waitTime = Date.now() - startTime;
      log.elementSuccess(`✅ 元素已出现: ${selector}, 等待时间: ${waitTime}ms`);
      log.performance('等待元素', waitTime);
      return element;
    } catch (error) {
      const waitTime = Date.now() - startTime;
      log.error(`❌ 等待元素超时: ${selector}, 已等待: ${waitTime}ms`, error);
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
    log.info(`⏳ 等待页面加载状态: ${stateType}, 超时: ${timeout}ms`);
    const startTime = Date.now();
    
    try {
      await this.page.waitForLoadState(stateType, options);
      const waitTime = Date.now() - startTime;
      log.elementSuccess(`✅ 页面加载完成: ${stateType}, 等待时间: ${waitTime}ms`);
      log.performance('页面状态等待', waitTime);
    } catch (error) {
      const waitTime = Date.now() - startTime;
      log.error(`❌ 页面加载超时: ${stateType}, 已等待: ${waitTime}ms`, error);
      throw error;
    }
  }

  /**
   * 获取元素文本内容
   * @param selector 元素选择器或Locator对象
   */
  async getText(selector: string | Locator): Promise<string> {
    const selectorInfo = await this.getElementDescription(selector);
    log.debug(`📖 正在获取元素文本: ${selectorInfo}`);
    
    try {
      let text: string;
      if (typeof selector === 'string') {
        text = await this.page.locator(selector).innerText();
      } else {
        text = await selector.innerText();
      }
      log.debug(`✅ 获取元素文本成功: ${selectorInfo}, 文本: ${text}`);
      return text;
    } catch (error) {
      log.error(`❌ 获取元素文本失败: ${selectorInfo}`, error);
      throw error;
    }
  }

  /**
   * 执行JavaScript代码并返回结果
   * @param pageFunction 要执行的JavaScript函数
   * @param arg 传递给函数的参数
   */
  async evaluate<R>(pageFunction: Function | string, arg?: any): Promise<R> {
    log.debug(`🔄 正在执行JavaScript`);
    const startTime = Date.now();
    
    try {
      const result = await this.page.evaluate(pageFunction as any, arg);
      const evalTime = Date.now() - startTime;
      log.debug(`✅ JavaScript执行成功`);
      log.performance('JS执行', evalTime);
      return result as R;
    } catch (error) {
      log.error(`❌ JavaScript执行失败`, error);
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