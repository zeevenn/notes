---
title: 小程序与 React Native 的运行模型对比
date: 2026-09-18
category:
  - 前端
  - 跨端开发
tag:
  - 跨端开发
---

# 小程序与 React Native 的运行模型对比

微信小程序和 React Native 都允许用 JavaScript 编写业务，但运行容器、界面目标和通信机制不同。比较时先区分传统 WebView 小程序、Skyline 小程序与 React Native 的新旧架构。

## 同一次点击经过的路径

传统 WebView 小程序中，视图层接收点击，经微信客户端把事件发往逻辑层。业务调用 `setData` 后，数据更新再传回视图层，框架更新界面。

React Native 中，原生视图产生事件，JS 处理函数更新 React state；React 与渲染器计算变化，再将视图操作应用到原生 UI。旧架构主要经过 Bridge 消息路径，新架构由 JSI、Fabric 等机制协作。

两者都是“事件触发业务更新，业务更新驱动界面”，但 `setData` 和 React state setter 的状态语义、调度与渲染过程并不相同。

## 层与线程不能一一对应

小程序“逻辑层 / 渲染层”首先是职责和执行环境划分。传统渲染层内部有 WebView 的框架 JS、布局与绘制等工作，还可能涉及多个线程和多个页面环境。

React Native 的 UI Thread 是平台主线程，是执行位置概念；它不等于小程序渲染层这个完整子系统。Fabric 的部分渲染工作也会在 UI 线程之外执行。

| 维度 | 传统 WebView 小程序 | React Native 新架构 |
| --- | --- | --- |
| 宿主 | 微信客户端提供受控环境 | 自身 Android / iOS 原生应用 |
| 业务逻辑 | AppService 中的小程序脚本 | JS 引擎中的应用与 React 代码 |
| 界面描述 | WXML、WXSS、组件数据 | React 组件、props、state、style |
| 更新入口 | `setData` 等数据更新 API | React 状态更新与渲染器 |
| 跨层机制 | 宿主中转事件与数据同步 | JSI 基础上的模块和渲染交互 |
| 主要界面目标 | WebView 渲染并结合原生组件 | 平台原生视图及相应渲染能力 |
| 自定义原生扩展 | 受微信开放能力约束 | 可通过模块与组件接入原生代码 |

## Skyline 需要单独考虑

Skyline 改变了小程序的渲染后端与框架执行安排，使用专门的渲染线程，并调整原先跨 WebView 的框架通信路径。因此“所有小程序都用 WebView，通过相同桥接传数据”已经不适合作为统一解释。

Skyline 与 React Native 都可以把部分高频交互放在靠近渲染的一侧，但它们的组件系统、运行时契约和扩展方式仍不相同。

## 性能诊断可以共享思路

都可以沿着输入、业务计算、跨边界交互、布局、绘制来查找延迟；也都需要控制高频更新、大列表和资源规模。

具体措施必须回到实现：小程序重点分析 `setData` 与组件更新范围，RN 则还要区分 React render、Fabric 挂载、原生模块调用和动画执行位置。不能看到卡顿就统一归因于“JS 与 UI 通信慢”。

相关专题：[小程序双线程](./wechat-miniprogram/dual-thread.md)、[Skyline](./wechat-miniprogram/renderers.md)、[RN 整体架构与线程模型](./react-native/architecture-overview.md)。

## 参考资料

- [小程序宿主环境](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/framework.html)
- [Skyline 架构](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html)
- [React Native 线程模型](https://reactnative.dev/architecture/threading-model)
- [Fabric](https://reactnative.dev/architecture/fabric-renderer)
