---
title: Primitive Types
date: 2026-01-24
category: java
---

Java 有八个基本数据类型（primitive data types）：

- 整数类型：`byte`、`short`、`int`、`long`
- 浮点类型：`float`、`double`
- 字符类型：`char`
- 布尔类型：`boolean`

| Types     | Description              | Default Value |
| --------- | ------------------------ | ------------- |
| `byte`    | 8-bit signed integer     | `0`           |
| `short`   | 16-bit signed integer    | `0`           |
| `int`     | 32-bit signed integer    | `0`           |
| `long`    | 64-bit signed integer    | `0L`          |
| `float`   | 32-bit floating point    | `0.0f`        |
| `double`  | 64-bit floating point    | `0.0d`        |
| `char`    | 16-bit Unicode character | `'\u0000'`    |
| `boolean` | true or false            | `false`       |

> [!TIP]
> `L`、`f` 和 `d` 后缀分别用于表示 `long`, `float` 和 `double` 类型的字面值。

## 字面量表示法

Java 支持多种进制的整数字面量表示方式：

```java
// 十进制
int decimal = 100;

// 二进制（0b 或 0B 开头）
int binary = 0b1100100;  // 100

// 八进制（0 开头）
int octal = 0144;        // 100

// 十六进制（0x 或 0X 开头）
int hex = 0x64;          // 100
```

为了提高可读性，Java 7+ 支持使用下划线分隔数字：

```java
int million = 1_000_000;
long cardNumber = 1234_5678_9012_3456L;
int binary = 0b1010_1010_1010_1010;
double pi = 3.14_15_92_65;
```

> [!TIP]
> 下划线只能出现在数字之间，不能在开头、结尾或小数点旁边。

## 数值范围

对于一个 n bit 的有符号整数：

- 最小值：-2^(n-1)
- 最大值： 2^(n-1) - 1

> [!TIP]
> 为什么最大值少 1 ？因为 `0` 占用了一个正数区间的名额，而补码里 `-0` 不存在。

以 byte（8 bit）为例：

```
0111 1111  ->  127   (最大 2^7 - 1)
1000 0000  -> -128   (最小 -2^7)
范围：[-128, 127]
```

可以通过 `MIN_VALUE` 和 `MAX_VALUE` 常量来获取各个整数类型的范围：

```java
System.out.println("Byte range: " + Byte.MIN_VALUE + " to " + Byte.MAX_VALUE);
System.out.println("Short range: " + Short.MIN_VALUE + " to " + Short.MAX_VALUE);
System.out.println("Integer range: " + Integer.MIN_VALUE + " to " + Integer.MAX_VALUE);
System.out.println("Long range: " + Long.MIN_VALUE + " to " + Long.MAX_VALUE);
System.out.println("Float range: " + Float.MIN_VALUE + " to " + Float.MAX_VALUE);
System.out.println("Double range: " + Double.MIN_VALUE + " to " + Double.MAX_VALUE);
```

如果尝试赋值超出范围的值，不会导致编译错误。小于最小值称为下溢（underflow），大于最大值称为上溢（overflow）。

```java
int willThisCompile = (Integer.MAX_VALUE + 1); // 编译通过，但结果是 Integer.MIN_VALUE
System.out.println("Result of overflow: " + willThisCompile); // 输出 -2147483648
```

## 包装类

上述这八种基本数据类型都有对应的包装类（Wrapper Classes），它们位于 `java.lang` 包中。

包装类提供了基本的操作方法，并且允许将基本数据类型作为对象来处理。包装类如下：

| Primitive Type | Wrapper Class |
| -------------- | ------------- |
| `byte`         | `Byte`        |
| `short`        | `Short`       |
| `int`          | `Integer`     |
| `long`         | `Long`        |
| `float`        | `Float`       |
| `double`       | `Double`      |
| `char`         | `Character`   |
| `boolean`      | `Boolean`     |

> [!TIP]
> JavaScript 中也有类似的概念，详情见 [原始值包装类型](/docs/frontend/basic/javascript/007-basic-reference-type.md#原始值包装类型)。

## Casting（类型转换）

类型转换分为两种：自动类型转换（implicit casting）和强制类型转换（explicit casting）。核心判断标准只有一个：是否可能发生精度或信息丢失。

### 自动类型转换

当 目标类型的表示范围 ≥ 源类型，且不会丢失信息时，Java 会自动完成转换。

```java
int a = 10;
long b = a;        // int → long

float c = b;       // long → float（注意精度）
double d = c;      // float → double
```

类型的自动提升顺序：

- `byte / short / char` 在运算时会先提升为 `int`
- `char` 是无符号的（0 ~ 65535），但提升规则与整数一致

```
byte → short → int → long → float → double
                ↑
               char
```

表达式中的自动提升：

```java
byte myMinByteValue = Byte.MIN_VALUE;
byte myNewByteValue = (myMinByteValue / 2); // 编译失败
```

在上面的例子中，`myMinByteValue / 2` 的结果被提升为 `int` 类型，与声明类型不一致，因此需要进行强制类型转换。

### 强制类型转换

当 目标类型范围 < 源类型，可能丢失精度或发生溢出时，必须显式转换。

```java
byte myNewByteValue = (byte) (myMinByteValue / 2); // 强制类型转换为 byte

long a = 100L;
int b = (int) a;

double x = 3.14;
int y = (int) x;   // 结果是 3，直接截断小数

// 溢出示例：byte 只有 8 位，发生 二进制截断，不是「取最大/最小值」
int a = 130;
byte b = (byte) a;  // -126
```

`char` 在运算中会自动提升为 `int`：

```java
char a = 'A';
char b = (char) (a + 1);  // 需要强制转换
System.out.println(b);     // 输出：B
```

## 浮点数精度问题

浮点数使用 IEEE 754 标准表示，存在精度限制：

```java
System.out.println(0.1 + 0.2);        // 输出：0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3); // 输出：false
```

**原因：**

浮点数在二进制中无法精确表示某些十进制小数（如 0.1、0.2），导致舍入误差累积。

**解决方案：**

1. **使用 `BigDecimal` 进行精确计算**（推荐用于金融、货币等场景）：

```java
import java.math.BigDecimal;

BigDecimal a = new BigDecimal("0.1");
BigDecimal b = new BigDecimal("0.2");
BigDecimal sum = a.add(b);
System.out.println(sum);  // 输出：0.3
```

> [!WARNING]
> 必须使用 `new BigDecimal("0.1")` 而非 `new BigDecimal(0.1)`，后者仍会受到 double 精度影响。

**使用整数运算**（金额以"分"为单位）：

```java
int priceInCents = 100;  // 1.00 元
int tax = priceInCents * 13 / 100;  // 计算税费
```

**浮点数比较使用误差范围**：

```java
double epsilon = 1e-10;
boolean isEqual = Math.abs((0.1 + 0.2) - 0.3) < epsilon;  // true
```

**浮点数与整数的精度差异：**

```java
long bigNumber = 9_007_199_254_740_993L;
float f = bigNumber;
System.out.println((long) f == bigNumber);  // false（精度丢失）
```

> [!TIP]
> `float` 只有 24 位有效数字，`double` 有 53 位。超过这个范围会导致精度丢失。

## char 类型的特殊性

`char` 是 16 位的 Unicode 字符类型，可以用多种方式表示：

```java
char c1 = 'A';           // 字符字面量
char c2 = 65;            // 直接用整数（ASCII/Unicode 码点）
char c3 = '\u0041';      // Unicode 转义序列
char c4 = '\n';          // 转义字符

System.out.println(c1 + c2 + c3);  // 输出：195（字符参与运算会转为 int）
```

常见的转义字符：

| 转义序列 | 含义         |
| -------- | ------------ |
| `\n`     | 换行         |
| `\t`     | 制表符       |
| `\\`     | 反斜杠       |
| `\'`     | 单引号       |
| `\"`     | 双引号       |
| `\uXXXX` | Unicode 字符 |
