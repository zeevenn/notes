---
title: 视频和音频
date: 2022-07-25
icon: duomeit
category:
  - HTML
tag:
  - HTML5
---

HTML5 中加入了视频和音频标签，增强网页的表达能力。

## `<audio>` 音频

以下就是使用 `<audio>` 的最简单例子，其中 `controls` 属性为音频控件，`autopaly` 为是否自动播放，`loop` 为循环播放。

详细属性见 [MDN audio](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio)。

```html
<audio controls src="xxx" autopaly loop></audio>
```

## `<video>` 视频

一些属性的含义与 `<audio>` 音频元素相同。

详细属性见 [MDN video](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)。

```html
<video controls src="xxx" autopaly loop></video>
```

## `<source>` 标签

因为浏览器对视频格式的支持程度不一样，为了能兼容不同的浏览器，可以通过 `<source>` 标签指定视频源或音频源。

```html
<video controls width="250">
  <source src="/media/flower.webm" type="video/webm" />
  <source src="/media/flower.mp4" type="video/mp4" />
  Sorry, your browser doesn't support embedded videos.
</video>
```
