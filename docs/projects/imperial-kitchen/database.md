---
title: 数据库结构设计
date: 2024-07-11
icon: database-line
category:
  - Project
tag:
  - imperial-kitchen
  - 系统设计
---

::: warning

Deprecated. 已改用 prisma + Mysql 数据库。

:::

## 数据库选择

选择使用云数据库 [turso](https://docs.turso.tech/introduction)。

Turso 是一个兼容 SQLite 的数据库，基于 libSQL（SQLite 的开放贡献分叉）构建。 它可以将每个组织的数据库扩展到数十万个，并支持复制到任何位置，包括您自己的服务器，以实现微秒级延迟访问。

```ts
import { InStatement, LibsqlError, createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN
})
```

## user

```sql
CREATE TABLE "user" (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
, password TEXT);
```

## category

```sql
CREATE TABLE category (
id INTEGER PRIMARY KEY,
name TEXT,
description TEXT
);
```

## commodity

```sql
CREATE TABLE commodity (
id INTEGER PRIMARY KEY,
name TEXT,
price REAL,
description TEXT,
category_id INTEGER,
FOREIGN KEY (category_id) REFERENCES category(id)
);
```
