# Playwright 测试框架

这是一个基于Playwright的自动化测试框架。

## 项目结构

```
/playwright-framework
├── src/                   # 源代码目录
│   ├── framework/         # 框架核心功能
│   │   ├── utils/         # 工具类
│   │   │   ├── logger.ts  # 日志工具
│   │   │   └── page-utils.ts # 页面操作工具
│   ├── pages/             # 页面对象
│   │   └── playwright-home.ts # Playwright官网页面对象
│   └── data/              # 测试数据
├── tests/                 # 测试用例
│   └── test_playwright/   # Playwright相关测试
│       └── example.spec.ts # 示例测试用例
├── config/                # 配置文件
├── logs/                  # 日志输出
├── playwright-report/     # 测试报告
└── test-results/          # 测试结果
```

## 安装

```bash
npm install
```

## 运行测试

```bash
# 运行所有测试
npm test

# 运行Chrome浏览器测试
npm run test-chrome

# 运行Firefox浏览器测试
npm run test-firefox

# 运行Safari浏览器测试
npm run test-webkit

# 使用UI模式运行测试
npm run test-ui

# 查看测试报告
npm run report
```

## 框架特性

1. **页面对象模式**：使用Page Object Model设计模式，提高代码重用性和可维护性
2. **工具类封装**：对Playwright API进行二次封装，增强日志和错误处理
3. **日志系统**：详细的日志记录，包括性能监控、调试信息等
4. **多浏览器支持**：支持Chrome、Firefox和Safari等主流浏览器
5. **环境配置**：使用dotenv管理环境变量
6. **测试报告**：生成详细的HTML测试报告

## 开发指南

1. 在src/pages下创建新的页面对象
2. 在tests目录下创建对应的测试用例
3. 使用src/framework/utils中的工具类来简化测试代码
4. 运行测试并查看报告 