---
title: 微信内置浏览器视频 preload 兼容性问题
date: 2025-08-15
---

## 背景

在 Web 项目中使用 `video.js` 播放视频时，通常我们会通过 `preload="metadata"` 或 `preload="auto"` 来提前加载视频元数据（`loadedmetadata` 事件）和首帧，以便显示封面或做一些视频时长计算。

然而，在 **微信内置浏览器（尤其是 iOS 版）** 中，视频的加载行为存在限制：

- 即使设置了 `autoplay`、`muted`、`preload`，也**不会自动触发 `loadedmetadata`**。
- 视频首帧也不会在未播放时渲染出来。
- 这些行为与 Chrome / Safari / Android 微信都有差异。

---

## 原因分析

这是微信内置浏览器的 **自动播放和加载策略** 导致的：

- iOS 微信要求用户与页面产生交互（如点击、触摸），才会允许调用 `video.play()` 或加载视频数据。
- 虽然 `muted` + `autoplay` 在多数移动浏览器能绕过这个限制，但在微信内核中并不完全适用。
- 结果就是，在没有用户交互前，视频的 `loadedmetadata` 事件不会触发，首帧也不会加载。

---

## 解决方案

在 **第一次用户交互时**，主动调用 `video.load()`，这样可以在不真正播放视频的情况下，触发视频的加载和首帧渲染。

实现方式：

1. 判断当前是否在微信内置浏览器中。
2. 如果是，监听 `touchstart` 事件（或 `click`，但移动端推荐 `touchstart`）。
3. 在第一次触摸时调用 `player.load()`。

---

## 实现代码

```ts
// 判断是否为微信内置浏览器
function isWeixin(): boolean {
  return /MicroMessenger/i.test(window.navigator.userAgent);
}

// 初始化逻辑
if (isWeixin()) {
  document.addEventListener(
    'touchstart',
    () => {
      player.load(); // 触发视频加载，渲染首帧
    },
    { once: true } // 只执行一次
  );
}
```
