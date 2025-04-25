import { log, LogLevel, LogConfig } from './logger';

/**
 * 配置日志系统
 * @param config 日志配置
 */
export function configureLogger(config?: Partial<LogConfig>): void {
  // 默认配置
  const defaultConfig: Partial<LogConfig> = {
    level: LogLevel.INFO,        // 默认只显示INFO及以上级别
    console: true,               // 在控制台输出日志
    file: true,                  // 保存日志到文件
    performance: false,          // 不显示性能日志
    elementSuccess: false        // 不显示元素操作成功的日志
  };

  // 应用配置
  log.setConfig({ ...defaultConfig, ...config });
}

/**
 * 预设的日志配置
 */
export const logPresets = {
  // 详细模式 - 输出所有日志
  verbose: {
    level: LogLevel.DEBUG,
    console: true,
    file: true,
    performance: true,
    elementSuccess: true
  },
  
  // 安静模式 - 只输出警告和错误
  quiet: {
    level: LogLevel.WARN,
    console: true,
    file: true,
    performance: false,
    elementSuccess: false
  },
  
  // 生产模式 - 只输出到文件，不在控制台显示
  production: {
    level: LogLevel.INFO,
    console: false,
    file: true,
    performance: true,
    elementSuccess: false
  },
  
  // 开发模式 - 详细的控制台输出，不保存到文件
  development: {
    level: LogLevel.DEBUG,
    console: true,
    file: false,
    performance: true,
    elementSuccess: true
  }
} as const; 