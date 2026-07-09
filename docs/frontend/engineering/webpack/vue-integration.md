---
title: webpack-vue
date: 2022-05-16
category:
  - 工程化
tag:
  - 项目打包
  - webpack
---

> 项目地址：https://github.com/Stephen-wzw/webpack-demo

平时我们可以通过 Vue-cli 快速搭建 Vue 开发环境，但是要知道 Vue-cli 也是基于 webpack 构建的，那么如何使用 webpack 搭建 Vue 开发环境呢？

前面已经了解了 webpack 如何对 js、css、图片、字体等其他资源进行打包处理，而想要搭建 Vue 开发环境，主要就是对 `.vue` 文件进行处理。

## 准备

现在 Vue@3.x 已经发布了，因此需要安装 `vue@next`。

```bash
npm install vue@next
```

在 `src` 文件夹下新增 `vue` 文件夹，新建 `App.vue` 文件，同时在 `index.js` 中导入：

**project**

```diff
  webpack-demo
  |- node_modules
  |- package-lock.json
  |- package.json
  |- postcss.config.js
  |- babel.config.js
  |- webpack.config.js
  |- /public
    |- favicon.ico
    |- index.html
  |- /src
    |- /css
      |- style.css
      |- title.less
    |- /font
      |- iconfont.css
      |- iconfont.eot
      |- iconfont.ttf
      |- iconfont.woff
      |- iconfont.woff2
    |- /img
      |- avatar.png
      |- wallpaper.png
    |- /js
      |- format.js
      |- math.js
+   |- /vue
+     |- App.vue
    |- index.js
```

**App.vue**

```vue
<template>
  <h2>我是Vue渲染出来的</h2>
  <h2>{{title}}</h2>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello Vue"
    }
  }
}
</script>

<style>

</style>
```

**index.js**

```diff
+ import { createApp } from "vue";
 
  import { sum } from "./js/math.js";
  const { priceFormat } = require("./js/format");
  
+ import App from "./vue/App.vue";
  
  import "./css/style.css";
  import "./css/title.less";
  import "./font/iconfont.css";
  
  // 导入图片
  import avatar from "./img/avatar.png";
  
  console.log(sum(10, 20));
  console.log(priceFormat());
  
  const div = document.createElement("div");
  div.className = "title";
  div.innerHTML = "webpack-css";
  
  // 方式一：设置 img 元素的 src
  const imgEl = document.createElement("img");
  imgEl.src = avatar;
  
  // 方式二：设置背景图片
  const bgEl = document.createElement("div");
  bgEl.className = "image-bg";
  
  // i元素
  const iEl = document.createElement('i');
  iEl.className = "iconfont icon-ashbin";
  
  document.body.appendChild(div);
  document.body.appendChild(imgEl);
  document.body.appendChild(bgEl);
  document.body.appendChild(iEl);
  
  // babel
  const messages = [1, 2, 3];
  messages.map((n) => n + 1);
  
+ // vue
+ const app = createApp(App);
+ app.mount("#app");
```

## 配置 webpack

默认情况下 `vue-loader` 是对 Vue@2.x 准备的，而我们是 Vue@3.x，因此需要安装 `vue-loader@next`，而 `vue-loader` 又依赖于 `@vue/compiler-sfc` 的，因此也需要安装。

```bash
npm install vue-loader@next @vue/compiler-sfc -D
```

修改 `webpack.config.js` 配置：

**webpack.config.js**

```diff
  //...
+ const { VueLoaderPlugin } = require("vue-loader/dist/index");
  //...
  
  module.exports = {
    module: {
      rules: [
        ...
+       {
+         test: /\.vue$/,
+         loader: "vue-loader"
+       }
        //...
      ]
    }
    plugins: [
      ...
+     new VueLoaderPlugin()
      ...
    ]
  }
```

执行 `npm run build`，打开浏览器可以看到渲染正常。但是浏览器控制台出现了一个警告：

```bash
runtime-core.esm-bundler.js:4432 Feature flags __VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__ are not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.
```

这是因为从 3.0.0-rc.3 开始，Vue 希望我们手动设置全局标识，这样做的好处是可以对最终的打包代码进行 tree-shaking 优化。

全局标识有两个：

* \_\_VUE_OPTIONS_API\_\_（是否支持 Options API，默认为 `true`）
* \_\_VUE_PROD_DEVTOOLS\_\_（是否在生产环境中支持 devtools，默认为 `false`）

为了在 webpack 中配置全局标识，可以使用 `DefinePlugin`。

**webpack.config.js**

```diff
  module.exports = {
    plugins: [
      ...
      new DefinePlugin({
        BASE_URL: "'./'",
+       __VUE_OPTIONS_API__: true,
+       __VUE_PROD_DEVTOOLS__: false
      }),
      ...
    ]
  }
```

这时重新打包后，浏览器控制台的警告就会消除了。

## 总结

在这个案例中对 .vue 单文件进行了解析：安装 `vue-loader` 和 `@vue/compiler-sfc`，同时配置 `VueLoaderPlugin`，在重新打包后浏览器控制台会报一个全局标识的警告，通过配置 `DefinePlugin` 手动配置全局标识消除全局标识警告。