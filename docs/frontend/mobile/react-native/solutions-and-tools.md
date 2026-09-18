---
title: React Native 常见方案与工具
date: 2026-09-18
category:
  - 前端
  - React Native
tag:
  - React Native
---

# React Native 常见方案与工具

## 数据与存储

| 需求 | 方案 | 说明 |
| --- | --- | --- |
| 查询缓存、分页与刷新 | [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) | 管理服务端数据；RN 的联网、应用前台与页面焦点需按[接入说明](https://github.com/TanStack/query/blob/main/docs/framework/react/react-native.md)联动 |
| 设置与普通缓存 | [AsyncStorage](https://github.com/react-native-async-storage/async-storage) | 异步持久化键值存储，数据不加密 |
| 凭证存储 | [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) | 使用平台安全存储，适合 token 等少量敏感数据 |

## 界面与交互

| 需求 | 方案 | 说明 |
| --- | --- | --- |
| 长列表 | [FlashList](https://shopify.github.io/flash-list/docs/) | 复用列表项视图；[v2 要求 RN 新架构](https://shopify.github.io/flash-list/docs/v2-migration/) |
| 表单状态与校验 | [React Hook Form](https://github.com/react-hook-form/react-hook-form) | 通过 `Controller` / `useController` 对接 RN 受控输入组件 |
| 键盘避让与跟随动画 | [Keyboard Controller](https://kirillzyusko.github.io/react-native-keyboard-controller/) | 提供键盘状态、动画与输入区域适配能力 |
| 手势识别与连续动画 | [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)、[Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) | 分别处理手势与动画；按主版本配置原生依赖和 Worklets |
| 安全区 | [react-native-safe-area-context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/) | 处理系统栏、刘海与底部手势区域 |

页面导航见 [Expo Router](https://docs.expo.dev/router/basics/navigation/)；页面显示期间的订阅使用 [useFocusEffect](https://reactnavigation.org/docs/use-focus-effect/)，应用前后台变化使用 [AppState](https://reactnative.dev/docs/appstate)。

## 平台能力与构建

- [Expo SDK](https://docs.expo.dev/versions/latest/)：按相机、图片选择、文件系统、通知等能力查找模块。
- [React Native Directory](https://reactnative.directory/)：查找社区库并核对目标平台、Expo Go 与架构兼容信息。
- [Expo 应用开发工作流](../expo/README.md)：development build、原生配置、EAS Build 与更新发布。

Expo 项目使用 `npx expo install <package>` 安装兼容依赖；新增或修改原生代码、配置后重新构建应用。
