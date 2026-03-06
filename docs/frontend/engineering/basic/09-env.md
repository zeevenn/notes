---
title: Node.js 项目 dotenv 集成方案对比
date: 2026-03-06
category: engineering
---

## 背景问题

在 Node.js 项目中使用 `dotenv` 加载环境变量时，存在一个关键的**加载时机问题**：

```typescript
// src/index.ts
import { getConfig } from '@conan/backend/utils' // node-config 在此时读取 NODE_CONFIG_DIR
import 'dotenv/config' // 太晚了！环境变量还没设置
```

### 问题原因

1. **ES Modules 的 import 提升**：所有 `import` 语句会被提升到模块顶部执行
2. **node-config 的初始化时机**：`node-config` 在模块加载时就读取环境变量，不是在调用 `getConfig()` 时
3. **依赖导入顺序**：必须确保 `dotenv/config` 在任何读取环境变量的模块之前导入

### 错误示例

```typescript
// 错误：依赖导入顺序，且需要 eslint-disable
/* eslint-disable perfectionist/sort-imports */
import 'dotenv/config' // 必须第一个
import { getConfig } from '@conan/backend/utils'
```

这种方式的问题：

- 代码依赖导入顺序，脆弱易出错
- 需要 eslint-disable 注释
- 其他开发者可能不理解为什么顺序重要

---

## 方案对比

### 方案 1：NODE_OPTIONS="--require dotenv/config"

```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--require dotenv/config --import @conan/backend/utils/tracer' tsx watch src/index.ts"
  }
}
```

**执行顺序**：

1. `--require dotenv/config` (CJS) → 加载 .env
2. `--import tracer` (ESM) → 读取 OTEL_SERVICE_NAME
3. 应用代码 → 读取 NODE_CONFIG_DIR

**优点**：

- 不需要额外安装依赖（dotenv 已安装）
- 环境变量在 Node.js 启动时就加载

**缺点**：

- NODE_OPTIONS 变得很长
- `--require` 和 `--import` 混用，理解成本高
- 不够直观

---

### 方案 2：dotenv-cli（推荐）

```json
{
  "scripts": {
    "dev": "dotenv -e .env -- tsx watch --import @conan/backend/utils/tracer src/index.ts"
  }
}
```

**执行顺序**：

1. `dotenv -e .env` → 加载 .env 到环境变量
2. `--` 后的命令在已设置好环境变量的上下文中执行

**优点**：

- 命令更简洁直观
- 不污染 NODE_OPTIONS
- 支持指定多个 env 文件：`dotenv -e .env -e .env.local -- command`
- 与其他工具（如 tracer）解耦

**缺点**：

- 需要额外安装 `dotenv-cli`
- 默认不覆盖已存在的环境变量（可用 `-o` 强制覆盖）

---

### 方案 3：直接在 scripts 中设置环境变量（当前采用）

```json
{
  "scripts": {
    "dev": "NODE_CONFIG_DIR=../conan-consultant-oral-backend/config OTEL_SERVICE_NAME=xxx NODE_OPTIONS='--import @conan/backend/utils/tracer' tsx watch src/index.ts"
  }
}
```

**优点**：

- 最简单直接，无需任何额外工具
- 所有配置一目了然
- 无加载顺序问题

**缺点**：

- scripts 命令较长
- 敏感信息会暴露在 package.json 中（本项目不涉及）
- 修改配置需要改 package.json

---

## 最终方案：dotenv-cli

### 安装

```bash
pnpm add -D -w dotenv-cli
```

### 基本用法

```bash
# 加载 .env 文件
dotenv -- <command>

# 指定 .env 文件路径
dotenv -e .env -- <command>

# 加载多个文件（后面的覆盖前面的）
dotenv -e .env -e .env.local -- <command>

# 强制覆盖已存在的环境变量
dotenv -e .env -o -- <command>
```

### `--` 的作用

`--` 是命令行约定，表示"选项结束"：

- `--` 之前：dotenv-cli 的选项
- `--` 之后：要执行的命令

```bash
dotenv -e .env -- npm start
#      ^^^^^^^^    ^^^^^^^^^
#      dotenv选项   要执行的命令
```

### 覆盖行为

默认情况下，dotenv-cli **不会覆盖**已存在的环境变量：

| 场景     | 行为                                 |
| -------- | ------------------------------------ |
| 开发环境 | 系统没有这些变量 → .env 生效         |
| 生产环境 | K8s 注入的环境变量优先 → .env 不覆盖 |

如果需要强制覆盖（如禁用代理）：

```bash
dotenv -e .env -o -- <command>
# 或直接在命令中设置
dotenv -e .env -- env http_proxy= <command>
```
