---
title: Rspack
date: 2023-01-03
icon: creative
category:
  - 工程化
tag:
  - 项目打包
  - rspack
---

## Why Rspack?

面对大型项目，开发和生产环境的构建需要耗费很长时间。

组内实际项目在生产环境中构建需要接近 30 分钟。

按照官方说法，Rspack 拥有：

- 快速的 Dev 启动性能
- 高效的 Build 性能
- 灵活的配置
- 生产环境的优化能力

## Rspack 创建项目

使用 Rspack CLI：

```shell
pnpm create rspack@latest
```

目前支持三种模版：

- react
- react-ts
- vue

用该命令创建的项目 Rspack 不是最新，因此选择从零开始。 (11 月 29 日 已适配为最新版本。)

## 从零开始

安装相关依赖。

```shell
pnpm init
pnpm install react react-dom
pnpm install -D typescript @types/react @types/react-dom
pnpm install -D @rspack/cli @rspack/core
```

为了快速启动项目，直接将所有文件内容复制，然后启动项目，报错：

![报错](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240103130024.png)

从官网中查看 [迁移示例](https://github.com/rspack-contrib/rspack-examples/pull/2)，并未得到有用信息。复制错误信息 `JavaScript parsing error` 搜索 issue。

在 [issue 官网示例报错](https://github.com/web-infra-dev/rspack/issues/4745) 中找到解决方法：

这里按照官方解答无效，查看 `rspack-template` 最新配置如下：

```ts
{
	test: /\.(jsx?|tsx?)$/,
	use: [
		{
			loader: "builtin:swc-loader",
			options: {
				sourceMap: true,
				jsc: {
					parser: {
						syntax: "typescript",
						tsx: true
					},
					transform: {
						react: {
							runtime: "automatic",
							development: isDev,
							refresh: isDev
						}
					}
				},
				env: {
					targets: [
						"chrome >= 87",
						"edge >= 88",
						"firefox >= 78",
						"safari >= 14"
					]
				}
			}
		}
	]
}
```

## Rspack VS Webpack

常见语言与资源模块支持对比如下：

| 语言/资源 | 支持(Rspack/Webpack)                                                           |
| --------- | ------------------------------------------------------------------------------ |
| CSS       | "style-loader", "css-loader"                                                   |
| PostCSS   | "postcss-loader", "style-loader", "css-loader", "postcss-loader"               |
| Less      | "less-loader", "style-loader", "css-loader", "postcss-loader", "less-loader"   |
| Sass      | "sass-loader", "style-loader", "css-loader", "postcss-loader", "sass-loader"   |
| 图片      | type: "asset", type: "asset"                                                   |
| TS        | 内置 SWC, "ts-loader" or "babel-loader"                                        |
| JSX/TSX   | "babel-loader", "presets": ["@babel/preset-react", "@babel/preset-typescript"] |

## 阅读 - Bundler 的设计取舍

原文地址：[Bundler 的设计取舍](https://github.com/orgs/web-infra-dev/discussions/4)

### Why We Build Rspack

::: info 原文

性能始终是 Webpack 绕不开的话题，虽然我们尝试了各种 Webpack 的优化方式，如 swc-loader、esbuild-loader、thread-loader、cache-loader、MFSU、Persistent Cache 等等。

但是最终就是这些方案虽然可能缓解一部分的性能问题，面对大型项目仍然捉襟见肘，另一方面这些方案导致构建过程更加黑盒化。

如 Persistent Cache 依赖业务配置良好的 build dependencies，esbuild-loader 不支持 es5 的降级，cache-loader 忘记清理 cache 导致产物没更新。

:::

| 优化方式         | 优点                                                                                                                                    | 缺点                                                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| swc-loader       | SWC 是一个用 Rust 编写的超快的 JavaScript/TypeScript 编译器。swc-loader 使 Webpack 可用 SWC 作为编译器，取代 Babel。                    | 在处理老版本（如 ES5）的 JavaScript 语法兼容性问题时，可能表现不如 Babel.                                                              |
| esbuild-loader   | esbuild 是一个 JavaScript 打包器和压缩器，速度极快。esbuild-loader 同样替代 Babel，性能提升更大。                                       | 同上                                                                                                                                   |
| thread-loader    | thread-loader 允许 Webpack 使用多线程加载和编译，提升构建速度。                                                                         | 可能会增加硬件资源（如 CPU 和内存）的使用。对于资源受限的环境（如某些 CI/CD 环境或者低端硬件），可能导致构建失败。                     |
| cache-loader     | cache-loader 缓存其他 loader 的执行结果。当源文件没有变化时，Webpack 可以直接使用缓存的结果，避免重复工作。                             | 忘记清理 cache 导致产物没更新                                                                                                          |
| MFSU             | 对于不常改变的模块，通过 MFSU 可以预编译并复用它们，缩短构建时间。                                                                      | 如果模块数量较大或模块本身较大，预编译所需的时间可能较长，甚至可能导致构建速度下降而非提升。此外，这种优化可能使得代码的调试更为困难。 |
| Persistent Cache | 从 Webpack 5 开始，提供了持久化缓存特性。它会在硬盘上保存一些构建信息，对于经常进行的构建任务，来自持久化缓存的信息可使构建速度快很多。 | 如果业务的构建依赖项配置不恰当，Persistent Cache 有可能导致产物与预期不一致，使得构建过程更加“黑盒化”。                                |

::: info 原文

Rollup 的产物优化能力相比弱了不少，尤其是缺失 Bundle Splitting 等能力导致业务很难做精细的优化，因此内部有不少业务是 dev 下运行 Vite，生产环境用 Webpack，这导致开发和生产存在着较大的差异。

:::

「产物优化能力」通常指的是一种工具在构建后产生的代码中应用优化的能力。这类优化可以包括 代码压缩（移除无用的代码或者空格、注释）、代码拆分（将大的代码块拆分为多个较小的模块，以实现并行加载或延迟加载）、抽取公共的模块（例如将多次使用的库抽取出来，避免重复打包）、树摇（剔除项目中未引用的代码）等等。

由于 Rollup 设计之初主要为库作者服务，其支持的一些功能可能没有 Webpack 那么强大。比如，Webpack 提供了非常强大的代码分割（code splitting）和长缓存优化（long term caching optimisation）功能，即你提到的 Bundle Splitting 能力。这些功能对于构建大型、复杂的应用程序非常有用。

Vite 使用 Rollup 作为生产环境构建工具，它非常适合于小型到中型项目，因为它速度快。但当你面对一个大型项目，可能需要用到更高级的优化手段时，Webpack 可能会是更好的选择。

### How We Build Rspack

::: info 原文

最终导致转向了 Webpack 架构。

:::

#### 一等公民

Rollup 则是只有 Javascript 才是一等公民，而 Webpack 5 支持了更多的一等公民模块。

#### 插件 API 设计

插件设计对比：

| 插件机制                                                                                                                                                                                                   | Rollup                                                                                                                    | Webpack                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 模块转换 <br/> 过滤器（filter）：即过滤哪些模块进行转换。<br/>转换器（transformer）: 即对过滤模块进行怎样的转换。<br/>模块类型转换（change module type）: 即我们可能需要将一个模块从 A 类型转换成 B 类型。 | 三个维度揉进了一个 transform hook 里：<br/>- 高频的 callback 通信<br/>- 用户灵活性的丧失<br/>- 丧失了模块转换逻辑的组合性 | 过滤器：rule.test<br/>转换器：@svgr/webpack loader<br/>类型转换：inlineMatchResource |
| AST 复用                                                                                                                                                                                                   | -                                                                                                                         | -                                                                                    |

### Beyond Webpack

使用 Rust 来实现一套 Webpack 架构（最好能复用 Webpack 生态的插件/loader）的、同时又通过自定义一些具体实现（例如缓存和 swc）来提升构建效率的工具。
