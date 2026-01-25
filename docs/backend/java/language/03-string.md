---
title: String
date: 2026-01-25
category: java
---

`String` 是 Java 中用于表示字符串的**引用类型**（Reference Type），位于 `java.lang` 包中。

`String` 可以被用做 Java 的第九个基本数据类型，可以像基本类型一样使用字面量创建，但它其实是一个类。

```java
String s = "Hello";  // 字面量方式（推荐）
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

## 常用方法

### 长度与字符访问

```java
String s = "Hello World";

s.length();                    // 11
s.charAt(0);                   // 'H'
s.isEmpty();                   // false
"".isBlank();                  // true（Java 11+，判断是否为空或仅包含空白）
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

### 比较

```java
String s1 = "Hello";
String s2 = "Hello";
String s3 = new String("Hello");

// == 比较引用（对象地址）
s1 == s2;                      // true（常量池中的同一对象）
s1 == s3;                      // false（s3 是堆中的新对象）

// equals() 比较内容
s1.equals(s3);                 // true（内容相同）
s1.equalsIgnoreCase("hello");  // true（忽略大小写）

// 字典序比较
"apple".compareTo("banana");   // < 0（apple 在字典中排在 banana 前）
"banana".compareTo("apple");   // > 0
"hello".compareTo("hello");    // 0（相等）
```

> [!WARNING]
> 字符串比较时应使用 `.equals()` 或 `.equalsIgnoreCase()`，而非 `==`。

### 替换（返回新对象）

```java
s.replace("World", "Java");    // "Hello Java"
s.replaceAll("o", "0");        // "Hell0 W0rld"（支持正则）
s.replaceFirst("l", "L");      // "HeLlo World"
```

### 分割与拼接

```java
// 分割
s.split(" ");                  // ["Hello", "World"]
"a,b,c".split(",");            // ["a", "b", "c"]

// 拼接
String.join(", ", "a", "b");   // "a, b"
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

### 其他常用方法

```java
String.valueOf(123);           // "123"（任意类型转字符串）
"hello".repeat(3);             // "hellohellohello"（Java 11+）
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

### 文本块（Java 13+）

Java 13+ 引入了**文本块（Text Blocks）**，使用 `"""` 三引号表示多行字符串，类似 JavaScript 的模板字符串 `` ` ``。

```java
String json = """
    {
        "name": "Alice",
        "age": 25
    }
    """;

// 等价于传统写法
String json = "{\n" +
              "    \"name\": \"Alice\",\n" +
              "    \"age\": 25\n" +
              "}\n";
```

**主要特性：**

1. **保留换行和缩进**

   ```java
   string html = """
       <html>
           <body>
               <h1>hello</h1>
           </body>
       </html>
       """;
   ```

2. **无需转义双引号**

   ```java
   String message = """
       She said "Hello" to me.
       """;  // 双引号无需转义
   ```

3. **自动去除公共前导空白**

   ```java
   String s = """
           Line 1
           Line 2
           """;  // 自动去除 8 个空格的公共缩进
   ```

4. **支持变量格式化（Java 15+）**

   ```java
   String name = "Alice";
   String message = """
       Hello, %s!
       Welcome to Java.
       """.formatted(name);

   // 或使用 String.format()
   String message = String.format("""
       Hello, %s!
       Welcome to Java.
       """, name);
   ```

**与 JavaScript 模板字符串的对比：**

| 特性       | JavaScript `` ` `` | Java `"""`                |
| ---------- | ------------------ | ------------------------- |
| 变量插值   | ✅ `${name}`       | ❌ 不支持（需手动格式化） |
| 多行字符串 | ✅                 | ✅                        |
| 保留格式   | ✅                 | ✅                        |
| 转义双引号 | 不需要             | 不需要                    |
| 版本要求   | ES6+               | Java 13+                  |

> [!TIP]
> Java 文本块**不支持**类似 JavaScript `${variable}` 的语法糖，需要使用 `.formatted()` 或 `String.format()` 进行变量替换。

**实际使用示例：**

```java
// SQL 语句
String sql = """
    SELECT id, name, email
    FROM users
    WHERE status = 'active'
    ORDER BY created_at DESC
    """;

// HTML 模板
String html = """
    <!DOCTYPE html>
    <html>
        <head><title>%s</title></head>
        <body>
            <h1>%s</h1>
        </body>
    </html>
    """.formatted(title, heading);

// JSON 数据
String json = """
    {
        "users": [
            {"name": "Alice", "age": 25},
            {"name": "Bob", "age": 30}
        ]
    }
    """;
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

### 3. 忘记 String 不可变

```java
String s = "hello";
s.toUpperCase();       // ❌ 返回值被忽略，s 仍然是 "hello"
s = s.toUpperCase();   // ✅ 正确用法
```
