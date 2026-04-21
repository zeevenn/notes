---
title: TypeScript 配置文件
date: 2026-03-03
category:
  - 工程化
tag:
  - frontend
  - typescript
  - tsconfig
---

## 基础结构

```json
{
  "compilerOptions": {
    // 编译选项
  },
  "include": [],
  "exclude": [],
  "extends": "",
  "files": [],
  "references": []
}
```

## 常用编译选项

### 基础配置

- `target`: 编译目标版本（ES5/ES6/ES2020等）
- `module`: 模块系统（CommonJS/ESNext/UMD等）
- `lib`: 需要包含的库文件（ES2020/DOM等）
- `outDir`: 输出目录
- `rootDir`: 源码根目录

### 严格检查

- `strict`: 启用所有严格类型检查选项
- `noImplicitAny`: 不允许隐式 any 类型
- `strictNullChecks`: 严格的 null 检查
- `strictFunctionTypes`: 严格的函数类型检查

### 模块解析

- `moduleResolution`: 模块解析策略（node/classic）
- `baseUrl`: 基础路径
- `paths`: 路径映射
- `esModuleInterop`: 允许 ESM 和 CommonJS 互操作

### 其他常用选项

- `skipLibCheck`: 跳过声明文件的类型检查
- `forceConsistentCasingInFileNames`: 强制文件名大小写一致
- `resolveJsonModule`: 允许导入 JSON 文件
- `jsx`: JSX 支持（react/preserve/react-native）

## 示例配置

### Node.js 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### React 项目

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## 配置继承

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

## Project References（特殊场景）

> ⚠️ **注意：** 现代 Monorepo 项目**大多数情况不需要**使用 Project References。上面的 `paths` 方案已经足够。

`references` 是 TypeScript 提供的项目依赖管理功能，**仅在极少数场景下需要**。

### 什么是 Project References？

将大型项目拆分为多个子项目，由 TypeScript 管理它们之间的依赖关系和构建顺序。

**核心特点：**

- 必须使用 `tsc --build` 构建
- 每个项目必须 `composite: true` + `declaration: true`
- TypeScript 自动管理依赖顺序和增量编译

### 何时需要？（罕见场景）

**同时满足以下条件才考虑使用：**

1. ✅ **必须用 `tsc` 构建**（不用其他构建工具）
2. ✅ **包之间有复杂依赖关系**（pkg-b 依赖 pkg-a）
3. ✅ **超大型项目**（几十个包以上）
4. ✅ **需要强制模块边界**

**但即使满足以上条件，2026 年也有更好的替代方案：**

- 构建工具：用 tsup/esbuild（更快）
- 增量构建：用 Turbo（更智能）
- 模块边界：用 ESLint 规则

### 配置示例

**根目录 `tsconfig.json`：**

```json
{
  "files": [],
  "references": [{ "path": "./packages/shared" }, { "path": "./packages/client" }, { "path": "./packages/server" }]
}
```

**子项目 `packages/shared/tsconfig.json`：**

```json
{
  "compilerOptions": {
    "composite": true, // 必须
    "declaration": true, // 必须
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

**依赖 shared 的项目 `packages/client/tsconfig.json`：**

```json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  },
  "references": [{ "path": "../shared" }],
  "include": ["src/**/*"]
}
```

### 构建命令

```bash
tsc --build  # 或 tsc -b
```

TypeScript 会：

1. 分析依赖关系
2. 按顺序构建（shared → client）
3. 增量编译（只重新编译改动的）
4. 并行构建无依赖的包

### 缺点

- ❌ 配置复杂，学习成本高
- ❌ 必须每个包都配置 tsconfig
- ❌ 必须 `composite: true` + `declaration: true`
- ❌ 只能用 `tsc --build`，不能用现代工具

### paths vs references 对比

| 特性              | paths（推荐） | references       |
| ----------------- | ------------- | ---------------- |
| **用途**          | 模块解析      | 项目依赖管理     |
| **配置复杂度**    | 简单          | 复杂             |
| **构建工具**      | 任意          | 必须 tsc --build |
| **2026 年推荐度** | ⭐⭐⭐⭐⭐    | ⭐（罕见场景）   |

### 总结

**现代 Monorepo 推荐：**

- ✅ 用 `paths` 做类型检查
- ✅ 用 tsdown/vite 做构建
- ✅ 用 Turbo 做增量构建优化
- ❌ 不需要 Project References

## Monorepo 类型检查配置

### 方案一：单个 tsconfig + paths（⭐ 推荐）

这是 **2026 年主流的现代方案**，适用于 95% 的 Monorepo 项目。

**配置示例：**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noEmit": true, // 只做类型检查，不生成文件
    "strict": true,
    "paths": {
      "pkg-a": ["./packages/pkg-a/src/index.ts"],
      "pkg-b": ["./packages/pkg-b/src/index.ts"],
      "@scope/*": ["./packages/*/src/index.ts"]
    }
  },
  "include": ["packages/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**工作原理：**

1. **类型检查：** TypeScript 通过 `paths` 找到包的源码进行类型检查
2. **构建：** 使用现代工具（tsup/vite/rollup）直接读取源码构建
3. **包管理：** 通过 pnpm/npm workspace 管理包依赖

**构建方式：**

```json
// package.json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "pnpm -r --parallel run build",
    "dev": "pnpm -r --parallel run dev"
  }
}

// packages/pkg-a/package.json
{
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm",
    "dev": "tsup src/index.ts --watch"
  }
}
```

**为什么需要 `--parallel`？**

包之间有依赖时，必须并行构建：

```bash
pnpm -r --parallel run build
```

因为现代构建工具（tsup/vite）会：

- 通过 `paths` 直接读取依赖包的**源码**
- 不需要等待依赖包先构建出 `dist/`
- 所以可以同时构建所有包

**优点：**

- ✅ 配置极简，一个文件搞定
- ✅ IDE 类型检查体验好
- ✅ 适配现代工具链
- ✅ 不需要 Project References 的复杂配置

**适用场景：**

- ✅ 使用 Vite/Rollup/tsup/esbuild 等构建工具
- ✅ 前端项目、Node.js 工具库、CLI 工具
- ✅ 中小型 Monorepo（绝大多数情况）

---

### 方案二：每个包独立 tsconfig

**配置示例：**

根目录 `tsconfig.json`（共享配置）：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "strict": true,
    "declaration": true
  }
}
```

子包 `packages/pkg-a/tsconfig.json`：

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**构建方式：**

```bash
# 使用 pnpm workspace
pnpm -r run build

# 或手动
cd packages/pkg-a && tsc
cd packages/pkg-b && tsc
```

**优点：**

- ✅ 每个包可以自定义配置
- ✅ 灵活性高

**适用场景：**

- 每个包的编译选项不同
- 需要细粒度控制

---

### 决策流程

```
选择 Monorepo 配置方案
│
├─ 使用现代构建工具（Vite/tsup/Rollup）？
│  └─ 是 → 方案一（paths + 并行构建）⭐
│  └─ 否 ↓
│
├─ 每个包配置需求差异大？
│  └─ 是 → 方案二（独立 tsconfig）
│  └─ 否 → 方案一
│
└─ 默认推荐：方案一
```

**关键点：**

- ❌ **不需要** Project References（见下一章节）
- ✅ 用 `paths` 做类型检查
- ✅ 用现代构建工具做实际构建
- ✅ 包依赖关系通过 workspace 管理
