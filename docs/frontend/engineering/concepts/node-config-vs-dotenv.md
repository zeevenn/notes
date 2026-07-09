---
title: node-config 与 dotenv 的区别和配合使用
date: 2026-03-09
category: engineering
---

## 核心区别

### dotenv 的作用

**加载 `.env` 文件到 `process.env`**

```bash
# .env
DATABASE_URL=postgres://localhost:5432/mydb
API_KEY=secret123
NODE_ENV=development
```

```javascript
import 'dotenv/config'
console.log(process.env.DATABASE_URL) // postgres://localhost:5432/mydb
console.log(process.env.API_KEY) // secret123
```

### node-config 的作用

**管理多环境配置文件，支持分层、合并、类型安全**

```
config/
├── default.json           # 基础配置
├── development.json       # 开发环境覆盖
├── production.json        # 生产环境覆盖
└── custom-environment-variables.json  # 环境变量映射
```

```javascript
import config from 'config'
console.log(config.get('Customer.dbConfig.host')) // 从配置文件读取
```

---

## 为什么需要 dotenv？

node-config **在模块加载时**就会读取环境变量（如 `NODE_ENV`、`NODE_CONFIG_DIR`），而不是在你调用 `config.get()` 时。

### 问题场景

```typescript
// ❌ 错误：node-config 已经初始化了，读不到 .env 的配置
import config from 'config' // 此时读取 NODE_CONFIG_DIR 等环境变量
import 'dotenv/config' // 太晚了！
```

### 解决方案

使用 dotenv 或 `--env-file` **在 Node.js 启动时**就加载环境变量：

```json
{
  "scripts": {
    "dev": "node --env-file=.env src/index.js"
  }
}
```

---

## node-config 的环境变量机制

### 1. 控制 node-config 行为的环境变量

这些变量影响 node-config 本身的行为：

| 变量                | 作用                           | 示例                                             |
| ------------------- | ------------------------------ | ------------------------------------------------ |
| `NODE_ENV`          | 决定加载哪个环境的配置文件     | `NODE_ENV=production` → 加载 `production.json`   |
| `NODE_CONFIG_DIR`   | 指定配置文件目录               | `NODE_CONFIG_DIR=./config`                       |
| `NODE_CONFIG`       | 用 JSON 字符串直接覆盖配置     | `NODE_CONFIG='{"port":8080}'`                    |
| `HOSTNAME`          | 主机名（影响配置文件加载）     | `HOSTNAME=server1` → 加载 `server1.json`         |
| `NODE_APP_INSTANCE` | 多实例部署（影响配置文件加载） | `NODE_APP_INSTANCE=1` → 加载 `production-1.json` |

**这些变量必须在 node-config 加载前就存在于 `process.env` 中！**

### 2. Custom Environment Variables（自定义环境变量映射）

node-config 可以将环境变量映射到配置结构中。

#### 配置文件

```javascript
// config/custom-environment-variables.json
{
  "Customer": {
    "dbConfig": {
      "host": "DATABASE_HOST",      // 映射到 process.env.DATABASE_HOST
      "port": "DATABASE_PORT"
    },
    "apiKey": "API_KEY"
  }
}
```

#### 使用

```bash
# .env
DATABASE_HOST=prod.db.example.com
DATABASE_PORT=5432
API_KEY=secret123
```

```javascript
import config from 'config'
console.log(config.get('Customer.dbConfig.host')) // prod.db.example.com
console.log(config.get('Customer.apiKey')) // secret123
```

#### 优先级

```
命令行参数 > Custom Environment Variables > local.json > {deployment}.json > default.json
```

**重要**：Custom Environment Variables 会覆盖所有配置文件（包括 `local.json`），只有命令行参数优先级更高。

---

## 典型使用场景

### 场景 1：本地开发（使用 .env + node-config）

```bash
# .env
NODE_CONFIG_DIR=./config
NODE_ENV=development
DATABASE_HOST=localhost
```

```json
// config/custom-environment-variables.json
{
  "db": {
    "host": "DATABASE_HOST"
  }
}
```

```json
// config/development.json
{
  "db": {
    "port": 5432
  }
}
```

**结果**：

- `config.get('db.host')` → `localhost`（来自 `.env` 的 `DATABASE_HOST`）
- `config.get('db.port')` → `5432`（来自 `development.json`）

---

### 场景 2：生产环境（K8s 注入环境变量）

K8s Pod 定义：

```yaml
env:
  - name: NODE_ENV
    value: production
  - name: DATABASE_HOST
    valueFrom:
      secretKeyRef:
        name: db-secret
        key: host
```

**不需要 `.env` 文件**，node-config 直接读取 K8s 注入的环境变量。

---

### 场景 3：只用环境变量（不用配置文件）

```bash
# .env
NODE_CONFIG='{"db":{"host":"localhost","port":5432},"apiKey":"secret"}'
```

```javascript
import config from 'config'
console.log(config.get('db.host')) // localhost
console.log(config.get('apiKey')) // secret
```

**缺点**：

- JSON 字符串难以维护
- 无类型检查
- 不能享受 node-config 的分层合并优势

---

## 最佳实践

### 1. 使用 `--env-file` 加载 .env（Node.js 20.6.0+）

```json
{
  "scripts": {
    "dev": "node --env-file=.env src/index.js"
  }
}
```

**为什么**：

- 确保环境变量在 node-config 加载前就存在
- 无需额外依赖

### 2. 配置结构

```
.env                        # 本地开发环境变量（不提交）
config/
├── default.json            # 通用配置
├── development.json        # 开发环境覆盖
├── production.json         # 生产环境覆盖
└── custom-environment-variables.json  # 敏感信息映射
```

**分工**：

- `.env`：控制 node-config 行为（`NODE_ENV`、`NODE_CONFIG_DIR`）+ 敏感信息（`DATABASE_HOST`、`API_KEY`）
- `config/*.json`：非敏感的业务配置（超时时间、功能开关等）
- `custom-environment-variables.json`：将 `.env` 中的敏感信息映射到配置结构

### 3. 不要把敏感信息写在配置文件里

```javascript
// ❌ 不要这样做
// config/production.json
{
  "db": {
    "password": "prod-secret-123"  // 不要！
  }
}

// ✅ 正确做法
// config/custom-environment-variables.json
{
  "db": {
    "password": "DATABASE_PASSWORD"  // 映射到环境变量
  }
}

// .env（不提交到 git）
DATABASE_PASSWORD=prod-secret-123
```

---

## 常见误区

### 误区 1：认为 node-config 不需要 dotenv

**错误**：node-config 有环境变量支持，所以不需要 dotenv。

**正确**：node-config 的环境变量支持是**映射现有环境变量**，不负责**加载 .env 文件**。

### 误区 2：在代码中 import 'dotenv/config'

**错误**：

```typescript
import config from 'config' // 已经读取环境变量了
import 'dotenv/config' // 太晚了！
```

**正确**：

```bash
node --env-file=.env src/index.js
```

### 误区 3：把所有配置都放在 NODE_CONFIG 环境变量里

**错误**：

```bash
NODE_CONFIG='{"db":{"host":"localhost","port":5432,"user":"admin","password":"secret"}}'
```

**正确**：

```javascript
// config/custom-environment-variables.json
{
  "db": {
    "host": "DATABASE_HOST",
    "port": "DATABASE_PORT",
    "user": "DATABASE_USER",
    "password": "DATABASE_PASSWORD"
  }
}
```

```bash
# .env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=admin
DATABASE_PASSWORD=secret
```

---

## 总结

| 工具                     | 职责                             | 何时使用                             |
| ------------------------ | -------------------------------- | ------------------------------------ |
| **dotenv**               | 加载 `.env` 文件到 `process.env` | 本地开发，确保环境变量在启动时加载   |
| **--env-file**           | Node.js 原生加载 `.env`          | Node.js 20.6.0+，替代 dotenv         |
| **node-config**          | 管理多环境配置文件，支持分层合并 | 复杂配置管理，多环境部署             |
| **Custom Env Variables** | 将环境变量映射到配置结构         | 敏感信息（密码、密钥）从环境变量注入 |

**配合使用**：

1. 用 `--env-file` 或 `dotenv` 加载 `.env` 文件
2. 用 node-config 管理配置文件结构
3. 用 `custom-environment-variables.json` 映射敏感信息
