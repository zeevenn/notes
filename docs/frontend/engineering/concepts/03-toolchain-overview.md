---
title: 工具链
date: 2023-12-23
category:
  - 工程化
tag:
  - frontend
---

## JavaScript

问题：

- API 兼容，polyfill: core.js
- 语法增强（compiler），syntax transformer(regenerator)，jsx，tsc...

babel 代码编译工具

- @babel/core
- @babel/preset-env

source code -- ast

swc(rust) 对标 babel

https://github.com/estree/estree

https://github.com/bramblex/jsjs

## CSS

问题：

- 语法缺失（循环、判断、拼接）
- 功能缺失（颜色函数、数学函数、自定义函数）

sass/less/stylus --> 预处理器 --> css --> postcss（后处理器） --> polyfill、代码压缩、剪枝

https://postcss.org/

![20231223162446](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20231223162446.png)

## 构建工具

以 webpack 为例。

1. 入口：通过入口分析依赖关系；
2. 开发服务器：webpack serve --> webpack dev server --> express --> 源码变更 --> 浏览器刷新（强制刷新、HMR）websocket
3. 文件指纹（hash），涉及到缓存，类似 [HTTP ETag](../../computer-science/networking/005-HTTP-cache.md#etag-和-if-none-match)
4. sourcemap
5. ...

## 脚手架

提供界面与交互、提供工程模版

- cra：深度定制，配置需要 eject 或使用 react-rewired 和 customize-cra
- vue-cli：支持配置覆盖，折中方案
- ...
