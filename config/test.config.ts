import { LogLevel } from '../src/framework/utils/logger';

/**
 * 测试配置
 */
export const testConfig = {
  // 超时设置
  timeouts: {
    element: 30000,    // 元素等待超时时间（毫秒）
    page: 60000,       // 页面加载超时时间（毫秒）
    test: 120000       // 测试用例超时时间（毫秒）
  },
  
  // 重试设置
  retry: {
    count: 2,          // 失败重试次数
    testRetryDelay: 1000  // 重试延迟时间（毫秒）
  },
  
  // 截图设置
  screenshot: {
    enabled: true,      // 是否启用截图功能
    onFailure: true,    // 失败时自动截图
    directory: './screenshots'  // 截图保存目录
  },
  
  // 日志配置
  logger: {
    level: LogLevel.INFO,
    console: true,
    file: true,
    performance: false,
    elementSuccess: false
  }
}; 