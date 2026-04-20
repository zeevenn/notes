---
title: 初始化项目
date: 2024-05-09
icon: STARTUP
category:
  - Project
tag:
  - imperial-kitchen
  - 系统设计
---

## 技术方案选型

### Flutter vs React Native

目前，[Flutter](https://flutter.dev/) 和 [React Native](https://reactnative.dev/) 是最流行的跨端解决方案。

考虑到 Flutter 使用 `dart` 语言，而 React Native 使用 `js`，学习成本相对而言较少，因此决定使用 React Native。

- [Flutter vs. React Native – Which is Better for Your Project in 2024?](https://www.thedroidsonroids.com/blog/flutter-vs-react-native-comparison)
- [4 Most Popular Cross-Platform App Development Frameworks for 2024](https://www.thedroidsonroids.com/blog/top-cross-platform-app-development-frameworks)

### Expo Go vs React Native CLI

如果您是移动开发的新手，最简单的入门方法就是使用 Expo Go。Expo 是一套围绕 React Native 构建的工具和服务，虽然它有很多功能，但目前与我们最相关的功能是它能让你在几分钟内编写出一个 React Native 应用程序。您只需要一个最新版本的 Node.js 和一部手机或模拟器。

如果你已经熟悉移动开发，你可能想使用 React Native CLI。它需要 Xcode 或 Android Studio 才能开始使用。如果你已经安装了这些工具之一，应该可以在几分钟内开始运行。如果没有安装这些工具，则需要花费大约一个小时进行安装和配置。

考虑到快速实现一个 MVP，最终选择了 Expo。

### Next or Node

最初，考虑使用 Expo 与 Next.js 结合的方案来实现前后端不分离的全栈项目。然而，[Expo 官方](https://docs.expo.dev/guides/using-nextjs/) 提到 Next.js 只能用于 Expo for Web，无法实现跨端需求。

因此确定使用 Expo + Node.js + Monorepo 的方案，这样可以使得项目结构更加清晰，便于管理和维护。

::: warning

Deprecated. 已改用 nest.js 框架。

:::

## Monorepo 搭建

最初使用 `pnpm` workspaces 搭建 Monorepo 项目，然而安装依赖后启动报错：

- [Pnpm not working with Expo](https://github.com/expo/expo/issues/22413)
- [[bug] - Pnpm not working with expo](https://github.com/pnpm/pnpm/issues/4286)

查询到上述两个 issue 后，在目录中添加 `.npmrc` 文件后重新安装依赖项目启动成功。

```
node-linker=hoisted
```

考虑到可能还会遇到其他兼容问题，最终选择官方推荐的 `yarn 1.x` workspaces。

目录结构设计如下：

```sh
- apps
  - mobile
  - server
- packages
  - types
- package.json
```

### init mobile

以下按照 [Work with monorepos](https://docs.expo.dev/guides/monorepos/) 搭建项目。

在 imperial-kitchen 文件夹中 使用以下命令初始化 `expo` 项目

```sh
npx create-expo-app apps/mobile
```

::: warning

使用 expo router，必须添加环境变量：`EXPO_USE_METRO_WORKSPACE_ROOT=1`

:::

### init server

后端服务选择使用原生 `node` 开发，详见 [服务器架构设计](./02-server.md)。

### 配置 lint

配置 `eslint`、`prettier`、`commitlint` 和 `husky`。
