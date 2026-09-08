---
title: Maven 依赖管理
date: 2026-09-08
icon: network-wired
category:
  - java
tag:
  - maven
  - dependency
---

Maven 根据 POM 中声明的依赖构造依赖图，再为编译、测试和运行阶段计算不同的类路径。理解依赖图比记住几个 XML 节点更重要：一个直接依赖可能继续引入多层传递依赖，而 scope、排除和版本调解会改变最终结果。

## 直接依赖与传递依赖

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

当前项目显式声明的是直接依赖。如果这个构件还依赖其他构件，Maven 会继续读取它们的 POM，并将符合条件的构件作为传递依赖加入依赖图。

代码直接使用的库应显式声明。不要因为某个库当前被其他依赖传递引入，就把它当作稳定的直接依赖；上游删除或调整依赖后，项目的编译结果会随之改变。

查看实际依赖树：

```shell
mvn dependency:tree
```

限定到某个坐标：

```shell
mvn dependency:tree -Dincludes=org.slf4j
```

## 依赖调解

同一个 `groupId:artifactId` 出现多个版本时，Maven 需要选出一个版本。

### 最近定义优先

```text
application
├── library-a
│   └── common:1.0
└── library-b
    └── helper
        └── common:2.0
```

`common:1.0` 距离根项目更近，因此被选中。

### 同深度时先声明优先

```text
application
├── library-a -> common:1.0
└── library-b -> common:2.0
```

两个版本深度相同时，先在当前 POM 中声明的直接依赖所在路径获胜。这是依赖声明顺序造成的结果，不适合作为长期版本管理方案。

项目需要确定版本时，应在根项目显式声明该依赖，或通过 `dependencyManagement` 统一约束版本。

## dependency scope

依赖范围（scope）决定依赖出现在哪些类路径中，以及是否继续传递给下游项目。

| scope | 主代码编译 | 测试 | 运行 | 传递给下游 | 常见用途 |
| --- | --- | --- | --- | --- | --- |
| `compile` | 是 | 是 | 是 | 是 | 默认范围，主代码直接使用的库 |
| `provided` | 是 | 是 | 否 | 否 | 运行容器或 JDK 提供的 API |
| `runtime` | 否 | 是 | 是 | 是 | 只在运行时需要的实现或驱动 |
| `test` | 否 | 是 | 否 | 否 | 测试框架和测试辅助库 |
| `system` | 是 | 是 | 否 | 否 | 直接引用本机文件，通常应避免 |
| `import` | 不适用 | 不适用 | 不适用 | 不适用 | 仅在 `dependencyManagement` 中导入 BOM |

`provided` 不等于“可选”。它表示编译时需要，但预期运行环境会提供。例如 Servlet API 可能由 Web 容器提供。如果实际运行环境没有该依赖，应用仍会在运行时失败。

`system` 依赖通过绝对或机器相关路径引用 JAR，会破坏可移植性和仓库解析流程。更合理的做法是将构件发布到内部仓库。

## optional 与 exclusions

库作者可以把某项功能对应的依赖声明为可选：

```xml
<dependency>
  <groupId>com.example</groupId>
  <artifactId>optional-driver</artifactId>
  <version>1.0.0</version>
  <optional>true</optional>
</dependency>
```

当前项目仍可使用这个依赖，但依赖当前项目的下游不会自动获得它。下游需要该功能时必须再次显式声明。

使用方可以从某条依赖路径排除不需要或冲突的传递依赖：

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

排除针对一条具体依赖路径生效。如果另一路径也引入同一构件，它仍可能出现在依赖树中。排除前应先用 `dependency:tree` 找到来源，并确认替代实现或运行环境确实不需要它。

## dependencies 与 dependencyManagement

`dependencies` 会把依赖加入当前项目。

`dependencyManagement` 只提供默认的版本、scope 和排除配置，不会单独把依赖加入项目：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.example</groupId>
      <artifactId>shared-api</artifactId>
      <version>2.4.0</version>
    </dependency>
  </dependencies>
</dependencyManagement>
```

子模块仍需声明使用它：

```xml
<dependency>
  <groupId>com.example</groupId>
  <artifactId>shared-api</artifactId>
</dependency>
```

此时版本来自有效 POM 中的 `dependencyManagement`。这种方式让多个模块使用同一版本，同时保留“模块实际用了哪些依赖”的清晰记录。

## 导入 BOM

BOM（Bill of Materials，物料清单）是 `packaging=pom` 的构件，集中提供一组相互兼容的依赖版本。它通过 `import` scope 导入：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.example.platform</groupId>
      <artifactId>example-bom</artifactId>
      <version>3.2.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

BOM 只管理依赖版本，不会建立 POM 继承关系，也不会自动引入其中列出的库。一个 POM 只能有一个 `<parent>`，但可以导入多个 BOM。多个 BOM 管理同一坐标时会产生顺序和覆盖问题，项目应避免依赖隐含顺序，并用有效 POM 验证最终版本。

## 分析依赖声明

```shell
mvn dependency:analyze
```

该目标可以报告常见问题：

- 代码直接使用了某个传递依赖，但 POM 没有直接声明。
- POM 声明了依赖，但分析阶段没有发现代码使用。

分析基于字节码，反射、服务加载和框架配置可能让“未使用”成为误报。结论需要结合实际加载方式判断，不能机械删除依赖。

## 参考资料

- [Introduction to the Dependency Mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
- [Optional Dependencies and Dependency Exclusions](https://maven.apache.org/guides/introduction/introduction-to-optional-and-excludes-dependencies.html)
- [Apache Maven Dependency Plugin](https://maven.apache.org/plugins/maven-dependency-plugin/)
