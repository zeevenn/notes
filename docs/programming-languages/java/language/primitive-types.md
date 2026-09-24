---
title: 基本数据类型与类型转换
date: 2026-01-24
category: java
---

Java 的基本数据类型保存数值、字符编码或布尔值。声明时选择的类型，决定了值的范围，以及参与运算和赋值时的规则。

```java
int count = 3;
long total = 3_000_000_000L;
double price = 12.5;
char grade = 'A';
boolean enabled = true;
```

## 八种基本类型

整数类型按能表示的范围选择；浮点类型用于带小数的计算；`boolean` 只有 `true` 和 `false` 两个值。

| 类型 | 含义 | 范围或精度 |
| --- | --- | --- |
| `byte` | 8 位有符号整数 | -128 ～ 127 |
| `short` | 16 位有符号整数 | -32768 ～ 32767 |
| `int` | 32 位有符号整数 | -2147483648 ～ 2147483647 |
| `long` | 64 位有符号整数 | -2⁶³ ～ 2⁶³ - 1 |
| `float` | 单精度浮点数 | 24 个二进制有效位，约 6～7 位十进制有效数字 |
| `double` | 双精度浮点数 | 53 个二进制有效位，约 15～16 位十进制有效数字 |
| `char` | 16 位无符号值，用于字符编码 | 0 ～ 65535 |
| `boolean` | 布尔值 | `true`、`false` |

## 字面量与数值范围

直接写在代码中的 `100`、`12.5`、`'A'` 等固定值称为字面量。整数字面量通常按 `int` 处理，带小数点的字面量通常按 `double` 处理；`L` 和 `f` 后缀分别指定 `long`、`float`。

```java
long population = 8_000_000_000L;
float ratio = 0.5f;
double distance = 0.5;

int decimal = 100;
int binary = 0b1100100; // 二进制
int octal = 0144;      // 八进制
int hex = 0x64;        // 十六进制
```

下划线用来分隔数字，不改变数值，不能写在数字开头、结尾或小数点旁边。八进制使用前缀 `0`，因此 `010` 表示十进制的 `8`。

n 位有符号整数的范围是 -2ⁿ⁻¹ 到 2ⁿ⁻¹ - 1。运算超出范围时会溢出，保留有限位数的结果，不会自动扩大变量类型。

```java
int max = 2_147_483_647;
System.out.println(max + 1); // -2147483648
// byte small = 128;         // 编译错误：赋值不在 byte 范围内
```

直接赋入不兼容的值会编译失败；表达式运行时溢出则通常不会抛出异常，两者需要区分。

## 自动类型转换

把较窄的整数类型赋给较宽的整数类型，例如 `int` 赋给 `long`，可以自动完成。

```java
int count = 10;
long total = count;
```

Java 允许的扩大转换可以概括为：

```text
byte → short → int → long → float → double
                ↑
               char
```

“扩大”不保证数值完全精确。`int → float`、`long → float/double` 允许自动转换，但浮点数可能没有足够的有效位保留全部整数信息。

```java
int original = 16_777_217;
float converted = original;
System.out.println((int) converted); // 16777216
```

`boolean` 不参与数值转换，不能把整数直接赋给布尔变量。

## 强制类型转换

在值前写 `(目标类型)`，显式执行转换。转换为较窄类型可能丢失信息，整数转为更窄整数时会丢弃高位。

```java
long total = 100L;
int count = (int) total;

double price = 3.75;
int whole = (int) price;
System.out.println(whole); // 3：向零截断小数

int value = 130;
byte small = (byte) value;
System.out.println(small); // -126
```

赋值存在常量特例：范围内的 `int` 常量可以直接赋给 `byte`、`short` 或 `char`，但普通变量不适用这条规则。

```java
byte first = 100;
int value = 100;
// byte second = value; // 编译错误
byte second = (byte) value;
```

## 运算中的类型提升

`byte`、`short`、`char` 参与常见算术运算时，会先按 `int` 计算。结果不会因为左侧接收变量更窄而自动变窄。

```java
byte left = 10;
byte right = 20;
int sum = left + right;
// byte small = left + right; // 编译错误：表达式结果是 int

char letter = 'A';
char next = (char) (letter + 1);
System.out.println(next); // B
```

混合数值运算通常统一到操作数中适用的较宽类型；例如一个操作数是 `double` 时，另一个数值操作数也转换为 `double` 后参与计算。

## 浮点数精度问题

浮点数使用有限位数表示二进制小数。有些十进制小数无法精确表示，计算结果会包含舍入误差。

```java
System.out.println(0.1 + 0.2);        // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3); // false
```

需要比较近似计算结果时，应根据数据尺度和允许误差判断差值；没有适合所有数值的固定误差阈值。需要按十进制精确计算时，可以使用标准库的 `BigDecimal`，它通过十进制数值及其运算方法完成计算：

```java
import java.math.BigDecimal;

BigDecimal first = new BigDecimal("0.1");
BigDecimal second = new BigDecimal("0.2");
System.out.println(first.add(second)); // 0.3
```

这里从字符串构造十进制值。若使用 `new BigDecimal(0.1)`，得到的是那个二进制浮点值的精确十进制表示，会保留原有误差。

## char 类型的特殊性

`char` 使用单引号表示，例如 `'A'`、`'中'`。字符编码为字符分配数值；`char` 可以参与整数运算。

```java
char first = 'A';
char second = 65;
char third = '\u0041';
System.out.println(first == second); // true
System.out.println(first + second + third); // 195
```

Unicode 为字符分配的编号称为码点。Java 的 UTF-16 表示法用一个或两个 16 位单元表示一个码点，`char` 对应其中一个单元。因此部分字符（例如很多 emoji）需要两个 `char`，应放在字符串中处理。

常见转义包括 `\n`（换行）、`\t`（制表符）、`\\`（反斜杠）、`\'`（单引号）。`\u0041` 是 Unicode 转义，表示编码值为十六进制 `0041` 的字符。

## 默认值与边界常量

声明在类中、方法外的变量称为字段；数组元素是数组各位置保存的值。字段和新数组元素自动获得默认值：数值为零、`char` 为 `'\u0000'`、`boolean` 为 `false`。方法内部的局部变量必须在读取前明确赋值。

标准库为基本类型提供了对应的工具类，例如 `Integer` 对应 `int`、`Double` 对应 `double`。可以通过这些类的常量查询类型边界：

```java
System.out.println(Integer.MIN_VALUE); // -2147483648
System.out.println(Integer.MAX_VALUE); // 2147483647
```

`Float.MIN_VALUE` 和 `Double.MIN_VALUE` 表示最小的正非零值，不是最负值。它们与整数类型的 `MIN_VALUE` 含义不同。

## 参考资料

- [Java SE 17 JLS：Primitive Types and Values](https://docs.oracle.com/javase/specs/jls/se17/html/jls-4.html#jls-4.2)
- [Java SE 17 JLS：Conversions and Contexts](https://docs.oracle.com/javase/specs/jls/se17/html/jls-5.html)
- [Java SE 17 API：Double](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Double.html)
