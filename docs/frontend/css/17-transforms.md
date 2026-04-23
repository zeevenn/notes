---
title: CSS 变换
date: 2024-04-23
icon: tool
category:
  - CSS
tag:
  - 变换
  - frontend
---

CSS `transform` 属性对元素做几何变换，**不影响文档流**（不触发重排）。

## 2D 变换

```css
/* 平移 */
transform: translate(50px, 20px);
transform: translateX(50px);
transform: translateY(-20px);

/* 旋转（顺时针为正） */
transform: rotate(45deg);

/* 缩放 */
transform: scale(1.5); /* 等比 */
transform: scale(1.2, 0.8); /* 独立 X/Y */

/* 倾斜 */
transform: skew(10deg, 5deg);

/* 组合：从右到左依次执行 */
transform: translateX(50px) rotate(30deg) scale(1.2);
```

## 变换原点

`transform-origin` 控制变换的基准点，默认为元素中心 `50% 50%`。

```css
transform-origin: top left; /* 左上角 */
transform-origin: 0 0;
transform-origin: 100% 100%; /* 右下角 */
```

## 3D 变换

需先在父元素设置透视距离：

```css
.container {
  perspective: 800px; /* 观察点距离，越小透视越强 */
}

.card {
  transform: rotateY(45deg);
  transform-style: preserve-3d; /* 子元素保留 3D 空间 */
}
```

常用 3D 变换：

```css
transform: rotateX(30deg);
transform: rotateY(45deg);
transform: translateZ(100px);
```

## 居中技巧

`translate(-50%, -50%)` 配合绝对定位实现不依赖元素尺寸的居中（见 [居中](./011-centering.md#定位)）：

```css
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```
