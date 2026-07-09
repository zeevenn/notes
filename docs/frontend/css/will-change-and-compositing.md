---
title: will-change 与合成层
date: 2026-05-09
icon: gpu
category:
  - CSS
tag:
  - 性能
---

浏览器渲染不是一步完成的，理解渲染流水线是做 CSS 性能优化的基础。

## 渲染流水线

浏览器将页面渲染到屏幕分为以下阶段：

```
JavaScript → Style → Layout → Paint → Composite
```

| 阶段 | 工作内容 | 触发条件 |
| --- | --- | --- |
| **Layout**（重排） | 计算元素位置和尺寸 | 修改 `width`、`height`、`top`、`margin` 等几何属性 |
| **Paint**（重绘） | 绘制像素到图层 | 修改 `color`、`background`、`box-shadow` 等视觉属性 |
| **Composite**（合成） | 将各图层合并输出 | 修改 `transform`、`opacity` |

代价：**Layout > Paint > Composite**。Composite 完全在 GPU 上完成，不占用主线程，性能最好。

## 为什么 transform 比 top/left 动画性能好

`top`/`left` 修改的是几何属性，触发 **Layout → Paint → Composite** 全流程。

`transform` 只触发 **Composite**，直接由 GPU 处理，不重排不重绘。

```css
/* 差：每帧触发 Layout */
.box { transition: left 0.3s; }

/* 好：只触发 Composite */
.box { transition: transform 0.3s; }
```

同理，`opacity` 动画也只触发 Composite，而 `visibility` 会触发 Paint。

## 合成层

浏览器会把页面拆分成若干**图层（Layer）**，分别绘制后在 GPU 中合成。某些元素会被提升为独立的合成层（Compositing Layer），这样该元素的变化不会影响其他图层的绘制。

**触发合成层提升的条件**：

- `transform` 非 `none`（3D transform 更明确）
- `opacity` 小于 1
- `will-change` 属性
- `position: fixed`
- `<video>`、`<canvas>`、`<iframe>`

## will-change

`will-change` 告诉浏览器某个元素即将发生特定变化，让浏览器提前为其创建合成层：

```css
.sidebar {
  will-change: transform; /* 提前创建合成层，动画开始时无需等待提升 */
}
```

### 正确用法

`will-change` 应该在**动画即将发生前**添加，动画结束后移除：

```js
el.addEventListener('mouseenter', () => {
  el.style.willChange = 'transform'
})

el.addEventListener('animationend', () => {
  el.style.willChange = 'auto'
})
```

### 过度使用的代价

很多人误以为给所有动画元素加 `will-change` 能提升性能，实际上：

- 每个合成层都占用**额外的 GPU 显存**
- 大量合成层会导致**合成阶段本身变慢**
- 移动端显存有限，容易引发内存压力

> [!WARNING]
>
> 不要把 `will-change` 写在普通 CSS 中作为常驻样式，只在需要优化的场景动态加上。
> `transform: translateZ(0)` 是同类 hack，同样有相同代价，应谨慎使用。

## 排查渲染性能问题

Chrome DevTools → **Rendering** 面板：

- **Paint flashing**：绿色高亮显示正在重绘的区域
- **Layer borders**：橙色边框显示合成层边界
- **Frames Per Second**：实时帧率显示

## 参考

- [MDN - will-change](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change)
- [Google - Stick to Compositor-Only Properties](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count)
