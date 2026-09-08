---
title: Maven 仓库与 settings.xml
date: 2026-09-08
icon: database
category:
  - java
tag:
  - maven
  - repository
---

Maven 仓库保存构件及其 POM、校验信息和其他元数据。项目 POM 描述需要哪些构件；`settings.xml` 描述当前机器如何访问仓库，例如镜像、代理和凭据。

## 本地仓库与远程仓库

Maven 仓库分为两类：

- 本地仓库默认位于 `${user.home}/.m2/repository`，缓存下载结果，也保存 `mvn install` 写入的本地产物。
- 远程仓库通过 HTTPS、文件路径等方式访问，可以是 Maven Central，也可以是组织内部的仓库管理器。

解析依赖时，Maven 先检查本地仓库；缺少构件或需要更新 Snapshot 元数据时，再按照有效配置访问远程仓库。下载完成后，后续构建可以复用本地文件。

本地仓库是带 Maven 元数据的缓存和构件存储，不应把它当作普通 JAR 目录手工增删。损坏或过期时应先定位到具体坐标，再做局部清理。

## settings.xml 的位置

Maven 可以读取两级配置：

```text
${maven.home}/conf/settings.xml   # Maven 安装级别
${user.home}/.m2/settings.xml     # 当前用户级别
```

用户配置会与全局配置合并。常见内容包括：

- `localRepository`：修改本地仓库位置。
- `mirrors`：把远程仓库请求重定向到镜像或内部仓库管理器。
- `servers`：保存仓库服务的认证信息。
- `proxies`：配置网络代理。
- `profiles`：提供机器或环境相关的仓库和属性。

查看合并后的配置：

```shell
mvn help:effective-settings
```

## 使用内部镜像

组织通常让所有依赖请求经过内部仓库管理器：

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
  <mirrors>
    <mirror>
      <id>company-mirror</id>
      <name>Company repository mirror</name>
      <url>https://repo.example.com/maven-public</url>
      <mirrorOf>*</mirrorOf>
    </mirror>
  </mirrors>
</settings>
```

`mirrorOf=*` 表示用该镜像处理所有远程仓库请求。镜像不是额外增加一个下载地址，而是替代匹配的仓库。内部服务必须代理项目需要的构件，否则 Maven 不会自动绕过它访问 Central。

## 凭据与 server id

发布私有构件或访问受保护仓库时，在 `settings.xml` 中配置 `server`：

```xml
<servers>
  <server>
    <id>company-releases</id>
    <username>${env.MAVEN_REPO_USERNAME}</username>
    <password>${env.MAVEN_REPO_PASSWORD}</password>
  </server>
</servers>
```

`id` 必须与 POM 中仓库、镜像或 `distributionManagement` 的对应 id 匹配。Maven 通过 id 关联地址和凭据。

不要把用户名、密码或访问令牌写进 `pom.xml` 并提交。CI 应通过秘密变量或受保护的 settings 文件注入凭据；开发机可以使用 Maven 的密码加密机制降低明文暴露风险。

## repositories 与 pluginRepositories

项目依赖从 `<repositories>` 解析，构建插件从 `<pluginRepositories>` 解析。二者用途不同。Central 已由 Super POM 提供，大多数公共项目不需要再次声明。

仓库地址写入项目 POM 会影响每个使用者的解析行为。组织统一镜像、代理和凭据更适合放进 `settings.xml`；只有构件确实不在通用仓库体系中，并且该位置属于项目可复现构建的一部分时，才考虑在 POM 声明额外仓库。

## Snapshot 与 Release

以 `-SNAPSHOT` 结尾的版本表示开发中的可变版本，例如：

```text
1.4.0-SNAPSHOT
```

远程仓库可以为同一 Snapshot 坐标保存带时间戳的构建。Maven 根据仓库更新策略检查新版本，因此相同 POM 在不同时间可能解析到不同内容。

Release 版本不带 `-SNAPSHOT`，发布后应保持不可变。覆盖已经发布的 Release 会破坏缓存一致性和构建可追溯性；需要变更时应发布新版本。

## install 与 deploy

```shell
mvn install
```

`install` 写入本地仓库，只影响当前机器。

```shell
mvn deploy
```

`deploy` 把项目 POM 和产物上传到 `distributionManagement` 指定的远程仓库：

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

地址属于项目发布约定，可以写在 POM；与这些 id 对应的秘密仍放在 `settings.xml`。

## 离线构建的边界

```shell
mvn --offline verify
```

离线模式只使用本地仓库。如果依赖、插件或元数据从未下载，构建会失败。一次在线构建成功不必然保证长期离线可复现：动态 Snapshot、版本范围和未固定的插件版本都会引入额外解析需求。

## 参考资料

- [Introduction to Repositories](https://maven.apache.org/guides/introduction/introduction-to-repositories.html)
- [Settings Reference](https://maven.apache.org/settings.html)
- [Password Encryption](https://maven.apache.org/guides/mini/guide-encryption.html)
- [POM Reference: Distribution Management](https://maven.apache.org/pom.html#distribution-management)
