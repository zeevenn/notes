---
title: 浏览器存储
date: 2022-08-02
category:
  - 浏览器
tag:
  - 前端存储
---

浏览器提供了多种本地存储机制，各自有不同的容量、生命周期和适用场景。

## Cookie

Cookie 是浏览器保存并按规则随 HTTP 请求发送的少量键值数据，常用于携带会话 ID，也可保存语言等偏好。是否发送取决于目标域名、路径、有效期、Secure、SameSite、请求凭据模式和浏览器策略，不能概括为“同域请求都会携带”。

Cookie 单条容量通常约 4 KiB，数量和计量方式因浏览器实现而异。`HttpOnly` 可以禁止页面脚本读取和修改 Cookie，浏览器仍可随请求发送它。

[Cookie 与会话机制](./cookie.md) 详细说明登录流程、属性、跨源携带、JavaScript 操作、注销，以及 XSS / CSRF 的防护边界。Token 的校验和刷新见 [JWT](../../security/auth/jwt.md)。

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

- Cookie：可用 Max-Age / Expires 设置有效期；未设置时由浏览器会话生命周期决定，会话恢复可能保留它
- localStorage：除非手动清除，否则永久保存
- sessionStorage：当前标签页有效，关闭页面或浏览器则会失效

> localStorage 和 sessionStorage 也可以通过封装设置过期时间，一旦到达这个时间，则调用 API 清除数据。

### 存储大小

- Cookie：单条通常约 4 KiB，具体限制因实现而异
- localStorage 和 sessionStorage：5MB 字符串的长度 或 10MB 字节数

### http 请求是否携带

- Cookie：符合发送条件时由浏览器写入 Cookie 请求头，增加请求开销
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
| **随请求发送**  | 符合规则时自动发送                  | ✗                  | ✗              | ✗              | ✗                |
| **数据类型**    | 字符串             | 字符串             | 字符串         | 任意结构化数据 | Request/Response |
| **API 类型**    | 同步               | 同步               | 同步           | 异步           | 异步（Promise）  |
| **典型用途**    | 登录态、服务端通信 | 用户偏好、持久配置 | 表单临时数据   | 离线数据库     | 静态资源缓存     |

## 参考

- [MDN - Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API)
- [MDN - IndexedDB API](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)
- [MDN - Cache](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)
