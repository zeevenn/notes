---
title: 字体加载与 Font Loading API
date: 2026-04-22
icon: font
category:
  - Frontend
  - HTML
tag:
  - html
  - performance
  - font
---

浏览器加载字体分为两条独立的管线：**HTTP 缓存**（负责下载字节）和**字体引擎**（负责解码、注册字体）。两者之间没有自动桥接——字节下载完成不等于字体可用。

## 字体加载的完整流程

```
HTML 解析到 <link rel="preload"> / CSS 触发 @font-face
  → 发起网络请求，下载字体文件
  → 浏览器解码字体文件
  → 注册到字体引擎
  → document.fonts.check() 返回 true ← 此时才真正可用
```

在注册完成之前，任何依赖字体 metrics 的操作（Canvas 绘制、行高计算）都会拿到后备字体的数据。

## Font Loading API

```js
// 检查字体是否已注册（同步）
// 参数格式为 CSS font shorthand，需包含 size 和 family，大小写敏感
document.fonts.check('16px MyFont')
document.fonts.check('bold 16px MyFont')

// 等待指定字体注册完成（异步）
await document.fonts.load('16px MyFont')

// 等待页面初始布局涉及的所有字体就绪
await document.fonts.ready
```

`document.fonts.load()` 内部会自行触发网络请求，不需要提前手动 `fetch()`。防止 FOUT 的关键是 `await`——等 Promise resolve 后再渲染。

## 常见误区：用 fetch() 作为就绪信号

```ts
// ✗ 错误：fetch 只把字节存入 HTTP 缓存，字体引擎不感知
await fetch('https://example.com/font.woff2')
setLoading(false) // 此时字体引擎尚未注册，仍会用后备字体渲染

// ✓ 正确：等待字体引擎真正注册完成
await document.fonts.load('16px MyFont')
setLoading(false)
```

用 `fetch()` 作为就绪信号会造成比不处理更明显的 FOUT——`fetch()` resolved 之后 React 立即渲染，浏览器用后备字体画出文字，几十毫秒后字体引擎注册完毕再替换，闪烁肉眼可见。这类 bug 在本地开发时很难复现，只在网络较慢或首次访问时出现。

## 在应用中使用

**全局等待（适合整个应用都依赖自定义字体）：**

```ts
// main.ts
await document.fonts.ready
createApp(App).mount('#app')
```

**组件级等待（适合只有特定页面用到自定义字体，比如 Canvas）：**

```ts
function useFont(family: string, descriptors = '16px') {
  const [loaded, setLoaded] = useState(() => document.fonts.check(`${descriptors} ${family}`))

  useEffect(() => {
    if (loaded) return
    document.fonts.load(`${descriptors} ${family}`).then(() => setLoaded(true))
  }, [family, descriptors])

  return loaded
}
```

`useState` 的初始值用惰性初始化检查字体是否已缓存，避免字体已就绪时还走一次异步流程。

## 典型使用场景

**Canvas 文字渲染** — `ctx.drawText()` 依赖精确的字体 metrics。字体未注册时绘制，文字尺寸和位置会按后备字体计算，且不会自动重绘：

```ts
const fontReady = useFont('MyFont')

useEffect(() => {
  if (!fontReady) return
  ctx.font = '16px MyFont'
  ctx.fillText('Hello', 0, 0)
}, [fontReady])
```

**虚拟列表行高计算** — 需要用 `measureText()` 提前算出每行文字高度，同样依赖字体已注册。

## 浏览器兼容性

Chrome 35、Firefox 41、Safari 10、Edge 79 起支持，覆盖率 96.72%，无需 polyfill（不支持 IE）。

- [caniuse - CSS Font Loading API](https://caniuse.com/css-font-loading)

## 参考

- [MDN - CSS Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API)
- [MDN - FontFaceSet](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet)
- [MDN - font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
