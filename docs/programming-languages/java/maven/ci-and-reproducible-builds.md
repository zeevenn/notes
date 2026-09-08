---
title: Maven CI 与可复现构建
date: 2026-09-08
icon: robot
category:
  - java
tag:
  - maven
  - ci
  - reproducible-builds
---

稳定的 Maven 构建需要固定输入边界：源码、Maven 和 JDK 版本、依赖与插件版本、构建参数，以及发布时使用的仓库和凭据。CI 的作用不只是重新执行一条命令，还要让这些边界可见并可重复。

## 固定 Maven 版本

把 Maven Wrapper 文件提交到版本控制：

```text
mvnw
mvnw.cmd
.mvn/wrapper/maven-wrapper.properties
```

本地和 CI 都运行：

```shell
./mvnw -B --no-transfer-progress clean verify
```

- `-B` 或 `--batch-mode` 禁用交互式输入，适合 CI。
- `--no-transfer-progress` 隐藏重复的下载进度，但保留构建日志。
- `clean verify` 从干净输出开始，执行到集成测试和质量校验。

Wrapper 固定 Maven，不固定 JDK。CI 镜像或 runner 仍需明确选择 Java 17。

## 固定 JDK 与编译目标

三层配置解决不同问题：

| 配置 | 控制对象 |
| --- | --- |
| CI 使用的 Java 发行版和版本 | 运行 Maven 及其插件的 JDK |
| Maven Toolchains | 支持的插件实际调用的 JDK 工具 |
| `maven.compiler.release` | Java 源码、标准库 API 和 class 文件目标版本 |

项目只需要一个 JDK 时，CI 环境与 `maven.compiler.release=17` 保持一致最容易理解。需要用一个 JDK 运行 Maven、另一个 JDK 编译或测试时，再引入 Toolchains，并在 `${user.home}/.m2/toolchains.xml` 描述机器上的 JDK 安装。

Enforcer 可以在 `validate` 阶段尽早拒绝不支持的环境：

```xml
<requireMavenVersion>
  <version>[3.9,4.0)</version>
</requireMavenVersion>
<requireJavaVersion>
  <version>[17,18)</version>
</requireJavaVersion>
```

## 固定依赖与插件版本

依赖版本应由当前 POM、父 POM 或导入的 BOM 明确管理。发布构建应避免依赖版本范围和可变 Snapshot，因为同一份源码可能在不同时间解析到不同内容。

构建插件也会改变产物，必须管理版本。父 POM 的 `pluginManagement` 适合集中固定编译、测试、资源处理、打包、安装和部署插件的版本。只固定业务依赖而依赖 Super POM 中随 Maven 版本变化的插件默认值，仍然不能形成稳定构建计划。

查看实际插件和依赖配置：

```shell
./mvnw help:effective-pom
./mvnw dependency:tree
```

## 生成可复现产物

可复现构建要求相同源码、构建环境和构建指令生成逐字节一致的指定产物。Maven 3 项目可以在 POM 中设置固定输出时间戳：

```xml
<properties>
  <project.build.outputTimestamp>2026-09-08T00:00:00Z</project.build.outputTimestamp>
</properties>
```

支持该属性的归档插件会使用这个时间，而不是把每次构建的当前时间写进 JAR 或 ZIP 条目。它只能解决一部分时间差异；文件顺序、换行符、生成器版本、用户名和绝对路径等环境信息仍可能影响输出。

官方 Artifact Plugin 可以检查构建计划中的插件支持情况，并比较两次构建的产物：

```shell
./mvnw artifact:check-buildplan
./mvnw clean install
./mvnw clean verify artifact:compare
```

本机重复构建一致只能发现基础问题。真正验证可复现性还需要在独立目录或不同环境中重新构建。

## 缓存边界

CI 通常缓存 Maven 本地仓库以减少网络下载。缓存应被视为性能优化，而不是构建输入的唯一来源：

- 缓存 `${user.home}/.m2/repository`，不要跨任务复用项目的 `target`。
- 缓存键至少应考虑操作系统、架构、JDK 主版本和 POM 变化。
- 不要缓存或上传包含凭据的整个 `${user.home}/.m2`。
- Release 构件应不可变；频繁变化的 Snapshot 会降低缓存可预测性。
- 定期验证空缓存下仍能从声明的仓库完成构建。

即使缓存命中，也应执行项目测试和质量阶段，不能把缓存的旧产物当成本次源码的验证结果。

## 凭据与日志

发布步骤所需的用户名、令牌和签名材料应由 CI 的秘密管理功能注入。`settings.xml` 可以引用环境变量，但生成的文件和调试日志都需要控制访问权限。

建议把验证和发布分开：

```text
提交或合并请求 -> clean verify -> 保存测试报告
受保护的发布事件 -> deploy -> 保存构件与发布记录
```

普通分支不应拥有发布仓库的写权限。执行 `mvn -X` 或打印有效 settings 时，也应避免把认证信息带入公开日志。

## 参考资料

- [Maven Wrapper](https://maven.apache.org/tools/wrapper/)
- [Configuring for Reproducible Builds](https://maven.apache.org/guides/mini/guide-reproducible-builds.html)
- [Guide to Using Toolchains](https://maven.apache.org/guides/mini/guide-using-toolchains.html)
- [Maven Enforcer Plugin](https://maven.apache.org/enforcer/maven-enforcer-plugin/)
- [Maven Releases History](https://maven.apache.org/docs/history.html)
