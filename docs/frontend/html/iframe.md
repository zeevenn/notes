---
title: iframe
date: 2026-04-21
icon: iframe
category:
  - Frontend
  - HTML
tag:
  - html
  - security
  - performance
---

## 优点

- 隔离第三方内容（广告、地图、支付页面），样式和脚本互不影响
- 可嵌入独立部署的子应用（微前端常见方案）
- 异步加载，不阻塞父页面渲染

## 缺点

- **性能**：每个 iframe 都有独立的浏览器上下文，内存开销大
- **SEO**：iframe 内容不被搜索引擎索引
- **通信复杂**：跨域需要 `postMessage`，调试困难
- **历史记录**：iframe 内部的导航会污染浏览器 history
- **移动端**：滚动行为在 iOS 上有兼容问题

## 安全：sandbox 属性

不加 `sandbox` 的 iframe 默认继承父页面权限，存在安全风险：

```html
<!-- 最严格：禁止所有脚本、表单、弹窗 -->
<iframe src="..." sandbox></iframe>

<!-- 按需开放 -->
<iframe src="..." sandbox="allow-scripts allow-same-origin"></iframe>
```

常用值：

| 值 | 作用 |
| :---: | :--- |
| `allow-scripts` | 允许执行脚本 |
| `allow-same-origin` | 允许同源访问（去掉则视为跨域） |
| `allow-forms` | 允许提交表单 |
| `allow-popups` | 允许弹窗 |

> [!WARNING]
>
> `allow-scripts` + `allow-same-origin` 同时开启会让 iframe 内的脚本能移除 sandbox，等于没有限制。

## 跨文档通信

```js
// 父页面发送
iframe.contentWindow.postMessage({ type: 'ping' }, 'https://child.com')

// iframe 接收
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://parent.com') return
  console.log(e.data)
})
```

## 参考

- [MDN - iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
