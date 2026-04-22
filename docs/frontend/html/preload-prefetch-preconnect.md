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

| 指令         | 时机               | 用途                         |
| ------------ | ------------------ | ---------------------------- |
| `preload`    | 当前页面，尽早加载 | 当前页面必用资源             |
| `prefetch`   | 空闲时加载         | 下一个页面可能用到的资源     |
| `preconnect` | 提前建立连接       | 第三方域名的 DNS + TCP + TLS |

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

**preload** — 当前页面首屏必须用到的资源，越早加载越好：

```html
<!-- 字体：避免 FOUT，必须带 crossorigin -->
<link rel="preload" href="font.woff2" as="font" crossorigin />
<!-- 首屏大图 -->
<link rel="preload" href="hero.jpg" as="image" />
<!-- 动态 import 的关键 chunk -->
<link rel="preload" href="/assets/critical.js" as="script" />
```

**prefetch** — SPA 中预取下一个路由的 JS chunk：

```html
<link rel="prefetch" href="/assets/about-page.js" />
```

**preconnect** — 页面依赖第三方域名时提前建立连接：

```html
<!-- Google Fonts 需要连接两个域名 -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## 注意事项

**preload 字体必须带 `crossorigin`**

字体请求默认走 CORS 模式，即使是同源字体也一样。如果 `preload` 缺少 `crossorigin`，
预加载请求与 CSS `@font-face` 触发的请求模式不匹配，浏览器会把它们视为两个不同的请求，导致字体被下载两次，预加载完全白费。

```html
<!-- ✗ 缺少 crossorigin，字体会被下载两次 -->
<link rel="preload" href="font.woff2" as="font" />

<!-- ✓ 正确写法 -->
<link rel="preload" href="font.woff2" as="font" crossorigin />
```

**preload 的资源必须实际被使用**

如果预加载的资源在页面中没有被用到，浏览器会在控制台输出警告，且浪费了带宽。

**不要滥用 preconnect**

建立连接本身也有开销（内存、CPU），只对确定会用到的第三方域名使用。

## 参考

- [MDN - Resource hints](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)
