---
title: 运算符与表达式
date: 2026-09-24
category: java
---

表达式由值、变量、运算符和方法调用等组成，按类型规则计算结果。运算结果取决于操作数类型，不能仅根据接收结果的变量类型判断。

## 算术与数值提升

```java
System.out.println(5 / 2);         // 2
System.out.println(-5 / 2);        // -2：整数除法向零截断
System.out.println(5 / 2.0);       // 2.5
System.out.println((double) (5 / 2)); // 2.0：转换发生在整数除法之后
System.out.println(-5 % 2);        // -1
```

对整数操作数，`/` 丢弃小数部分；`%` 的非零结果与被除数同号。整数除零抛出 `ArithmeticException`；浮点除零可以得到无穷大或 `NaN`。`NaN` 表示“不是一个有效数值”，例如 `0.0 / 0.0` 的结果。

二元数值运算通常把操作数提升为共同类型：存在 `double` 就使用 `double`，否则依次考虑 `float`、`long`、`int`。`byte`、`short`、`char` 参与常见算术运算时会提升为 `int`。

```java
byte a = 10;
byte b = 20;
int sum = a + b;
// byte small = a + b; // 编译错误：结果是 int

int count = 50_000;
long wrong = count * count;  // 先做 int 乘法，溢出后才转 long
long correct = (long) count * count; // 2500000000
```

整数运算溢出通常不会抛出异常。需要检测溢出时，可以使用标准库 `Math` 类的 `addExact()`、`multiplyExact()` 方法：它们在结果超出整数范围时抛出异常。

## 赋值、自增与复合赋值

普通赋值需要类型兼容。复合赋值会包含到左侧类型的隐式转换，不能把它视为完全等价的文本替换。

```java
byte value = 127;
value += 1;
System.out.println(value); // -128
// value = value + 1;      // 编译错误：int 不能直接赋给 byte

int index = 0;
int old = index++; // old = 0，index = 1
int now = ++index; // now = 2，index = 2
```

后置自增表达式产生旧值，前置自增产生新值，两者都会修改变量。一个表达式中反复修改同一变量会掩盖求值顺序，通常应拆成独立语句。

## 比较与短路逻辑

数值可以使用 `<`、`<=`、`>`、`>=` 比较大小，使用 `==`、`!=` 判断是否相等。比较结果是 `boolean` 值。

Java 的条件表达式必须得到 `boolean`，整数和引用不会自动转换为布尔值。

```java
int divisor = 0;
boolean large = divisor != 0 && 10 / divisor > 1; // false，右侧不执行
boolean skip = divisor == 0 || 10 / divisor <= 1; // true，右侧不执行
```

`&&` 在左侧为 `false` 时短路，`||` 在左侧为 `true` 时短路。`!` 取反。`&`、`|`、`^` 也接受布尔操作数，但会计算两侧，上例若把 `&&` 改成 `&`，右侧仍会执行整数除零并抛出异常。

浮点值还需要考虑 `NaN`：它与任何值（包括自身）用 `==` 比较都为 `false`，判断应使用 `Double.isNaN()` 或 `Float.isNaN()`。

## 位运算与移位

整数的 `&`、`|`、`^`、`~` 分别进行按位与、或、异或、取反。移位运算中，`<<` 左移，`>>` 保留符号扩展，`>>>` 在高位补零。

```java
int flags = 0b0101;
System.out.println(flags & 0b0001); // 1
System.out.println(-8 >> 1);       // -4
System.out.println(-8 >>> 1);      // 2147483644
System.out.println(1 << 32);       // 1
```

`int` 的移位距离只取右操作数的低 5 位，`long` 取低 6 位，因此 `int` 左移 32 位等价于左移 0 位。移位前的小整数类型也会提升，不能按原来的 8 位或 16 位宽度理解结果。

## 条件表达式、优先级与求值顺序

`condition ? first : second` 只计算被选中的分支。结果类型还受两个分支的类型共同影响，数值分支可能发生提升。

```java
int amount = -3;
int positive = amount >= 0 ? amount : 0;
System.out.println(2 + 3 * 4);      // 14
System.out.println((2 + 3) * 4);    // 20
System.out.println(1 + 2 + " items"); // 3 items
System.out.println("items: " + 1 + 2); // items: 12
```

优先级决定如何分组；Java 的操作数按从左到右求值，短路与条件表达式再决定是否计算后续部分。字符串参与 `+` 时发生拼接，详细规则见 [String 与字符串处理](../standard-library/string.md#字符串拼接)。

不熟悉的优先级组合应使用括号明确含义。

## 对象比较与类型检查

对象变量保存的是用于访问对象的引用。对两个对象变量使用 `==`，检查它们是否指向同一个对象，不会逐个比较对象中的数据。例如字符串应使用 `equals()` 比较文字内容。

`instanceof` 用于检查一个对象是否属于某种类型，`(类型)` 也可以用于转换对象引用。这些操作的完整示例见[多态与类型转换](./polymorphism.md)。

## 参考资料

- [Java SE 17 JLS：Expressions](https://docs.oracle.com/javase/specs/jls/se17/html/jls-15.html)
- [Java SE 17 JLS：Numeric Contexts](https://docs.oracle.com/javase/specs/jls/se17/html/jls-5.html#jls-5.6)
- [Dev.java：Java Language Basics](https://dev.java/learn/language-basics/)
- [廖雪峰：整数运算](https://liaoxuefeng.com/books/java/quick-start/basic/integer/index.html)
