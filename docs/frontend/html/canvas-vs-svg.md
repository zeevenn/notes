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

| #        | Canvas               | SVG                     |
| -------- | -------------------- | ----------------------- |
| 渲染方式 | 位图，逐像素绘制     | 矢量，DOM 节点          |
| 缩放     | 放大会失真           | 无损缩放                |
| 事件绑定 | 需要手动计算坐标     | 直接绑定到元素          |
| 性能瓶颈 | 元素数量少，图形复杂 | 元素数量多时 DOM 开销大 |
| 动态修改 | 重绘整个区域         | 修改对应 DOM 节点       |

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

没有精确数字，取决于图形复杂度和更新频率，但通用参考：

- **SVG**：元素数量超过 ~1000 个节点后，DOM 操作和样式重算开销显著上升
- **Canvas**：单帧绘制面积越大越慢；图形简单但数量极多（粒子系统）反而比 SVG 快得多

实际瓶颈要 Profile 后再定，不要凭经验猜。

## 实践经验

- **数据可视化**（折线图、柱状图）：数据点 < 数千用 SVG，超过考虑 Canvas；D3.js 两种后端都支持
- **图标**：始终用 SVG，支持 CSS 变色、任意尺寸清晰
- **游戏 / 粒子**：Canvas，配合 `requestAnimationFrame` 逐帧重绘
- **地图**：底图瓦片用 Canvas（像素操作快），矢量标注层用 SVG（需要点击事件）；Mapbox、Leaflet 都采用此分层策略
- **截图 / 导出**：Canvas 原生支持 `toDataURL()` / `toBlob()`；SVG 需先序列化再用 `canvas.drawImage()` 转换

## 参考

- [MDN - Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MDN - SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)
