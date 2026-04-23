---
title: CSS 过渡
date: 2024-04-23
icon: animation
category:
  - CSS
tag:
  - 动画
  - frontend
---

CSS 过渡（Transition）让属性值的变化从「瞬间切换」变为「平滑动画」。

## 基本语法

```css
/* transition: property duration timing-function delay */
.btn {
  transition: background-color 0.3s ease 0s;
}
```

四个子属性：

| 属性                         | 说明             | 示例值                                |
| ---------------------------- | ---------------- | ------------------------------------- |
| `transition-property`        | 哪些属性参与过渡 | `color`, `all`                        |
| `transition-duration`        | 持续时长         | `0.3s`, `300ms`                       |
| `transition-timing-function` | 速度曲线         | `ease`, `linear`, `cubic-bezier(...)` |
| `transition-delay`           | 延迟开始         | `0.1s`                                |

多个属性用逗号分隔：

```css
transition:
  color 0.2s ease,
  transform 0.3s ease-out;
```

## 常用 timing-function

- `ease`：慢→快→慢（默认）
- `linear`：匀速
- `ease-in`：慢→快
- `ease-out`：快→慢（交互反馈常用）
- `cubic-bezier(x1, y1, x2, y2)`：自定义曲线

## 性能建议

优先对 `transform` 和 `opacity` 做过渡，它们由 GPU 合成层处理，**不触发重排（reflow）**。

避免对 `width`、`height`、`margin`、`top/left` 等布局属性做过渡，每帧都会触发重排。

```css
/* 推荐 */
.box {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

/* 避免 */
.box {
  transition:
    width 0.3s,
    margin 0.3s;
}
```
