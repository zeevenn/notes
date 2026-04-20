---
title: 语义化标签
date: 2022-04-30
icon: tag
category:
  - HTML
tag:
  - HTML5
---

HTML5 中加入了一些语义化标签，来更清晰的表达文档结构。

![语义化标签](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/tag.png)

- `<header>`：页眉。
- `<nav>`：导航栏。
- `<main>`：主内容。主内容中还可以有各种子内容区段，可用 `<article>`、`<section>` 和 `<div>` 等元素表示。
- `<aside>`：侧边栏，经常嵌套在 `<main>` 中。
- `<footer>`：页脚。

语义化优点：

- 易于用户阅读，在丢失 CSS 样式的时候仍能呈现清晰的结构；
- 方便屏幕阅读器解析，如盲人阅读器根据标签渲染网页；
- 提升用户体验，例如 title、alt 可以用于解释名称或图片信息；
- 便于 SEO 搜索引擎优化，搜索引擎根据标签来确定上下文和关键字的权重；
- 有利于开发人员维护。

缺点：

- 存在兼容性问题，HTML5 语义化标签在 IE8 下，默认当成行内元素展示。
