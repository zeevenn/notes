---
title: 架构概述
date: 2024-07-29
icon: architecture
category:
  - Pixi
tag:
  - basic-knowledge
---

[PixiJS](https://github.com/pixijs/pixijs) 源代码中主要模块的关系如下：

| 模块          | 说明                                                           |
| ------------- | -------------------------------------------------------------- |
| Renderer      | 渲染器，PixiJS 系统核心，用于显示场景树，并将其绘制到屏幕上。  |
| Container     | 容器，主要场景对象，用于创建场景树，如精灵、图形和文本。       |
| Assets        | 为异步加载资源提供工具。                                       |
| Ticker        | 基于时钟的周期性回调。游戏更新逻辑将通常在每帧的响应中运行。   |
| Application   | 一个简单的帮助对象，包装了一个加载器，一个时钟和一个渲染器。   |
| Events        | PixiJS 支持基于指针的交互，使对象可以被点击，触发悬停事件等。  |
| Accessibility | 通过我们的显示系统我们拥有了一个丰富的键盘和屏幕阅读器的工具。 |
