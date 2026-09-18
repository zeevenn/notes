---
title: JSI：JavaScript 与 C++ 的交互
date: 2026-09-18
category:
  - 前端
  - React Native
tag:
  - React Native
---

# JSI：JavaScript 与 C++ 的交互

JSI（JavaScript Interface）是一组 C++ 接口，用于操作 JavaScript 运行时、值、对象和函数。它使原生侧能够向 JS 暴露函数或对象，也能从 C++ 调用 JS，而不必把每次交互都组织为旧式 Bridge 消息。

## 从消息调用到函数入口

传统 Bridge 调用通常先生成模块、方法和参数组成的消息。通过 JSI，原生侧可以在 JS 运行时中安装一个函数；JS 调用它时，进入对应的 C++ 函数实现。

下面是安装 HostFunction 的概念示例，省略平台模块注册与生命周期接入：

```cpp
#include <jsi/jsi.h>
#include <utility>
using namespace facebook;

void installExample(jsi::Runtime& runtime) {
  auto addOne = jsi::Function::createFromHostFunction(
    runtime,
    jsi::PropNameID::forAscii(runtime, "addOne"),
    1,
    [](jsi::Runtime& rt, const jsi::Value&,
       const jsi::Value* args, size_t count) -> jsi::Value {
      if (count != 1 || !args[0].isNumber()) {
        throw jsi::JSError(rt, "Expected one number");
      }
      return jsi::Value(args[0].asNumber() + 1);
    }
  );
  runtime.global().setProperty(runtime, "addOne", std::move(addOne));
}
```

在正确运行时完成安装后，JS 才能调用 `globalThis.addOne(41)` 得到 42。这不是在应用里复制一段 JS 就会自动出现的 API；业务模块一般使用 TurboModules 建立规范接口。

## HostFunction 与 HostObject

HostFunction 把原生函数暴露为 JS 可调用函数。HostObject 让 JS 通过属性访问与方法入口操作由原生实现支持的对象。

例如图像库可以向 JS 暴露图像对象的引用，让操作留在原生侧，避免每次都把完整像素数组复制成 JS 数据。对象引用的生命周期、资源释放和并发访问仍由实现负责。

## 解决了哪些限制

JSI 降低了对批量消息与 JSON 风格数据表示的依赖，支持同步调用，也能表达由原生对象支持的接口。这为低延迟交互、同步读取和高吞吐媒体处理提供基础。

JSI 不承诺任意参数零复制。普通数组、字符串、平台对象之间仍可能发生转换；具体是否复制，取决于模块、引擎和数据表示。

## 同步调用的代价

同步 HostFunction 在返回之前占用当前调用路径。如果其中进行磁盘读取或耗时计算，JS 可能一直等待。调用 C++ 不等于切换到后台，返回 Promise 也不自动保证原生实现已卸载工作。

运行时与其值有线程和生命周期约束，不能随意从工作线程操作同一个 `jsi::Runtime`。后台任务完成后，要通过适当的调度机制回到允许访问运行时的线程，并处理应用重载或销毁。

## 参考资料

- [JSI 架构术语](https://reactnative.dev/architecture/glossary)
- [JSI 接口源码](https://github.com/facebook/react-native/blob/v0.82.0/packages/react-native/ReactCommon/jsi/jsi/jsi.h)
- [新架构交互](https://reactnative.dev/architecture/landing-page)
