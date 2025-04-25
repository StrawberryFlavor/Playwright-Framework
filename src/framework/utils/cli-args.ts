import { LogLevel, LogConfig } from './logger';
import { logPresets } from './log-config';

/**
 * 解析命令行参数
 * @returns 解析后的参数对象
 */
export function parseCliArgs(): any {
  const args: any = {};
  const processArgs = process.argv.slice(2);
  
  processArgs.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      args[key] = value === undefined ? true : value;
    }
  });
  
  return args;
}

/**
 * 根据环境变量获取日志配置
 * @returns 日志配置
 */
export function getLogConfigFromEnv(): Partial<LogConfig> {
  // 如果指定了预设，使用预设配置
  const logPreset = process.env.LOG_PRESET;
  if (logPreset && logPresets[logPreset]) {
    return logPresets[logPreset];
  }
  
  // 否则根据各个环境变量创建配置
  const config: Partial<LogConfig> = {};
  
  // 日志级别
  if (process.env.LOG_LEVEL) {
    const level = process.env.LOG_LEVEL.toUpperCase();
    if (Object.values(LogLevel).includes(level as LogLevel)) {
      config.level = level as LogLevel;
    }
  }
  
  // 控制台输出
  if (process.env.LOG_CONSOLE !== undefined) {
    config.console = process.env.LOG_CONSOLE === 'true';
  }
  
  // 文件输出
  if (process.env.LOG_FILE !== undefined) {
    config.file = process.env.LOG_FILE === 'true';
  }
  
  // 性能日志
  if (process.env.LOG_PERFORMANCE !== undefined) {
    config.performance = process.env.LOG_PERFORMANCE === 'true';
  }
  
  // 元素操作成功日志
  if (process.env.LOG_ELEMENT_SUCCESS !== undefined) {
    config.elementSuccess = process.env.LOG_ELEMENT_SUCCESS === 'true';
  }
  
  return config;
} 