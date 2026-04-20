---
title: 移动端适配方案 postcss-px-to-viewport
date: 2022-03-23
icon: shikou1
category:
  - practice
tag:
  - frontend
  - 移动端适配
  - postcss
---

由于 `px` 是固定单位，所以在不同设备上显示的大小是固定的，而不同设备又有不同大小，为了适配不同设备的单位大小，需要将 `px` 转换为视口单位。

确定方案之后，那么思考如何将 `px` 转为视口单位呢，一个一个算？不太可能，因为你事先并不知道用户手中的设备是什么大小，这样换算得到的结果并不能满足所有用户的需求，因此需要一个更为适用的方法。

这就需要用到一个插件：`postcss-px-to-viewport`。

## 安装

```
npm install postcss-px-to-viewport --save-dev
```

## 参数配置

新建 `postcss.config.js`，默认配置如下：

```js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 需要转换的单位
      viewportWidth: 320, // 设计稿的视口宽度
      unitPrecision: 5, // 单位转换后保留的精度
      propList: ['*'], // 能转换的vw属性列表
      viewportUnit: 'vw', // 希望使用的视口单位
      fontViewportUnit: 'vw', // 字体使用的视口单位
      selectorBlackList: [], // 需要忽略的css选择器
      minPixelValue: 1, // 设置最小的转换数值，如果为1，只有大于1的值才会被转换
      mediaQuery: false, // 媒体查询中是否需要转换单位
      replace: true, // 是否直接更换属性值
      exclude: undefined, // 忽略一些文件比如 node_modules
      include: undefined, // 如果设置了 include，则仅转换匹配的文件
      landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
      landscapeUnit: 'vw', // 横屏时使用的单位
      landscapeWidth: 568 // 横屏时使用的视口宽度
    }
  }
}
```

详细配置见 [postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)。

当全部设置完成后，重新运行项目，查看 css 属性，即可发现所有 `px` 单位全部变成了 `vw` 单位。

切换不同的设备时，大小会随之发生变化。
