---
title: Maven 多模块项目
date: 2026-09-08
icon: sitemap
category:
  - java
tag:
  - maven
  - multi-module
---

一个代码库可以包含多个 Maven 项目，每个模块有自己的 POM 和产物。根项目把模块纳入同一次构建；父 POM 则让模块共享版本和构建配置，这两种关系分别称为聚合与继承。

## 根项目与子模块

以接口模块依赖领域模块为例：

```text
shop/
├── pom.xml
├── shop-domain/
│   ├── pom.xml
│   └── src/main/java/
└── shop-api/
    ├── pom.xml
    └── src/main/java/
```

根 `pom.xml` 同时组织模块并提供共同的编译配置：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>shop</artifactId>
  <version>1.0.0-SNAPSHOT</version>
  <packaging>pom</packaging>

  <modules>
    <module>shop-domain</module>
    <module>shop-api</module>
  </modules>

  <properties>
    <maven.compiler.release>17</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.16.0</version>
      </plugin>
    </plugins>
  </build>
</project>
```

聚合 POM 必须使用 `packaging=pom`。`modules` 中填写相对于根 POM 的目录路径，不是构件坐标。

`shop-domain/pom.xml` 通过 `parent` 继承根项目：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.example</groupId>
    <artifactId>shop</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <relativePath>../pom.xml</relativePath>
  </parent>
  <artifactId>shop-domain</artifactId>
</project>
```

`groupId`、`version`、属性和编译插件配置都可继承，子模块保留自己的 `artifactId`。`relativePath` 指向本地父 POM；父 POM 也可以是从仓库解析的公共构件。

聚合与继承不要求绑定在一起：模块可以参加当前根项目的构建，却继承另一个父 POM；继承某个父 POM，也不代表自动加入它的模块列表。

## 声明模块间依赖

`shop-api/pom.xml` 同样继承根项目，并声明对领域模块的依赖：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.example</groupId>
    <artifactId>shop</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <relativePath>../pom.xml</relativePath>
  </parent>
  <artifactId>shop-api</artifactId>
  <dependencies>
    <dependency>
      <groupId>com.example</groupId>
      <artifactId>shop-domain</artifactId>
      <version>${project.version}</version>
    </dependency>
  </dependencies>
</project>
```

`${project.version}` 是当前模块的有效版本。此例各模块统一版本，因此可以这样引用；独立发布的模块需要分别管理依赖版本。

在根目录执行 `mvn clean verify` 时，Maven Reactor 会收集模块，按依赖关系排序并构建。即使 `modules` 先列出 `shop-api`，也会先构建它依赖的 `shop-domain`；彼此没有排序约束的模块才按声明顺序排列。

同一次 Reactor 构建可以使用上游模块的构建结果，无需先逐个执行 `install`。

## 统一依赖与插件版本

父 POM 可以继承普通 `dependencies`，但这样所有子模块都会获得这些依赖。只想统一版本、让子模块按需使用时，应放进 `dependencyManagement`。具体写法见 [依赖版本管理](./dependency-management.md#dependencymanagement)。

插件的管理也有类似区别。父 POM 中可用 `pluginManagement` 提供版本和配置：

```xml
<build>
  <pluginManagement>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.5.5</version>
      </plugin>
    </plugins>
  </pluginManagement>
</build>
```

`pluginManagement` 本身不会新增插件执行。插件被生命周期默认绑定或被子模块实际声明使用时，才应用这些管理配置。Surefire 已绑定 `jar` 项目的 `test` 阶段，因此上面的配置能统一测试插件版本。

当前 POM 与父 POM 的配置会按元素规则覆盖或合并。需要确认某个模块实际使用的版本时，查看该模块的有效 POM：

```shell
mvn -f shop-api/pom.xml help:effective-pom
```

仅出现在管理区、未被实际使用的依赖或插件，不会建立模块间的构建依赖。

## 选择模块构建

从根目录构建接口模块及其上游依赖：

```shell
mvn -pl :shop-api -am verify
```

`-pl` 选择模块，`-am` 同时加入它依赖的 Reactor 模块。只写 `-pl` 时，上游产物需要能从仓库解析；本地联调通常一起使用这两个选项。

修改领域模块后，也可以选择它及依赖它的下游模块进行验证：

```shell
mvn -pl :shop-domain -amd verify
```

`-amd` 加入依赖所选模块的项目。冒号后的名称是 `artifactId`，也可以用 `-pl shop-api` 按相对路径选择。

构建失败时先看 Reactor Summary 中第一个失败模块。下游的 `SKIPPED` 通常由上游失败造成，应先解决源头问题。
