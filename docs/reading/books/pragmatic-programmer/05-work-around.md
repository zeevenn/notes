---
title: 宁弯不折
date: 2024-04-09
icon: round
category:
  - READING
tag:
  - pragmatic
---

尽量编写宽松灵活的代码，增强代码的健壮性。

有一个保持灵活性的好方法，那就是编写更少的代码。修改代码可能会引入新的 Bug

## 解耦

代码耦合会导致「一改都改」。

- 解耦让改变代码更容易；
- 避免全局数据。

## 在现实世界抛球杂耍

利用下面四种策略编写更好的程序：

1. 有限状态机
2. 观察者模式
3. 发布/订阅
4. 响应式编程与流

::: tip

响应式编程相关学习资料：

- [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
- [Rxjs](https://rxjs.dev/)
- [学习 rxjs 操作符](https://rxjs-cn.github.io/learn-rxjs-operators/)
- [learn rxjs](https://www.learnrxjs.io/)
- [rxmarbles](https://rxmarbles.com/)
- [rxjs 操作决定树](https://rxjs.dev/operator-decision-tree)

:::

## 变换式编程

把程序视为从输入到输出的一个变换。

- 编程谈的是代码，但程序谈的是数据；
- 将代码看作是一系列的变换。

## 继承税

继承就是耦合。

更好的替代方案：

- 接口：尽量使用接口来表达多态
- 委托
- `mixin` 与特征

::: tip

所以 React、Vue 都走向了函数式编程？

:::

## 配置

使用外部配置参数化应用程序，使用 `json`, `yml` 等。
