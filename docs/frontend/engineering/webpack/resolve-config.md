---
title: webpack-resolve
date: 2022-05-17
category:
  - 工程化
tag:
  - 项目打包
  - webpack
---

> 项目地址：https://github.com/Stephen-wzw/webpack-demo

在开发中会有各种各样的模块，这些文件可能自己编写，也可能来自第三方库。`resolve` 选项能设置模块如何被解析。webpack 会提供合理的默认值，但是还是可能会修改一些解析的细节。

## webpack 解析规则

### 绝对路径

```js
import '/home/me/file';

import 'C:\\Users\\me\\file';
```

由于以及获得文件的绝对路径，因此不需要再做进一步解析。

### 相对路径

```js
import '../src/file1';
import './file2';
```

在这种情况下，使用 `import` 或 `require` 的资源文件所处的目录，被认为是上下文目录。在 `import/require` 中给定的相对路径，会拼接此上下文路径，来生成模块的绝对路径。

### 模块路径

```js
import 'module';
import 'module/lib/file';
```

模块会在 resolve.modules 中指定检索模块，默认值为 ['node_modules]，所以默认是从 `node_modules` 下查找文件。

### 确定文件还是文件夹

一旦根据上述规则解析路径后，resolver 将会检查路径是指向文件还是文件夹。如果路径指向文件：

* 如果文件具有扩展名，则直接将文件打包。
* 否则，将使用 `resolve.extensions` 选项作为文件扩展名来解析，此选项会告诉解析器在解析中能够接受那些扩展名（例如 .js，.jsx）。

如果路径指向一个文件夹，则进行如下步骤寻找具有正确扩展名的文件：

* 根据 `resolve.mainFields` 配置中的字段顺序查找，默认值是 `['index']`；
* 然后使用 `resolve.extensions` 选项，以类似的方式解析文件扩展名。

## `extensions` 和 `alias` 配置

`extensions` 选项可以在解析到文件时自动添加扩展名。默认值为 `['.wasm', '.mjs', '.js', '.json']`。

`alias` 可以为路径配置别名，当项目结构比较深时，一个文件的路径可能加上 `../../../` 这种路径片段。就可以给常见的路径配置别名了。

```js
resolve: {
  extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.vue', '.ts'],
  alias: {
    '@': path.resolve(__dirname, './src'),
    'js': path.resolve(__dirname, './src/js')
  }
}
```