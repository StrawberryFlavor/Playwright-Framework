import fs from 'fs';
import path from 'path';

// 日志级别枚举
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  NONE = 'NONE'
}

// 日志颜色映射
const LogColors = {
  [LogLevel.DEBUG]: '\x1b[36m', // 青色
  [LogLevel.INFO]: '\x1b[32m',  // 绿色
  [LogLevel.WARN]: '\x1b[33m',  // 黄色
  [LogLevel.ERROR]: '\x1b[31m', // 红色
  RESET: '\x1b[0m'              // 重置颜色
};

// 日志配置
export interface LogConfig {
  // 日志级别
  level: LogLevel;
  // 是否输出到控制台
  console: boolean;
  // 是否输出到文件
  file: boolean;
  // 是否记录性能日志
  performance: boolean;
  // 是否打印元素操作的成功信息
  elementSuccess: boolean;
}

// 默认日志配置
export const defaultLogConfig: LogConfig = {
  level: LogLevel.INFO,
  console: true,
  file: true,
  performance: true,
  elementSuccess: false
};

export class Logger {
  private logDir: string;
  private logFile: string;
  private testName: string;
  private config: LogConfig;

  constructor(testName: string = 'playwright', config: Partial<LogConfig> = {}) {
    this.testName = testName;
    this.config = { ...defaultLogConfig, ...config };
    this.logDir = path.resolve(process.cwd(), 'logs');
    
    // 确保日志目录存在
    if (!fs.existsSync(this.logDir) && this.config.file) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    
    // 使用东八区时间创建日志文件名
    const date = new Date();
    // 调整为东八区，UTC+8
    date.setHours(date.getHours() + 8);
    const timestamp = date.toISOString().replace(/:/g, '-').split('.')[0];
    this.logFile = path.join(this.logDir, `${this.testName}_${timestamp}.log`);
  }

  /**
   * 获取东八区(UTC+8)的当前时间字符串
   */
  private getTimeString(): string {
    const date = new Date();
    // 调整为东八区，UTC+8
    date.setHours(date.getHours() + 8);
    return date.toISOString().replace('T', ' ').split('.')[0];
  }

  /**
   * 检查是否应该记录指定级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    if (this.config.level === LogLevel.NONE) return false;
    
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const configLevelIndex = levels.indexOf(this.config.level);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex >= configLevelIndex;
  }

  /**
   * 写入日志
   * @param level 日志级别
   * @param message 日志消息
   * @param data 额外数据
   */
  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;
    
    const timestamp = this.getTimeString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    
    // 添加额外数据
    const fullLogEntry = data 
      ? `${logEntry}\n${JSON.stringify(data, null, 2)}`
      : logEntry;
    
    // 控制台输出彩色日志
    if (this.config.console) {
    console.log(`${LogColors[level]}${logEntry}${LogColors.RESET}`);
    if (data) {
      console.log(data);
      }
    }
    
    // 写入日志文件
    if (this.config.file) {
    fs.appendFileSync(this.logFile, fullLogEntry + '\n');
    }
  }

  /**
   * 设置日志配置
   */
  setConfig(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 调试级别日志
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * 信息级别日志
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * 警告级别日志
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * 错误级别日志
   */
  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * 记录测试步骤
   */
  step(message: string): void {
    this.info(`Step: ${message}`);
  }

  /**
   * 记录性能信息
   */
  performance(action: string, timeMs: number): void {
    if (this.config.performance) {
    this.info(`Performance [${action}]: ${timeMs}ms`);
    }
  }

  /**
   * 记录成功的元素操作
   */
  elementSuccess(message: string): void {
    if (this.config.elementSuccess) {
      this.info(message);
    }
  }

  /**
   * 记录API调用
   */
  api(method: string, url: string, status?: number, responseTime?: number): void {
    const statusInfo = status ? ` Status: ${status}` : '';
    const timeInfo = responseTime ? ` Time: ${responseTime}ms` : '';
    this.info(`API ${method} ${url}${statusInfo}${timeInfo}`);
  }
}

// 创建默认logger实例
export const logger = new Logger();

// 简化的日志函数
export const log = {
  debug: (message: string, data?: any) => logger.debug(message, data),
  info: (message: string, data?: any) => logger.info(message, data),
  warn: (message: string, data?: any) => logger.warn(message, data),
  error: (message: string, data?: any) => logger.error(message, data),
  step: (message: string) => logger.step(message),
  performance: (action: string, timeMs: number) => logger.performance(action, timeMs),
  elementSuccess: (message: string) => logger.elementSuccess(message),
  api: (method: string, url: string, status?: number, responseTime?: number) => 
    logger.api(method, url, status, responseTime),
  setConfig: (config: Partial<LogConfig>) => logger.setConfig(config)
}; 