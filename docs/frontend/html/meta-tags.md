---
title: 常用 meta 标签
date: 2026-04-21
icon: meta
category:
  - Frontend
  - HTML
tag:
  - html
  - seo
  - performance
---

## 字符编码

```html
<meta charset="UTF-8" />
```

## 视口（移动端必加）

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

## SEO 相关

```html
<meta name="description" content="页面描述，显示在搜索结果摘要中" />
<meta name="keywords" content="关键词1,关键词2" />
<meta name="robots" content="index, follow" />
```

> [!NOTE]
>
> `keywords` 已被 Google 忽略，Baidu 仍参考。`description` 影响点击率但不影响排名。

## Open Graph（社交分享）

```html
<meta property="og:title" content="标题" />
<meta property="og:description" content="描述" />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta property="og:url" content="https://example.com/page" />
```

## 兼容性

```html
<!-- 告诉 IE 使用最新引擎渲染，现代项目可不加 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
```

## 安全相关

```html
<!-- 禁止页面被 iframe 嵌入，防止点击劫持 -->
<meta http-equiv="X-Frame-Options" content="DENY" />

<!-- CSP：限制资源加载来源 -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
```

## 参考

- [MDN - meta](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
