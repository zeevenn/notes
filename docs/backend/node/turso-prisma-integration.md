---
title: Turso 集成 Prisma
date: 2024-09-24
icon: prisma
category:
  - practice
tag:
  - backend
  - orm
  - cloud database
  - prisma
---

在现代应用开发中，数据库和 ORM（对象关系映射）工具的选择对项目的开发效率和数据管理至关重要。[Prisma](https://www.prisma.io/) 是一款优秀的 ORM，它不仅能为你生成类型安全的数据库查询，还可以通过自动迁移管理数据库模式。而 [Turso](https://docs.turso.tech/introduction) 是一种基于 libSQL 的托管云数据库，提供了生产环境级别的 SQLite 数据库。本文将介绍如何将 Turso 和 Prisma 结合使用，帮助你快速集成并管理数据库。

## 什么是 Turso？

Turso 是由 libSQL 提供的云端托管数据库服务，其核心基于 SQLite，专为生产环境设计。它保持了 SQLite 简单、轻量和快速的特点，同时通过云端托管的方式，让开发者能够在分布式的环境中使用 SQLite，且具有云数据库的优势，例如多点访问、强大性能和易于集成。

Turso 的特点：

- 基于 libSQL：提供了生产级的 SQLite 数据库。
- 分布式存储：适用于多区域、多地的应用程序。
- 轻量易用：你可以像使用本地 SQLite 数据库一样去使用它。

::: tip

重点是能够免费使用。

:::

## 什么是 Prisma？

Prisma 是一个现代的 ORM 工具，旨在简化数据库交互。它通过提供类型安全的数据库查询接口，使得开发者能够在使用数据库时避免常见的错误。Prisma 的一些核心功能包括数据库迁移管理、自动生成的查询 API 和直观的数据库模式定义文件（`schema.prisma`）。

Prisma 的特点：

- 类型安全：Prisma 生成的客户端代码是类型安全的，能在开发阶段捕获错误。
- 直观的 Schema 定义：使用 `.prisma` 文件定义数据库模型。
- 数据库迁移：提供了数据库迁移工具，能够自动化管理数据库版本。

## 集成 Turso 和 Prisma

接下来将逐步介绍如何将 Turso 和 Prisma 集成在一起。主要的步骤包括安装工具、设置数据库连接、生成模型、进行数据库迁移并应用更改。

::: warning

从 Prisma ORM 5.4.2 及更高版本开始，Turso 可获得早期访问支持。

:::

### 安装 Turso CLI 和 Prisma CLI

首先，我们需要安装 Turso CLI 以便管理和访问 Turso 数据库，并且需要安装 Prisma CLI 以便生成客户端和管理数据库迁移。

安装 Prisma CLI：

```shell
npm install prisma --save-dev
```

[安装 Turso CLI](https://docs.turso.tech/cli/introduction)，以 macOS 为例：

```shell
brew install tursodatabase/tap/turso
```

安装完成后，通过 `turso auth login` 登录你的 Turso 帐户。

### 创建 Turso 数据库

使用以下命令创建一个新的 Turso 数据库：

```shell
turso db create my-database
```

获取数据库 URL：

```shell
turso db show --url my-database
```

获取数据库访问 token：

```shell
turso db tokens create my-database
```

### 配置 Prisma 数据源

初始化 Prisma 数据源：

```shell
npx prisma init
```

这会生成 `prisma/schema.prisma` 文件及 `.env` 文件，其中包含 Prisma 数据源定义。

`.env` 文件：

```shell
TURSO_URL=<your-turso-database-url>
TURSO_AUTH_TOKEN=<your-turso-auth-token>
```

需要启用 `driverAdapters` 特性：

```prisma{3}
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

生成 Prisma 客户端，它可以让你通过代码与数据库交互。

```shell
npx prisma generate
```

### 同步数据库

在本地开发环境下，我们首先需要同步数据库。

::: warning

若无需同步数据库，可以跳过这一步。

:::

首先登陆到 Turso 数据库：

```shell
turso db shell my-database
```

导出当前数据库 SQL 数据：

```shell
.schema
```

然后将 SQL 应用到本地数据库：

```shell
sqlite3 dev.db < schema.sql
```

::: tip

`sqlite3` 是 SQLite 数据库的命令行工具，用于创建、管理和查询 SQLite 数据库。它非常轻量，适合嵌入式系统或小型应用的本地数据库操作。你可以通过 `sqlite3` 工具来执行 SQL 命令、创建数据库、插入数据、查询数据、导入和导出数据库结构等。

macOS 通常自带 SQLite。

:::

然后将数据库结构拉入 prisma，这将从本地的 `dev.db` 文件中提取数据库模型，并自动生成 Prisma schema。

```shell
npx prisma db pull
```

生成 Prisma 客户端：

```shell
npx prisma generate
```

### 迁移数据库

由于 Turso 目前不支持直接使用 Prisma 进行模式迁移，所以在本地开发环境下，我们首先使用 SQLite 进行数据库迁移。

生成迁移文件：

```shell
npx prisma migrate dev --name init
```

这条命令做了三件事：

1. 在 `prisma/migrations` 目录中为这次迁移创建了一个新的 SQL 迁移文件。
2. 针对数据库执行 SQL 迁移文件。 
3. 运行 `prisma generate`（安装 `@prisma/client` 软件包，并根据你的模型生成定制的 Prisma 客户端 API）。

推送迁移到远端 turso 数据库：

```shell
turso db shell my-database < ./prisma/migrations/20240923125341_init/migration.sql
``` 

### 数据库操作

为 libSQL 安装 libSQL 数据库客户端和 Prisma ORM 驱动程序适配器：

```shell
npm install @libsql/client @prisma/adapter-libsql
```

更新数据库访问实例：

```ts
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: `${process.env.TURSO_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`
})

const adapter = new PrismaLibSQL(libsql)
const prisma = new PrismaClient({ adapter })

export default prisma
```

## 结论

集成 Turso 和 Prisma 可以让你在分布式云环境中享受 SQLite 的性能优势，同时利用 Prisma 的 ORM 功能管理数据库模型和查询。

但由于 Turso 目前对 Prisma 的支持有限，你需要手动将迁移文件应用到远程数据库。通过这种方式，你可以将本地开发环境与生产环境有效分离，保持高效的开发流程。
