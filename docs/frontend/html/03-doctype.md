---
title: DOCTYPE
date: 2023-03-22
icon: doc
category:
  - HTML
tag:
  - frontend
  - html
  - basic-knowledge
---

在 HTML 中，每个 HTML 文档必须以 DOCTYPE 开头，它的目的在于告诉浏览器应该以什么样的文档类型定义（Document Type Definition, DTD）来解析文档。

::: info DTD

DTD：文档类型定义，是一套关于标记符的语法规则。

在 HTML5 以前，HTML 都是基于标准通用标记语言（Standard Generalized Markup Language，SGML）来实现的，而 SGML 使用 DTD 来定义不同版本的语法。

:::

那么不同的 DOCTYPE 有什么区别呢，这就涉及到了浏览器的渲染模式。

## 浏览器渲染模式

目前浏览器的排版引擎使用三种渲染模式，之所以会出现三种渲染模式，是因为以前并没有一个统一的标准，当 W3C 创立网络标准后，现在需要兼容以前的页面，因此出现了不同的渲染模式。

- 怪异模式（Quirks mode）：以一种宽松的向后兼容的方式解析页面；
- 接近标准模式（Almost standards mode）：尝试以新标准处理旧标准的页面；
- 标准模式（Standards mode）：遵循浏览器支持的最新标准渲染解析页面。

不同的 DOCTYPE 会决定浏览器以不同的渲染模式解析页面，如果文档没有声明或者使用了错误的 DOCTYPE，那么会导致浏览器以怪异模式来渲染页面。

## HTML4 DOCTYPE

HTML4 的 DOCTYPE 类型一共有三种：

**HTML4 Strict**

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

**HTML4 Transitional**

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

**HTML4 Frameset**

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
```

## HTML5 DOCTYPE

因为 HTML5 不基于 SGML，没有为之定义的 DTD，所以理论上 HTML5 不需要再声明 DOCTYPE。

但是前面提到了：**如果文档没有声明或者使用了错误的 DOCTYPE，那么会导致浏览器以怪异模式来渲染页面**。因此，HTML5 使用了以下 DOCTYPE：

```html
<!DOCTYPE html>
```
