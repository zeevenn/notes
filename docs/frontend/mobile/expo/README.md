---
title: 从 React Native 到 Expo：快速实现跨平台开发
date: 2025-01-24
category:
  - expo
tag:
  - expo
  - full stack
  - react native
  - mobile
---

随着移动开发的需求日益增长，跨平台开发框架成为开发者的首选。其中，[React Native](https://reactnative.dev/) 和 [Expo](https://expo.dev/) 是两种备受关注的技术路线。这篇文章将从 React Native 的基础出发，探讨 Expo 的优势，并介绍如何搭建 Expo 项目、CI/CD 流程及开发体验。

---

## 为什么选择 Expo 而不是纯 React Native？

React Native 是一个基于 JavaScript 的开源框架，支持使用一套代码构建 iOS 和 Android 应用。Expo 则是围绕 React Native 构建的一套工具和服务，提供了一种更简便的开发体验。

### 核心对比

| 特性             | React Native CLI                       | Expo                                                  |
| ---------------- | -------------------------------------- | ----------------------------------------------------- |
| 学习曲线         | 较陡，需要配置 Xcode 或 Android Studio | 平缓，使用 Expo Go 即可快速启动                       |
| 项目启动速度     | 慢，需要较多依赖安装                   | 快，仅需 Node.js 和手机或模拟器                       |
| 社区支持和扩展性 | 强，自由配置                           | 强，但受限于 Expo 生态                                |
| 构建和打包       | 手动配置                               | 提供托管的打包服务                                    |
| 原生模块支持     | 灵活，但需要手动集成                   | 有限，但支持 EAS (Expo Application Services) 解决方案 |

### 适用场景

- **React Native CLI**：适合有移动开发经验或对原生模块有较高定制化需求的开发者。
- **Expo**：更适合快速构建 MVP（Minimum Viable Product）或移动开发新手。

## 如何搭建一个 Expo 项目

Expo 的上手非常简单，只需几步即可构建一个跨平台应用。

### 环境准备

1. 安装最新版本的 Node.js。
2. 安装 Expo CLI：
   ```bash
   npm install -g expo-cli
   ```
3. 确保设备上安装了 [Expo Go](https://expo.dev/go)。

### 创建项目

使用以下命令快速创建一个 Expo 项目：

```bash
npx create-expo-app@latest
```

> [!INFO]
> 可以使用 `--template` 参数选择模板。

创建项目后，进入项目目录并启动开发服务器：

```bash
cd my-app
expo start
```

此时，你可以通过 Expo Go 扫描 QR 码或使用模拟器查看应用效果。

![调试二维码](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20250124160026.png)

## CI/CD 流程

Expo 提供了托管服务 EAS，用于自动化构建、部署和发布。

### 配置 EAS CLI

1. 安装 EAS CLI：
   ```bash
   npm install -g eas-cli
   ```
2. 初始化 EAS：
   ```bash
   eas init
   ```
   这会生成一个 `eas.json` 文件，用于配置构建流程。

> [!NOTE]
> 如果你是 monorepo 项目，需要在 expo 项目目录下使用 `eas-cli` 来初始化 EAS。

### 配置构建

在 `eas.json` 中添加构建配置，例如：

```json
{
  "build": {
    "production": {
      "ios": {
        "distribution": "app-store"
      },
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 运行构建

构建 iOS 和 Android 应用：

```bash
eas build --platform all
```

完成后，你会收到构建链接，可以下载或分发应用。

可以在官网 dashboard 中查看构建进度。

![构建进度](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20250124164823.png)

### 配置 GitHub CI/CD

expo 提供了 [expo-github-action](https://github.com/expo/expo-github-action) 来配置 GitHub CI/CD。

> [!TIP]
> 更多配置请参考 [expo-github-action](https://github.com/expo/expo-github-action/tree/main/preview#create-previews-on-pull-requests)。

需要在 expo.dev 中生成一个 token，并配置到 GitHub 仓库的 secrets 中。

![expo token](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20250124170920.png)

下面是一份创建 Pull Request 预览的配置示例：

```yaml
name: PR Preview

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  eas-preview:
    runs-on: ubuntu-latest

    permissions:
      pull-requests: write

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20.10.0
          cache: yarn

      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: yarn install

      - name: Change env
        working-directory: ./apps/mobile
        run: |
          EXPO_PUBLIC_BASE_URL=http://${{ secrets.TEST_DEPLOY_HOST }}:${{ secrets.TEST_DEPLOY_PORT }}
          echo $EXPO_PUBLIC_BASE_URL
          echo "EXPO_PUBLIC_BASE_URL=$EXPO_PUBLIC_BASE_URL" >> .env

      - name: Trigger EAS Preview
        uses: expo/expo-github-action/preview@v8
        id: preview
        with:
          working-directory: ./apps/mobile
          command: eas update --auto --branch ${{ github.event.pull_request.head.ref }}
```

当每次 PR 时，会自动触发构建，并生成预览链接，可以使用 Expo Go 扫描二维码查看。

![expo-update](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20250124165038.png)

也可在 Expo go 中登录账号，直接查看对应项目的所有更新。

![expo go 查看更新](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/2025.01.24_16.53.07.jpg)

## 开发体验

Expo 不仅降低了入门门槛，还提供了一些提升开发效率的工具：

1. **实时刷新（Fast Refresh）**：代码修改后，应用会即时更新。
2. **丰富的 API 支持**：内置摄像头、位置、推送通知等常用功能。
3. **跨平台统一性**：一次编码，运行在 iOS 和 Android。
4. **调试工具**：支持使用 Chrome DevTools 或 VSCode 进行调试。
5. **EAS 构建**：支持自动构建和发布，方便管理。

### 注意事项

- **依赖管理**：某些原生模块需要 `eject`（脱离）到裸工作流。
- **性能优化**：对于复杂 UI 和高性能需求，可能需要优化图像处理和动画。

### 推荐库

- [react-native-paper](https://callstack.github.io/react-native-paper/)：基于 Material Design 的跨平台 UI 组件库。
- [react-native-vector-icons](https://oblador.github.io/react-native-vector-icons/)：icon 库
- [react-native-bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet)：功能强大的底部弹窗组件
- [react-native-svg](https://github.com/react-native-svg/react-native-svg)：集成 SVG 图标
- [formik](https://formik.org/docs/overview)：表单管理库
- [yup](https://github.com/jquense/yup)：数据验证库

## 总结

Expo 通过降低技术门槛和提供完善的工具链，使跨平台开发变得更加轻松。对于需要快速实现 MVP 或缺乏移动开发经验的开发者，Expo 是一个理想选择。

如果你正计划开发一个跨平台应用，不妨试试 Expo，享受快速启动、强大功能和简化的开发体验！
