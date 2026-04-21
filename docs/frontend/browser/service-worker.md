---
title: Service Worker
date: 2026-04-21
icon: worker
category:
  - Frontend
  - HTML
tag:
  - html
  - pwa
  - cache
  - performance
---

## 是什么

Service Worker 是运行在浏览器后台的独立线程，可拦截网络请求、管理缓存，是 PWA 的核心技术。

与 Web Worker 的区别：

| | Service Worker | Web Worker |
| :---: | :---: | :---: |
| 生命周期 | 独立于页面，可持久 | 随页面关闭销毁 |
| 网络拦截 | 可以 | 不可以 |
| 典型用途 | 离线缓存、推送通知 | CPU 密集型计算 |

## 生命周期

1. 注册（register）
2. 安装（install）
3. 激活（activate）
4. 拦截请求（fetch）

## 基本用法

```js
// 注册
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

// sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => cache.addAll(['/index.html', '/app.js']))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  )
})
```

## 缓存策略

- **Cache First**：先查缓存，没有再请求网络（适合静态资源）
- **Network First**：先请求网络，失败才用缓存（适合 API）
- **Stale While Revalidate**：返回缓存同时后台更新

## 注意事项

- 只能在 HTTPS 或 localhost 下运行
- 更新 sw.js 后需要等旧 SW 不再控制页面才会激活

## 参考

- [MDN - Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
