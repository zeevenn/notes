---
title: yeoman 基础使用
date: 2024-01-09
icon: yeoman
category:
  - 工程化
tag:
  - frontend
  - cli
  - yeoman
  - deprecated
---

::: warning

`yo@5.0.0` 引入了一个破坏性的更新，会导致 [instantiatedGenerator.run is not a function](https://github.com/yeoman/generator-generator/issues/258)，需要降级到 `@4.x`。

降级后仍有报错，可能是 `generator-node` 的问题，不再推荐使用。

:::

Yeoman 是一个通用的脚手架系统，允许创建任何类型的应用程序。它可以快速启动新项目，并简化现有项目的维护工作。

Yeoman 与语言无关。它可以生成任何语言（Web、Java、Python、C# 等）的项目。

Yeoman 本身不做任何决定。所有决定都由生成器做出，而生成器基本上就是 Yeoman 环境中的插件。有很多公开可用的生成器，创建一个新的生成器来匹配任何工作流程也很容易。Yeoman 始终是满足脚手架需求的正确选择。

以下是一些常见的使用案例：

- 快速创建新项目
- 创建项目的新部分，如带有单元测试的新控制器
- 创建模块或软件包
- 引导新服务
- 执行标准、最佳实践和风格指南
- 通过让用户使用示例应用程序来推广新项目
- ...

## 开始

`yo` 是一款 Yeoman 命令行实用程序，允许使用脚手架模板（简称为生成器）创建项目。使用 npm 安装 `yo` 和生成器：

```shell
npm install -g yo
```

然后可以安装一些生成器：

::: info

可以在 [生成器](https://yeoman.io/generators/) 中搜索想要的生成器。

:::

```shell
npm install -g generator-node
```

## 基本脚手架

搭建基本脚手架，只需要去除生成器前缀 `generator-`：

```shell
yo node
```

大多数生成器会提出一系列问题来定制新项目。要查看哪些选项可用，请使用 `help` 命令：

```shell
yo node --help
```

很多生成器都依赖于构建系统（如 Grunt 或 Gulp）和软件包管理器（如 npm 和 Bower）。请务必访问生成器的网站，了解运行和维护新应用程序的相关信息。运行以下命令即可轻松访问生成器的主页：

```shell
npm home generator-node
```

为复杂框架搭建脚手架的生成器可能会提供额外的生成器，为项目的较小部分搭建脚手架。这些生成器通常被称为子生成器，访问方式为 `generator:sub-generator`。

以 `generator-node` 为例。一旦生成了完整的 node 应用程序，就可以添加其他功能。要在项目中添加新控制器，请运行控制器子生成器：

```shell
yo node:cli
```

## 其他 yo 命令

除了上一节介绍的基础知识，`yo` 还是一个完全交互式的工具。只需在终端键入 `yo`，就能看到一系列选项，用于管理与生成器有关的一切：运行、更新、安装、帮助和其他实用程序。

`yo` 还提供以下命令。

- `yo --help` 访问完整的帮助界面
- `yo --generators` 列出所有已安装的生成器
- `yo --version` 获取版本

## 故障排除

大多数问题都可以通过运行：

```shell
yo doctor
```

`doctor` 命令将诊断并提供解决最常见问题的步骤。
