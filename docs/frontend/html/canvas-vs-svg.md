---
title: Canvas vs SVG
date: 2026-04-21
icon: canvas
category:
  - Frontend
  - HTML
tag:
  - html
  - canvas
  - svg
  - performance
---

## 核心区别

| | Canvas | SVG |
| :---: | :---: | :---: |
| 渲染方式 | 位图，逐像素绘制 | 矢量，DOM 节点 |
| 缩放 | 放大会失真 | 无损缩放 |
| 事件绑定 | 需要手动计算坐标 | 直接绑定到元素 |
| 性能瓶颈 | 元素数量少，图形复杂 | 元素数量多时 DOM 开销大 |
| 动态修改 | 重绘整个区域 | 修改对应 DOM 节点 |

## 如何选择

**用 Canvas：**
- 游戏、粒子效果等高帧率场景
- 图形元素数量极多（> 数千）
- 需要像素级操作（图片处理、滤镜）

**用 SVG：**
- 图标、插图、数据可视化（折线图、饼图）
- 需要无损缩放（响应式设计）
- 需要 CSS 动画或交互事件

## 性能临界点

## 实践经验

## 参考

- [MDN - Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN - SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)
