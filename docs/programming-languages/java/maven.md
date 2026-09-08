---
title: Maven
date: 2026-09-08
icon: Maven
category:
  - java
tag:
  - maven
---

Maven 使用项目对象模型（Project Object Model，POM）描述项目，并由插件执行编译、测试、打包和发布等工作。POM 位于项目根目录的 `pom.xml`；它声明项目坐标、依赖、构建插件以及这些配置之间的继承关系。

本组笔记以 Maven 3.9.x 和 Java 17 为基线。截至 2026-09-08，Maven 4 仍处于候选发布阶段，不作为主学习路径的前提。

## 一个最小构建

Maven 默认识别下面的目录：

```text
hello-maven/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/example/App.java
    │   └── resources/
    └── test/
        ├── java/
        └── resources/
```

- `src/main/java` 存放主代码。
- `src/main/resources` 存放进入运行时类路径的资源。
- `src/test/java` 和 `src/test/resources` 存放测试代码与测试资源。
- `target` 由构建生成，包含编译结果、测试报告和最终产物，不应作为源文件目录使用。

最小的 `pom.xml` 可以只描述项目身份和编译目标：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>hello-maven</artifactId>
  <version>1.0.0-SNAPSHOT</version>

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

`maven.compiler.release` 同时约束 Java 语法、可用的 Java 标准库 API 和生成的 class 文件版本。即使 Maven 运行在更高版本的 JDK 上，这个项目仍以 Java 17 为编译目标。只设置 `source` 和 `target` 不能阻止代码调用较新 JDK 才提供的 API。

主类示例：

```java
package com.example;

public class App {
    public static void main(String[] args) {
        System.out.println("Hello, Maven");
    }
}
```

在项目根目录执行：

```shell
mvn clean verify
```

Maven 会读取 POM，解析插件和依赖，删除旧的 `target`，随后依次完成资源处理、编译、测试、打包和校验。成功后可以在 `target/hello-maven-1.0.0-SNAPSHOT.jar` 找到 JAR 产物。

如果还要让本机的其他 Maven 项目引用该产物，执行：

```shell
mvn install
```

`install` 会先执行此前所有默认生命周期阶段，再把 POM 和产物写入本地仓库。它不等于安装或启动应用。

## 使用 Maven Wrapper

Maven Wrapper 把项目所需的 Maven 版本记录在仓库中。其他开发者和 CI 可以使用同一版本，而不必依赖机器上预装的 `mvn`。

已有 Maven 环境时，可在项目中生成 Wrapper 文件：

```shell
mvn wrapper:wrapper
```

之后使用项目内的脚本构建：

```shell
./mvnw clean verify
```

Windows 使用：

```powershell
mvnw.cmd clean verify
```

`mvnw`、`mvnw.cmd` 和 `.mvn/wrapper/` 应提交到版本控制。Wrapper 固定的是 Maven 版本；项目使用哪个 JDK，还需要由开发环境、CI 或 Toolchains 配置决定。

## 核心词汇

| 词汇 | 在构建中的作用 |
| --- | --- |
| POM | 描述项目、依赖和构建配置的 `pom.xml` |
| 坐标 | 用 `groupId:artifactId:version` 唯一定位一个版本的构件 |
| 构件（artifact） | Maven 管理的文件及其元数据，例如 JAR、WAR 或 POM |
| 生命周期（lifecycle） | 一组有固定顺序的构建阶段 |
| 阶段（phase） | 构建过程中的位置，例如 `compile`、`test`、`package` |
| 插件（plugin） | 提供实际构建能力的扩展 |
| 目标（goal） | 插件可以执行的具体任务，例如 `compiler:compile` |
| 仓库（repository） | 保存并解析构件的本地或远程存储 |
| 有效 POM | Super POM、父 POM、当前 POM 和已激活配置合并后的最终模型 |
| Reactor | 收集、排序并构建多模块项目的 Maven 机制 |

## 学习路径

1. [生命周期与插件](./maven/lifecycle-and-plugins.md)：理解一条 Maven 命令实际执行了什么。
2. [依赖管理](./maven/dependency-management.md)：理解类路径、传递依赖、scope、版本调解和 BOM。
3. [POM、继承与配置](./maven/pom-and-inheritance.md)：理解有效 POM、父 POM、属性和插件管理。
4. [多模块构建](./maven/multi-module-builds.md)：理解聚合项目、父项目和 Reactor。
5. [仓库与 settings.xml](./maven/repositories-and-settings.md)：理解构件从哪里下载、向哪里发布以及凭据放在哪里。
6. [排障方法](./maven/troubleshooting.md)：从运行环境、有效模型、依赖图和插件输出定位问题。
7. [CI 与可复现构建](./maven/ci-and-reproducible-builds.md)：固定工具版本、构建环境和发布边界。

## 参考资料

- [Maven Getting Started Guide](https://maven.apache.org/guides/getting-started/)
- [Introduction to the Standard Directory Layout](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html)
- [Maven Wrapper](https://maven.apache.org/tools/wrapper/)
- [Maven Releases History](https://maven.apache.org/docs/history.html)
