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

字符串中的双引号、反斜杠或换行可用转义表达，例如 `\"`、`\\`、`\n`、`\t`。`char` 保存一个 16 位字符编码单元，`String` 保存这样的单元序列；部分字符需要两个单元，具体例子在本篇的编码部分。

```java
String quoted = "\"Java\"";
String lines = "first\nsecond";
System.out.println(quoted); // "Java"
```

## 文本块 [Java 15+]

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

例子中的结束三引号独占一行，因此结果末尾有换行。文本块不会自动替换 `${name}`；这里的 `.formatted(name)` 按 `%s` 占位符填入值，与 `String.format()` 使用相同的格式规则。

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

### 字符串常量池（String Pool）

字符串常量池用于复用内容相同的字符串实例，字符串字面量会参与这种复用。因为 `String` 不可变，共享实例不会让一个使用者改掉另一个使用者看到的内容。

```java
String first = "Hello";
String second = "Hello";
String separate = new String("Hello");
System.out.println(first == second);            // true
System.out.println(first == separate);          // false
System.out.println(first == separate.intern()); // true
```

`intern()` 返回池中内容相同的实例；若不存在，则把当前实例加入池并返回它。字面量之间的 `==` 恰好为 `true`，不代表可以用 `==` 比较任意字符串的内容。

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

`length()` 按 `char` 单位计数，部分字符占两个 `char`，因此它不一定等于看到的字符数。下方“字符、编码与 byte[] 转换”给出了例子。

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

## String vs StringBuilder vs StringBuffer

三者的区别来自内容能否修改，以及修改时是否提供线程同步：

- **`String` 不可变**：创建后内容不变，`s += part` 会把拼接结果赋回 `s`，不会修改原对象。多个线程可以共享同一个字符串的内容；但在循环中不断累积拼接，会反复复制已经拼好的内容，字符串越长，复制成本越高。
- **`StringBuilder` 可变**：`append()` 在同一个对象的内部缓冲区（用于存放内容的可扩容存储空间）中追加数据，容量足够时可直接复用，最后用 `toString()` 得到字符串。它不提供线程同步，省去了同步开销，但多个线程同时修改同一个实例可能相互干扰。
- **`StringBuffer` 可变且提供同步**：`append()` 等操作通过 `synchronized` 锁协调对同一对象的访问，使受保护的操作依次执行。同步可能带来额外开销；而且连续两次调用，如 `append("A").append("B")`，仍可能被其他线程的操作插入，两次调用不会自动成为一个不可分割的整体。

| 特性     | String                       | StringBuilder          | StringBuffer                 |
| -------- | ---------------------------- | ---------------------- | ---------------------------- |
| 内容修改 | 原对象不变                   | 在原对象上修改         | 在原对象上修改               |
| 线程共享 | 不可变内容可共享             | 不支持无同步的并发修改 | 对同一实例的操作提供同步     |
| 拼接成本 | 累积拼接可能反复复制已有内容 | 复用缓冲区，必要时扩容 | 复用缓冲区，并有同步开销     |
| 常见用途 | 保存文本、少量直接拼接       | 单个线程内逐步构造文本 | 需要共享可变缓冲区并同步访问 |

少量拼接直接使用 `+` 即可，编译器可以优化拼接表达式，不能笼统地说 `String`“性能最差”。多线程程序也不必一律使用 `StringBuffer`：如果每个线程各自创建和使用 `StringBuilder`，彼此没有共享实例，就不存在并发修改同一缓冲区的问题。

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

## 与数组互转

`split()` 把一段文本分成字符串数组，`String.join()` 把数组中的文本按指定分隔符连接起来：

```java
import java.util.Arrays;

String[] parts = "a,b,c".split(",");
System.out.println(Arrays.toString(parts)); // [a, b, c]
System.out.println(String.join("/", parts)); // a/b/c
```

`split()` 的参数是正则表达式，即描述匹配规则的字符串。逗号可直接写；点号在正则表达式中有特殊含义，按普通点号分割时应写成 `"a.b.c".split("\\.")`。

## 字符、编码与 byte[] 转换

`String` 的 API 按 UTF-16 代码单元处理索引，一个 `char` 是一个 16 位代码单元。Unicode 为字符分配码点，基本多文种平面之外的码点需要两个 `char` 表示，称为代理对。

```java
String text = "A😀";
System.out.println(text.length()); // 3：char 数量
System.out.println(text.codePointCount(0, text.length())); // 2：码点数量
System.out.println(text.codePointAt(1)); // 128512
```

`charAt()` 和 `substring()` 使用代码单元下标，截取时可能拆开代理对。码点数量也不一定等于用户看到的字符数量，例如字母和组合重音可以由多个码点组成一个显示单元。

字符编码规定字符串如何转换为字节。写入文件或网络时编码，读取字节时解码，两端需要约定相同的字符集：

```java
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

byte[] bytes = "中".getBytes(StandardCharsets.UTF_8);
System.out.println(Arrays.toString(bytes)); // [-28, -72, -83]
String restored = new String(bytes, StandardCharsets.UTF_8);
System.out.println(restored); // 中
```

`byte` 是有符号类型，因此输出可以为负数；上例仍表示三个 UTF-8 字节。Java 17 的默认字符集可能随环境变化，省略字符集参数会使结果依赖运行环境。

普通 `String` 编解码方法对部分非法输入会使用替换字符或替换字节。需要拒绝非法输入时，使用 `CharsetDecoder` 或 `CharsetEncoder` 并设置 `CodingErrorAction.REPORT`。

内部存储结构属于实现细节，不应由 API 的 UTF-16 索引规则推断其底层一定是 `char[]`。

## 参考资料

- [Dev.java：Strings](https://dev.java/learn/numbers-strings/strings/)
- [Java 17：String](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/String.html)
- [Java 17：StringBuilder](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/StringBuilder.html)、[StringBuffer](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/StringBuffer.html)
- [Java 17：Formatter](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Formatter.html)
- [Java 17：Text Blocks](https://docs.oracle.com/en/java/javase/17/text-blocks/index.html)
- [Java SE 17 API：Charset](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/nio/charset/Charset.html)
- [廖雪峰：字符和字符串](https://liaoxuefeng.com/books/java/quick-start/basic/string/index.html)
- [廖雪峰：字符串和编码](https://liaoxuefeng.com/books/java/oop/core/string-encoding/index.html)
