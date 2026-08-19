---
title: Prisma ORM
date: 2024-12-20
icon: creative
article: false
category:
  - backend
  - node
tag:
  - ORM
---

# Prisma ORM

Prisma ORM 是面向 Node.js、Bun 和 Deno 的对象关系映射（Object-Relational Mapping，ORM）工具。它根据数据模型生成带类型的查询客户端，并提供数据库迁移和数据查看工具。本节以当前稳定的 Prisma ORM 7 为基线；旧版本项目应先核对[升级指南](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7)。

## 工具组成

- **Prisma Client**：根据 Prisma schema 生成查询 API 和 TypeScript 类型。
- **Prisma Migrate**：根据数据模型生成可修改的 SQL 迁移文件，并分别支持开发和生产迁移流程。
- **Prisma Studio**：用于查看和编辑数据库记录的图形界面。

三者共享 Prisma schema。schema 中的模型描述应用需要操作的数据结构，生成器决定客户端代码的输出方式，数据源声明数据库类型。Prisma 7 的连接 URL 等运行配置放在 `prisma.config.ts` 中。

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
}
```

## 两条数据模型工作流

新项目通常先编写 Prisma schema，再使用 Prisma Migrate 生成并执行迁移：

```text
修改 schema → prisma migrate dev → prisma generate → 使用 Prisma Client
```

已有数据库通常先执行内省（introspection）。`prisma db pull` 读取数据库结构并更新 Prisma schema，随后再生成客户端：

```text
修改数据库 → prisma db pull → prisma generate → 使用 Prisma Client
```

两条流程解决的方向不同。`migrate dev` 以 Prisma schema 为变更来源；`db pull` 以现有数据库结构为来源。团队需要明确哪一侧是结构变更的主要入口，避免 schema 与数据库被两套流程同时修改。

## 查询能力与边界

Prisma Client 会根据模型生成查询参数和返回值类型，适合常见的增删改查、关系查询和事务。它返回普通 JavaScript 对象，不要求业务对象继承 ORM 模型类。

类型检查只能覆盖查询 API 和已生成的数据模型，不能证明查询满足业务规则，也不能消除索引缺失、N+1 查询、锁竞争或事务边界错误。需要精确控制 SQL、使用数据库特有能力或分析执行计划时，可以结合原始 SQL、数据库客户端和监控工具。

Prisma ORM 7 直接连接数据库时必须配置对应的 driver adapter，并通过 `new PrismaClient({ adapter })` 传入。使用 Prisma Accelerate 时采用 `accelerateUrl` 和对应扩展，而不是直接数据库适配器。

## 本节内容

- [Prisma 入门](./quick-start.md)：创建项目、定义模型、执行迁移并完成一次查询。
- [Turso 集成 Prisma](../turso-prisma-integration.md)：项目中的 libSQL 与 Prisma 集成记录；使用前需要核对版本兼容性。

## 官方资料

- [Prisma ORM 概览](https://www.prisma.io/docs/orm)
- [Prisma schema](https://www.prisma.io/docs/orm/prisma-schema/overview)
- [生成 Prisma Client](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [Prisma ORM 7 升级指南](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7)
