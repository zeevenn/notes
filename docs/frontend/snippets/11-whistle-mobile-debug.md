---
title: whistle 调试真机
date: 2024-07-29
icon: debug
category:
  - practice
tag:
  - debug
---

在前端开发中移动端开发技能必不可少。当我们遇到类似于这样的问题：

- 移动端 `Canvas` 渲染失败
- 微信获取 `openId` 回调页不匹配
- 微信浏览器文件上传失败
- 支付宝，微信 `H5` 支付域名校验不匹配
- 生产环境 BUG，测试环境无法复现
- 当后端接口启用 `cors` 跨域时，本地环境无法访问

`Chrome` 模拟器和微信开发者工具等都无法完美复现我们遇到的问题，这时候我们需要用到 `whistle` 来实现真机调试

## Whistle

[whistle](https://wproxy.org/whistle/)（读音[ˈwɪsəl]，拼音[wēisǒu]）基于 Node 实现的跨平台 web 调试代理工具。

它的作用可以理解为用 Node 开一个代理服务器，将我们需要调试的设备代理到 `whistle` 后，由 `whistle` 进行代理请求。同时 `whistle` 支持类似于 hosts 的转发规则，我们可以通过正则或者内置的一些指令对我们需要进行代理的域名进行转发，添加插件等。

### 安装启动

安装 `whistle`：

```sh
npm install whistle -g
```

启动 `whistle`：

```sh
w2 start
```

启动完成后，默认会在 `localhost:8899` 端口监听。

### 设置代理

#### 移动端

电脑与手机连接同一 wifi，在手机端 wifi 中设置代理为手动，输入代理 ip（启动 `whistle` 后在控制台中打印的局域网 ip），端口号为 `8899`。

保存后移动端则已经设置好代理，在手机浏览器中访问互联网，即可以在 `whistle` 控制台中抓取到相应的网络请求。

#### PC 端

PC 端有时也需要通过 `whistle` 控制台设置代理修改请求信息或者配置 `source map` 文件，下面介绍如何使用 `Proxy switchyOmega` 插件设置代理。

在扩展商店中搜索安装 `Proxy switchyOmega` 插件，下载完成后，默认会有一个 `proxy` 的情景模式，设置代理服务器为 `127.0.0.1`，端口号为 `8899` 保存并应用选项。

![设置情景模式](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240729163103.png)

这里还推荐修改一个配置，将默认配置改为系统代理，避免日常使用时被代理到 `whistle`，无法科学上网。

![修改默认配置](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240729163028.png)

### 安装证书

参考 [官方文档](https://wproxy.org/whistle/webui/https.html) 即可。

## 真机调试

打开 `whistle` 控制台，左侧有个 `Rules`，在这里面可以进行一些跳转规则的分组，配置。

### resMerge

由于大部分 webapp 是嵌入到 webview 中，因此需要更改响应结果中的 `webAppUrl` 路径。

```
https://xxxx resMerge://(webAppUrl=https://localhost:3000/index.html?isWebApp=true)
```

### tpl

tpl 基本功能跟 file 一样可以做本地替换，但 tpl 内置了一个简单的模板引擎，可以把文件内容里面 `{name}` 替换请求参数对应的字段(如果不存在对应的自动则不会进行替换)，一般可用于 mock jsonp 的请求。

在 `values` 面板中创建一个文件，名字为 `mockConfig.json`，内容如下：

可以直接修改返回结果：

```
https://xxxx tpl://{mockConfig.json}
```

### 注入 eruda

安装 `whistle.inspect` 插件，该插件即成了 [eruda](https://github.com/liriliri/eruda) 等调试工具，用来在移动端页面上模拟 Chrome 开发者工具功能的模块。

```shell
w2 i whistle.inspect
```

配置如下：

```
https://localhost:3000/index.html whistle.inspect://eruda disable://cache
```

这个配置的作用是当访问到 `localhost:3000` 时，页面会自动注入 `eruda` 调试工具。

## Chrome inspect

有些时候，使用 `whistle` 注入调试工具的效果并不是很好，因此我们可以使用 Chrome inspect 来替代。

### 准备工作

需要的工具：

- PC 安装 Chrome 浏览器
- 安卓手机
- 数据线

### 操作步骤

打开手机开发者选项，允许 USB 调试。

::: tip

不同安卓设备打开方式不同，根据品牌谷歌搜索打开方式。

:::

谷歌浏览器输入 `chrome://inspect/` 打开调试工具，点击 `inspect` 按钮即可调试网页。

![inspect](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240821141307.png)

::: warning

应该只能调试 chrome 内核的浏览器。

:::
