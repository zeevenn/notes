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

**组件级等待（仅适用于 Canvas 等命令式绘制场景）：**

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

> [!WARNING]
> `useFont` **不能防止 DOM 文字的 FOUT**。`useEffect` 在浏览器首次绘制之后才执行，第一帧已经用后备字体上屏，`fonts.load()` 此时还没开始——等字体就绪后重新渲染，闪烁仍然发生。
>
> Canvas 之所以有效，是因为可以用 `if (!fontReady) return` 完全跳过第一帧的绘制，什么都不画，等 `loaded = true` 后再执行 `drawText()`。DOM 文字没有这个控制手段。
>
> **DOM 文字防 FOUT，应使用全局等待方案。**

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

## font-display 与 Font Loading API

`font-display` 是 CSS 层面的字体加载策略，Font Loading API 是 JavaScript 层面的控制手段，两者解决同一个问题，选一个主导即可。

| 值         | 阻塞周期 | 交换周期 | 说明                       |
| ---------- | -------- | -------- | -------------------------- |
| `auto`     | —        | —        | 由用户代理定义，**默认值** |
| `block`    | 短暂     | 无限     | FOIT，超时后显示后备字体   |
| `swap`     | 极小     | 无限     | 立即显示后备字体（FOUT）   |
| `fallback` | 极小     | 短暂     | 显示后备字体，交换窗口有限 |
| `optional` | 极小     | 无       | 浏览器自行决定是否使用字体 |

**与 Font Loading API 同时使用时的注意事项：**

- **`font-display: swap` + 全局 `await fonts.ready`** — 两者冲突。`swap` 告诉浏览器先用后备字体，但 `await` 在应用挂载前就等好了，字体已就绪再渲染，`swap` 的效果被覆盖，FOUT 不会出现。选了 Font Loading API 做全局等待，`font-display` 就不需要再设置。
- **`font-display: optional` + `fonts.load()`** — 危险组合。`optional` 在网络慢时浏览器会直接放弃加载字体，导致 `fonts.load()` 的 Promise 可能永远不 resolve，造成应用挂起。
- **Canvas 场景** — `font-display` 完全无关。Canvas 绕过了 CSS 渲染管线，直接走字体引擎，只有 Font Loading API 有效。

## 浏览器兼容性

Chrome 35、Firefox 41、Safari 10、Edge 79 起支持，覆盖率 96.72%，无需 polyfill（不支持 IE）。

- [caniuse - CSS Font Loading API](https://caniuse.com/css-font-loading)

## 参考

- [MDN - CSS Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API)
- [MDN - FontFaceSet](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet)
- [MDN - font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
