---
title: 场景图像
date: 2024-08-08
icon: scene
category:
  - Pixi
tag:
  - basic-knowledge
---

每一帧，PixiJS 都会更新并渲染场景图。让我们来谈谈场景图中有哪些内容，以及它如何影响项目开发。

## 场景图是一棵树

场景图的根节点是由应用程序维护的容器，用 `app.stage` 引用。将 sprite 或其他可渲染对象作为子对象添加到 stage 时，它就会被添加到场景图中，并进行渲染和交互。

PixiJS 容器也可以有子对象，因此当你构建更复杂的场景时，最终会形成一棵父子关系树，stage 是整个场景树的根节点。Chrome 浏览器的 [Pixi.js devtools](https://chromewebstore.google.com/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon) 插件是一个探索项目的有用工具，它允许你在项目运行时实时查看和操作场景图！）。

## Parents and Children

父节点移动时，其子节点也会移动。旋转父节点时，其子节点也会旋转。隐藏父对象，子对象也会被隐藏。如果一个游戏对象由多个精灵组成，可以将它们收集到一个容器中，将它们视为世界中的一个对象，作为一个整体移动和旋转。

在每一帧中，PixiJS 都会运行场景图，从根开始向下穿过所有子对象，直到叶子，以计算每个对象的最终位置、旋转、可见性、透明度等。

如果父对象的 alpha 设置为 0.5（使其透明 50% ），那么它的所有子对象也将从 50% 开始透明。如果将一个子对象的 alpha 设置为 0.5，它就不会是 50% 透明，而是 0.5 x 0.5 = 0.25 alpha，即 75% 透明。同样，对象的位置是相对于父对象而言的，因此如果父对象的 x 位置设置为 50 像素，而子对象的 x 位置设置为 100 像素，那么它将在屏幕偏移 150 像素处绘制，即 50 + 100。

下面是一个示例。我们将创建三个精灵，每个都是上一个精灵的子精灵，并对它们的位置、旋转、缩放和 alpha 进行动画处理。尽管每个精灵的属性都设置为相同的值，但父子链会放大每个变化：

```js
// Create the application helper and add its render target to the page
const app = new Application();
await app.init({ width: 640, height: 360 })
document.body.appendChild(app.canvas);

// Add a container to center our sprite stack on the page
const container = new Container({
  x:app.screen.width / 2,
  y:app.screen.height / 2;
});

app.stage.addChild(container);

// load the texture
await Assets.load('assets/images/sample.png');

// Create the 3 sprites, each a child of the last
const sprites = [];
let parent = container;
for (let i = 0; i < 3; i++) {
  let wrapper = new Container();
  let sprite = Sprite.from('assets/images/sample.png');
  sprite.anchor.set(0.5);
  wrapper.addChild(sprite);
  parent.addChild(wrapper);
  sprites.push(wrapper);
  parent = wrapper;
}

// Set all sprite's properties to the same value, animated over time
let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta.deltaTime / 60;
  const amount = Math.sin(elapsed);
  const scale = 1.0 + 0.25 * amount;
  const alpha = 0.75 + 0.25 * amount;
  const angle = 40 * amount;
  const x = 75 * amount;
  for (let i = 0; i < sprites.length; i++) {
    const sprite = sprites[i];
    sprite.scale.set(scale);
    sprite.alpha = alpha;
    sprite.angle = angle;
    sprite.x = x;
  }
});
```

场景图中任何给定节点的累计平移、旋转、缩放和倾斜值都存储在对象的 `worldTransform` 属性中。 同样，累积的 alpha 值也存储在 `worldAlpha` 属性中。

![sample](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/Aug-08-2024%2011-58-35.gif)

## 渲染顺序

因此，我们有一个树需要渲染，那么渲染顺序是什么？

PixiJS 会从树根开始向下渲染。在每一级，先渲染当前对象，然后按插入顺序渲染每个子对象。请看下面的示例：两个父对象 A 和 D，以及 A 下的两个子对象 B 和 C：

```js
// Create the application helper and add its render target to the page
const app = new Application()
await app.init({ width: 640, height: 360 })
document.body.appendChild(app.canvas)

// Label showing scene graph hierarchy
const label = new Text({
  text: 'Scene Graph:\n\napp.stage\n  ┗ A\n     ┗ B\n     ┗ C\n  ┗ D',
  style: { fill: '#ffffff' },
  position: { x: 300, y: 100 }
})

app.stage.addChild(label)

// Helper function to create a block of color with a letter
const letters = []
function addLetter(letter, parent, color, pos) {
  const bg = new Sprite(Texture.WHITE)
  bg.width = 100
  bg.height = 100
  bg.tint = color

  const text = new Text({
    text: letter,
    style: { fill: '#ffffff' }
  })

  text.anchor.set(0.5)
  text.position = { x: 50, y: 50 }

  const container = new Container()
  container.position = pos
  container.visible = false
  container.addChild(bg, text)
  parent.addChild(container)

  letters.push(container)
  return container
}

// Define 4 letters
let a = addLetter('A', app.stage, 0xff0000, { x: 100, y: 100 })
let b = addLetter('B', a, 0x00ff00, { x: 20, y: 20 })
let c = addLetter('C', a, 0x0000ff, { x: 20, y: 40 })
let d = addLetter('D', app.stage, 0xff8800, { x: 140, y: 100 })

// Display them over time, in order
let elapsed = 0.0
app.ticker.add((ticker) => {
  elapsed += ticker.deltaTime / 60.0
  if (elapsed >= letters.length) {
    elapsed = 0.0
  }
  for (let i = 0; i < letters.length; i++) {
    letters[i].visible = elapsed >= i
  }
})
```

![render order](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/Aug-08-2024%2016-23-14.gif)

如果想对子对象重新排序，可以使用 `setChildIndex()`。 要在父对象列表的给定位置添加子对象，可以使用 `addChildAt()`。 最后，您可以使用 `sortableChildren` 选项，结合设置每个子对象的 `zIndex` 属性，对对象的子对象进行自动排序。

## 渲染组

当你深入研究 PixiJS 时，你会遇到一个强大的功能，即渲染组。 将渲染组视为场景图中的专门容器，其本身就像迷你场景图。 以下是在项目中有效使用渲染组的必要知识。 更多信息，请查看 [渲染组概述](https://pixijs.com/8.x/guides/advanced/render-groups)。

## 剔除

如果您正在构建的项目中，大部分场景对象都不在屏幕上（例如，一个横版游戏），那么您就需要对这些对象进行剔除。

剔除是一个评估对象（或其子代！）是否在屏幕上的过程，如果不在屏幕上，则关闭对其的渲染。

如果不对屏幕外的对象进行剔除，即使它们的像素最终都不在屏幕上，渲染器仍会绘制它们。

PixiJS 并不提供视口剔除的内置支持，但你可以找到第三方插件来满足你的需求。另外，如果你想建立自己的剔除系统，只需在每个 tick 期间运行对象，并将任何不需要绘制的对象的 `renderable` 设置为 false 即可。

## 局部坐标 vs 全局坐标

如果在舞台上添加一个精灵，默认情况下它会显示在屏幕的左上角。这是 PixiJS 使用的全局坐标空间的原点。

如果你的所有对象都是舞台的子对象，那么你只需要担心这个坐标。但是一旦引入容器和子对象，事情就变得复杂了。

位于 [50, 100] 处的子对象距离父对象向右 50 像素，向下 100 像素。我们称这两个坐标系为「全局坐标」和「局部坐标」。当你在一个对象上使用 `position.set(x, y)` 时，你总是在局部坐标系下工作，相对于对象的父对象。

问题是，很多时候你都想知道某个对象的全局位置。例如，如果您想剔除屏幕外的对象以节省渲染时间，您需要知道给定的子对象是否在视图矩形之外。

要将本地坐标转换为全局坐标，您需要使用 `toGlobal()` 函数。下面是一个使用示例：

```js
// Get the global position of an object, relative to the top-left of the screen
let globalPos = obj.toGlobal(new Point(0, 0))
```

这段代码会将 `globalPos` 设置为子对象的全局坐标，相对于全局坐标系中的 [0, 0]。

## 全局坐标 vs 屏幕坐标

当您的项目与主机操作系统或浏览器协同工作时，还有第三个坐标系——「屏幕坐标」（又称「视口坐标」）会发挥作用。屏幕坐标表示相对于 PixiJS 正在呈现的画布元素左上角的位置。DOM 和本地鼠标点击事件等都在屏幕空间中工作。

现在，在很多情况下，屏幕空间等同于世界空间。如果画布的大小与创建应用程序时指定的呈现视图大小相同，就属于这种情况。 默认情况下就是这样——例如，您将创建一个 800x600 的应用程序窗口并将其添加到 HTML 页面，它就会保持这个大小。世界坐标中的 100 像素等于屏幕空间中的 100 像素。

但是！常见的情况是拉伸呈现视图，使其充满整个屏幕，或者以较低分辨率呈现，然后放大以提高速度。在这种情况下，画布元素的屏幕尺寸会发生变化（例如通过 CSS），但底层呈现视图不会，从而导致世界坐标和屏幕坐标不匹配。
