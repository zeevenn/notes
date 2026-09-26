---
title: String 与字符串处理
date: 2026-01-25
category: java
---

`String` 用来保存文本，例如姓名或一行消息。`String` 变量通过一个引用访问字符串对象，可以把引用理解为变量与某个对象之间的关联。Java 为字符串提供了双引号字面量和 `+` 拼接语法。

## 字符串基础

字符串字面量使用双引号，字符字面量使用单引号。`""` 是长度为零的字符串；`null` 表示没有指向字符串对象。

```java
char letter = 'A';
String text = "A";
String empty = "";
String missing = null;
String message = "Hello, " + text;
```

字符串中的双引号、反斜杠或换行可用转义表达，例如 `\"`、`\\`、`\n`、`\t`。`char` 保存一个 16 位字符编码单元，`String` 保存这样的单元序列，部分字符需要两个单元。

```java
String quoted = "\"Java\"";
String lines = "first\nsecond";
System.out.println(quoted); // "Java"
```

## 内容与对象

### 不可变性

把 `"Hello World"` 中的 `"World"` 替换为 `"Java"`，需要接收 `replace()` 的返回值：

```java
String text = "Hello World";
String changed = text.replace("World", "Java");
System.out.println(changed); // Hello Java
System.out.println(text);    // Hello World：原来的内容没有改变
```

这种“原字符串的内容不会被改动”的性质称为**不可变性**。`replace()`、`toUpperCase()` 等方法返回处理结果，忽略返回值就得不到处理后的文本。

如果希望后续使用处理结果，也可以把它赋回原变量，例如 `text = text.replace("World", "Java")`。这会让变量指向处理后的字符串，原字符串对象的内容仍然不变。

### 内容比较

判断两段文本是否相同，使用 `equals()`。即使两个字符串对象保存着相同文字，它们也可能是两个不同的对象：

```java
String text = "Hello";
String another = new String("Hello"); // 显式创建另一个字符串对象
System.out.println(text.equals(another)); // true：内容相同
System.out.println(text == another);      // false：不是同一个对象
```

这里用 `new String(...)` 演示两个独立对象，普通文本赋值直接用双引号即可。`==` 检查是否为同一个对象，不能代替内容比较。如果调用方法的变量为 `null`，调用会失败；可以先检查它不是 `null`，再调用 `equals()`。

`String` 重写了 `Object.equals()`，按字符串内容判断相等。默认行为与重写规则见 [Object.equals()：身份相等与逻辑相等](./object-contract.md#身份相等与逻辑相等)。

## 常用操作

得到字符串后，可以调用它的方法读取长度、取出一段文本，或检查是否包含某段内容：

```java
String text = "Hello World";
System.out.println(text.length());        // 11
System.out.println(text.charAt(0));       // H：下标从 0 开始
System.out.println(text.substring(0, 5)); // Hello：包含起点，不包含终点
System.out.println(text.indexOf("Java")); // -1：未找到
System.out.println(text.contains("World")); // true
System.out.println("  ".isEmpty());       // false：长度不是 0
System.out.println("  ".isBlank());       // true：仅包含空白
```

`length()` 按 `char` 单位计数，部分字符占两个 `char`，因此它不一定等于看到的字符数：

```java
System.out.println("A".length());  // 1
System.out.println("😀".length()); // 2
```

## 字符串拼接

少量拼接直接使用 `+`；循环中累积大量文本时，可以用 `StringBuilder` 逐步追加：

```java
StringBuilder builder = new StringBuilder();
for (int i = 0; i < 3; i++) {
    builder.append(i);
}
String result = builder.toString();
System.out.println(result); // 012
```

`String` 的内容不可修改，每次把拼接结果赋回变量，都不会改变原字符串。循环中不断累积拼接可能反复复制已有内容；`StringBuilder` 则在可变的缓冲区中追加，最后用 `toString()` 得到字符串。

`StringBuilder` 不提供线程同步，适合由单个线程构造文本。`StringBuffer` 的用途相似，但为修改等操作提供同步；只有多个线程共享同一个可变字符串时，才需要考虑这种协调。同步的具体含义见[线程基础](./thread-basics.md#共享数据与同步)。

## 字符串格式化

简单地把名字、年龄等值连起来时，`+` 就足够。需要控制小数位数、补零或对齐时，格式化更直接：

```java
import java.util.Locale;

String value = String.format(Locale.ROOT, "%.2f", 12.5);
String id = String.format(Locale.ROOT, "%04d", 7);
System.out.println(value); // 12.50
System.out.println(id);    // 0007

System.out.printf(Locale.ROOT, "value=%.2f, id=%04d%n", 12.5, 7);
// 输出 value=12.50, id=0007，并换行
```

`String.format()` 返回格式化后的字符串；`printf()` 直接输出。`Locale` 指定地区格式规则，示例使用 `Locale.ROOT` 固定小数点等格式，避免输出随机器的默认地区变化。

| 写法   | 含义                                                   |
| ------ | ------------------------------------------------------ |
| `%s`   | 按字符串形式输出                                       |
| `%d`   | 按十进制整数输出                                       |
| `%.2f` | 输出两位小数，不足时补零，多余时舍入                   |
| `%04d` | 十进制整数至少占四位，不足时在前面补零；超过四位不截断 |
| `%n`   | 使用当前平台的换行符                                   |

格式化控制的是输出文本，不会改变原数值，也不能消除浮点计算误差。

## 文本块

文本块用三引号 `"""` 表示多行字符串。开头的三引号后需要换行；编译器会去掉公共的附带缩进，并把行结束符统一为 `\n`：

```java
String name = "Alice";
String message = """
    Name: %s
    Status: active
    """.formatted(name);
System.out.print(message);
```

输出：

```text
Name: Alice
Status: active
```

例子中的结束三引号独占一行，因此结果末尾有换行。`.formatted(name)` 按 `%s` 占位符填入值，与 `String.format()` 使用相同的格式规则。

## 与数组互转

`split()` 把一段文本分成字符串数组，`String.join()` 把数组中的文本按指定分隔符连接起来：

```java
import java.util.Arrays;

String[] parts = "a,b,c".split(",");
System.out.println(Arrays.toString(parts)); // [a, b, c]
System.out.println(String.join("/", parts)); // a/b/c
```

`split()` 的参数是正则表达式，即描述匹配规则的字符串。逗号可直接写；点号在正则表达式中有特殊含义，按普通点号分割时应写成 `"a.b.c".split("\\.")`。

字符串常量池与 `intern()` 的机制见[字符串实现与源码分析](../standard-library/string-internals.md)。
