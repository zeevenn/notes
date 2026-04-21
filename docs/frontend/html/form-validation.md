---
title: 表单数据校验
date: 2024-03-19
icon: validate
category:
  - HTML
tag:
  - form
---

表单校验帮助我们确保用户以正确格式填写表单数据，确保提交的数据能使我们的应用程序正常工作。

## 什么是表单数据校验

表单校验——验证你输入表单的数据是否正确。

- 该字段是必填的
- 请输入你的电话号码，它的格式是：xxx-xxxx
- 请输入一个合法的邮箱地址
- 你的密码长度应该是 8 至 30 位的，并且至少应该包含一个大写字母、一个符号以及一个数字

## 不同类型的表单数据校验

在 Web 中，你可能会遇见各种不同的表单校验：

- 「客户端校验」：这种类型的校验可以进一步细分成下面这些方式：
  - JavaScript 校验，这是可以完全自定义的实现方式；
  - HTML5 内置校验，这不需要 JavaScript，而且性能更好，但是不能像 JavaScript 那样可自定义。
- 「服务器端校验」：通常服务器端校验都是发生在将数据写入数据库之前，如果数据没通过校验，则会直接从服务器端返回错误消息。

在真实的项目开发过程中，开发者一般都倾向于使用客户端校验与服务器端校验的组合校验方式以更好的保证数据的正确性与安全性。

## HTML5 内置校验

HTML5 可以通过表单元素的 [校验属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Constraint_validation) 实现对用户的输入进行数据校验。

这些属性可以让你定义一些规则，用于限定用户的输入，比如某个输入框是否必须输入，或者某个输入框的字符串的最小最大长度限制，或者某个输入框必须输入一个数字、邮箱地址等；还有数据必须匹配的模式。

如果表单中输入的数据都符合这些限定规则，那么表示这个表单校验通过，否则则认为校验未通过。

当一个元素校验通过时：

- 该元素将可以通过 CSS 伪类 `:valid` 进行特殊的样式化；
- 如果用户尝试提交表单，如果没有其他的控制来阻止该操作（比如 JavaScript 即可阻止提交），那么该表单的数据会被提交。

如果一个元素未校验通过：

- 该元素将可以通过 CSS 伪类 `:invalid` 进行特殊的样式化；
- 如果用户尝试提交表单，浏览器会展示出错误消息，并停止表单的提交。

### required 属性

最简单的 HTML5 校验功能是 `required` 属性 — 如果要使输入成为必需的，则可以使用此属性标记元素。

当设置此属性时，如果输入为空，该表单将不会提交（并将显示错误消息），输入也将被视为无效。

在校验失败时输入框会有一个亮红色的虚线边框，在校验通过时会有一个黄色边框。

::: normal-demo required

```html
<form>
  <label for="choose">Would you prefer a banana or cherry?</label>
  <input id="choose" name="i_like" required />
  <button onclick="submitForm(event)">Submit</button>
</form>
```

```css
input:invalid {
  border: 2px dashed red;
}

input:valid {
  border: 2px solid yellow;
}
```

```js
function submitForm(event) {
  event.preventDefault()
}
```

:::

### 正则表达式

另一个常用的校验功能是 `pattern` 属性，以正则表达式作为 `value` 值。

```html
<form>
  <label for="choose">Would you prefer a banana or a cherry?</label>
  <input id="choose" name="i_like" required pattern="banana|cherry" />
  <button>Submit</button>
</form>
```

::: normal-demo pattern

```html
<form>
  <label for="choose">Would you prefer a banana or cherry?</label>
  <input id="choose" name="i_like" required pattern="banana|cherry" />
  <button onclick="submitForm(event)">Submit</button>
</form>
```

```css
input:invalid {
  border: 2px dashed red;
}

input:valid {
  border: 2px solid yellow;
}
```

```js
function submitForm(event) {
  event.preventDefault()
}
```

:::

### demo

这里展示一个较为完整的例子：

::: normal-demo 完整例子

```html
<form>
  <p>
    <fieldset>
      <legend>Title<abbr title="This field is mandatory">*</abbr></legend>
      <input type="radio" required name="title" id="r1" value="Mr"><label for="r1">Mr.</label>
      <input type="radio" required name="title" id="r2" value="Ms"><label for="r2">Ms.</label>
    </fieldset>
  </p>
  <p>
    <label for="n1">How old are you?</label>
    <!-- 这里的 pattern 属性可以用作不支持 number 类 input 浏览器的备用方法
         请注意当与数字输入框一起使用时，支持 pattern 属性的浏览器会使它沉默失效。
         它仅仅是在这里用作备用 -->
    <input type="number" min="12" max="120" step="1" id="n1" name="age"
           pattern="\d+">
  </p>
  <p>
    <label for="t1">What's your favorite fruit?<abbr title="This field is mandatory">*</abbr></label>
    <input type="text" id="t1" name="fruit" list="l1" required
           pattern="[Bb]anana|[Cc]herry|[Aa]pple|[Ss]trawberry|[Ll]emon|[Oo]range">
    <datalist id="l1">
      <option>Banana</option>
      <option>Cherry</option>
      <option>Apple</option>
      <option>Strawberry</option>
      <option>Lemon</option>
      <option>Orange</option>
    </datalist>
  </p>
  <p>
    <label for="t2">What's your e-mail?</label>
    <input type="email" id="t2" name="email">
  </p>
  <p>
    <label for="t3">Leave a short message</label>
    <textarea id="t3" name="msg" maxlength="140" rows="5"></textarea>
  </p>
  <p>
    <button onclick="submitForm(event)">Submit</button>
  </p>
</form>
```

```css
body {
  font: 1em sans-serif;
  padding: 0;
  margin: 0;
}

form {
  max-width: 200px;
  margin: 0;
  padding: 0 5px;
}

p > label {
  display: block;
}

input[type='text'],
input[type='email'],
input[type='number'],
textarea,
fieldset {
  /* 需要在基于 WebKit 的浏览器上对表单元素进行恰当的样式设置 */
  -webkit-appearance: none;

  width: 100%;
  border: 1px solid #333;
  margin: 0;

  font-family: inherit;
  font-size: 90%;

  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

input:invalid {
  box-shadow: 0 0 5px 1px yellow;
}

input:focus:invalid {
  outline: none;
}
```

```js
function submitForm(event) {
  event.preventDefault()
}
```

:::

### 自定义错误信息

每次我们提交无效的表单数据时，浏览器总会显示错误信息。但是显示的信息取决于你所使用的浏览器。

这些自动生成的错误有两个缺点：

- 没有标准可以让 CSS 来改变他们的界面外观。
- 这依赖于他们使用的浏览器环境，意味着你可能在这种语言的页面里得到另一种语言的错误提示。

![错误信息](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240320183034.png)

要自定义这些消息的外观和文本，你必须使用 JavaScript; 不能使用 HTML 和 CSS 来改变。

HTML5 提供 [constraint validation API](https://html.spec.whatwg.org/multipage/forms.html#the-constraint-validation-api) 来检测和自定义表单元素的状态。

除此之外，它可以改变错误信息的文本。让我们快速的看一个例子：

::: normal-demo 自定义错误信息

```html
<form>
  <label for="mail">I would like you to provide me an e-mail</label>
  <input type="email" id="mail" name="mail" />
  <button>Submit</button>
</form>
```

```js
var email = document.getElementById('mail')

email.addEventListener('input', function (event) {
  event.preventDefault()
  if (email.validity.typeMismatch) {
    email.setCustomValidity('I expect an e-mail, darling!')
  } else {
    email.setCustomValidity('')
  }
})
```

:::

## JavaScript 校验

### 约束校验的 API

越来越多的浏览器支持限制校验 API，并且这逐渐变得可靠。这些 API 由成组的方法和属性构成，可在特定的表单元素接口上调用：

- HTMLButtonElement
- HTMLFieldSetElement
- HTMLInputElement
- HTMLOutputElement
- HTMLSelectElement
- HTMLTextAreaElement

::: info

具体属性见 [约束校验的 API](https://developer.mozilla.org/zh-CN/docs/Learn/Forms/Form_validation#%E4%BD%BF%E7%94%A8_javascript_%E6%A0%A1%E9%AA%8C%E8%A1%A8%E5%8D%95)

:::

### demo

这个简单的表单使用 `novalidate` 属性关闭浏览器的自动校验；这允许我们使用脚本控制表单校验。

但是，这并不禁止对约束校验 API 的支持或是以下 CSS 伪类：`:valid`、`:invalid`、`:in-range` 、`:out-of-range` 的应用。

这意味着，即使浏览器在发送数据之前没有自动检查表单的有效性，你仍然可以自己做，并相应地设置表单的样式。

::: normal-demo 约束校验 API

```html
<form novalidate id="demo">
  <p>
    <label for="mail">
      <span>Please enter an email address:</span>
      <input type="email" id="mail" name="mail" />
      <span class="error" aria-live="polite"></span>
    </label>
  </p>
  <button>Submit</button>
</form>
```

```css
/* 仅为了使示例更好看 */
body {
  font: 1em sans-serif;
  padding: 0;
  margin: 0;
}

form {
  max-width: 200px;
}

p * {
  display: block;
}

input[type='email'] {
  -webkit-appearance: none;

  width: 100%;
  border: 1px solid #333;
  margin: 0;

  font-family: inherit;
  font-size: 90%;

  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

/* 校验失败的元素样式 */
input:invalid {
  border-color: #900;
}

input:focus:invalid {
  outline: none;
}

/* 错误消息的样式 */
.error {
  width: 100%;
  padding: 0;

  font-size: 80%;
  color: white;
  background-color: #900;
  border-radius: 0 0 5px 5px;

  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.error.active {
  padding: 0.3em;
}
```

```js
// 有许多方式可以获取 DOM 节点；在此我们获取表单本身和
// email 输入框，以及我们将放置错误信息的 span 元素。

var form = document.getElementById('demo')
var email = document.getElementById('mail')
var error = document.querySelector('.error')

email.addEventListener(
  'input',
  function (event) {
    // 当用户输入信息时，校验 email 字段
    if (email.validity.valid) {
      // 如果校验通过，清除已显示的错误消息
      error.innerHTML = '' // 重置消息的内容
      error.className = 'error' // 重置消息的显示状态
    } else {
      error.innerHTML = 'I expect an e-mail, darling!'
      error.className = 'error active'
    }
  },
  false
)
form.addEventListener(
  'submit',
  function (event) {
    // 当用户提交表单时，校验 email 字段
    if (!email.validity.valid) {
      // 如果校验失败，显示一个自定义错误
      error.innerHTML = 'I expect an e-mail, darling!'
      error.className = 'error active'
      // 还需要阻止表单提交事件，以取消数据传送
      event.preventDefault()
    } else {
      event.preventDefault()
    }
  },
  false
)
```

:::

::: info 一些校验库

- [Validate.js](https://github.com/rickharrison/validate.js)
- [rc-field-form](https://github.com/react-component/field-form)

:::
