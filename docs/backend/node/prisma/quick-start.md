---
title: Prisma 7 接入 MySQL
date: 2024-12-17
icon: STARTUP
category:
  - node
tag:
  - prisma
  - ORM
  - MySQL
---

# Prisma 7 接入 MySQL

本例从空目录创建 TypeScript 项目，通过 Prisma ORM 7 连接已有的 MySQL 服务，创建两张关联表并执行一次写入和查询。

## 前置条件

- Node.js 20.19.0 或更高版本。
- TypeScript 5.4.0 或更高版本。
- 可访问的 MySQL 数据库，以及非 `root` 的应用账号。
- 数据库账号对目标数据库具有建表和修改表结构所需的权限。

Prisma CLI 执行迁移时使用数据库连接 URL；应用运行时通过 driver adapter 建立连接。生产凭据不应提交到版本库。

## 创建项目

```bash
mkdir hello-prisma
cd hello-prisma
npm init -y
npm install --save-dev prisma typescript tsx @types/node
npm install @prisma/client @prisma/adapter-mariadb dotenv
npx tsc --init
```

Prisma ORM 7 使用 ECMAScript Module（ESM）格式。在 `package.json` 中声明模块类型：

```json
{
  "type": "module"
}
```

`tsconfig.json` 至少需要兼容 ESM 和当前 Node.js 运行环境：

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## 初始化 Prisma

```bash
npx prisma init --datasource-provider mysql --output ../generated/prisma
```

初始化命令会创建：

- `prisma/schema.prisma`：数据源、客户端生成器和数据模型。
- `prisma.config.ts`：schema、迁移目录和数据库连接配置。
- `.env`：本地环境变量。

`prisma.config.ts` 读取 Prisma CLI 使用的数据库连接 URL：

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  datasource: {
    url: env('DATABASE_URL')
  }
})
```

在 `.env` 中填写 MySQL 连接信息：

```dotenv
DATABASE_URL="mysql://app_user:password@localhost:3306/hello_prisma"
DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_USER="app_user"
DATABASE_PASSWORD="password"
DATABASE_NAME="hello_prisma"
```

`DATABASE_URL` 供 Prisma CLI 执行迁移使用；其余变量供 `@prisma/adapter-mariadb` 在应用运行时建立连接。

## 定义数据模型

编辑 `prisma/schema.prisma`：

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String? @db.Text
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

关系字段 `User.posts` 只存在于 Prisma Client API 中；MySQL 中实际保存关系的是 `Post.authorId` 外键。

## 创建迁移并生成客户端

```bash
npx prisma migrate dev --name init
npx prisma generate
```

`migrate dev` 根据模型生成 SQL 迁移文件并应用到开发数据库。该命令可能在检测到结构漂移时要求重置数据库，因此只应对可控的开发数据库执行。生产环境应用已经提交的迁移时使用 `prisma migrate deploy`。

`prisma generate` 根据 schema 在 `generated/prisma` 中生成客户端代码。修改模型或生成器配置后需要重新执行该命令。

## 创建 Prisma Client

新建 `lib/prisma.ts`：

```typescript
import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 3306),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
})

export const prisma = new PrismaClient({ adapter })
```

Prisma ORM 7 直接连接数据库时要求向 `PrismaClient` 传入 driver adapter。`@prisma/adapter-mariadb` 同时适用于 MySQL 和 MariaDB。

## 写入并查询数据

新建 `script.ts`：

```typescript
import { prisma } from './lib/prisma'

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      posts: {
        create: {
          title: 'Hello Prisma',
          published: true
        }
      }
    },
    include: {
      posts: true
    }
  })

  console.dir(user, { depth: null })

  const users = await prisma.user.findMany({
    include: {
      posts: true
    }
  })

  console.dir(users, { depth: null })
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

运行脚本：

```bash
npx tsx script.ts
```

输出应包含新建的用户及其 `posts` 数组。再次运行会因为 `email` 的唯一约束而失败；重复测试前需要更换邮箱或清理测试数据。

## 查看数据

```bash
npx prisma studio
```

Prisma Studio 使用项目配置连接数据库，可用于检查本地开发数据，不代替生产环境的权限控制和审计工具。

## 迁移与原型命令的区别

- `prisma migrate dev`：为开发阶段生成并应用有版本记录的迁移。
- `prisma migrate deploy`：在测试或生产环境应用已经提交的迁移。
- `prisma db push`：直接同步 schema，不生成迁移历史，适合短期原型。
- `prisma db pull`：从现有数据库读取结构并更新 Prisma schema。

## 参考资料

- [Prisma ORM 7 MySQL Quickstart](https://www.prisma.io/docs/prisma-orm/quickstart/mysql)
- [MySQL connector](https://www.prisma.io/docs/orm/core-concepts/supported-databases/mysql)
- [Prisma ORM 7 升级指南](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7)
- [Prisma Config](https://www.prisma.io/docs/orm/reference/prisma-config-reference)
