---
title: Maven 依赖与仓库管理
date: 2026-09-08
icon: network-wired
category:
  - java
tag:
  - maven
  - dependency
  - repository
---

Maven 根据 POM 中的依赖声明构造依赖图，选择版本后从仓库解析构件，并为编译、测试和运行准备相应的类路径。

## 声明依赖与传递依赖

例如，在 POM 的 `dependencies` 中加入测试库：

```xml
<dependencies>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.13.4</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

显式声明的是直接依赖；它所依赖的其他构件会按规则传递引入。代码直接使用的库应显式声明，避免上游调整依赖后，当前项目意外失去所需的库。

`scope` 决定依赖在哪些类路径可见。常用范围如下：

| scope | 主代码编译 | 测试 | 运行 | 用途 |
| --- | --- | --- | --- | --- |
| `compile` | 是 | 是 | 是 | 默认范围，主代码使用的库 |
| `provided` | 是 | 是 | 否 | 运行容器提供的 API，如 Servlet API |
| `runtime` | 否 | 是 | 是 | 运行时实现或数据库驱动 |
| `test` | 否 | 是 | 否 | 测试框架与测试辅助库 |

`provided`、`test` 依赖不会继续传给下游项目。`provided` 仍要求运行环境确实提供相应库，否则运行时会缺少类。

## 版本冲突与统一管理

同一依赖出现多个版本时，在没有额外版本管理的情况下，Maven 选择距离当前项目最近的定义：

```text
application
├── library-a
│   └── common:1.0
└── library-b
    └── helper
        └── common:2.0
```

这里选择 `common:1.0`。距离相同时，先声明的路径优先；不要依靠调整声明顺序来长期控制版本。

### `dependencyManagement`

`dependencies` 引入依赖，`dependencyManagement` 提供管理配置。下面约束 `com.example:common` 使用 `2.0`：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.example</groupId>
      <artifactId>common</artifactId>
      <version>2.0</version>
    </dependency>
  </dependencies>
</dependencyManagement>
```

这会让前面传递引入的 `common` 使用 `2.0`，而不再按最近路径选择 `1.0`。如果代码直接使用它，可以在 `dependencies` 中省略已管理的版本：

```xml
<dependency>
  <groupId>com.example</groupId>
  <artifactId>common</artifactId>
</dependency>
```

只有管理配置、没有任何路径引入依赖时，它不会出现在项目中。多模块项目可把这些配置放进父 POM，详见 [多模块项目](./multi-module-builds.md#统一依赖与插件版本)。

### BOM

BOM（Bill of Materials，物料清单）集中管理一组依赖的版本，通过 `type=pom`、`scope=import` 导入 `dependencyManagement`。例如统一 JUnit 组件版本：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.junit</groupId>
      <artifactId>junit-bom</artifactId>
      <version>5.13.4</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

导入后，前面的 `junit-jupiter` 依赖可以省略 `version`。BOM 导入的是依赖管理条目，也可包含 scope 和排除配置；它不会自动引入库，也不会建立父 POM 继承关系。

### 查看最终版本与引入路径

```shell
mvn dependency:tree -Dverbose
mvn dependency:tree -Dincludes=org.slf4j
```

依赖树能说明版本从哪条路径引入、哪些版本被调解掉。标记为 omitted 的节点不表示多个版本的 JAR 都进入了类路径。需要确认管理配置时，再查看 `mvn help:effective-pom`。

## 排除不需要的传递依赖

使用方可以从一条依赖路径排除构件：

```xml
<dependency>
  <groupId>com.example</groupId>
  <artifactId>library-a</artifactId>
  <version>1.0.0</version>
  <exclusions>
    <exclusion>
      <groupId>com.example</groupId>
      <artifactId>legacy-logging</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

排除只针对这条路径，其他依赖仍可能引入同一构件。先用依赖树确认来源，并判断库是否真的不需要、是否有替代实现。

库作者则可在依赖中声明 `<optional>true</optional>`：当前项目仍能使用它，但下游需要自行声明才能获得。它与使用方配置 `exclusions` 的方向不同。

## 构件从哪里获取

本地仓库默认位于 `${user.home}/.m2/repository`，既缓存下载结果，也保存 `mvn install` 写入的产物。需要下载时，Maven 按有效配置访问远程仓库，例如 Maven Central 或公司的内部仓库。

项目依赖使用 `repositories`，构建插件使用 `pluginRepositories`。Central 已由默认配置提供，使用公共依赖通常无需重复声明仓库。

`1.4.0-SNAPSHOT` 表示开发中的可变版本，同一坐标可能随仓库更新解析到不同内容。正式 Release 版本发布后应保持不变，需要修改时发布新版本。

## `settings.xml` 与公司镜像

项目 POM 描述需要什么，`settings.xml` 描述机器如何访问仓库。用户配置位于 `${user.home}/.m2/settings.xml`，会与 `${maven.home}/conf/settings.xml` 合并，用户配置优先。

常见的公司仓库配置如下，地址和凭据由实际环境提供：

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0">
  <mirrors>
    <mirror>
      <id>company-mirror</id>
      <url>https://repo.example.com/maven-public</url>
      <mirrorOf>*</mirrorOf>
    </mirror>
  </mirrors>
  <servers>
    <server>
      <id>company-mirror</id>
      <username>${env.MAVEN_REPO_USERNAME}</username>
      <password>${env.MAVEN_REPO_PASSWORD}</password>
    </server>
  </servers>
</settings>
```

`mirrorOf=*` 用该镜像替代所有下载仓库；镜像中缺少构件时，Maven 不会自动绕过它访问 Central。`server.id` 匹配实际访问目标的 ID，所以访问镜像时填写镜像 ID。无需认证时可省略 `servers`。

依赖无法下载时，先核对坐标、镜像地址和认证 ID，再用 `mvn help:effective-settings` 查看生效配置。需要重试本地缺失的 Release 或检查 Snapshot 更新时，可执行 `mvn -U verify`，无需先删除整个本地仓库。

## 本地安装与远程发布

`mvn install` 把项目产物和 POM 写入本地仓库，供本机其他项目引用；`mvn deploy` 再上传到远程发布仓库。发布地址在 POM 的 `distributionManagement` 中配置：

```xml
<distributionManagement>
  <repository>
    <id>company-releases</id>
    <url>https://repo.example.com/maven-releases</url>
  </repository>
  <snapshotRepository>
    <id>company-snapshots</id>
    <url>https://repo.example.com/maven-snapshots</url>
  </snapshotRepository>
</distributionManagement>
```

发布凭据仍放在 `settings.xml` 的 `servers` 中，ID 分别匹配发布仓库的 ID。下载镜像不代替发布仓库；密码和令牌不要写进项目 POM 或提交到仓库。
