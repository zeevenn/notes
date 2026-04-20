---
title: 快速开始
date: 2024-07-19
icon: STARTUP
category:
  - Pixi
tag:
  - basic-knowledge
---

[PixiJS](https://pixijs.com/) 的核心是一个使用 WebGL（或 Canvas）显示图像或其他 **2D** 可视化内容的呈现系统。

它提供了一个完整的场景图（要呈现的对象的层次结构），并提供交互支持以处理点击和触摸事件。

在现代 HTML5 世界中，它是 Flash 的天然替代品，但却能提供更好的性能和像素级的效果，超越了 Flash 所能达到的水平。

它非常适合网络游戏、教育内容、交互式广告、数据可视化......任何基于网络的、需要复杂图形的应用程序。

与 Cordova 和 Electron 等技术相结合，PixiJS 应用程序可以作为移动和桌面应用程序在浏览器之外发布。

## 创建 pixi 应用

`Application` 是一个简化 PixiJS 工作的辅助类。 它能创建呈现器、创建舞台并启动一个用于更新的 ticker。

`Application` 类还有一个 `init` 方法，它将使用给定的选项初始化应用程序。因为 PixiJS 使用了 WebGPU，因此该方法是异步的。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://pixijs.download/release/pixi.js"></script>
  </head>
  <body>
    <h1>Hello PixiJS</h1>

    <script type="module">
      const app = new PIXI.Application()
      await app.init({ width: 640, height: 360 })
      document.body.appendChild(app.canvas)
    </script>
  </body>
</html>
```

![create pixi app](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240719160224.png)

## 创建 Sprite

到目前为止，我们所做的只是准备工作。 我们还没有告诉 PixiJS 绘制任何东西。 让我们添加一张要显示的图片来解决这个问题。

在 PixiJS 中绘制图像有多种方法，但最简单的方法是使用 [Sprite](https://pixijs.download/release/docs/scene.Sprite.html)。 Sprite 是一种容器类型，它封装了加载的图像资源，允许对其进行绘制、缩放、旋转等操作。

```js
// load the PNG asynchronously
await PIXI.Assets.load('sample.png')
let sprite = PIXI.Sprite.from('sample.png')
```

![sample](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/sample.png)

## 将 Sprite 添加至 Stage

最后，我们需要将 Sprite 添加到 Stage 上。Stage 只是一个容器，是场景图的根。Stage 容器的每个子容器都将在每一帧中进行渲染。将 Sprite 添加到 Stage 后，我们就告诉了 PixiJS 的渲染器我们要绘制它。

```js
app.stage.addChild(sprite)
```

## 更新 loop

虽然可以将 PixiJS 用于静态内容，但对于大多数项目而言，都希望添加动画。

示例应用程序希望每秒在同一位置多次渲染同一个 Sprite。

要使图像移动，我们只需每帧更新一次属性即可。为此，我们要挂钩应用程序的 `ticker`。`ticker` 是一个 PixiJS 对象，每帧运行一个或多个回调。

只需调用 `app.ticker.add(...)`，给它传递一个回调函数，然后在该函数中更新场景。它将在每一帧中被调用，你可以移动、旋转等任何你想要的方式来驱动项目的动画。

```js
// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0
// Tell our application's ticker to run a new callback every frame, passing
// in the amount of time that has passed since the last tick
app.ticker.add((ticker) => {
  // Add the time to our total elapsed time
  elapsed += ticker.deltaTime
  // Update the sprite's X position based on the cosine of our elapsed time.  We divide
  // by 50 to slow the animation down a bit...
  sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0
})
```

## all done

现在，我们已经创建了一个简单的应用程序，可以在浏览器中运行。

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://pixijs.download/release/pixi.min.js"></script>
  </head>
  <body>
    <script type="module">
      // Create the application helper and add its render target to the page
      const app = new PIXI.Application()
      await app.init({ width: 640, height: 360 })
      document.body.appendChild(app.canvas)

      // Create the sprite and add it to the stage
      await PIXI.Assets.load('sample.png')
      let sprite = PIXI.Sprite.from('sample.png')
      app.stage.addChild(sprite)

      // Add a ticker callback to move the sprite back and forth
      let elapsed = 0.0
      app.ticker.add((ticker) => {
        elapsed += ticker.deltaTime
        sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0
      })
    </script>
  </body>
</html>
```
