---
title: 关系数据模型
date: 2024-01-16
icon: relation
category:
  - database
tag:
  - backend
  - 关系数据库模型
  - data model
---

本文介绍最重要的数据模型之一：「二维表」，或者称为「关系」。

## 数据模型概述

### 什么是数据模型

数据模型是用于描述数据或信息的标记，一般由三部分组成：

- 数据结构：物理数据模型，也称概念模型；
- 数据操作：查询、修改；
- 数据约束。

### 一些重要的数据模型

现今，数据库系统中有两种比较重要的数据模型：

- 关系数据模型，包括对象关系模型的拓展；
- 半结构化数据模型，包括 XML 相关的标准。

#### 关系模型

关系模型是一种基于「二维表」的数据模型，由 E.F.Codd 于 1970 年提出。

以电影关系模型为例，这张表中会有大量的数据行，一部电影对应一行数据。

|          title           | year | length | genre |
| :----------------------: | :--: | :----: | :---: |
|      The Godfather       | 1972 |  175   | Crime |
| The Shawshank Redemption | 1994 |  142   | Drama |
|  The Godfather: Part II  | 1974 |  202   | Crime |

关系模型具有 **高效性** 和 **易用性**。

- 提供简单的方法进行建模；
- 提供了一套有限但有效的操作集。

#### 半结构化模型

目前半结构话模型最主要的体现就是 XML，标签与 HTML 类似。

```xml
<Movies>
  <Movie>
    <title>The Godfather</title>
    <year>1972</year>
    <length>175</length>
    <genre>Crime</genre>
  </Movie>
  <Movie>
    <title>The Shawshank Redemption</title>
    <year>1994</year>
    <length>142</length>
    <genre>Drama</genre>
  </Movie>
  <Movie>
    <title>The Godfather: Part II</title>
    <year>1974</year>
    <length>202</length>
    <genre>Crime</genre>
  </Movie>
</<Movies>
```

## 关系模型基础

### 属性

关系模型中的属性是一个「命名值」，例如「电影」关系模型中的「title」、「year」等。

### 模式

关系模型中的模式（schema）是属性的集合。

```
Movies(title, year, length, genre)
```

### 元组

关系中除含属性名所在行以外的其他行称作元组。

```
('The Godfather', 1972, 175, 'Crime')
```

### 域

关系模型中的域是属性的取值范围。

```
Movies(title: string, year: integer, length: integer, genre: string)
```

### 键

在关系模型中，可以对数据库模式的关系增加很多约束。

最基本的约束就是「键约束」，通常定义为 `id`。

## SQL

最普遍的用于描述和操作关系数据库的语言是 SQL。现今大部分数据管理系统都只实现了标准的一部分，而不是全部实现。

SQL 有两方面的内容：

- 定义数据库模式的数据定义语言（DDL）；
- 查询和更新数据库的数据操作语言（DML）。
