---
title: 小程序常见方案与工具
date: 2026-09-18
category:
  - 前端
  - 微信小程序
tag:
  - 微信小程序
---

## 组件与状态

| 需求           | 方案                                                                                                                 | 说明                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 通用 UI 组件   | [TDesign 小程序](https://github.com/Tencent/tdesign-miniprogram)、[Vant Weapp](https://github.com/youzan/vant-weapp) | 提供表单、弹层、选择器等组件；按所用版本核对渲染后端支持情况  |
| 跨页面共享状态 | [mobx-miniprogram-bindings](https://github.com/wechat-miniprogram/mobx-miniprogram-bindings)                         | 配合 `mobx-miniprogram` 将共享状态绑定到页面或组件         |
| 自定义组件通信 | [属性与事件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html)                | 属性传入数据，`triggerEvent` 通知父组件                       |
| 滚动列表与刷新 | [scroll-view](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html)                           | 提供滚动、触底和下拉刷新能力；WebView 与 Skyline 支持的属性有所不同 |

组件库通过[小程序 npm 支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)接入；安装 npm 包后还需按项目配置构建 npm。

## 请求与登录

- [wx.request](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)：网络请求；同时核对[请求域名与证书配置](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。
- [小程序登录](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)：`wx.login` 获取临时凭证，业务服务端用临时凭证换取用户标识，再建立业务会话。
- [本地存储](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html)：保存设置、草稿和缓存；跨用户的数据按账号隔离。

## 分包与发布

- [分包配置](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html)与[预下载](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html)：将非入口功能拆分到其他代码包，按访问需要下载；预下载可提前获取后续可能访问的包。
- [miniprogram-ci](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)：在脚本或 CI 中构建 npm、生成预览和上传代码；上传后仍需完成平台审核与发布。
