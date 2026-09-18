---
title: 性能分析与调试工具
date: 2026-09-18
category:
  - 前端
  - React Native
tag:
  - React Native
---

# 性能分析与调试工具

定位性能问题需要把操作、时间范围和执行层对应起来。以“滚动列表后点击一行”为例，先区分滚动掉帧、点击事件延迟、React 计算过久，还是原生视图更新过慢。

## 观察层次与工具

| 问题 | 主要工具与证据 |
| --- | --- |
| 组件重复 render | React DevTools Components、Profiler，检查变化的 props 与提交 |
| JS 长任务 | JS 采样与时间线，沿调用栈找到同步工作 |
| 网络等待 | 请求时序、服务端请求 ID、缓存命中情况 |
| 原生 UI 或布局耗时 | Android Studio Profiler、系统 Trace、Xcode Instruments |
| JS 对象未释放 | JS 堆快照与引用链 |
| 图片、视频或原生资源增长 | 平台内存工具与进程内存 |

React Native DevTools 侧重 React 与 JS；Network 和 Performance 面板从 RN 0.83 起加入。原生代码、布局和资源问题仍需要平台工具。

## 捕获一次交互

固定设备、数据集和操作路径，捕获覆盖该交互的短时间线。根据长任务或提交的调用栈提出一个原因，改变一个主要因素，再用相同路径测量。

开发模式适合查更新来源，发布构建或可分析的近发布构建用于验证实际性能。比较时保持构建类型一致，避免大量日志改变测量结果。

60Hz 屏幕每帧约 16.7ms，120Hz 约 8.3ms。这是相关显示路径的时间约束，不是每个函数都能独占的预算。React render 的耗时也不包含后续全部布局、挂载和绘制。

## 列表与动画

滚动卡顿时检查行组件、图片、布局与渲染窗口；滚动流畅而新行填充或点击反馈迟缓时，检查 JS 时间线。两种瓶颈可能同时存在。

用 Profiler 确认无关行是否重复 render，再考虑稳定记录引用、回调和 `memo`。稳定 `key` 负责项目身份，不会自动阻止组件重新计算。

[FlatList 窗口和批次参数](https://reactnative.dev/docs/optimizing-flatlist-configuration/)需要同时比较填充空白、交互延迟与内存。固定行高时才使用匹配实际尺寸的 `getItemLayout`；字体放大或展开行使尺寸变化后，错误的偏移会破坏定位。

连续动画应检查每帧是否依赖业务 JS，以及是否反复触发整页状态更新。原生驱动或靠近 UI 的动画运行时可以减少部分 JS 依赖，但不能消除复杂布局和绘制成本。可选库见[界面与交互方案](./solutions-and-tools.md#界面与交互)。

## 启动与内存

启动分别记录运行时初始化、JS 加载与模块求值、首屏挂载、首批数据可用的时间。冷启动、后台恢复与不同缓存条件分开比较。将初始化延后时，还要测量首次访问该功能的等待；引擎与字节码机制见 [Hermes](./hermes.md)。

重复执行“进入详情 → 加载资源 → 返回”，观察多轮后的稳定内存。JS 堆快照关注监听器、闭包和缓存的引用链；平台工具检查图片、媒体与原生对象。返回后没有立即释放全部内存不一定是泄漏，应结合持续增长和对象持有关系判断。

记录设备、系统、RN / Expo SDK、构建模式和数据规模。比较耗时分布与长帧位置，并检查改动是否把成本转移到内存、首屏或首次交互。

## 参考资料

- [React Native DevTools](https://reactnative.dev/docs/react-native-devtools)
- [性能概览](https://reactnative.dev/docs/performance)
- [原生调试](https://reactnative.dev/docs/debugging-native-code)
- [FlatList 配置](https://reactnative.dev/docs/optimizing-flatlist-configuration/)
- [JS 加载优化](https://reactnative.dev/docs/optimizing-javascript-loading)
