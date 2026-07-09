---
title: AJAX
date: 2022-08-12
category:
  - JavaScript
tag:
  - 网络请求
  - 手写代码
---

AJAX，即 Asynchronous JavaScript + XML，通过 JavaScript 异步请求服务器 XML 文档（格式不一定是 XML），可以实现在不刷新页面的情况下从服务器获取数据。

AJAX 最初是通过 XMLHttpRequest 对象实现，但是它的 API 比较难用。随着 Fetch API 的出现，它支持期约（promise）和服务线程（service worker），逐渐代替了 XHR 对象。

## XMLHttpRequest 对象

### 基本 API

所有现代浏览器都支持的对象，通过 XMLHttpRequest 构造函数支持 XHR 对象。

```js
let xhr = new XMLHttpRequest()
```

XHR 对象需要首先调用 `open()` 方法，这个方法接收3 个参数：请求类型（"get"、"post"等）、请求 URL，以及表示请求是否异步的布尔值。

```js
xhr.open("get", "server.com", true);
```

要发送定义好的请求，就需要调用 `send()` 方法，它接收一个参数，作为请求体发送的数据。如果不需要发送请求体，则必须传 null。

```js
xhr.send(null)
```

收到响应后，XHR 对象的以下属性会被填充上数据。

* `responseText`：作为响应体返回的文本；
* `responseXML`：如果响应的内容类型是 "text/xml" 或 "application/xml"，那就是包含响应数据的 XML DOM 文档；
* `status`：响应的 HTTP 状态；
* `statusText`：响应的 HTTP 状态描述。

同时 XHR 对象还有一个 `readyState` 属性，表示当前处于请求/响应的哪个阶段：

* 0：未初始化（Uninitialized）。尚未调用 `open()` 方法；
* 1：已打开（Open）。已调用 `open()` 方法，尚未调用 `send()` 方法；
* 2：已发送（Sent）。已调用 `send()` 方法，尚未收到响应；
* 3：接收中（Receiving）。已经收到部分响应；
* 4：完成（Complete）。已经收到所有响应，可以使用了；

每次 `readyState` 从一个值变成另一个值，都会触发 `readystatechange` 事件。可以借此机会检查 `readyState` 的值。

```js
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      console.log(xhr.response)
    } else {
      console.error(xhr.status)
    }
  }
}
```

除此之外，可以使用 `setRequestHeader()` 方法添加一些头部信息，这个方法接收两个参数：头部字段的名称和值。为保证请求头部被发送，必须在 `open()` 之后、`send()` 之前调用。

```js
xhr.open("get", "server.com", true);
xhr.setRequestHeader("MyHeader", "MyValue");
xhr.send(null);
```

### 实现 AJAX

使用 XMLHttpRequest 实现 AJAX 的基本步骤如下：

1. 创建 XHR 对象；
2. 在这个对象上使用 `open()` 方法创建 HTTP 请求；
3. 在发起请求前，可以为这个对象添加一些信息（如请求头）和监听函数；
4. 当请求的额外信息和监听函数添加完成后，使用 `send()` 发送请求。

可以使用 Promise 对 AJAX 请求进行封装。

```js
const url = 'server.com'

function getJSON(url) {
  return new Promise(resolve, reject) {
    const xhr = new XMLHttpRequest()

    // 创建 http 请求
    xhr.open('get', url)
    // 设置状态监听函数
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          resolve(xhr.response)
        } else {
          reject(new Error(xhr.statusText))
        }
      }
    }
    // 设置请求头信息
    xhr.responeseType = 'json'
    xhr.setRequestHeader('Accept', 'application/json')
    // 发送请求
    xhr.send(null)
  }
}
```