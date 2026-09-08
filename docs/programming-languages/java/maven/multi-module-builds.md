---
title: Maven 多模块构建
date: 2026-09-08
icon: sitemap
category:
  - java
tag:
  - maven
  - multi-module
---

多模块构建把若干 Maven 项目放进同一次构建。Maven Reactor（反应堆）收集模块，依据模块间关系计算顺序，再按该顺序执行每个模块的生命周期。

## 最小目录结构

```text
shop/
├── pom.xml
├── shop-domain/
│   ├── pom.xml
│   └── src/
└── shop-api/
    ├── pom.xml
    └── src/
```

根 POM 聚合两个模块：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>shop</artifactId>
  <version>1.0.0-SNAPSHOT</version>
  <packaging>pom</packaging>

  <modules>
    <module>shop-domain</module>
    <module>shop-api</module>
  </modules>
</project>
```

`<module>` 是相对根 POM 的目录路径，不是 Maven 坐标。聚合 POM 通常使用 `packaging=pom`，因为它的主要作用是组织构建而不是生成 JAR。

## 聚合与继承是两种关系

| 关系 | 由什么声明 | 解决的问题 |
| --- | --- | --- |
| 聚合（aggregation） | 根 POM 的 `<modules>` | 哪些项目参加本次 Reactor 构建 |
| 继承（inheritance） | 子 POM 的 `<parent>` | 子项目从哪里获得通用配置 |

一个根 POM 经常同时是 aggregator 和 parent，但这不是强制关系：

- 模块可以参加根项目的 Reactor 构建，却继承另一个已发布的父 POM。
- 子项目可以继承组织父 POM，却不在父 POM 的 `<modules>` 中。

子模块继承根 POM 的示例：

```xml
<parent>
  <groupId>com.example</groupId>
  <artifactId>shop</artifactId>
  <version>1.0.0-SNAPSHOT</version>
  <relativePath>../pom.xml</relativePath>
</parent>

<artifactId>shop-domain</artifactId>
```

## Reactor 如何确定顺序

如果 `shop-api` 依赖 `shop-domain`：

```xml
<dependency>
  <groupId>com.example</groupId>
  <artifactId>shop-domain</artifactId>
  <version>${project.version}</version>
</dependency>
```

即使 `<modules>` 先写 `shop-api`，Reactor 也会先构建 `shop-domain`。影响排序的已实例化关系包括：

- 模块间的项目依赖。
- 使用 Reactor 中另一个模块作为构建插件。
- 插件对 Reactor 中模块的依赖。
- 构建扩展关系。
- 没有其他关系可判断时，才使用 `<modules>` 中的声明顺序。

只有写在 `dependencyManagement` 或 `pluginManagement` 中、但未实际使用的声明，不会改变 Reactor 顺序。

## 选择部分模块

从根目录执行以下命令。

只构建指定模块：

```shell
./mvnw -pl :shop-api verify
```

同时构建它依赖的 Reactor 模块：

```shell
./mvnw -pl :shop-api -am verify
```

同时构建依赖它的模块：

```shell
./mvnw -pl :shop-domain -amd verify
```

从失败模块继续：

```shell
./mvnw -rf :shop-api verify
```

常用选项：

| 短选项 | 长选项 | 含义 |
| --- | --- | --- |
| `-pl` | `--projects` | 选择要构建的项目 |
| `-am` | `--also-make` | 加入所选项目依赖的模块 |
| `-amd` | `--also-make-dependents` | 加入依赖所选项目的模块 |
| `-rf` | `--resume-from` | 从指定模块恢复构建 |
| `-N` | `--non-recursive` | 只构建当前 POM，不进入模块 |

`:shop-api` 使用 artifactId 选择项目，可以避免输入完整坐标。大型项目中如果 artifactId 不唯一，应改用完整坐标或明确的相对路径。

## 失败处理

Maven 默认使用 fail-fast：一个模块失败后停止后续构建。

```shell
./mvnw --fail-at-end verify
```

`--fail-at-end` 会尽可能继续构建不受影响的模块，最后统一报告失败，适合在 CI 中收集更多错误。它不会让依赖失败模块的下游绕过缺失产物继续成功。

## 多模块版本管理

同一代码库中的模块通常继承统一的项目版本，并由根 POM 的 `dependencyManagement` 和 `pluginManagement` 管理外部依赖及插件版本。每个模块仍应只在 `dependencies` 和 `plugins` 中声明自己实际使用的内容。

`${project.version}` 表示当前模块的有效版本。若模块不是统一版本发布，需要显式管理模块间依赖版本，不能假设它始终等于根项目版本。

## 参考资料

- [Guide to Working with Multiple Modules](https://maven.apache.org/guides/mini/guide-multiple-modules.html)
- [Introduction to the POM](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html)
- [Maven CLI Options Reference](https://maven.apache.org/ref/current/maven-embedder/cli.html)
