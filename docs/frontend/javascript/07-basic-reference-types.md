---
title: 基本引用类型
date: 2024-04-17
icon: reference
category:
  - JavaScript
tag:
  - language advanced
---

引用值（或者对象）是某个特定 **引用类型** 的实例。

新对象通过使用 `new` 操作符后跟一个构造函数（constructor）来创建。构造函数就是用来创建新对象的函数，比如下面这行代码：

```js
let now = new Date()
```

这行代码创建了引用类型 `Date` 的一个新实例，并将它保存在变量 `now` 中。`Date()` 在这里就是构造函数，它负责创建一个只有默认属性和方法的简单对象。

ECMAScript 提供了很多像 `Date` 这样的原生引用类型，帮助开发者实现常见的任务。

## `Date`

`Date` 类型将日期保存为自协调世界时（UTC，Universal Time Coordinated）时间 1970 年 1 月 1 日午夜（零时）至今所经过的毫秒数。

要创建日期对象，就使用 `new` 操作符来调用 `Date` 构造函数：

```js
let now = new Date()
```

在不给 `Date` 构造函数传参数的情况下，创建的对象将保存当前日期和时间。要基于其他日期和时间创建日期对象，必须传入其毫秒表示（UNIX 纪元 1970 年 1 月 1 日午夜之后的毫秒数）。

为了得到这个时间，可以使用两个辅助函数：

- `Date.parse()`
- `Date.UTC()`

### `Date.parse()` 和 `Date.UTC()`

#### `Date.parse()`

`Date.parse()` 方法接收一个表示日期的字符串参数，尝试将这个字符串转换为表示该日期的毫秒数（本地时间）。

支持下列日期格式：

- 「月/日/年」，如 `"5/23/2019"`；
- 「月名 日, 年」，如 `"May 23, 2019"`；
- 「周几 月名 日 年 时:分:秒 时区」，如 `"Tue May 23 2019 00:00:00 GMT-0700"`；
- ISO 8601 扩展格式「YYYY-MM-DDTHH:mm:ss.sssZ」，如 `"2019-05-23T00:00:00"`（只适用于兼容 ES5 的实现）。

如果传给 `Date.parse()` 的字符串并不表示日期，则该方法会返回 `NaN`。

如果直接把表示日期的字符串传给 `Date` 构造函数，那么 `Date` 会在后台调用 `Date.parse()`。

```js
let someDate1 = new Date('May 23, 2019')
let someDate2 = new Date(Date.parse('May 23, 2019'))
```

这两行代码得到的日期对象相同。

#### `Date.UTC()`

`Date.UTC()` 方法也返回日期的毫秒表示（UTC 时间），参数是「年、零起点月数（1 月是 0，2 月是 1，以此类推）、日（1 ~ 31）、时（0 ~ 23）、分、秒和毫秒」。

这些参数中，只有前两个（年和月）是必需的。如果不提供日，那么默认为 1 日。其他参数的默认值都是 0。

```js
// GMT 时间 2000 年 1 月 1 日零点
let y2k = new Date(Date.UTC(2000, 0)) // 2000-01-01T00:00:00.000Z
// GMT 时间 2005 年 5 月 5 日下午 5 点 55 分 55 秒
let allFives = new Date(Date.UTC(2005, 4, 5, 17, 55, 55)) // 2005-05-05T17:55:55.000Z
```

与 `Date.parse()` 一样，`Date.UTC()` 也会被 `Date` 构造函数隐式调用，但有一个区别：这种情况下创建的是本地日期，不是 `GMT` 日期。

```js
// 本地时间（北京）为：UTC + 8，因此会相差 8 * 60 * 60 * 1000 = 28800000
let time = new Date(Date.UTC(2000, 0)) - new Date(2000, 0) // 28800000
```

::: tip JS 中的时间

不同时间概念，详见 [GMT、UTC、时区、JavaScript Date 总结](https://juejin.cn/post/7063118893115670536)。

:::

#### 对比

`Date.UTC()` 日期指的是在没有时区偏差的情况下(将日期转换为 GMT 时间)的日期值。

`Date.parse()` 方法是基于本地时区建立的，而 `Date.UTC()` 方法是基于无时区偏差建立的。

所以如果我们对两个方法传入相同的时间，我们会发现 `Date.UTC()` 方法得到的毫秒数相对于 `Date.parse()` 方法得到的毫秒数会多八个小时的毫秒数(这里的本地时区指的是北京时间)。

### 继承的方法

`Date` 类型重写了 `toLocaleString()`、`toString()` 和 `valueOf()` 方法。

`Date` 类型的 `toLocaleString()` 方法返回与浏览器运行的本地环境一致的日期和时间。

`toString()` 方法通常返回带时区信息的日期和时间，而时间也是以 24 小时制（0~23）表示的。

`valueOf()` 方法不返回原始对象，而是返回日期的毫秒数。因此，操作符（如小于号和大于号）可以直接使用它返回的值。

```js
let date1 = new Date(2019, 0, 1) // 2019 年 1 月 1 日
let date2 = new Date(2019, 1, 1) // 2019 年 2 月 1 日
console.log(date1 < date2) // true
console.log(date1 > date2) // false
```

::: tip

当需要将对象转换为原始值时（比如在算术运算、逻辑运算、字符串拼接等情况下），会 [自动调用](./006-toString-toLocalString-valueOf.md#自动调用顺序) 对象的 `valueOf()` 和 `toString()` 方法来获取原始值。

:::

### 日期格式化方法

`Date` 类型有几个专门用于格式化日期的方法，它们都会返回字符串：

- `toDateString()` 显示日期中的周几、月、日、年（格式特定于实现）；
- `toTimeString()` 显示日期中的时、分、秒和时区（格式特定于实现）；
- `toLocaleDateString()` 显示日期中的周几、月、日、年（格式特定于实现和地区）；
- `toLocaleTimeString()` 显示日期中的时、分、秒（格式特定于实现和地区）；
- `toUTCString()` 显示完整的 UTC 日期（格式特定于实现）。

这些方法的输出与 `toLocaleString()` 和 `toString()` 一样，会因浏览器而异。因此不能用于在
用户界面上一致地显示日期。

## `RegExp`

正则表达式（Regular Expression）是一种强大的文本模式匹配工具，用于在字符串中搜索、匹配和替换特定的文本。ECMAScript 通过 `RegExp` 类型支持正则表达式。

正则表达式由模式和标记组成：

```js
let expression = /pattern/flags;
```

pattern（模式）可以是任何简单或复杂的正则表达式，包括字符类、限定符、分组、向前查找和反向引用。每个正则表达式可以带零个或多个 flags（标记），用于控制正则表达式的行为。

下面给出了表示匹配模式的标记。

- `g`：全局模式，表示查找字符串的全部内容，而不是找到第一个匹配的内容就结束。
- `i`：不区分大小写，表示在查找匹配时忽略 `pattern` 和字符串的大小写。
- `m`：多行模式，表示查找到一行文本末尾时会继续查找。
- `y`：粘附模式，表示只查找从 `lastIndex` 开始及之后的字符串。
- `u`：Unicode 模式，启用 Unicode 匹配。
- `s`：dotAll 模式，表示元字符 `.` 匹配任何字符（包括 `\n` 或 `\r`）。

```js
// 匹配字符串中的所有"at"
let pattern1 = /at/g
// 匹配第一个"bat"或"cat"，忽略大小写
let pattern2 = /[bc]at/i
// 匹配所有以"at"结尾的三字符组合，忽略大小写
let pattern3 = /.at/gi
```

### 实例属性

通过实例属性可以全面了解正则表达式的信息，但是在实际开发中使用的并不多，因为从模式中可以直接看出。

- `lastIndex`：表示在源字符串中下一次搜索的开始位置。

### 实例方法

#### `exec()`

`exec()` 方法在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 `null`。

返回的数组虽然是 Array 的实例，但包含两个额外的属性：`index` 和 `input`。`index` 是字符串中匹配模式的起始位置，`input` 是要查找的字符串。

```js
const regex1 = /foo*/g
const str1 = 'table football, foosball'
let array1

while ((array1 = regex1.exec(str1)) !== null) {
  console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`)
  // Expected output: "Found foo. Next starts at 9."
  // Expected output: "Found foo. Next starts at 19."
}
```

```js
let text = 'mom and dad and baby'
let pattern = /mom( and dad( and baby)?)?/gi
let matches = pattern.exec(text)
console.log(matches.index) // 0
console.log(matches.input) // "mom and dad and baby"
console.log(matches[0]) // "mom and dad and baby"
console.log(matches[1]) // " and dad and baby"
console.log(matches[2]) // " and baby"
```

#### `test()`

`test()` 方法接收一个字符串参数。如果输入的文本与模式匹配，则参数返回 `true`，否则返回 `false`。这个方法适用于只想测试模式是否匹配，而不需要实际匹配内容的情况。

```js
let text = '000-00-0000'
let pattern = /\d{3}-\d{2}-\d{4}/
if (pattern.test(text)) {
  console.log('The pattern was matched.')
}
```

### 继承的方法

`RegExp` 也继承了 `Object` 上的 `valueOf()`, `toString()`, `toLocalString()` 三个方法。

无论正则表达式是怎么创建的，`toLocaleString()` 和 `toString()` 都返回正则表达式的字面量表示。比如：

```js
let pattern = new RegExp('\\[bc\\]at', 'gi')
console.log(pattern.toString()) // /\[bc\]at/gi
console.log(pattern.toLocaleString()) // /\[bc\]at/gi
```

这里的模式是通过 `RegExp` 构造函数创建的，但 `toLocaleString()` 和 `toString()` 返回的都是其字面量的形式。

::: warning

正则表达式的 `valueOf()` 方法返回正则表达式本身。

:::

## 原始值包装类型

为了方便操作原始值，ECMAScript 提供了 3 种特殊的引用类型：`Boolean`、`Number` 和 `String`。

每当用到某个原始值的方法或属性时，后台都会创建一个相应原始包装类型的对象，从而暴露出操作原始值的各种方法。来看下面的例子：

```js
let s1 = 'some text'
let s2 = s1.substring(2)
```

当第二行访问 `s1` 时，是以读模式访问的，也就是要从内存中读取变量保存的值。

在以读模式访问字符串值的任何时候，后台都会执行以下 3 步：

1. 创建一个 `String` 类型的实例；
2. 调用实例上的特定方法；
3. 销毁实例。

相当于下面行为：

```js
let s1 = new String('some text')
let s2 = s1.substring(2)
s1 = null
```

引用类型与原始值包装类型的主要区别在于对象的生命周期。在通过 `new` 实例化引用类型后，得到的实例会在离开作用域时被销毁，而自动创建的原始值包装对象则只存在于访问它的那行代码执行期间。

这意味着不能在运行时给原始值添加属性和方法。比如下面的例子：

```js
let s1 = 'some text'
s1.color = 'red'
console.log(s1.color) // undefined
```

这里的第二行代码尝试给字符串 `s1` 添加了一个 `color` 属性。可是，第三行代码访问 `color` 属性时，它却不见了。

原因就是第二行代码运行时会临时创建一个 `String` 对象，而当第三行代码执行时，这个对象已经被销毁了。实际上，第三行代码在这里创建了自己的 `String` 对象，但这个对象没有 `color` 属性。

::: warning

上述代码在严格模式下会报错：`TypeError: Cannot create property 'color' on string 'some text'`。

:::

另外，`Object` 构造函数作为一个工厂方法，能够根据传入值的类型返回相应原始值包装类型的实例。比如：

```js
let obj = new Object('some text')
console.log(obj instanceof String) // true
```

::: warning

注意，使用 new 调用原始值包装类型的构造函数，与调用同名的转型函数并不一样。例如：

```js
let value = '25'
let number = Number(value) // 转型函数
console.log(typeof number) // "number"
let obj = new Number(value) // 构造函数
console.log(typeof obj) // "object"
```

:::

### `Boolean`

`Boolean` 的实例会重写 `valueOf()` 方法，返回一个原始值 `true` 或 `false`。`toString()` 方法被调用时也会被覆盖，返回字符串 `"true"` 或 `"false"`。

::: warning

永远不要显示使用 `Boolean` 对象。

:::

### `Number`

与 `Boolean` 类型一样，`Number` 类型重写了 `valueOf()`、`toLocaleString()` 和 `toString()` 方法。`valueOf()` 方法返回 `Number` 对象表示的原始数值，另外两个方法返回数值字符串。

`toString()` 方法可选地接收一个表示基数的参数，并返回相应基数形式的数值字符串，如下所示：

```js
let num = 10
console.log(num.toString()) // "10"
console.log(num.toString(2)) // "1010"
console.log(num.toString(8)) // "12"
console.log(num.toString(10)) // "10"
console.log(num.toString(16)) // "a"
```

:::warning

不建议直接实例化 `Number` 对象。

:::

#### `toFixed()`

返回包含指定小数点位数的数值字符串，如：

```js
let num = 10
console.log(num.toFixed(2)) // "10.00"
```

#### `toExponential()`

返回以科学记数法（也称为指数记数法）表示的数值字符串。`toExponential()` 也接收一个参数，表示结果中小数的位数。来看下面的例子：

```js
let num = 10
console.log(num.toExponential(1)) // "1.0e+1"
```

#### `toPrecision()`

会根据情况返回最合理的输出结果，可能是固定长度，也可能是科学记数法形式。这个方法接收一个参数，表示结果中数字的总位数（不包含指数）。来看几个例子：

```js
let num = 99
console.log(num.toPrecision(1)) // "1e+2"
console.log(num.toPrecision(2)) // "99"
console.log(num.toPrecision(3)) // "99.0"
```

#### `isInteger()`

ES6 新增了 `Number.isInteger()` 方法，用于辨别一个数值是否保存为整数。

```js
console.log(Number.isInteger(1)) // true
console.log(Number.isInteger(1.0)) // true
console.log(Number.isInteger(1.01)) // false
```

### `String`

3 个继承的方法 `valueOf()`、`toLocaleString()` 和 `toString()` 都返回对象的原始字符串值。

::: tip

`String` 类型方法较多，可以查看 [MDN String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)，下面介绍一些常用的。

:::

#### `concat()`

用于将一个或多个字符串拼接成一个新字符串。

```js
let stringValue = 'hello '
let result = stringValue.concat('world')
console.log(result) // "hello world"
console.log(stringValue) // "hello"
```

虽然 `concat()` 方法可以拼接字符串，但更常用的方式是使用加号操作符 `+`。而且多数情况下，对于拼接多个字符串来说，使用「模版字符串」更方便。

#### `slice()`, `substring()`

这两个方法可以从字符串中提取子字符串。

::: warning

还有一个方法 `substr()`，但是已不再推荐使用该特性。

:::

- `slice(start[, end])`：返回 `[start, end)` 之间的元素，若 `end` 未指定，则默认到末尾所有元素；
- `substring(start[, end])`：返回 `[start, end)` 之间的元素，若 `end` 未指定，则默认到末尾所有元素；

二者在参数都为正数时，效果一致，但是它们对负数的处理不一样，下面看看例子。

```js
// 参数为正数
const str = 'Hello world'

console.log(str.slice(1)) // "ello world"
console.log(str.slice(1, 5)) // "ello"

console.log(str.substring(1)) // "ello world"
console.log(str.substring(1, 5)) // "ello"
```

对负值的处理如下：

- `slice(start[, end])`：所有负值与字符串长度相加；
- `substring(start[, end])`：所有负值置 0，若 `start` 大于 `end`，则会将二者调换。

```js
// 参数为负数
const str = 'Hello world'
console.log(str.slice(-3)) // str.slice(8) "rld"
console.log(str.slice(3, -4)) // str.slice(3, 7) "lo w"

console.log(str.substring(-3)) // str.substring(0) "hello world"
console.log(str.substring(3, -4)) // str.substring(3, 0) -> str.substring(0, 3) "hel"
```

::: warning

为了减少心智负担，给所有参数置为正数即可。

:::

#### `indexOf()`, `lastIndexOf()`

这两个方法从字符串中搜索传入的字符串，并返回位置（如果没找到，则返回 `-1`）。

两者的区别在于，`indexOf()` 方法从字符串开头开始查找子字符串，而 `lastIndexOf()` 方法从字符串末尾开始查找子字符串。来看下面的例子：

```js
let stringValue = 'hello world'
console.log(stringValue.indexOf('o')) // 4
console.log(stringValue.lastIndexOf('o')) // 7
```

#### `startsWith()`, `endsWith()`, `includes()`

这些方法都会从字符串中搜索传入的字符串，并返回一个表示是否包含的布尔值。它们的区别在于，`startsWith()` 检查开始于索引 `0` 的匹配项，`endsWith()` 检查开始于索引 `(string.length - substring.length)` 的匹配项，而 `includes()` 检查整个字符串：

```js
let message = 'foo bar baz'
console.log(message.startsWith('foo')) // true
console.log(message.startsWith('bar')) // false
console.log(message.endsWith('baz')) // true
console.log(message.endsWith('bar')) // false
console.log(message.includes('bar')) // true
console.log(message.includes('qux')) // false
```
