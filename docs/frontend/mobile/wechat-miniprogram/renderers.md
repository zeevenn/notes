---
title: WebView 与 Skyline 渲染架构
date: 2026-09-18
category:
  - 前端
  - 微信小程序
tag:
  - 微信小程序
---

WebView 和 Skyline 是微信小程序的两种页面渲染方式。两者都使用 WXML 描述页面结构、WXSS 描述样式，但执行模板更新、布局和绘制的方式不同。

## WebView 中的渲染工作

在[双线程模型](./dual-thread.md)中，AppService 执行业务脚本，WebView 承担页面渲染。WebView 是微信客户端内嵌的网页渲染组件，需要处理页面结构、样式计算、布局、绘制与合成。

业务脚本虽然已移到独立的逻辑层，WebView 中仍有组件框架的 JavaScript，用于处理模板和数据更新。这些脚本会与部分渲染工作竞争执行时间；把业务代码分离出去，并没有消除渲染层内部的所有阻塞。

## Skyline 如何重新分配工作

Skyline 不再让每个页面依赖一个 WebView 执行环境，而是将原来的工作拆开：

- 在 AppService 内创建独立的执行上下文，即与业务代码隔离的 JavaScript 环境，承接原先由 WebView 执行的部分框架代码和页面结构管理。
- 使用专门的渲染线程，负责布局、绘制和合成等工作。

这样可以减少为页面创建 WebView 及其 JS 引擎实例的开销，让页面共享更多资源。原先分布在 AppService 和 WebView 中的部分框架代码也不再需要通过 JSBridge 交换数据；JSBridge 指 JS 环境与微信原生实现之间的通信机制。

## 手势动画与 worklet

拖动元素时，手指位置不断变化。如果每次都把事件传到逻辑层，计算新位置后再传回渲染侧，跨线程往返就会增加跟手动画的延迟。

Skyline 提供 **worklet** 机制：开发者声明的函数经过编译处理后，可以在 UI 线程执行手势与动画逻辑，减少每次交互都返回业务逻辑层计算的需要。worklet 对可调用函数和跨线程数据有自己的规则，具体接口见[官方 worklet 文档](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/worklet.html)。

## 页面切换到 Skyline 后要适配什么

页面和组件 API 大体延续原有用法，但 Skyline 对 WXSS 和基础组件有不同的支持范围。迁移时应先确认页面依赖的布局、滚动、选择器查询和动画能力，再对照官方差异说明调整。

官方接入配置使用 `renderer: "skyline"` 选择渲染器，并配合 `componentFramework: "glass-easel"`。glass-easel 是管理组件和数据更新的框架，与负责布局、绘制的 Skyline 分工不同。

客户端兼容和灰度配置可能影响实际使用的渲染器。页面或组件的 `this.renderer`、开发调试菜单及路由日志可以用于确认当前模式；配置方法和平台要求以[接入指南](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/migration/)为准。

对比性能时，固定页面内容和设备，分别观察首开、滚动、交互延迟与内存。业务长任务和过于频繁的数据更新仍需独立分析，见 [setData 更新机制与性能](./setdata-performance.md)。

## 参考资料

- [Skyline 简介与架构](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html)
- [Skyline 接入指南](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/migration/)
- [Skyline worklet 动画](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/worklet.html)
