---
title: 高级元素
date: 2023-04-28
icon: yuansu
category:
  - HTML
tag:
  - frontend
  - html
  - basic-knowledge
---

除了标题、超链接等元素，还有一些比较复杂的元素：表格和表单。

## 表格

HTML 表格是一种用于结构化数据的方式，使用 HTML 的标签 `<table>` 来创建。一个基本的 HTML 表格包含以下组成部分：

- `<table>`：表格开始的标签。
- `<tr>`：表示行（table row）。
- `<td>`：表示列/单元格（table data）。

此外，还有几个其他的标签可以用来更精确地定义表格：

- `<thead>`：用于表示表格的头部区域。
- `<tbody>`：表示主体内容区域。
- `<tfoot>`：表示底部总结区域。
- `<th>`：表示表头。

这些标签使得你可以更清晰地定义表格的结构，并且可能会使你的表格获得更好的可访问性。

::: tip

即使你不给表格添加你自己的样式，表格标题也会带有一些默认样式：加粗和居中，让标题可以突出显示。

:::

以下是一个基本的 HTML 表格结构的例子：

::: normal-demo

```html
<table>
  <thead>
    <tr>
      <th>表头 1</th>
      <th>表头 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Row 1, Cell 1</td>
      <td>Row 1, Cell 2</td>
    </tr>
    <tr>
      <td>Row 2, Cell 1</td>
      <td>Row 2, Cell 2</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>总计</td>
      <td>100</td>
    </tr>
  </tfoot>
</table>
```

:::

### 通过 CSS 控制表格样式

需要用到一个非常重要的属性：`border-collapse`。这个属性用于控制表格边框的合并方式，它有两个值：

- `collapse`：合并边框。
- `separate`：分离边框。

::: tip

`border-collapse` 属性只能用于 `<table>` 元素，不能用于 `<div>` 等其他元素。

:::

以下是一个例子：

::: normal-demo

```html
<style>
  table {
    border-collapse: collapse;
  }
  td,
  th {
    padding: 5px 10px;
    text-align: center;
    border: 1px solid black;
  }
</style>

<table>
  <thead>
    <tr>
      <th>表头 1</th>
      <th>表头 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Row 1, Cell 1</td>
      <td>Row 1, Cell 2</td>
    </tr>
    <tr>
      <td>Row 2, Cell 1</td>
      <td>Row 2, Cell 2</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>总计</td>
      <td>100</td>
    </tr>
  </tfoot>
</table>
```

:::

### 跨列和跨行

有时候，我们需要让某个单元格跨越多列或多行，这时候就需要用到 `colspan` 和 `rowspan` 属性。

- `colspan`：跨列。
- `rowspan`：跨行。

::: normal-demo

```html
<style>
  table {
    border-collapse: collapse;
  }
  td,
  th {
    padding: 5px 10px;
    text-align: center;
    border: 1px solid black;
  }
</style>

<table>
  <thead>
    <tr>
      <th>表头 1</th>
      <th>表头 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">Row 1, Cell 1</td>
      <td>Row 1, Cell 2</td>
    </tr>
    <tr>
      <td>Row 2, Cell 2</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">总计</td>
    </tr>
  </tfoot>
</table>
```

:::

## 表单

HTML 表单是用于收集用户输入的一种交互式元素。它可以包含各种类型的输入元素，例如文本字段，复选框，单选按钮，下拉列表等。

HTML 表单的基本结构如下：

::: normal-demo

```html
<form action="https://example.com" method="post">
  <label for="name">姓名：</label>
  <input type="text" id="name" name="name" />
  <label for="email">邮箱：</label>
  <input type="email" id="email" name="email" />
  <label for="message">留言：</label>
  <textarea id="message" name="message"></textarea>
  <button type="submit">提交</button>
</form>
```

:::

### `<form>` 元素

`<form>` 元素用于创建 HTML 表单，它有两个重要的属性：

- `action`：用于指定表单提交的地址。
- `method`：用于指定表单提交的方式，有两个值：`get` 和 `post`。

### `<label>`、`<input>`、`<textarea>` 和 `<button>` 元素

`<label>` 元素用于定义表单元素的标签，它有一个重要的属性：

- `for`：用于指定它所对应的表单元素的 `id` 属性。

`<input>` 元素用于创建表单元素，它有一个重要的属性：

- `type`：用于指定表单元素的类型。

`<textarea>` 元素用于创建多行文本输入框。

`<button>` 元素用于创建按钮，它有一个重要的属性：

- `type`：用于指定按钮的类型。

::: tip

各元素包含的属性详见 MDN 文档：https://developer.mozilla.org/zh-CN/

:::
