---
title: preload / prefetch / preconnect
date: 2026-04-21
icon: load
category:
  - Frontend
  - HTML
tag:
  - html
  - performance
  - resource-hints
---

## 区别

| 指令 | 时机 | 用途 |
| :---: | :---: | :---: |
| `preload` | 当前页面，尽早加载 | 当前页面必用资源 |
| `prefetch` | 空闲时加载 | 下一个页面可能用到的资源 |
| `preconnect` | 提前建立连接 | 第三方域名的 DNS + TCP + TLS |

## preload

```html
<link rel="preload" href="font.woff2" as="font" crossorigin />
```

## prefetch

```html
<link rel="prefetch" href="/next-page.js" />
```

## preconnect

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
```

## 使用场景

## 注意事项

## 参考

- [MDN - Resource hints](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)
