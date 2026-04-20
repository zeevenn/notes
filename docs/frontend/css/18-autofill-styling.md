---
title: 覆盖输入框 autofill 样式
date: 2024-09-14
icon: auto-fill
category:
  - CSS
tag:
  - trick
---

浏览器自动填充密码会有一些默认样式：

![autofill 默认样式](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240914171559.png)

## 方法一

使用 `-webkit-box-shadow` 实现覆盖：

```css
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 999px #fff inset;
}
```

但是，该方式无法设置背景透明。

## 方法二

使用动画：

```css
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
  -webkit-text-fill-color: var(--white-color-1);
  transition: background-color 5000s ease-in-out 0s;
}
```

但是如果停留时间过久，也会有问题，但是目前好像没有更好的解决方法。
