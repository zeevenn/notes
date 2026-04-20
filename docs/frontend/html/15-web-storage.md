---
title: cookie、localStorage 和 sessionStorage
date: 2022-08-02
category: 
  - HTML
tag:
  - 前端存储
  - HTML5
---

在使用 Vuex、Pinia 等状态管理库的时候，网页刷新会导致所有数据清空。因此需要用到本地存储，前端本地存储的方式有三种：cookie、localStorage 和 sessionStorage。

## cookie

HTTP Cookie（也叫 Web Cookie 或浏览器 Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器，如保持用户的登录状态。Cookie 使基于无状态的 HTTP 协议记录稳定的状态信息成为了可能。

Cookie 主要用于以下三个方面：

* 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
* 个性化设置（如用户自定义设置、主题等）
* 浏览器行为跟踪（如跟踪分析用户行为等）

Cookie 的特点：

Cookie 的大小受限，一般为 4 KB；同一个域名下存放 Cookie 的个数是有限制的，不同浏览器的个数不一样，一般为 20 个；Cookie 支持设置过期时间，当过期时自动销毁；每次发起同域下的 HTTP 请求时，都会携带当前域名下的 Cookie；支持设置为 HttpOnly，防止 Cookie 被客户端的 JavaScript 访问。

```js
document.cookie = "msg1=hello";
document.cookie = "msg2=cookie";

console.log(document.cookie); // msg1=hello;msg2=cookie
```

## Web Storage

### localStorage

存储在浏览器中，如果不主动清除，则永远不会过期。采用键值对的方式存储数据，按**域名**将数据分别保存在对应的数据库文件里。

localStorage 的特点：

* 大小限制为 5MB ~ 10MB；
* 在同源的所有标签页和窗口之间共享数据；
* 数据仅保存在客户端，不与服务器进行通信；
* 数据持久存在且不会过期，重启浏览器后仍然存在。

```js
// 通过 setItem() 增加一个数据
localStorage.setItem('msg', 'hello localStorage');

// 通过 getItem() 获取某个数据
let msg = localStorage.getItem('msg');

// 通过 removeItem() 移除某个数据
localStorage.removeItem('msg');

// 移除所有数据
localStorage.clear();
```

### sessionStorage

sessionStorage 属性允许你访问一个，对应**当前源**的 session Storage 对象。它与 localStorage 相似，不同之处在于 localStorage 里面存储的数据没有过期时间设置，而存储在 sessionStorage 里面的数据在页面**会话结束**时会被清除。

sessionStorage 的特点：

* 打开多个相同的 URL 的标签页，会创建各自的 sessionStorage。
* 关闭对应浏览器标签或窗口，会清除对应的 sessionStorage。

```js
// 通过 setItem() 增加一个数据
sessionStorage.setItem('msg', 'hello localStorage');

// 通过 getItem() 获取某个数据
let msg = sessionStorage.getItem('msg');

// 通过 removeItem() 移除某个数据
sessionStorage.removeItem('msg');

// 移除所有数据
sessionStorage.clear();
```

### 存储事件

每当 Storage 对象发生变化时，都会在文档上触发 storage 事件。使用属性或 setItem() 设置值、使用 delete 或 removeItem() 删除值，以及每次调用 clear() 时都会触发这个事件。这个事件的事件对象有如下 4 个属性。

* domain：存储变化对应的域。
* key：被设置或删除的键。
* newValue：键被设置的新值，若键被删除则为 null。
* oldValue：键变化之前的值。

可以使用如下代码监听storage 事件：

```js
window.addEventListener("storage", (event) => alert('Storage changed for ${event.domain}'));
```

## 三者异同

### 过期时间

* cookie：可以设置过期时间，没设置默认浏览器关闭后失效
* localStorage：除非手动清除，否则永久保存
* sessionStorage：当前标签页有效，关闭页面或浏览器则会失效

> localStorage 和 sessionStorage 也可以通过封装设置过期时间，一旦到达这个时间，则调用 API 清除数据。

### 存储大小

* cookie：4KB 左右
* localStorage 和 sessionStorage：5MB 字符串的长度 或 10MB 字节数

### http 请求是否携带

* cookie：请求时会被 http 头部自动携带，如果数据过多会影响性能
* localStorage 和 sessionStorage：不参与服务器通信