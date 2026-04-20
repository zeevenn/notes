---
title: placeholder 支持换行展示
date: 2024-04-08
icon: pre-line
category:
  - practice
tag:
  - frontend
  - antd
---

`placeholder` 内容有时需要支持换行，查了网上一些例子，结果都无法实现。

## 错误 demo

### 直接使用 `\n`

会被当成字符渲染。

```jsx
<Input.TextArea
  rows={5}
  placeholder="多个关键词请使用逗号分隔\nShift+Enter换行，Enter搜索"
/>
```

![直接使用 `\n`](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240408181616.png)

### 使用 ASCII 码

若使用 `ASCII` 码会被处理成空格。

- `&#10;`——换行符 `\n`
- `&#13;`——回车 `\r`

```jsx
<Input.TextArea
  rows={5}
  placeholder="多个关键词请使用逗号分隔&#13;Shift+Enter换行，Enter搜索"
/>
```

![使用 ASCII 码](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240408182209.png)

## 正确做法 —— 使用 JSX

此时应该使用 `\n` 实现换行。

::: tip

在 JSX 中，要在字符串中插入 ASCII 字符，你需要直接使用对应的字符或者使用其 Unicode 表示方式，因为 HTML entities 在 JSX 中不会被解析。

:::

```jsx
<Input.TextArea
  rows={5}
  placeholder={`多个关键词请使用逗号分隔\nShift+Enter换行，Enter搜索`}
/>
```

![JSX](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240408182716.png)
