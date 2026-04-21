---
title: img srcset 响应式图片
date: 2026-04-21
icon: image
category:
  - Frontend
  - HTML
tag:
  - html
  - performance
  - responsive
---

## 是什么

`srcset` 让浏览器根据设备像素密度或视口宽度自动选择最合适的图片，避免在小屏上加载大图。

## 像素密度描述符（x）

适合固定尺寸的图片（如头像、logo）：

```html
<img
  src="avatar.jpg"
  srcset="avatar@2x.jpg 2x, avatar@3x.jpg 3x"
  alt="avatar"
/>
```

浏览器在 2x 屏（Retina）加载 `avatar@2x.jpg`，普通屏加载 `avatar.jpg`。

## 宽度描述符（w）+ sizes

适合响应式布局中宽度随视口变化的图片：

```html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 800px"
  alt="photo"
/>
```

`sizes` 告诉浏览器图片在各断点下的显示宽度，浏览器据此结合屏幕 DPR 选择最优图片。

> [!TIP]
>
> `src` 是必须保留的回退值，不支持 `srcset` 的浏览器使用它。

## 与 `<picture>` 的区别

`srcset` 只做分辨率/尺寸切换；`<picture>` 可以做格式切换（如 WebP 降级 JPEG）：

```html
<picture>
  <source srcset="photo.webp" type="image/webp" />
  <img src="photo.jpg" alt="photo" />
</picture>
```

## 参考

- [MDN - srcset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset)
- [MDN - picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
