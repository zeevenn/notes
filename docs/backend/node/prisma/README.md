---
title: Prisma
date: 2024-12-20
icon: creative
category:
  - backend
  - node
tag:
  - ORM
---

# Prisma

Prisma ORM 是一套用于与数据库进行交互的下一代 ORM（对象关系映射，Object-Relational Mapping）工具，包括以下组件：

- Prisma Client: 自动生成且类型安全的查询构建器，用于 Node.js 和 TypeScript
- Prisma Migrate: 声明式数据建模和迁移系统
- Prisma Studio: 用于查看和编辑数据库中数据的 GUI

> [!INFO]
> Prisma Studio 是 Prisma ORM 中唯一不是开源的部分。你只能在本地运行 Prisma Studio。

## 为什么使用 Prisma ORM

Prisma ORM 不仅提供了现代化的开发体验，还显著提高了与数据库交互的效率和安全性。以下是 Prisma ORM 的主要优势，并与原始 SQL 进行对比。

### 类型安全 vs SQL 静态查询

Prisma Client 提供了强大的类型安全功能，每个查询都与 Prisma schema 紧密结合，使得查询语法和返回值均受到 TypeScript 的静态类型检查支持：

Prisma 查询：

```typescript
const users = await prisma.user.findMany({
  where: { name: { contains: 'Alice' } }
})
```

SQL 查询：

```sql
SELECT * FROM user WHERE name LIKE '%Alice%';
```

Prisma 查询中，错误可以在开发阶段被捕获，而 SQL 查询需要额外的测试或运行时调试，容易引入拼写或逻辑错误。

### 开发效率 vs 手动编写 SQL

使用 Prisma ORM，可以通过高层抽象简化常见的数据库操作，而不需要重复编写大量 SQL 查询。

创建一个用户和关联帖子：

```typescript
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@example.com',
    posts: {
      create: { title: 'Prisma is amazing!' }
    }
  }
})
```

SQL：

```sql
INSERT INTO "User" ("name", "email") VALUES ('Alice', 'alice@example.com');
INSERT INTO "Post" ("title", "authorId") VALUES ('Prisma is amazing!', 1);
```

Prisma 的高层 API 不仅易读，还避免了处理 SQL 中外键关系和手动关联数据的复杂性。

### 声明式数据建模 vs 手动设计数据库

Prisma schema 提供了直观的声明式语法来定义数据模型，与数据库结构直接同步，而 SQL 通常需要手动设计表结构并维护复杂的迁移脚本。

Prisma schema：

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  posts Post[]
}
```

SQL：

```sql
CREATE TABLE "User" (
  "id" INT AUTO_INCREMENT PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
);

CREATE TABLE "Post" (
  "id" INT AUTO_INCREMENT PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "authorId" INT NOT NULL,
  FOREIGN KEY ("authorId") REFERENCES "User"("id")
);
```

Prisma schema 自动生成相关的迁移脚本，而 SQL 的表定义需要开发者手动编写，容易出错。

### 总结

Prisma ORM 通过提供类型安全、自动迁移、高层抽象和声明式数据建模，显著提高了与数据库交互的效率和安全性。

| 特性             | Prisma ORM                       | 原始 SQL             |
| ---------------- | -------------------------------- | -------------------- |
| **类型安全**     | 是                               | 否                   |
| **开发效率**     | 高                               | 低，需要手动编写 SQL |
| **工具集成**     | Prisma Client + Migrate + Studio | 多种分散工具组合     |
| **数据建模方式** | 声明式，紧密结合业务逻辑         | 手动设计，偏技术导向 |
| **迁移脚本生成** | 自动生成                         | 手动编写             |
| **复杂查询处理** | 高层抽象，易读                   | 复杂拼接，易出错     |

## 工作原理

### Prisma schema

每一个使用 Prisma ORM 工具的项目都以一个 `prisma/schema.prisma` 文件开始。

[Prisma schema](https://www.prisma.io/docs/orm/prisma-schema) 是 Prisma ORM 的配置文件，用于定义数据库的结构和关系。可以包含如下内容：

- 数据源（datasource）：定义数据库的连接
- 生成器（generator）：定义 Prisma Client 的生成器
- 模型（model）：定义数据库中的表和字段

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
```

> [!NOTE]
> Prisma 模式具有强大的数据建模功能。 例如，它允许你定义「Prisma 级」关系字段，这将使你更容易在 Prisma 客户端 API 中处理关系。
>
> 在上述案例中，用户的 `posts` 字段仅定义在「Prisma 级」，这意味着它在底层数据库中并不显示为外键。

### 数据模型 model

模型有两个主要功能：

- 在关系数据库中表示表，在 MongoDB 中表示集合
- 为 Prisma 客户端 API 中的查询提供基础

Prisma schema 中维护 model 有两个主要工作流程：

- 使用 Prisma Migrate 手动编写 model 并将其映射到数据库
- 通过内省数据库生成 model

一旦定义了数据模型，就可以生成 Prisma Client，该客户端将为已定义的模型提供 CRUD 和更多查询。如果使用的是 TypeScript，那么所有查询都将获得完全的类型安全。

### 使用 Prisma Client 访问数据库

首先安装 Prisma Client 包：

```bash
npm install @prisma/client
```

该包会提供一个 `prisma generate` 命令，该命令会读取 Prisma schema 并生成 Prisma Client 代码。默认情况下，代码生成在 `node_modules/.prisma/client` 文件夹中。

在你更改了 Prisma schema 后，需要重新运行 `prisma generate` 命令，以确保 Prisma Client 代码是最新的。

```bash
npx prisma generate
```

一旦 Prisma Client 代码生成后，就可以在代码中使用它来访问数据库。

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 查询所有用户
const allUsers = await prisma.user.findMany()

// 查询所有包含 "prisma" 的帖子
const filteredPosts = await prisma.post.findMany({
  where: {
    OR: [{ title: { contains: 'prisma' } }, { content: { contains: 'prisma' } }]
  }
})

// 创建一个用户
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@prisma.io',
    posts: {
      create: { title: 'Join us for Prisma Day 2020' }
    }
  }
})

// 更新一个帖子
const post = await prisma.post.update({
  where: { id: 42 },
  data: { published: true }
})
```

> [!NOTE]
> 更多 Prisma Client 的使用方法，请参考 [Prisma Client 文档](https://www.prisma.io/docs/orm/prisma-client)。

> [!TIP]
> 在开发环境中，建议开启 Prisma Client 的调试模式，以便查看实际生成的 SQL 查询：
>
> ```typescript
> const prisma = new PrismaClient({
>   log: ['query', 'info', 'warn', 'error']
> })
> ```

## 工作流

如上所述，有两种方法可将数据模型「获取」到 Prisma schema 中。根据选择的方法，Prisma ORM 工作流程可能会有所不同。

> [!TIP]
> 一般而言，使用 Prisma Migrate 是更好的选择，因为它提供了更强大的功能和更好的可维护性。

### Prisma Migrate

使用 Prisma ORM 的集成数据库迁移工具 Prisma Migrate，工作流程如下：

1. 手动调整 Prisma schema 数据模型
2. 使用 `prisma migrate dev --name <migration-name>` CLI 命令迁移开发数据库
3. 在应用程序代码中使用 Prisma Client 访问数据库

![Prisma Migrate](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241220174057.png)

### SQL migrations and introspection

如果由于某种原因不能或不想使用 Prisma Migrate，仍可使用 introspection 功能从数据库模式更新 Prisma schema。使用 SQL 迁移和自省时的典型工作流程略有不同：

1. 手动调整数据库 schema 使用 SQL 或第三方迁移工具
2. （重新）审视您的数据库
3. 可选择[（重新）配置 Prisma Client API](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/custom-model-and-field-names)
4. 使用 `prisma generate` CLI 命令生成 Prisma Client
5. 在应用程序代码中使用 Prisma Client 访问数据库

![SQL migrations and introspection](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241220174256.png)

## 目录

- [Prisma 入门](./quick-start.md)
