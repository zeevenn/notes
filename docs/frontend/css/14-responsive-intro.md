---
title: 响应式设计介绍
date: 2024-03-04
icon: STARTUP
category:
  - CSS
tag:
  - 布局
---

响应式设计是一种使网页内容适应各种设备的不同屏幕和窗口尺寸的网页设计方法。

它并不是设计网站的第一种方法。在采用响应式设计之前的几年里，网页设计师和开发人员尝试过许多不同的技术。

## 固定宽度设计

20 世纪 90 年代初，当网络开始流行时，大多数显示器的屏幕尺寸为宽 `640` 像素、高 `480` 像素。这些显示器是凸面阴极射线管，与现在的平面液晶显示器不同。

在早期网页设计的雏形时期，设计宽度为 `640` 像素的网页是比较安全的。但是，在手机和相机等其他技术不断微型化的同时，屏幕却越来越大（最终变得越来越扁平）。

不久之后，大多数屏幕的尺寸都达到了 `800 x 600` 像素。网页设计也随之改变。设计师和开发人员开始认为 `800` 像素是一个安全的默认值。

后来，屏幕又变大了。`1024 x 768` 成为默认值。这感觉就像是网页设计师和硬件制造商之间的军备竞赛。

无论是 `640`、`800` 还是 `1024` 像素，选择一种特定宽度进行设计被称为「固定宽度设计」。

如果你为布局指定了一个固定的宽度，那么你的布局只能在这个特定的宽度下才好看。如果访问者的屏幕比你选择的宽度更宽，那么屏幕上就会出现浪费的空间。你可以将页面内容居中，使空间分布更均匀（而不是一边空着），但你仍然无法充分利用可用空间。

同样，如果访客的屏幕比您选择的宽度窄，那么您的内容就无法横向显示。浏览器会生成一个爬行条--相当于水平滚动条，用户必须左右移动整个页面才能看到所有内容。

::: normal-demo 固定宽度设计

```html
<div>
  <h1>Fixed-width design</h1>
  <article>
    <p>
      If you specify a fixed width for your layout, then your layout will only
      look good at that specific width. If a visitor to your site has a screen
      that is wider than the width you have specified, then there’ll be wasted
      space on the screen. You can center the content of your pages to
      distribute that space more evenly (instead of having empty space on one
      side) but you still wouldn’t be taking full advantage of the available
      space.
    </p>
    <p>
      Similarly, if the visitor arrives with a screen that is narrower than the
      width you’ve chosen, then your content won’t fit horizontally. The browser
      generates a crawlbar—the horizontal equivalent of a scrollbar—and the user
      has to move the whole page left and right in order to see all of the
      content.
    </p>
  </article>
</div>
```

```css
div {
  width: 1024px;
  font-family: sans-serif;
  line-height: 1.5;
  padding: 0 16px;
}

h1 {
  margin-bottom: 0;
}
```

:::

## 流体布局

虽然大多数设计者都使用固定宽度布局，但也有一些设计者选择流体布局。与使用固定宽度的布局相比，你可以使用百分比作为列宽来制作流体布局。与只能在特定尺寸下看起来合适的固定宽度布局相比，这些设计适用于更多情况。

这就是所谓的流体布局。不过，虽然液态布局在各种宽度下都很美观，但在极端情况下就会开始恶化。在宽屏幕上，布局看起来被拉伸。而在窄屏幕上，布局则显得拥挤。这两种情况都不理想。

使用 `min-width` 和 `max-width` 布局可以缓解这些问题。但是，在 `min-width` 以下或 `max-width` 以上的任何尺寸下，都会出现与固定宽度布局相同的问题。在宽屏幕上，未使用的空间会被浪费。在窄屏幕上，用户必须左右移动整个页面才能看到所有内容。

::: normal-demo 流体布局

```html
<div>
  <h1>Liquid layout</h1>
  <article>
    <p>
      Instead of using fixed widths for your layouts you could make a flexible
      layout using percentages for your column widths. This will work in more
      situations than a fixed-width layout that only looks right at one specific
      size. These were called liquid layouts.
    </p>
    <p>
      But while a liquid layout will look good across a wide range of widths, it
      will begin to worsen at the extremes. On a wide screen the layout will
      look like it’s been stretched out too far. On a narrow screen the layout
      will look like it’s been squashed. Both scenarios feel uncomfortable.
    </p>
    <p>
      You can mitigate these problems by using <code>min-width</code> and
      <code>max-width</code> for your layout. But then at any sizes below the
      minimum width or above the maximum width, you’ve got the same issues you’d
      have with a fixed-width layout. On a wide screen there’d be unused space
      going to waste. On a narrow screen, the user would have to move the whole
      page left and right in order to see everything.
    </p>
  </article>
  <aside>
    <p>
      The word “liquid” is just one of the terms used to describe this kind of
      layout. These kinds of designs were also called fluid layouts or flexible
      layouts. The terminology was as fluid as the technique.
    </p>
    <p>
      This example is using the CSS <code>float</code> property to create
      columns. That was a popular technique before CSS grid or flexbox existed.
    </p>
  </aside>
</div>
```

```css
body {
  font-family: sans-serif;
  line-height: 1.5;
  padding: 0 16px;
}

article {
  width: 66%;
  float: left;
}

aside {
  width: 33%;
  float: right;
}

h1 {
  margin-bottom: 0;
}
```

:::

## 自适应布局

当 CSS 出现媒体查询时，可以实现更灵活的布局。

其中一种技术就是在指定宽度的几个固定宽度布局之间切换。有人称之为「自适应设计」。

自适应设计允许设计人员提供在几种不同尺寸下看起来都不错的布局，但在这些尺寸之间查看时，设计看起来总是不太合适。空间过大的问题依然存在，尽管不像固定宽度布局那样严重。

使用 CSS 媒体查询，可以为用户提供最接近其浏览器宽度的布局。但鉴于设备尺寸的多样性，对于大多数人来说，这种布局很可能看起来并不完美。

::: normal-demo 自适应布局

```html
<div>
  <h1>Adaptive design</h1>
  <article>
    <p>
      When media queries arrived in CSS it opened the door to making layouts
      more flexible. But developers were still most comfortable making
      fixed-width layouts. One technique involved switching between a handful of
      fixed-width layouts at specified widths.
    </p>
    <p>
      This allowed designers to provide layouts that looked good at a few
      different sizes but the design never looked quite right when viewed
      <em>between</em> those sizes. The problem of excess space persisted
      although it wasn’t as bad as in a fixed-width layout.
    </p>
  </article>
  <aside>
    <p>
      Ultimately this technique wasn’t very popular. The term “adaptive” was
      also used to refer to other approaches so it can be a confusing descriptor
      for what was quite a niche technique.
    </p>
    <p>
      This example is using the CSS <code>float</code> property to create
      columns. That was a popular technique before CSS grid or flexbox existed.
    </p>
  </aside>
</div>
```

```css
div {
  font-family: sans-serif;
  line-height: 1.5;
  padding: 0 16px;
}

h1 {
  margin-bottom: 0;
}

@media all and (min-width: 800px) {
  article {
    width: 540px;
    float: left;
  }

  aside {
    width: 250px;
    float: left;
    margin-left: 10px;
  }
}

@media all and (min-width: 1200px) {
  article {
    width: 800px;
    float: left;
  }

  aside {
    width: 350px;
    float: left;
    margin-left: 50px;
  }
}

@media all and (min-width: 1600px) {
  h1 {
    width: 400px;
    float: left;
  }

  article {
    width: 800px;
    float: left;
  }

  aside {
    width: 350px;
    float: left;
    margin-left: 50px;
  }
}
```

:::

## 响应式布局

如果说自适应布局是媒体查询和固定宽度布局的混合体，那么响应式网页设计就是媒体查询和液体布局的混合体。

::: normal-demo 响应式布局

```html
<div>
  <h1>Responsive design</h1>
  <article>
    <p>
      If adaptive layouts are a mashup of media queries and fixed-width layouts,
      responsive web design is a mashup of media queries and liquid layouts. The
      term was coined by Ethan Marcotte in
      <a href="https://alistapart.com/article/responsive-web-design/"
        >an article in A List Apart</a
      >
      in 2010.
    </p>
    <p>Ethan defined three criteria for responsive design:</p>
    <ol>
      <li>Fluid grids</li>
      <li>Fluid media</li>
      <li>Media queries</li>
    </ol>
    <p>
      If a site was responsive, its layout and images would look good on any
      device.
    </p>
  </article>
  <aside>
    <p>
      This example is using the CSS <code>float</code> property to create
      columns. That was a popular technique before CSS grid or flexbox existed.
    </p>
  </aside>
</div>
```

```css
div {
  font-family: sans-serif;
  line-height: 1.5;
  padding: 0 16px;
}

h1 {
  margin-bottom: 0;
}

@media all and (min-width: 800px) {
  article {
    width: 66%;
    float: left;
  }

  aside {
    width: 33%;
    float: right;
  }
}

@media all and (min-width: 1600px) {
  h1 {
    width: 100%;
  }

  article {
    width: 50%;
    float: left;
  }

  aside {
    width: 22.5%;
    float: right;
  }
}
```

:::
