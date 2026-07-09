---
title: iOS 图片兼容
date: 2024-09-11
icon: img
category:
  - practice
tag:
  - 兼容
---

## 长按图片，弹出菜单

在 iOS 中，用户可以通过长按图片来弹出菜单，可以通过以下方式阻止。

```css
img {
  -webkit-touch-callout: none;
}
```

## 长按图片，拖动

长按禁止拖动。

```css
img {
  -webkit-user-drag: none;
  user-select: none;
}
```

## 点击出现黑色阴影

```css
img {
  -webkit-tap-highlight-color: transparent;
}
```