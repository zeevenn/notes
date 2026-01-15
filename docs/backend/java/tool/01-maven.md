---
title: Maven
date: 2024-08-30
icon: Maven
category:
  - node
tag:
  - express
---

## 什么是 Maven

Maven 是一个项目管理和构建工具，主要用于 Java 项目。它通过 POM（Project Object Model）文件来管理项目的依赖、编译、测试和打包等任务。Maven 的核心功能包括：

- 依赖管理：通过定义 POM 文件中的依赖项，Maven 能够自动下载和配置项目所需的库。
- 构建自动化：Maven 可以自动化执行从编译、测试到打包的整个构建过程。
- 项目结构标准化：Maven 提供了约定优于配置的项目结构，减少了开发者的配置工作。

类似 npm，不同的是，npm 使用 `package.json`，而 Maven 使用 `pom.xml`。

`package.json` 通常包含以下内容：

- 依赖管理：`dependencies` 和 `devDependencies` 字段用于列出项目在运行时和开发时所需的包。
- 脚本管理：`scripts` 字段允许开发者定义各种命令，如 `npm start`、`npm test` 等，来自动化常见任务。
- 项目元数据：如项目名称、版本、描述、作者等。

`pom.xml` 中包含下述内容：

- 依赖管理：`dependencies` 节点列出项目所依赖的库及其版本。
- 构建管理：`build` 节点定义了构建过程中的各种配置，包括插件的使用。
- 项目元数据：如项目的 `groupId`、`artifactId`、`version` 等。
- 生命周期管理：Maven 提供了一整套的生命周期管理机制，涵盖了项目的编译、测试、打包和部署等阶段。

示例：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>my-project</artifactId>
  <version>1.0.0</version>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <version>3.0.0</version>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.8.1</version>
        <configuration>
            <source>17</source>
            <target>17</target>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

## 依赖原则

1. 依赖路径最短优先原则：

```shell
A -> B -> C -> X(1.0)
A -> D -> X(2.0)
```

由于 X(2.0) 路径最短，所以使用 X(2.0)。

1. 声明顺序优先原则：

```shell
A -> B -> X(1.0)
A -> C -> X(2.0)
```

在 POM 中最先声明的优先，上面的两个依赖如果先声明 B，那么最后使用 X(1.0)。

1. 覆写优先原则：子 POM 内声明的依赖优先于父 POM 中声明的依赖。
