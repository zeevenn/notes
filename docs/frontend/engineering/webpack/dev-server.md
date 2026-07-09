---
title: webpack-server
date: 2022-05-17
category:
  - 工程化
tag:
  - 项目打包
  - webpack
---

> 项目地址：https://github.com/Stephen-wzw/webpack-demo

目前我们开发的项目，为了运行需要有两个操作：

* 操作一：`npm run build`，编译相关的代码；
* 操作二：通过 `live server` 或者直接通过浏览器，打开 `index.html` 代码，查看效果。

这个过程会影响我们的开发效率，我们希望当文件发生改变后，可以自动的完成编译并展示。为了完成自动编译，webpack 提供了几种可选的方式：

* webpack watch mode
* webpack-dev-server

## `watch`

webpack 给我们提供了 `watch` 模式，在该模式下，webpack 依赖图中的所有文件，只要有一个发生了更新，那么代码将会被重新编译，不需要再手动执行 `npm run build` 了。

为了配置 `watch` 模式，可以直接在 `package.json` 中修改脚本命令：

**package.json**

```diff
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
+   "watch": "webpack --watch"
  },
```

此时执行 `npm run watch`，webpack 会在配置中自动加上 `wathc: true` 的指令，这样以后所有的更新都会被检测到并重新编译。

## `webpack-dev-server`

虽然 `watch` 方式可以很便捷的帮我们重新编译打包，但操作二自动刷新浏览器其实是 live server 帮我们完成的。为了在**不使用** live server 的情况下完成 live reloading （实时重新加载）的功能，需要使用 `webpack-dev-server`。

> 开启 dev-server 后，`watch` 模式就不必要开启了。

```bash
npm install webpack-dev-server -D
```

在 `package.json` 中修改脚本命令：

**package.json**

```diff
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "watch": "webpack --watch",
+   "serve": "webpack serve"
  },
```

执行 `npm run serve` 后，webpack 内部会找到 `webpack-dev-server` 来开启服务。

> `webpack-dev-server` 在编译之后不会写入到任何输出文件，而是将打包的文件保留在内存中。

### 热模块替换（HMR）

热模块更新（Hot Module Replacement），指在应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个页面。

HMR 通过以下几种方式，提升开发效率：

* 不需重新加载整个页面，这样可以保留某些应用程序的状态不丢失；
* 只更新需要变化的内容，节省开发时间；
* 修改了 css、js 源代码，会立即在浏览器更新，相当于直接在浏览器的 devtools 中直接修改样式。

`webpack-dev-server` 内置支持 HMR，只需要开启即可。

> 在不开启 HMR 的情况下，整个页面会重新刷新，使用的是 live reloading。

**webpack.config.js**

```diff
  module.exports = {
    ...
+   devServer: {
+     hot: true
+   }
  }
```

在开启后，修改内容仍然是进行整个页面的重新刷新，因为你还没有告知 webpack 哪些模块需要热更新。现在修改 `index.js`。

**index.js**

```diff
  ...
  import { sum } from "./js/math.js";
+ if (module.hot) {
+   module.hot.accept("./js/math.js", () => {
+     console.log("模块更新了");
+   })
+ }
  ...
```

这时再修改 `math.js`，浏览器就不会再重新刷新整个页面了。

```bash
[webpack-dev-server] App updated. Recompiling...
[webpack-dev-server] App hot update...
[HMR] Checking for updates on the server...
HMR111
模块更新了
[HMR] Updated modules:
[HMR]  - ./src/js/math.js
[HMR] App is up to date.
```

而在真实开发中，难道每个文件都需要手动指定 HMR 吗？事实上不需要这么麻烦。

在 Vue 开发中，使用 `vue-loader` 就能支持 vue 组件的 HMR。React 开发中，有 React Hot Loader，实时调整 React 组件（目前 React 官方已经弃用了，改成使用 react-refresh）；

可以试试修改之前的 `App.vue` 组件，不需任何手动配置即可达到 HMR 的效果。

### 其他配置

#### `host` 

可以设置主机地址，默认值为 localhost，还可以设置为 0.0.0.0。

localhost 和 0.0.0.0 的区别：

* localhost：本质上是一个域名，通常情况下会被解析成 127.0.0.1；
* 127.0.0.1：回环地址(Loop Back Address)，表达的意思其实是我们主机自己发出去的包，直接被自己接收，正常的数据包经过应用层 - 传输层 - 网络层 - 数据链路层 - 物理层，而回环地址，是在网络层直接就被获取到了，是不会经过数据链路层和物理层的。比如我们监听 127.0.0.1 时，在同一个网段下的主机中，通过 ip 地址是不能访问的，只能本机访问；
* 0.0.0.0：监听 IPV4 上所有的地址，再根据端口找到不同的应用程序，比如我们监听 0.0.0.0 时，在同一个网段下的主机中，通过 ip 地址是可以访问的;

#### `port` 

可以配置端口号。

#### `open` 

默认值为 false，设置为 true 会自动打开浏览器，也可以设置 Chrome Google 等值。

#### `compress`

是否为静态文件开启 gzip 压缩，默认值为 false，可以设置为 true。

#### `proxy`

可以设置代理解决跨域访问的问题。比如一个 api 请求是 http://localhost:8888，但是本地客户端的域名是 http://localhost:8000，这时发送请求就会出现跨域的问题。

这时可以先将请求发送到一个代理服务器，代理服务器和 API 服务器没有跨域问题，就可以解决跨域问题。`proxy` 有如下设置：

```js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        pathRewrite: {
          "^/api": ""
        },
        secure: false,
        changeOrigin: true
      }
    }
  }
}
```

* `target`：表示代理到的目标地址，比如 target:  /api/moment 会被代理到 http://localhost:8888/api/moment；
* `pathRewrite`：默认情况下，/api 也会被写入到 URL 中（http://localhost:8888/api/moment），如果希望删除，可以使用 `pathRewrite`；
* `secure`：默认（true）情况下不接收转发到 http 服务器上，如果希望支持 http，可以设置为 false；
* `changeOrigin`：是否更新代理后请求的 headers 中 host 地址。
  
> 关于 `changeOrigin`：因为我们真实的请求虽然是通过 http://localhost:8888 来代理的，但是默认情况下 host 的值还会是 http://localhost:8000，如果我们需要修改为 http://localhost:8888，那么可以将 `changeOrigin` 设置为 true 即可。
> 修改 host 的原因在于有些服务器可能为了防止爬虫，在服务器中做了关于 headers 的校验，因此一般将 `changeOrigin` 设置为 true。

## 总结

这个案例中搭建了本地开发服务器，有两种方式：`watch` 和 `webpack-dev-server`。`webpack-dev-server` 中自带 HMR，可以指定某个模块开启 HMR，以及 dev-server 中的一些其他配置。