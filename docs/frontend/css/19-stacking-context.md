---
title: 层叠上下文
date: 2026-05-09
icon: layers
category:
  - CSS
tag:
  - 布局
---

层叠上下文（Stacking Context）是 CSS 渲染中控制元素**垂直方向（Z 轴）堆叠顺序**的机制。理解它能解释大多数 `z-index` 失效的问题。

## z-index 为什么会失效

最常见的困惑：明明设了更大的 `z-index`，元素却还是被盖住了。

```html
<div class="parent-a" style="position: relative; z-index: 1;">
  <div class="child" style="position: relative; z-index: 999;">
    <!-- 永远在 parent-b 下面 -->
  </div>
</div>
<div class="parent-b" style="position: relative; z-index: 2;">
  <!-- 盖住 child，尽管 child 的 z-index 是 999 -->
</div>
```

原因：`child` 的 `z-index: 999` 只在 `parent-a` 的层叠上下文**内部**排序，无法跨越到外部与 `parent-b` 比较。`parent-a`（z-index: 1）和 `parent-b`（z-index: 2）才是真正在同一上下文中比较的两者。

## 什么是层叠上下文

每个层叠上下文是一个独立的"平面"，内部元素的 z-index 只在该平面内有意义，不会影响外部的排序。

根元素 `<html>` 是最顶层的层叠上下文，所有元素默认在其中排序。

## 触发条件

以下属性会创建新的层叠上下文：

| 属性 | 条件 |
| --- | --- |
| `position` | `absolute` / `relative` / `fixed` / `sticky` + `z-index` 不为 `auto` |
| `opacity` | 值小于 1 |
| `transform` | 非 `none` |
| `filter` | 非 `none` |
| `will-change` | 值为上述任一属性 |
| `isolation` | `isolate` |
| `mix-blend-mode` | 非 `normal` |
| `contain` | `layout` / `paint` |

> [!TIP]
>
> `transform: translateZ(0)` 或 `will-change: transform` 是常见的"强制创建层叠上下文"技巧，常用于解决 `z-index` 问题或触发 GPU 合成层。

## 同一上下文内的层叠顺序

在同一个层叠上下文中，元素按以下顺序从下到上渲染（后渲染的在上面）：

1. 背景和边框（当前层叠上下文的根元素）
2. `z-index` 为负值的子层叠上下文
3. 正常流中的块级元素
4. 浮动元素
5. 正常流中的行内元素
6. `z-index: 0` / `z-index: auto` 的层叠上下文
7. `z-index` 为正值的子层叠上下文

## 与 BFC 的关系

BFC 和层叠上下文是**两个独立的概念**，某些属性会同时触发两者（如 `overflow: hidden`），但触发一个不代表触发另一个。

- BFC 控制**块级元素在平面内的布局**（margin 折叠、浮动清除）
- 层叠上下文控制**元素在 Z 轴上的堆叠顺序**

## 排查 z-index 问题的思路

1. 找到出问题的两个元素
2. 向上找它们各自所在的**最近公共层叠上下文**
3. 在该上下文中比较这两个分支的 z-index
4. 检查是否有意外触发层叠上下文的属性（最常见：`transform`、`opacity`）

## 参考

- [MDN - 层叠上下文](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)
