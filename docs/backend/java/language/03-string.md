---
title: String
date: 2026-01-25
category: java
---

`String` 是 Java 中用于表示字符串的**引用类型**（Reference Type），位于 `java.lang` 包中。

与基本类型不同，`String` 是一个类，但可以像基本类型一样使用字面量创建：

```java
String s = "Hello";  // 字面量方式（推荐）
```

## 不可变性（Immutable）

`String` 对象一旦创建，内容就**无法修改**：

```java
String s = "Hello";
s = s + " World";  // 并非修改原对象，而是创建了新对象
```

**底层原理：**

- Java 8 及之前：`String` 内部使用 `final char[]` 存储数据
- Java 9+：改为 `final byte[]` + 编码标识（节省内存）
- 所有修改操作都会返回新的 `String` 对象

**为什么要设计成不可变？**

1. **安全性**：字符串常用于文件路径、网络地址、数据库连接等敏感场景，不可变可防止恶意修改
2. **线程安全**：不可变对象天然线程安全，无需同步
3. **哈希缓存**：`String` 可以缓存 `hashCode()`，提高 `HashMap`、`HashSet` 等性能
4. **字符串常量池**：不可变才能安全共享对象

## 字符串常量池（String Pool）

JVM 会在堆内存中维护一个**字符串常量池**，缓存字符串字面量，避免重复创建：

```java
String s1 = "Hello";
String s2 = "Hello";
System.out.println(s1 == s2);  // true（指向常量池中的同一对象）

String s3 = new String("Hello");
System.out.println(s1 == s3);  // false（new 强制在堆中创建新对象）
```

**内存布局：**

```
堆内存（Heap）
├── 字符串常量池
│   └── "Hello" ← s1, s2 都指向这里
└── 普通对象区
    └── new String("Hello") ← s3 指向这里
```

**intern() 方法：**

```java
String s3 = new String("Hello");
String s4 = s3.intern();  // 将 s3 的值放入常量池（如果不存在），返回常量池中的引用
System.out.println(s1 == s4);  // true
```

## 创建方式

### 字面量方式（推荐）

```java
String s1 = "Hello";
```

- 自动使用字符串常量池
- 性能更好，内存占用更少

### 构造器方式

```java
String s2 = new String("Hello");
```

- 强制在堆中创建新对象
- 即使常量池中已有相同内容，仍会创建新对象

### 从字符数组创建

```java
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String s3 = new String(chars);
```

### 从字节数组创建

```java
byte[] bytes = {72, 101, 108, 108, 111};
String s4 = new String(bytes);  // 使用平台默认编码
String s5 = new String(bytes, "UTF-8");  // 指定编码
```

## 常用方法

### 长度与字符访问

```java
String s = "Hello World";

s.length();                    // 11
s.charAt(0);                   // 'H'
s.isEmpty();                   // false
```

### 子串操作

```java
s.substring(0, 5);             // "Hello"（不包含索引 5）
s.substring(6);                // "World"（从索引 6 到末尾）
```

### 查找与判断

```java
s.indexOf("World");            // 6（首次出现的位置）
s.lastIndexOf("o");            // 7（最后一次出现的位置）
s.contains("World");           // true
s.startsWith("Hello");         // true
s.endsWith("World");           // true
```

### 替换（返回新对象）

```java
s.replace("World", "Java");    // "Hello Java"
s.replaceAll("o", "0");        // "Hell0 W0rld"（支持正则）
s.replaceFirst("l", "L");      // "HeLlo World"
```

### 分割

```java
s.split(" ");                  // ["Hello", "World"]
"a,b,c".split(",");            // ["a", "b", "c"]
```

### 大小写转换

```java
s.toLowerCase();               // "hello world"
s.toUpperCase();               // "HELLO WORLD"
```

### 去除空白

```java
"  hello  ".trim();            // "hello"（去除首尾空白）
"  hello  ".strip();           // "hello"（Java 11+，支持 Unicode 空白字符）
"  hello  ".stripLeading();    // "hello  "（仅去除开头）
"  hello  ".stripTrailing();   // "  hello"（仅去除末尾）
```

### 比较

```java
String s1 = "Hello";
String s2 = "Hello";
String s3 = new String("Hello");

s1 == s2;                      // true（引用相同）
s1 == s3;                      // false（引用不同）
s1.equals(s3);                 // true（内容相同）
s1.equalsIgnoreCase("hello");  // true（忽略大小写）
s1.compareTo("World");         // < 0（字典序比较）
```

### 其他常用方法

```java
String.valueOf(123);           // "123"（任意类型转字符串）
"hello".repeat(3);             // "hellohellohello"（Java 11+）
"".isBlank();                  // true（Java 11+，判断是否为空或仅包含空白）
String.join(", ", "a", "b");   // "a, b"（拼接多个字符串）
```

## 字符串拼接

### + 运算符

```java
String s = "Hello" + " " + "World";
```

- 编译器会自动优化为 `StringBuilder`
- 循环中使用会创建多个 `StringBuilder`，性能较差

### StringBuilder（推荐，线程不安全）

```java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
String result = sb.toString();  // "Hello World"
```

- 可变对象，修改时不创建新对象
- 单线程场景性能最优

### StringBuffer（线程安全）

```java
StringBuffer buf = new StringBuffer();
buf.append("Hello").append(" ").append("World");
String result = buf.toString();
```

- 方法都加了 `synchronized`，线程安全
- 性能略低于 `StringBuilder`
- 多线程场景才需要使用

### 性能对比

```java
// 不推荐：循环中使用 +
String s = "";
for (int i = 0; i < 1000; i++) {
    s += i;  // 每次循环都创建新对象，性能极差
}

// 推荐：使用 StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result = sb.toString();
```

## 字符串比较

### == vs equals()

```java
String s1 = "Hello";
String s2 = "Hello";
String s3 = new String("Hello");

// == 比较引用（对象地址）
s1 == s2;           // true（常量池中的同一对象）
s1 == s3;           // false（s3 是堆中的新对象）

// equals() 比较内容
s1.equals(s3);      // true（内容相同）
```

> [!WARNING]
> 字符串比较时应使用 `.equals()` 或 `.equalsIgnoreCase()`，而非 `==`。

### 字典序比较

```java
"apple".compareTo("banana");   // < 0（apple 在字典中排在 banana 前）
"banana".compareTo("apple");   // > 0
"hello".compareTo("hello");    // 0（相等）
```

## 字符串格式化

### String.format()

```java
String name = "Alice";
int age = 25;
String s = String.format("Name: %s, Age: %d", name, age);
// "Name: Alice, Age: 25"
```

常用格式说明符：

| 说明符 | 类型          | 示例       |
| ------ | ------------- | ---------- |
| `%s`   | 字符串        | `"Hello"`  |
| `%d`   | 十进制整数    | `123`      |
| `%f`   | 浮点数        | `3.14`     |
| `%.2f` | 保留 2 位小数 | `3.14`     |
| `%x`   | 十六进制      | `7b`       |
| `%n`   | 换行符        | （跨平台） |

### printf()（直接输出）

```java
System.out.printf("Name: %s, Age: %d%n", "Bob", 30);
```

### 文本块（Java 15+）

```java
String json = """
    {
        "name": "Alice",
        "age": 25
    }
    """;
```

- 保留格式（包括换行和缩进）
- 无需转义双引号

## String vs StringBuilder vs StringBuffer

| 特性     | String     | StringBuilder | StringBuffer |
| -------- | ---------- | ------------- | ------------ |
| 可变性   | 不可变     | 可变          | 可变         |
| 线程安全 | 安全       | 不安全        | 安全         |
| 性能     | 修改时最差 | 最高          | 略低         |
| 使用场景 | 不频繁修改 | 单线程拼接    | 多线程拼接   |

**选择建议：**

- 字符串不需要修改 → 用 `String`
- 单线程频繁拼接 → 用 `StringBuilder`
- 多线程频繁拼接 → 用 `StringBuffer`

## 常见陷阱

### 1. 字符串拼接在循环中

```java
// ❌ 不推荐
String s = "";
for (int i = 0; i < 10000; i++) {
    s += i;  // 创建 10000 个中间对象
}

// ✅ 推荐
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
```

### 2. 使用 == 比较字符串

```java
// ❌ 不推荐
String s1 = new String("hello");
String s2 = new String("hello");
if (s1 == s2) { /* ... */ }  // false

// ✅ 推荐
if (s1.equals(s2)) { /* ... */ }  // true
```

### 3. substring() 的内存泄漏（Java 6）

```java
// Java 6 中，substring() 会持有原字符串的 char[]
String huge = "very long string...";
String sub = huge.substring(0, 5);  // sub 仍然持有整个 huge 的内存

// Java 7+ 已修复，substring() 会创建新的字符数组
```

### 4. 忘记 String 不可变

```java
String s = "hello";
s.toUpperCase();       // ❌ 返回值被忽略，s 仍然是 "hello"
s = s.toUpperCase();   // ✅ 正确用法
```
