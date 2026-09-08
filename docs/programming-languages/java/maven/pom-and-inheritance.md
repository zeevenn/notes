---
title: Maven POM、继承与配置
date: 2026-09-08
icon: file-code
category:
  - java
tag:
  - maven
  - pom
---

`pom.xml` 是 Maven 的项目描述，不是按书写顺序执行的脚本。Maven 先把默认值、父项目配置、当前项目配置和已激活的 profile 合并成有效 POM，再根据这个模型构造依赖图和构建计划。

## 最小 POM 与项目坐标

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>order-domain</artifactId>
  <version>1.0.0-SNAPSHOT</version>
</project>
```

三个字段组成项目的基本坐标：

```text
com.example:order-domain:1.0.0-SNAPSHOT
```

- `groupId` 表示组织或命名空间，通常使用反向域名。
- `artifactId` 是组织内的项目或模块名。
- `version` 标识一个具体版本。
- `packaging` 标识产物类型，省略时默认为 `jar`。

依赖坐标还可能包含 `type` 和 `classifier`。例如同一版本可以同时发布主 JAR、源码 JAR 和 Javadoc JAR。

## 有效 POM

即使项目 POM 很短，Maven 仍然知道源码目录、输出目录和一组默认插件绑定。这些默认值来自 Super POM 和打包类型。

查看最终生效的模型：

```shell
mvn help:effective-pom
```

写入文件便于搜索和比较：

```shell
mvn help:effective-pom -Doutput=target/effective-pom.xml
```

排查“明明没有配置却出现某个仓库、插件或依赖版本”时，有效 POM 比只阅读当前文件更可靠。

## 继承父 POM

子项目通过 `<parent>` 继承通用配置：

```xml
<parent>
  <groupId>com.example</groupId>
  <artifactId>build-parent</artifactId>
  <version>1.3.0</version>
  <relativePath>../pom.xml</relativePath>
</parent>
```

子 POM 通常可以省略与父 POM 相同的 `groupId` 和 `version`。`relativePath` 用于在 Reactor 或本地文件系统中定位父 POM；找不到时，Maven 再尝试从仓库解析父构件。若父 POM 只应从仓库获取，可使用空元素：

```xml
<relativePath/>
```

常见的可继承内容包括属性、依赖、`dependencyManagement`、插件配置和资源配置。`artifactId`、`name`、`prerequisites` 等项目自身信息不按普通配置直接继承；模块聚合关系也不通过父子继承自动建立。

当前 POM 对同一配置的具体声明通常会参与覆盖或合并，但不同元素具有不同合并规则。遇到插件 execution、列表或嵌套配置时，不应仅凭“子 POM 优先”推断最终结果，应查看有效 POM。

## 属性与插值

属性集中保存多个位置共同使用的值：

```xml
<properties>
  <maven.compiler.release>17</maven.compiler.release>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  <junit.version>5.13.4</junit.version>
</properties>
```

引用属性：

```xml
<version>${junit.version}</version>
```

常用内置表达式包括：

- `${project.version}`：当前项目版本。
- `${project.basedir}`：当前模块所在目录。
- `${maven.build.timestamp}`：本次 Maven 会话开始时的时间戳。

不要用属性隐藏每一个只出现一次的值。属性更适合表达需要跨模块统一、成组升级或具有明确语义的版本和构建参数。

## 管理与启用是两件事

依赖配置分为：

- `dependencyManagement`：提供默认版本和策略。
- `dependencies`：把依赖加入当前项目。

插件也有相同边界：

- `pluginManagement`：为子模块或后续声明提供默认插件版本和配置。
- `plugins`：让插件参与当前项目的构建。

父 POM 可以统一插件版本：

```xml
<build>
  <pluginManagement>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.16.0</version>
      </plugin>
    </plugins>
  </pluginManagement>
</build>
```

需要自定义或启用该插件的子模块再在 `plugins` 中声明它。由 packaging 默认绑定的核心插件可能无需额外声明也会执行，但在可复现构建中仍应通过父 POM 管理其版本。

## profiles 的适用边界

Profile 可以根据命令行、JDK、操作系统、属性或文件存在情况激活一组配置：

```xml
<profiles>
  <profile>
    <id>release-checks</id>
    <build>
      <plugins>
        <!-- 仅发布校验需要的插件 -->
      </plugins>
    </build>
  </profile>
</profiles>
```

显式激活：

```shell
mvn verify -Prelease-checks
```

查看激活结果：

```shell
mvn help:active-profiles
```

Profile 适合表达确实不同的构建能力，例如发布签名或可选的兼容性测试。普通测试不应依赖开发者是否记得激活 profile。环境凭据、代理和镜像属于机器配置，应放在 `settings.xml`，而不是 POM profile。

## 参考资料

- [Introduction to the POM](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html)
- [POM Reference](https://maven.apache.org/pom.html)
- [Introduction to Build Profiles](https://maven.apache.org/guides/introduction/introduction-to-profiles.html)
- [Guide to Configuring Plug-ins](https://maven.apache.org/guides/mini/guide-configuring-plugins.html)
