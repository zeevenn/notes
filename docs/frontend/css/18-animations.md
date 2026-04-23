---
title: CSS 动画
date: 2024-04-23
icon: animation
category:
  - CSS
tag:
  - 动画
  - frontend
---

CSS 动画通过 `@keyframes` 定义关键帧，再用 `animation` 属性驱动，比 Transition 更灵活，可自动循环、有中间状态。

## @keyframes

```css
/* from/to 语法 */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 百分比语法（多帧） */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
```

## animation 属性

```css
/* animation: name duration timing-function delay iteration-count direction fill-mode */
.box {
  animation: fade-in 0.5s ease 0s 1 normal forwards;
}
```

子属性一览：

| 属性                        | 说明       | 常用值                           |
| --------------------------- | ---------- | -------------------------------- |
| `animation-name`            | 关键帧名称 | `fade-in`                        |
| `animation-duration`        | 单次时长   | `0.5s`                           |
| `animation-timing-function` | 速度曲线   | `ease`, `linear`                 |
| `animation-delay`           | 延迟       | `0.2s`                           |
| `animation-iteration-count` | 循环次数   | `1`, `infinite`                  |
| `animation-direction`       | 方向       | `normal`, `reverse`, `alternate` |
| `animation-fill-mode`       | 首尾帧保留 | 见下方                           |

## fill-mode

控制动画**开始前**和**结束后**元素的状态：

- `none`（默认）：动画结束后回到初始状态
- `forwards`：动画结束后**保持最后一帧**
- `backwards`：动画开始前（含 delay 期间）应用第一帧
- `both`：同时应用 `forwards` + `backwards`

```css
/* 淡入后保持可见，而不是闪回透明 */
animation: fade-in 0.5s ease forwards;
```

## 示例：Loading Spinner

::: normal-demo loading-spinner

```html
<span class="loading-spinner" />
```

```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s linear infinite;
}
```

:::

## 性能建议

与 Transition 相同：优先动画 `transform` 和 `opacity`，避免动画 `width`、`height`、`top`、`left` 等触发重排的属性。
