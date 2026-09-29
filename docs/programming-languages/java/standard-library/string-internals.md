---
title: 字符串实现与源码分析
date: 2026-09-26
category: java
---

字符串的创建、内容比较与常用操作见 [String 与字符串处理](../language/string.md)。这里沿 OpenJDK 的 `java.lang` 源码分析存储、比较、复用与拼接；字段布局和缓存方式属于实现细节，不能当作所有 Java 实现的要求。

## 内部存储与不可变性

### `byte[]` 与编码标记

`String` 的核心字段如下，省略了注解和无关成员：

```java
private final byte[] value;
private final byte coder;
private int hash;
private boolean hashIsZero;
```

`value` 保存内容，`coder` 决定如何解释这些字节。启用紧凑字符串（Compact Strings）时，如果全部字符都能用 Latin-1 表示，就用一个字节保存一个编码单元；否则整段内容采用 UTF-16，每个编码单元占两个字节。Latin-1 能表示 `U+0000` 到 `U+00FF` 的字符，不只包含 ASCII。

| 文本 | 内部编码 | 内容数组字节数 | `length()` |
| --- | --- | --- | --- |
| `"ABC"` | Latin-1 | 3 | 3 |
| `"中文"` | UTF-16 | 4 | 2 |
| `"😀"` | UTF-16 | 4 | 2 |

表中的字节数只计算内容数组，不包含对象头等开销。内部编码也不是文件或网络传输使用的字符集；`getBytes(charset)` 会按指定字符集重新编码。

`length()` 的实现连接了字节存储和对外的 `char` 语义：

```java
public int length() {
    return value.length >> coder();
}
```

Latin-1 的标记为 `0`，UTF-16 为 `1`，因此分别返回字节数或字节数的一半。UTF-16 中的补充字符使用两个编码单元，内部采用紧凑存储不会改变 `length()` 的含义。

### 不可变性依赖封装

`final byte[]` 只保证数组引用不能重新赋值，并不会冻结数组内容。`String` 的不可变性依赖这些条件共同成立：类不能被继承，内容数组不向调用方暴露，公开 API 不原地修改内容，接收外部可变数组时复制内容。

```java
char[] source = {'J', 'a', 'v', 'a'};
String text = new String(source);
source[0] = 'L';

System.out.println(text); // Java
```

已有 `String` 的内容可以安全共享。接收另一个字符串的构造方法并不复制内容数组：

```java
public String(String original) {
    this.value = original.value;
    this.coder = original.coder;
    this.hash = original.hash;
}
```

所以 `new String(original)` 创建了另一个字符串对象，但两个对象可以共用同一份不可变内容。对象身份不同与底层数据共享并不矛盾。

## 内容比较、哈希缓存与子串

### `equals()` 比较内容

`String.equals()` 的源码先判断对象身份，再检查类型、编码标记和内容：

```java
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    return (anObject instanceof String aString)
            && (!COMPACT_STRINGS || this.coder == aString.coder)
            && StringLatin1.equals(value, aString.value);
}
```

相同对象可以立即返回；不同对象仍需要比较内容。这里的 `StringLatin1.equals()` 虽然带有 Latin-1 名称，实际比较的是两个字节数组的长度及内容，在编码一致时也能用于 UTF-16 数据。

该实现没有把哈希值相等当作内容相等的依据。不同字符串可能拥有相同哈希值：

```java
System.out.println("Aa".hashCode() == "BB".hashCode()); // true
System.out.println("Aa".equals("BB"));                 // false
```

### `hashCode()` 缓存计算结果

字符串哈希按 `char` 编码单元累积计算，相当于从 `h = 0` 开始，依次执行 `h = 31 * h + ch`。OpenJDK 分别由 `StringLatin1` 和 `StringUTF16` 读取内容，但相同字符序列得到相同结果。

`String.hashCode()` 的主体如下：

```java
int h = hash;
if (h == 0 && !hashIsZero) {
    h = isLatin1() ? StringLatin1.hashCode(value)
                   : StringUTF16.hashCode(value);
    if (h == 0) {
        hashIsZero = true;
    } else {
        hash = h;
    }
}
return h;
```

内容不可变，因此计算结果可以复用。`hash` 初始值为 `0`，而真实哈希也可能是 `0`，所以另用 `hashIsZero` 区分“尚未计算”和“结果确实为零”。缓存字段的变化不改变字符串内容。

### `substring()` 如何复制内容

`substring(beginIndex, endIndex)` 先检查范围。截取整个字符串时直接返回自身，否则交给对应编码的辅助类：

```java
if (beginIndex == 0 && endIndex == length) {
    return this;
}
int subLen = endIndex - beginIndex;
return isLatin1() ? StringLatin1.newString(value, beginIndex, subLen)
                  : StringUTF16.newString(value, beginIndex, subLen);
```

Latin-1 分支的 `newString()` 展示了复制发生的位置：

```java
public static String newString(byte[] val, int index, int len) {
    if (len == 0) {
        return "";
    }
    return new String(Arrays.copyOfRange(val, index, index + len), LATIN1);
}
```

UTF-16 分支同样为所需内容创建数组，并在可能时压缩为 Latin-1。非空的局部子串不会仅靠偏移量共享原字符串的大数组；截取整个范围和空范围则可复用已有对象。

## 字符串常量池（String Pool）

字符串常量池用于复用内容相同的字符串实例，字符串字面量会参与这种复用。因为 `String` 不可变，共享实例不会让一个使用者改掉另一个使用者看到的内容。

```java
String first = "Hello";
String second = "Hello";
String separate = new String("Hello");
System.out.println(first == second);            // true
System.out.println(first == separate);          // false
System.out.println(first == separate.intern()); // true
```

`intern()` 返回池中内容相同的实例；若不存在，则把当前实例加入池并返回它。调用不会改变原变量指向，若需要使用池中的对象，应接收返回值。OpenJDK 的 `String.intern()` 是 `native` 方法，具体池管理由虚拟机完成。

### 常量表达式与运行时拼接

字符串常量表达式的结果也参与复用：

```java
String literal = "Hello";
String folded = "He" + "llo";
final String prefix = "He";
String fromConstant = prefix + "llo";

String part = "He";
String fromRuntime = part + "llo";

System.out.println(literal == folded);             // true
System.out.println(literal == fromConstant);       // true
System.out.println(literal == fromRuntime);        // false
System.out.println(literal.equals(fromRuntime));   // true
System.out.println(literal == fromRuntime.intern()); // true
```

`prefix` 是由常量表达式初始化的 `final String`，因此相关拼接可以在编译期求值。`part` 不是常量变量，对它的拼接发生在运行时，结果不会自动变成池中的同一对象。

字面量和字符串常量表达式的复用、非恒定拼接结果的对象语义由语言规范规定；具体池结构属于虚拟机实现。普通业务代码仍应使用 `equals()` 比较内容。

## 拼接的字节码与 `StringBuilder`

### 单个 `+` 表达式

运行时拼接不必编译成显式的 `new StringBuilder().append(...)`。保存下面的代码为 `ConcatDemo.java`：

```java
public class ConcatDemo {
    static String constant() {
        return "user=" + "Alice";
    }

    static String dynamic(String name, int id) {
        return "user=" + name + ", id=" + id;
    }
}
```

编译后查看字节码：

```shell
javac ConcatDemo.java
javap -c -v ConcatDemo
```

本次 `javac` 输出中，`constant()` 通过 `ldc` 直接加载 `"user=Alice"`；`dynamic()` 的主要指令为：

```text
aload_0
iload_1
invokedynamic ... makeConcatWithConstants:(Ljava/lang/String;I)Ljava/lang/String;
areturn
```

`invokedynamic` 表示由运行时链接调用目标。`BootstrapMethods` 中对应的是 `StringConcatFactory.makeConcatWithConstants`，它根据参数类型和常量片段构造拼接逻辑。编译器表达了整个拼接操作，运行时可以选择具体实现；不能把某一种编译策略当成 `+` 的语言定义。

### 循环累积与可变缓冲区

单个表达式可以整体优化，但循环中反复使用前一次结果，仍可能反复复制不断增长的前缀：

```java
String result = "";
for (String part : List.of("A", "B", "C")) {
    result = result + part;
}
System.out.println(result); // ABC
```

如果每次追加固定长度片段并复制已有前缀，复制量随轮数形成 `1 + 2 + ... + n`，是平方级增长。这里描述的是复制成本模型，实际分配和耗时还会受运行时优化影响。

`StringBuilder` 把多次追加集中到同一个可变缓冲区：

```java
StringBuilder builder = new StringBuilder();
for (String part : List.of("A", "B", "C")) {
    builder.append(part);
}
String result = builder.toString();
builder.append("D");

System.out.println(result);  // ABC
System.out.println(builder); // ABCD
```

缓冲区由父类 `AbstractStringBuilder` 管理，核心字段是可变的 `byte[] value`、编码标记 `coder` 和已使用的编码单元数 `count`。`append(String)` 在处理 `null` 后的主要逻辑是：

```java
int len = str.length();
ensureCapacityInternal(count + len);
putStringAt(count, str);
count += len;
return this;
```

容量够用时写入尾部；容量不足时才分配更大的数组并复制旧内容。追加无法用 Latin-1 表示的文本时，还需要将已有内容转换为 UTF-16。预留容量、按需扩容，使普通追加无需每次复制整个前缀。

最后，`StringBuilder.toString()` 将有效内容交给前面分析过的 `newString()`：

```java
public String toString() {
    return isLatin1() ? StringLatin1.newString(value, 0, count)
                      : StringUTF16.newString(value, 0, count);
}
```

非空结果拥有复制后的内容，所以后续修改 builder 不会改变已经生成的字符串。少量拼接使用 `+` 即可；循环累积文本时，`StringBuilder` 能更直接地表达缓冲区复用。
