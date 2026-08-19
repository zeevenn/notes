---
title: Expo 应用开发工作流
date: 2025-01-24
article: false
category:
  - expo
tag:
  - expo
  - react native
  - mobile
---

# Expo 应用开发工作流

Expo 是围绕 React Native 提供的框架和工具链，不是另一套跨平台渲染框架。应用仍由 React Native 运行，Expo 负责项目初始化、原生配置、开发客户端、构建、提交和增量更新等环节。

## 创建并运行项目

新项目使用项目级 CLI，不需要全局安装旧的 `expo-cli`：

```bash
npx create-expo-app@latest my-app
cd my-app
npx expo start
```

开发服务器启动后，可以使用 Expo Go、Android Emulator、iOS Simulator 或 development build 打开应用。物理设备无法通过局域网连接时，可以临时使用隧道：

```bash
npx expo start --tunnel
```

隧道会增加加载和刷新延迟，能够使用局域网连接时不需要开启。

安装 Expo SDK 或 React Native 相关依赖时优先使用：

```bash
npx expo install <package-name>
```

`expo install` 会根据当前 Expo SDK 选择兼容版本；普通的 JavaScript 工具包仍可使用 npm、pnpm、Yarn 或 Bun 安装。

## 选择运行环境

| 环境 | 原生代码 | 主要用途 |
| --- | --- | --- |
| Expo Go | 固定，不能加入未内置的原生模块 | 学习 React Native、验证界面和短期原型 |
| Development build | 由当前项目编译，可包含自定义原生模块和原生配置 | 日常项目开发、设备调试和团队预览 |
| Preview / production build | 按发布配置编译，不包含开发工具 | 测试分发、应用商店审核和正式发布 |

Expo Go 是预先编译好的原生应用。JavaScript 代码只能调用其中已经包含的原生模块，因此不能验证自定义原生模块、正式应用图标、Universal Links 或完整的远程推送配置。需要这些能力时应创建 development build，而不是使用旧工作流中的“eject”。

## Development build

安装开发客户端：

```bash
npx expo install expo-dev-client
```

本地已经配置 Android Studio 或 Xcode 时，可以直接编译并安装：

```bash
npx expo run:android
npx expo run:ios
```

如果 `android/` 或 `ios/` 目录不存在，`expo run` 和 EAS Build 会先执行 Prebuild，根据 app config 和 config plugin 生成原生项目。这种按需生成原生目录的方式称为 Continuous Native Generation（CNG，持续原生生成）。

手动执行生成命令：

```bash
npx expo prebuild
```

采用 CNG 时，应用名称、权限、图标和原生库配置应尽量保存在 `app.json`、`app.config.ts` 和 config plugin 中。直接修改生成后的 Xcode 或 Gradle 文件，随后重新生成原生目录时可能丢失改动。

## EAS Build

EAS Build 是 Expo Application Services（EAS）中的托管构建服务，用于编译和签名 Android、iOS 应用。它不是使用 Expo 框架的前置条件；具备本地原生工具链时也可以在本机完成构建。

安装 EAS CLI 并登录：

```bash
npm install --global eas-cli
eas login
eas whoami
```

初始化构建配置：

```bash
eas build:configure
```

该命令在应用根目录创建 `eas.json`。默认配置通常区分三类 profile：

- `development`：包含 `expo-dev-client`，用于开发调试。
- `preview`：用于内部测试和评审。
- `production`：用于应用商店发布。

执行构建：

```bash
eas build --profile development --platform android
eas build --profile preview --platform all
eas build --profile production --platform all
```

Android 和 iOS 的签名凭据需要分别管理。构建应用商店版本还需要对应的 Google Play 或 Apple Developer 账号；完成构建不等于已经提交到商店。

在 monorepo 中，应从 Expo 应用目录执行 EAS CLI，并把该应用的 `eas.json`、app config 和凭据配置放在同一应用根目录。

## EAS Update 与原生构建的边界

EAS Update 可以发布 JavaScript、样式和静态资源更新，但不能替换已经编译进应用的原生代码。安装或升级原生依赖、修改权限、变更 config plugin 或升级影响原生运行时的 Expo SDK 后，必须重新构建应用。

首次启用更新：

```bash
eas update:configure
```

创建与目标 channel 关联的 build 后，再发布更新：

```bash
eas update \
  --channel preview \
  --message "Fix login validation" \
  --environment preview
```

Expo SDK 55 及更高版本要求通过 `--environment` 指定 EAS 环境变量集合。更新只会发送给 channel 和 `runtimeVersion` 都兼容的 build。默认的 `appVersion` policy 会根据应用版本确定 runtime version；原生层发生变化时仍需生成新 build。

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

## CI 中的凭据和预览

CI 可以调用 EAS CLI、EAS Workflows 或 `expo/expo-github-action`。自动化配置需要满足以下约束：

- Expo access token 放在 CI Secret 中，不写入仓库或日志。
- 来自外部 fork 的 Pull Request 默认不应获得发布凭据。
- monorepo job 的工作目录指向 Expo 应用根目录。
- 构建与 Update 使用明确的 profile、channel 和 environment，避免把预览更新发布到生产 channel。
- action 和运行时版本应固定到经过验证的主版本，并定期升级。

## 参考资料

- [Expo 开发工作流](https://docs.expo.dev/workflow/overview/)
- [创建 Expo 应用](https://docs.expo.dev/tutorial/create-your-first-app/)
- [Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/setup/)
- [EAS Update](https://docs.expo.dev/eas-update/getting-started/)
- [Runtime versions](https://docs.expo.dev/eas-update/runtime-versions/)
- [Monorepo 中使用 EAS Build](https://docs.expo.dev/build-reference/build-with-monorepos/)
