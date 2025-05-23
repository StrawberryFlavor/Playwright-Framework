# Playwright 测试框架 

这是一个基于Playwright的高级自动化测试框架，旨在提供增强的测试能力、日志记录和错误处理。框架采用Page Object模式，使测试代码更加模块化、可维护和可扩展。

## 核心优势

- **智能元素识别**：自动识别并描述元素，使日志更加直观易读
- **高级日志系统**：提供多级别日志，支持控制台彩色输出和文件记录
- **错误自动截图**：在测试失败时自动截取页面状态，快速定位问题
- **灵活配置**：通过配置文件控制测试行为，支持多种预设环境
- **性能监控**：自动记录操作耗时，帮助发现性能瓶颈

## 项目结构

```
/playwright-framework
├── src/                   # 源代码目录
│   ├── framework/         # 框架核心功能
│   │   ├── utils/         # 工具类
│   │   │   ├── logger.ts  # 日志系统
│   │   │   ├── page-utils.ts # 页面操作封装
│   │   │   ├── log-config.ts # 日志配置
│   │   │   └── cli-args.ts # 命令行参数处理
│   ├── pages/             # 页面对象
│   │   └── playwright-home.ts # Playwright官网页面对象
│   └── data/              # 测试数据
│       └── test-data.ts   # 测试数据常量
├── tests/                 # 测试用例
│   └── test_playwright/   # Playwright相关测试
│       └── example.spec.ts # 示例测试用例
├── config/                # 配置文件
│   └── test.config.ts     # 测试全局配置
├── logs/                  # 日志输出
├── screenshots/           # 错误截图和手动截图
├── playwright-report/     # 测试报告
└── test-results/          # 测试结果
```

## 安装

```bash
# 安装依赖
npm install

# 安装浏览器
npx playwright install
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

## 日志级别

框架提供了多种预设的日志级别配置：

```bash
# 安静模式 - 只显示警告和错误
npm run test:quiet

# 详细模式 - 显示所有调试信息
npm run test:verbose

# 开发模式 - 详细控制台输出但不保存文件
npm run test:dev

# 生产模式 - 只保存到文件不显示在控制台
npm run test:prod
```

## 框架特性

### 1. 智能元素识别

框架能够自动分析元素特性，生成易读的元素描述，使日志和错误信息更加直观：

```
[INFO] 🔍 正在获取元素: link[name="Get started"]
[INFO] 👆 正在点击元素: "Get started"
```

### 2. 高级日志系统

- **多级别日志**：支持DEBUG、INFO、WARN、ERROR和NONE五个级别
- **日志预设**：提供quiet、verbose、development和production四种预设配置
- **控制台彩色输出**：不同级别使用不同颜色，提高可读性
- **自动文件记录**：支持同时记录到文件系统，便于回溯

### 3. 错误自动截图

当测试过程中出现错误时，框架会自动截取当前页面状态：

- 截图命名格式：`error_[操作]_[时间戳].png`
- 自动保存在screenshots目录
- 在日志中记录截图路径
- 可通过配置文件控制是否启用

### 4. 配置系统

通过config/test.config.ts控制框架行为：

```typescript
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
```

### 5. 页面对象模式

使用 Page Object Model 设计模式，将页面元素和操作封装到类中：

```typescript
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
}
```

## 开发指南

### 创建新的页面对象

1. 在src/pages目录下创建新的页面对象类
2. 继承PageUtils提供的方法进行操作
3. 使用src/data中的测试数据

### 编写测试用例

```typescript
test('get started link', async ({ page }) => {
  const playwrightHome = new PlaywrightHome(page);
  await playwrightHome.getStartedLink();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

### 自定义日志级别

可以在测试用例中动态调整日志级别：

```typescript
import { configureLogger } from '../src/framework/utils/log-config';
import { LogLevel } from '../src/framework/utils/logger';

// 设置自定义日志配置
configureLogger({
  level: LogLevel.DEBUG,
  performance: true,
  elementSuccess: true
});
``` 
