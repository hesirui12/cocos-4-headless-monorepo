# 🎮 cocos-4-headless-monorepo

[![Node.js](https://img.shields.io/badge/Node.js-22.17.0-green.svg)](https://nodejs.org/)
[![Cocos Engine](https://img.shields.io/badge/Cocos-Engine-orange.svg)](https://github.com/cocos/cocos4)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 🚀 Headless monorepo：Cocos Engine (cocos4) + CLI 工具一体化仓库
> 引擎源码直接纳入版本库（vendored），无需运行时克隆；仅原生 SDK (external) 由脚本按需拉取

## 📦 仓库结构

```
├── packages/
│   ├── engine/                 # Cocos4 引擎源码（vendored，纳入 git 管理）
│   │   └── native/external/    # 第三方预编译原生 SDK（3GB+，不入 git，脚本拉取）
│   ├── cc-module/
│   ├── cocos-cli-types/
│   └── engine-compiler/
├── workflow/                   # 初始化/构建脚本
│   ├── update-repo.js          # 拉取 external（支持部分克隆，版本匹配时跳过 fetch）
│   ├── fix-engine-patches.js   # 引擎补丁（@types/three 冲突等，幂等）
│   └── init.js                 # 一键初始化：拉 external → 装 engine 依赖 → 打补丁
├── src/                        # CLI 源码
└── repo.json                   # 外部仓库配置（仅 external）
```

## ✨ Features

- 🏗️ **Project Management**: Create, import, and build Cocos projects
- 📦 **Resource Management**: Import/export resources, batch processing
- ⚡ **Build System**: Multi-platform build support
- 🎨 **Interactive Interface**: Wizard-guided operations

## 📋 Prerequisites

- Node.js 22.17.0（推荐用 fnm 管理：`fnm install 22.17.0 && fnm default 22.17.0`，仓库内已含 `.nvmrc` / `.node-version`）
- Git
- Visual Studio with C++ build tools (for Windows)
- Xcode (for macOS)

For native development, please refer to the [Native Development Setup Guide](https://docs.cocos.com/creator/3.8/manual/en/editor/publish/setup-native-development.html) for detailed setup instructions.

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cocos-4-headless-monorepo
   fnm use  # 切换 Node 22.17.0（或 nvm use）
   ```

2. **Install dependencies**

   ```bash
   npm install -g node-gyp
   npm run init
   npm install
   ```

3. **Build and link globally**

   ```bash
   npm run build
   npm link
   ```

## 🩹 已固化的坑（无需手动处理）

1. **external 克隆卡死**：`cocos-engine-external` 仓库含 3GB+ 预编译二进制。`workflow/update-repo.js` 已改为：
   - 克隆使用部分克隆 `--filter=blob:none`（只拉文件树，blob 按需下载）
   - 本地 HEAD 已匹配目标 tag 时跳过 fetch（`git fetch origin tag <tag>` 只拉单个 tag）
2. **@types/three 语法错误 (TS1005)**：全局 npm 目录若存在新版 `@types/three`，其 TS5 新语法会被 TS4.9 的 `native-pack-tool` 自动拾取导致构建失败。`workflow/fix-engine-patches.js`（随 `npm run init` 自动执行，幂等）会在 `native-pack-tool/tsconfig.json` 写入 `"types": ["node", "xml2js"]` 白名单，阻止向上搜索。
3. **Node 版本**：`.nvmrc` / `.node-version` 锁定 22.17.0，fnm 自动识别。

## 🚀 Quick Start

See [Quick Start Guide](docs/en/quick-start.md) for detailed usage steps.

## 📚 Commands

```bash
# Create project
cocos create --project ./my-project

# Build project
cocos build --project ./my-project --platform web-mobile

# Import project
cocos import --project ./my-project

# Show project information
cocos info --project ./my-project

# Start MCP server
cocos start-mcp-server --project ./my-project --port 9527

# Interactive wizard
cocos wizard

# Display help
cocos --help
```

For detailed command documentation, see [Commands Documentation](docs/en/commands.md).

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests (core)
npm test

# Run only core tests
npm run test:core

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in debug mode (preserves test projects)
npm run test:e2e:debug

# Check E2E test coverage
npm run check:e2e-coverage

# Generate E2E coverage HTML report
npm run check:e2e-coverage:report
```

### Run All Tests

```bash
# Run all tests (unit + E2E)
npm run test:all
```

For more testing details, see:

- [Unit Tests Documentation](tests/README.md)
- [E2E Tests Documentation](e2e/README.md)

## 📖 Documentation

- [Quick Start Guide](docs/en/quick-start.md)
- [Tool Download Guide](docs/en/download-tools.md)
- [Commands Documentation](docs/en/commands.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) to get started.

The guide covers:

- Development workflow and building the project
- Running and writing tests
- Code style and formatting
- Debugging techniques
- Submitting pull requests

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
