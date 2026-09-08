---
title: Maven 排障方法
date: 2026-09-08
icon: bug
category:
  - java
tag:
  - maven
  - troubleshooting
---

Maven 问题通常来自四层：运行 Maven 的环境、合并后的有效配置、解析得到的依赖图，以及插件执行结果。按层检查能避免一开始就删除整个本地仓库或盲目追加版本覆盖。

## 先确认失败发生在哪一层

1. 用 `mvn -version` 确认实际使用的 Maven、Java 和 Maven home。
2. 确认当前目录中的 POM，以及是否从正确的聚合项目根目录执行。
3. 查看有效 POM、有效 settings 和激活的 profiles。
4. 查看依赖树，确认最终版本及引入路径。
5. 找到失败插件、目标和生命周期阶段，再读取该插件生成的报告。
6. 只有普通日志不足时，才增加异常堆栈或调试日志。

## 运行环境

```shell
mvn -version
```

输出同时显示 Maven 版本和运行 Maven 的 Java。IDE、终端和 CI 可能使用不同的 `JAVA_HOME` 或 Maven 安装，因此“机器已经安装 Java 17”不能证明当前构建正在使用它。

常见症状：

- `release version 17 not supported`：实际执行编译器的 JDK 低于 17。
- `UnsupportedClassVersionError`：运行时 JDK 低于该 class 文件的编译目标。
- 本地成功、CI 失败：Wrapper、JDK、profile、settings 或环境变量存在差异。

编译目标由 `maven.compiler.release` 控制；运行 Maven 和插件使用哪个 JDK，由启动环境或 Toolchains 控制。这是两个不同问题。

## 查看有效配置

```shell
mvn help:effective-pom
mvn help:effective-settings
mvn help:active-profiles
```

这些命令分别回答：

- 某个依赖或插件版本最终是什么。
- 哪个镜像、代理和本地仓库正在生效。
- 哪些 profile 被激活，以及它们来自哪里。

多模块项目应在具体模块目录执行 `help:effective-pom`，或使用 `-f path/to/pom.xml` 指定目标 POM。根项目的有效 POM 不能代表所有子模块。

## 定位依赖冲突

查看完整依赖树：

```shell
mvn dependency:tree -Dverbose
```

只查看相关组织或构件：

```shell
mvn dependency:tree -Dincludes=org.slf4j
```

处理冲突时按以下顺序判断：

1. 当前代码是否直接使用该构件；如果是，应直接声明。
2. 哪条路径引入了不需要的版本。
3. 版本差异是否二进制兼容，而不是只比较版本号大小。
4. 应通过直接依赖、BOM 或 `dependencyManagement` 统一版本，还是对特定路径使用 exclusion。

不要为了让依赖树“看起来只有一个版本”就排除所有重复项。Maven 的 omitted 节点表示调解结果，不等于额外 JAR 都进入了最终类路径。

## 依赖无法下载

典型错误包括 `Could not resolve artifact` 和 `Non-resolvable parent POM`。需要检查：

- 坐标和版本是否真实存在。
- Repository 或 mirror 的 URL 是否可达。
- `server` id 是否与仓库或镜像 id 匹配。
- 代理、TLS 证书和组织网络策略是否允许连接。
- Release 与 Snapshot 是否发布到了正确类型的仓库。
- 父 POM 的 `relativePath` 是否意外指向了错误文件。

强制 Maven 按更新策略重新检查远程仓库：

```shell
mvn -U verify
```

`-U` 主要用于需要刷新 Snapshot 或曾经缓存解析失败的场景，不应成为每次 CI 构建的默认参数。

如果本地只有某个坐标损坏，优先使用 Dependency Plugin 做局部清理：

```shell
mvn dependency:purge-local-repository \
  -DmanualInclude=com.example:problem-artifact \
  -DreResolve=true
```

删除整个 `${user.home}/.m2/repository` 会丢失所有缓存和本地安装但未发布的构件，通常会扩大问题范围。

## 测试失败

单元测试报告通常位于：

```text
target/surefire-reports/
```

集成测试报告通常位于：

```text
target/failsafe-reports/
```

如果控制台只显示汇总，应先查看报告中的首个失败、标准输出和 fork 进程信息。Failsafe 集成测试应通过 `mvn verify` 完整运行，避免跳过 `post-integration-test` 清理和 `verify` 结果检查。

常见跳过选项含义不同：

- `-DskipTests`：通常跳过测试执行，但仍编译测试代码。
- `-Dmaven.test.skip=true`：跳过测试代码的编译和执行。

跳过测试只适合隔离问题或特定流水线阶段，不是修复失败。

## 多模块构建失败

先确认 Reactor Summary 中第一个失败模块。上游模块失败后，下游常显示 `SKIPPED`，这些通常是结果而不是新的根因。

修复后可以从失败模块恢复：

```shell
./mvnw -rf :failed-module verify
```

如果失败模块需要本次构建中的上游产物，选择它并同时构建依赖：

```shell
./mvnw -pl :failed-module -am verify
```

## 增加诊断信息

```shell
mvn -e verify
```

`-e` 显示异常堆栈。仍无法判断时再使用：

```shell
mvn -X verify
```

`-X` 会产生大量调试信息，其中可能出现仓库地址、用户名、系统属性或 CI 环境细节。分享日志前应清理敏感内容。

## 一份可复用的排障记录

记录问题时至少保留：

- 可复现命令和执行目录。
- `mvn -version` 的结果。
- 首个失败模块、插件、目标和阶段。
- 相关的有效 POM 片段、依赖树或测试报告。
- 本地、IDE 和 CI 之间的环境差异。
- 已验证的假设，而不是只记录尝试过的命令。

## 参考资料

- [Maven CLI Options Reference](https://maven.apache.org/ref/current/maven-embedder/cli.html)
- [Apache Maven Help Plugin](https://maven.apache.org/plugins/maven-help-plugin/)
- [Apache Maven Dependency Plugin](https://maven.apache.org/plugins/maven-dependency-plugin/)
- [Maven Surefire FAQ](https://maven.apache.org/surefire/maven-surefire-plugin/faq.html)
