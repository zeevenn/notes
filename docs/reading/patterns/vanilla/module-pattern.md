---
title: 模块模式
date: 2024-09-19
icon: box
author: patterns
category:
  - reading
tag:
  - design pattern
  - vanilla
  - module-pattern
---

随着应用程序和代码库的增长，保持代码的可维护性和分离性变得越来越重要。模块模式可以将代码分割成更小的、可重复使用的片段。

除了可以将代码分割成更小的、可重复使用的片段外，模块还可以将文件中的某些值保持私有。默认情况下，模块中的声明会被作用域（封装）到该模块。如果我们没有明确导出某个值，那么该值在该模块之外就不可用。这就降低了代码库其他部分声明的值发生名称冲突的风险，因为这些值在全局范围内不可用。

更详细的内容可以见 [模块化](../../../frontend/engineering/concepts/modularization.md)。
