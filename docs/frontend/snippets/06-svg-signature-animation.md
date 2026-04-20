---
title: SVG 实现签名动画效果
date: 2024-01-13
icon: signature
category:
  - practice
tag:
  - svg
  - animation
---

在阅读 antfu 大佬的 [Animated SVG Logo](https://antfu.me/posts/animated-svg-logo) 时，发现了一个很有意思的动画效果，最终实现的效果如下。

::: normal-demo 签名效果

```html
<svg height="55" xmlns="http://www.w3.org/2000/svg" viewBox="-10 -15 700 620">
  <path
    id="path1"
    d="M184.42,387.69a25,25,0,0,1-11-7.18c-4.43-5.17-5.2-10.95-5.86-14.76-.21-1.2-5.31-14.92-15.51-42.36-4.38-11.79-5.8-15.18-8.89-19.67-5.28-7.66-8.9-14.55-14.75-14.94-7.4-.5-14.11,9.19-16.84,15.89-6,14.72-1.44,36.36,14.38,46.14,10.94,6.77,22.73,5,26.29,4.35,14.59-2.51,23.58-12.25,37.58-27.85,2.81-3.13,5.53-6.49,23.15-31.75,12.15-17.41,18.22-26.12,20.54-29.74,11.81-18.53,18.52-33.27,27.86-54,8.42-18.7,16.27-36.29,23.74-60.9,8.64-28.44,9.71-43,8.61-56.08-1.75-20.67-8.21-29-10.35-31.56-9.89-11.77-24.18-14.44-29.85-15.5-31.47-5.88-85.62,22.81-136.07,72.92C107,131.08,43.84,195.31,14.71,297.51,1,345.61,4.27,369,13.56,387.07c2.17,4.21,16.6,31.82,45.81,41.49a77.54,77.54,0,0,0,16.75,3.24C152.84,437.2,315,348.56,315,348.56c34.55-18.88,76.19-40.52,159.47-83.79,57.73-30,105.23-53.81,136.21-69.19"
    style="
          fill: none;
          stroke: #000;
          stroke-miterlimit: 10;
          stroke-width: 20px;
          stroke-linecap: round;
        "
  />
  <path
    id="path2"
    d="M184.43,363.92a18.86,18.86,0,0,0,6.69,8.29,17.71,17.71,0,0,0,7,2.87c5.15.8,11.44-.86,14.64-4.74,5.27-6.37-2.14-13.45,1.56-22.37,4.32-10.41,20.92-16.54,33.3-13,6,1.71,13.89,9.59,20.28,15.72,7.7,7.39,7.37,5.86,10.41,9.94,12.08,16.17,18.63,23.92,27.58,33.13,26.34,27.12,32.73,66.61,36.94,92.61,2.74,16.93,4.37,27,2.08,41.1-1.1,6.72-7.74,47.41-36.42,59.83-34.25,14.83-81.9-18.44-96.77-54.63-1.78-4.33-3.61-10-6.24-30.17a556.06,556.06,0,0,1-4.58-85.66"
    style="
          fill: none;
          stroke: #000;
          stroke-miterlimit: 10;
          stroke-width: 20px;
          stroke-linecap: round;
        "
  />
  <path
    id="path3"
    d="M178.84,233.06a74.91,74.91,0,0,0-7.26,32.82,71.4,71.4,0,0,0,6.22,28.68c2.77,6,12.6,27.42,27.64,28,5.83.22,10.22-3,19-9.33,15-10.89,14.65-17.12,26.6-24.19,4.58-2.7,17.27-10.2,28.34-5.53,6.74,2.85,10.08,9,14.16,16.59,7.3,13.5,7.85,26,9,25.91,1.82-.18-3.67-31.85,5.52-35.93,7.38-3.27,18.73,13.6,25.23,10,5-2.78-.16-13.87,6.91-30.41,2.26-5.29,5.13-11.77,10.71-13.13,3.8-.92,5.95,1.25,16.24,4.15a88.2,88.2,0,0,0,12.44,2.76c9.86,1.33,17.72-.19,23.84-1.38a76,76,0,0,0,16.93-5.18,66.93,66.93,0,0,0,6.57-3.46"
    style="
          fill: none;
          stroke: #000;
          stroke-miterlimit: 10;
          stroke-width: 20px;
          stroke-linecap: round;
        "
  />
  <path
    id="path4"
    d="M426.93,197.81c-7.19-16.9-13.47-20.78-18-21.07-2.26-.15-4.06.61-9.68.34-4.15-.19-8.12-.42-12.09-2.42s-4.57-4-7.6-6.56a31.54,31.54,0,0,0-16.93-6.22c-17.64-1.4-32.27,20-38,28.33A92.88,92.88,0,0,0,313.19,214c-3.2,10.08-3.69,17.5-4.43,25.24-3,31.34-6.83,32.42-7.95,52.17-1,17.65,1.26,30.66,4.15,46.65,5.37,29.8,12.53,69.47,39.73,110.22,9.27,13.88,24.72,36.56,53.21,56,15.42,10.51,58.7,40,114.37,30.4,46.66-8.05,74.75-38.88,84.66-49.75,21.72-23.85,30.4-47.54,39-71.87C639.41,403.4,656,355,653.94,287a389.22,389.22,0,0,0-33.17-145.12c-18.3-41.37-36.1-81.62-79.47-110.22-12.86-8.48-51.23-33.79-94-23.85-31.48,7.32-55.64,31.5-54.59,40.43a21.93,21.93,0,0,0,3.11,8.64,19.46,19.46,0,0,0,6.91,6.22"
    style="
          fill: none;
          stroke: #000;
          stroke-miterlimit: 10;
          stroke-width: 20px;
          stroke-linecap: round;
        "
  />
</svg>
```

```css
:root {
  --dash-array-1: 1722px;
  --dash-array-2: 633px;
  --dash-array-3: 436px;
  --dash-array-4: 1386px;
}

@media (prefers-reduced-motion) {
  path {
    animation: none !important;
    stroke-dasharray: unset !important;
  }
}

@keyframes draw {
  0% {
    stroke-dashoffset: var(--dash-array);
    opacity: 0;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

path:nth-child(1) {
  --dash-array: var(--dash-array-1);
  animation: draw 1s ease forwards 0s;
}

path:nth-child(2) {
  --dash-array: var(--dash-array-2);
  animation: draw 0.7s ease forwards 1s;
}

path:nth-child(3) {
  --dash-array: var(--dash-array-3);
  animation: draw 0.5s ease forwards 2s;
}

path:nth-child(4) {
  --dash-array: var(--dash-array-4);
  animation: draw 1s ease forwards 3s;
}

path {
  stroke-dashoffset: 1px;
  stroke-dasharray: var(--dash-array);
  transform-origin: center;
  stroke: #303030;
  opacity: 0;
}
```

:::

其中原理可以参考下面两篇文章：

- [Animated line drawing in SVG](https://jakearchibald.com/2013/animated-line-drawing-svg/)
- [How SVG Line Animation Works](https://css-tricks.com/svg-line-animation-works/)

::: tip

下面以内马尔签名为例，介绍一下如何实现这个效果。

:::

## 签名文件处理

谷歌上搜索内马尔签名，找到 [原始 SVG 文件](https://zh.wikipedia.org/wiki/File:Neymar_da_Silva_Santos_J%C3%BAnior_signature.svg)。

![内马尔签名](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240113225839.png)

::: warning

源文件为 fill 填充，而只有 stroke 才能实现此动画效果，所以需要使用 Adobe Illustration 或 Figma 或 Motiff 处理。

先将填充取消，并进行描边处理，最后使用钢笔工具在填充中间增加路径。

:::

使用 AI 软件处理后，得到下面文件，再导出为 SVG 格式。由于技术不过关，少了很多细节处理，但是不影响效果。

![处理后的 stroke 文件](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240113230507.png)

## 实现动画

得到 stroke 文件后，就可以使用 `stroke-dasharray` 和 `stroke-dashoffset` 属性实现动画效果。

由于这里的有四条路径，因此需要分别设置四个动画。

这里先获得四条路径的总长度。

```js
const path1 = document.getElementById('path1')
const path2 = document.getElementById('path2')
const path3 = document.getElementById('path3')
const path4 = document.getElementById('path4')
console.log(path1.getTotalLength())
console.log(path2.getTotalLength())
console.log(path3.getTotalLength())
console.log(path4.getTotalLength())
```

获取完长度后，因为需要依次出现每个路径，所以需要设置动画延迟时间，这样就能保证每个路径依次出现，最终就能得到上述的效果了。

```css
:root {
  --dash-array-1: 1722px;
  --dash-array-2: 633px;
  --dash-array-3: 436px;
  --dash-array-4: 1386px;
}

@media (prefers-reduced-motion) {
  path {
    animation: none !important;
    stroke-dasharray: unset !important;
  }
}

@keyframes draw {
  0% {
    stroke-dashoffset: var(--dash-array);
    opacity: 0;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

path:nth-child(1) {
  --dash-array: var(--dash-array-1);
  animation: draw 1s ease forwards 0s;
}

path:nth-child(2) {
  --dash-array: var(--dash-array-2);
  animation: draw 0.7s ease forwards 1s;
}

path:nth-child(3) {
  --dash-array: var(--dash-array-3);
  animation: draw 0.5s ease forwards 2s;
}

path:nth-child(4) {
  --dash-array: var(--dash-array-4);
  animation: draw 1s ease forwards 3s;
}

path {
  stroke-dashoffset: 1px;
  stroke-dasharray: var(--dash-array);
  transform-origin: center;
  stroke: #303030;
  opacity: 0;
}
```

## 适配 vuepress

这里使用的是 `vuepress-theme-hope` 主题，参考 [替换主题组件](https://theme-hope.vuejs.press/zh/guide/advanced/replace.html) 中通过导航栏组件别名替换了默认的导航栏组件。

```js
alias: {
  '@theme-hope/modules/navbar/components/NavbarBrand': path.resolve(
    __dirname,
    './components/NavLogo.vue'
  )
}
```

## 适配深色主题

`vuepress` 并未提供是否为深色主题的接口，需要监听 `data-theme` 属性变化，来判断是否为深色主题。

```js
import { onUnmounted, onMounted, ref } from 'vue'

const isDarkMode = ref(false)

onMounted(() => {
  const html = document.documentElement

  console.log(html, '===')

  isDarkMode.value = html.dataset.theme === 'dark'

  // watch theme change
  const observer = new MutationObserver(() => {
    isDarkMode.value = html.dataset.theme === 'dark'
    console.log(isDarkMode.value, '---')
  })

  observer.observe(html, {
    attributeFilter: ['data-theme'],
    attributes: true
  })

  onUnmounted(() => {
    observer.disconnect()
  })
})

console.log(isDarkMode.value, '---')
```
