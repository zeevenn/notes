---
title: WebAssembly
date: 2026-05-09
icon: wasm
category:
  - 浏览器
tag:
  - 浏览器
  - 性能
---

WebAssembly（简称 WASM）是一种在浏览器中运行的**二进制指令格式**，可以将 C/C++/Rust 等语言编译成 WASM 在浏览器中执行，性能接近原生代码。

## 为什么比 JS 快

| | JavaScript | WebAssembly |
| --- | --- | --- |
| **格式** | 文本，需解析 | 二进制，直接解码 |
| **类型** | 动态类型，运行时推断 | 静态类型，编译时确定 |
| **优化** | JIT 编译，需要热身 | AOT 编译，直接生成机器码 |
| **内存** | GC 管理，有停顿 | 手动管理线性内存，无 GC |

WASM 的速度优势主要体现在**计算密集型任务**上，IO 密集型场景与 JS 差别不大。

## 适用场景

- **音视频编解码**：FFmpeg 编译为 WASM（如 Web 端视频转码）
- **语音检测**：VAD（Voice Activity Detection）模型在浏览器端运行
- **图像处理**：Photoshop Web 版的核心渲染层
- **游戏引擎**：Unity、Unreal Engine 导出 Web 版
- **加密运算**：bcrypt 等计算密集型算法
- **科学计算**：数值模拟、矩阵运算

## 与 JS 互操作

WASM 模块不能直接操作 DOM，需要通过 JS 作为胶水层：

```js
// 加载 .wasm 文件
const { instance } = await WebAssembly.instantiateStreaming(
  fetch('/vad.wasm'),
  importObject // 可传入 JS 函数供 WASM 调用
)

// 调用 WASM 导出的函数
const result = instance.exports.processAudio(bufferPtr, length)
```

**数据传递**：WASM 通过线性内存（`WebAssembly.Memory`）与 JS 共享数据，本质是一块 `ArrayBuffer`，两侧都可以读写。

## 实际使用方式

直接手写 WASM 汇编几乎不可能，实际工程中有两条路：

1. **用现成库**：直接引入已编译好的 WASM 包（如 `@ricky0123/vad-web`、`ffmpeg.wasm`），不需要了解编译过程
2. **自行编译**：用 Emscripten（C/C++）或 wasm-pack（Rust）将源码编译为 WASM + JS 胶水代码

## 参考

- [MDN - WebAssembly](https://developer.mozilla.org/zh-CN/docs/WebAssembly)
- [WebAssembly 官网](https://webassembly.org/)
