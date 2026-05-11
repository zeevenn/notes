---
title: 浏览器存储
date: 2022-08-02
category:
  - 浏览器
tag:
  - 前端存储
---

浏览器提供了多种本地存储机制，各自有不同的容量、生命周期和适用场景。

## cookie

HTTP Cookie（也叫 Web Cookie 或浏览器 Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。Cookie 使基于无状态的 HTTP 协议记录稳定的状态信息成为了可能。

Cookie 主要用于以下三个方面：

- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

Cookie 的特点：

Cookie 的大小受限，单条一般为 4 KB；同一个域名下存放 Cookie 的个数有限制，不同浏览器不同，通常在数百条；Cookie 支持设置过期时间，当过期时自动销毁；每次发起同域下的 HTTP 请求时，都会携带当前域名下的 Cookie（Cookie 越多，请求开销越大）；支持设置为 HttpOnly，防止 Cookie 被客户端的 JavaScript 访问。

```js
document.cookie = 'msg1=hello'
document.cookie = 'msg2=cookie'

console.log(document.cookie) // msg1=hello;msg2=cookie
```

## Web Storage

### localStorage

存储在浏览器中，如果不主动清除，则永远不会过期。采用键值对的方式存储数据，按**域名**将数据分别保存在对应的数据库文件里。

localStorage 的特点：

- 大小限制为 5MB ~ 10MB；
- 在同源的所有标签页和窗口之间共享数据；
- 数据仅保存在客户端，不与服务器进行通信；
- 数据持久存在且不会过期，重启浏览器后仍然存在。

```js
// 通过 setItem() 增加一个数据
localStorage.setItem('msg', 'hello localStorage')

// 通过 getItem() 获取某个数据
let msg = localStorage.getItem('msg')

// 通过 removeItem() 移除某个数据
localStorage.removeItem('msg')

// 移除所有数据
localStorage.clear()
```

### sessionStorage

sessionStorage 属性允许你访问一个，对应**当前源**的 session Storage 对象。它与 localStorage 相似，不同之处在于 localStorage 里面存储的数据没有过期时间设置，而存储在 sessionStorage 里面的数据在页面**会话结束**时会被清除。

sessionStorage 的特点：

- 打开多个相同的 URL 的标签页，会创建各自的 sessionStorage。
- 关闭对应浏览器标签或窗口，会清除对应的 sessionStorage。

```js
// 通过 setItem() 增加一个数据
sessionStorage.setItem('msg', 'hello localStorage')

// 通过 getItem() 获取某个数据
let msg = sessionStorage.getItem('msg')

// 通过 removeItem() 移除某个数据
sessionStorage.removeItem('msg')

// 移除所有数据
sessionStorage.clear()
```

### 存储事件

每当 Storage 对象发生变化时，都会在文档上触发 storage 事件。使用属性或 setItem() 设置值、使用 delete 或 removeItem() 删除值，以及每次调用 clear() 时都会触发这个事件。这个事件的事件对象有如下 4 个属性。

- domain：存储变化对应的域。
- key：被设置或删除的键。
- newValue：键被设置的新值，若键被删除则为 null。
- oldValue：键变化之前的值。

可以使用如下代码监听storage 事件：

```js
window.addEventListener('storage', (event) => alert('Storage changed for ${event.domain}'))
```

## 三者异同

### 过期时间

- cookie：可以设置过期时间，没设置默认浏览器关闭后失效
- localStorage：除非手动清除，否则永久保存
- sessionStorage：当前标签页有效，关闭页面或浏览器则会失效

> localStorage 和 sessionStorage 也可以通过封装设置过期时间，一旦到达这个时间，则调用 API 清除数据。

### 存储大小

- cookie：4KB 左右
- localStorage 和 sessionStorage：5MB 字符串的长度 或 10MB 字节数

### http 请求是否携带

- cookie：请求时会被 http 头部自动携带，如果数据过多会影响性能
- localStorage 和 sessionStorage：不参与服务器通信

## IndexedDB

IndexedDB 是浏览器内置的**非关系型数据库**，适合存储大量结构化数据。

特点：

- 容量大，通常无硬性上限（受磁盘空间限制，超过一定大小时浏览器会提示用户授权）
- 支持索引查询、事务、游标遍历
- 异步 API，不阻塞主线程
- 同源限制，数据持久存在

典型场景：离线应用的本地数据缓存、大量数据的客户端存储（如邮件客户端、笔记应用）。

```js
const request = indexedDB.open('myDB', 1)

request.onupgradeneeded = (e) => {
  const db = e.target.result
  db.createObjectStore('notes', { keyPath: 'id' })
}

request.onsuccess = (e) => {
  const db = e.target.result
  const tx = db.transaction('notes', 'readwrite')
  tx.objectStore('notes').add({ id: 1, content: 'hello' })
}
```

> [!TIP]
>
> 直接使用 IndexedDB 原生 API 较繁琐，实际项目通常用封装库：[Dexie.js](https://dexie.org/)、[idb](https://github.com/jakearchibald/idb)。

## Cache Storage

Cache Storage 是专门为**缓存网络请求响应**设计的存储，是 Service Worker 的配套 API。

特点：

- 以 Request/Response 对为单位存储
- 持久化，不会自动清除
- 主要在 Service Worker 中使用，也可在主线程中访问
- 适合缓存 HTML、JS、CSS、图片等静态资源

```js
// 存储响应
const cache = await caches.open('v1')
await cache.add('/index.html')

// 读取缓存
const response = await caches.match('/index.html')
```

## 全景对比

|                 | Cookie             | localStorage       | sessionStorage | IndexedDB      | Cache Storage    |
| --------------- | ------------------ | ------------------ | -------------- | -------------- | ---------------- |
| **容量**        | 单条 ~4KB          | ~5MB               | ~5MB           | 无硬限制       | 无硬限制         |
| **生命周期**    | 可设过期时间       | 永久               | 标签页关闭清除 | 永久           | 永久             |
| **跨 Tab 共享** | ✓                  | ✓                  | ✗              | ✓              | ✓                |
| **随请求发送**  | ✓                  | ✗                  | ✗              | ✗              | ✗                |
| **数据类型**    | 字符串             | 字符串             | 字符串         | 任意结构化数据 | Request/Response |
| **API 类型**    | 同步               | 同步               | 同步           | 异步           | 异步（Promise）  |
| **典型用途**    | 登录态、服务端通信 | 用户偏好、持久配置 | 表单临时数据   | 离线数据库     | 静态资源缓存     |

## 参考

- [MDN - Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API)
- [MDN - IndexedDB API](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)
- [MDN - Cache](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)
