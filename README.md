# Playwright 测试自动化框架

这是一个基于 Playwright 的测试自动化框架，提供了以下功能：

- **页面对象模式（POM）**：使用结构化的方式管理和操作页面元素
- **日志系统**：支持东八区时间的详细日志记录
- **工具类封装**：对 Playwright 的基础方法进行了二次封装，增加了日志和错误处理
- **可配置的测试环境**：通过环境变量支持多环境测试

## 项目结构

```
Playwright-Framework/
├── framework/           # 框架核心
│   └── utils/           # 工具类
│       ├── logger.ts    # 日志工具
│       └── page-utils.ts # 页面操作工具
├── src/                 # 源代码
│   └── pages/           # 页面对象
│       └── playwright-home.ts # Playwright首页对象
├── tests/               # 测试用例
│   └── test_playwright/ # Playwright测试
│       └── example.spec.ts # 测试示例
├── playwright.config.ts # Playwright配置
└── package.json         # 项目依赖
```

## 安装

```bash
# 安装依赖
npm install

# 安装 Playwright 浏览器
npx playwright install
```

## 运行测试

```bash
# 运行所有测试
npm test

# 运行指定测试
npx playwright test tests/test_playwright/example.spec.ts

# 使用 UI 模式运行
npm run test-ui
```

## 查看报告

```bash
npm run report
```

## 主要特性

### 1. 日志系统

- 支持多级别日志（DEBUG, INFO, WARN, ERROR）
- 自动记录到文件，使用东八区时间戳
- 控制台彩色输出

### 2. 页面对象模式

- 封装页面元素和操作
- 提供链式调用API
- 隔离测试逻辑和页面实现细节

### 3. 工具类封装

- 增强错误处理和日志记录
- 自动记录操作时间和性能数据
- 提供一致的API

## 贡献

欢迎提交问题和拉取请求。 