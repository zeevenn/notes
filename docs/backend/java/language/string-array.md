---
title: String and Array
date: 2026-01-25
category: java
---

## String（字符串）

`String` 是 Java 中用于表示字符串的**引用类型**，位于 `java.lang` 包中。

### 创建方式

```java
// 字面量方式（推荐）
String s1 = "Hello";  // 使用字符串常量池

// 构造器方式
String s2 = new String("Hello");  // 强制在堆中创建新对象

// 从字符数组或字节数组创建
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String s3 = new String(chars);
```

### 不可变性（Immutable）

`String` 对象一旦创建，内容就**无法修改**。

```java
String s = "Hello";
s = s + " World";  // 并非修改原对象，而是创建了新对象
```

**为什么不可变：**

1. 安全性（防止文件路径、URL 等被恶意修改）
2. 线程安全（无需同步）
3. 可以缓存 hashCode（提高 HashMap 性能）
4. 支持字符串常量池

### 字符串常量池（String Pool）

JVM 在堆内存中维护一个字符串常量池，缓存字符串字面量。

```java
String s1 = "Hello";
String s2 = "Hello";
System.out.println(s1 == s2);  // true（指向常量池中的同一对象）

String s3 = new String("Hello");
System.out.println(s1 == s3);  // false（new 强制在堆中创建新对象）

// intern() 方法：将字符串放入常量池
String s4 = s3.intern();
System.out.println(s1 == s4);  // true
```

### 常用方法

```java
String s = "Hello World";

// 长度与字符访问
s.length();                    // 11
s.charAt(0);                   // 'H'
s.isEmpty();                   // false

// 子串与查找
s.substring(0, 5);             // "Hello"
s.indexOf("World");            // 6
s.contains("World");           // true
s.startsWith("Hello");         // true

// 比较
s1.equals(s2);                 // 比较内容
s1.equalsIgnoreCase("hello");  // 忽略大小写
"apple".compareTo("banana");   // 字典序比较

// 替换与转换
s.replace("World", "Java");    // "Hello Java"
s.toLowerCase();               // "hello world"
s.toUpperCase();               // "HELLO WORLD"
"  hello  ".trim();            // "hello"

// 分割与拼接
s.split(" ");                  // ["Hello", "World"]
String.join(", ", "a", "b");   // "a, b"
```

> [!WARNING]
> 字符串比较使用 `.equals()`，不要使用 `==`。

### 字符串格式化

```java
// String.format()
String s = String.format("Name: %s, Age: %d", "Alice", 25);

// printf()
System.out.printf("Name: %s, Age: %d%n", "Bob", 30);
```

常用格式说明符：`%s`（字符串）、`%d`（整数）、`%f`（浮点数）、`%.2f`（保留 2 位小数）

### 文本块（Java 13+）

Java 13+ 支持**文本块（Text Blocks）**，使用 `"""` 三引号表示多行字符串。

```java
String json = """
    {
        "name": "Alice",
        "age": 25
    }
    """;

// 支持变量格式化（Java 15+）
String html = """
    <html>
        <body><h1>%s</h1></body>
    </html>
    """.formatted(title);
```

**特性：** 保留换行和缩进、无需转义双引号、自动去除公共前导空白

> [!TIP]
> Java 文本块不支持类似 JavaScript `${variable}` 的语法糖，需要使用 `.formatted()` 或 `String.format()`。

### 字符串拼接

```java
// + 运算符（简单场景）
String s = "Hello" + " " + "World";

// StringBuilder（推荐，线程不安全）
StringBuilder sb = new StringBuilder();
sb.append("Hello").append(" ").append("World");
String result = sb.toString();

// StringBuffer（线程安全，性能略低）
StringBuffer buf = new StringBuffer();
buf.append("Hello").append(" ").append("World");
```

**性能：** 循环中不要使用 `+`，应使用 `StringBuilder`。

### String vs StringBuilder vs StringBuffer

| 特性     | String     | StringBuilder | StringBuffer |
| -------- | ---------- | ------------- | ------------ |
| 可变性   | 不可变     | 可变          | 可变         |
| 线程安全 | 安全       | 不安全        | 安全         |
| 性能     | 修改时最差 | 最高          | 略低         |
| 使用场景 | 不频繁修改 | 单线程拼接    | 多线程拼接   |

### 常见陷阱

```java
// ❌ 循环中使用 +
String s = "";
for (int i = 0; i < 10000; i++) {
    s += i;  // 性能极差
}

// ❌ 使用 == 比较
String s1 = new String("hello");
if (s1 == s2) { }  // 应该用 equals()

// ❌ 忘记 String 不可变
String s = "hello";
s.toUpperCase();  // 返回值被忽略
```

## 数组（Array）

数组是一种**固定长度**的数据结构，用于存储相同类型的多个元素。

### 声明和初始化

```java
// 声明并指定长度
int[] numbers = new int[5];  // [0, 0, 0, 0, 0]

// 声明并指定初始值
int[] numbers = {1, 2, 3, 4, 5};  // 推荐

// 完整写法
int[] numbers = new int[]{1, 2, 3, 4, 5};
```

**默认值：** 整数为 `0`，浮点数为 `0.0`，布尔为 `false`，对象为 `null`

### 访问和修改

```java
int[] numbers = {10, 20, 30, 40, 50};

// 访问元素（索引从 0 开始）
int first = numbers[0];     // 10
int last = numbers[4];      // 50

// 修改元素
numbers[0] = 100;
System.out.println(numbers[0]);  // 100

// 越界访问会抛出 ArrayIndexOutOfBoundsException
int x = numbers[5];  // ❌ 运行时错误
```

### 数组长度

```java
int[] numbers = {1, 2, 3, 4, 5};

// 获取长度（属性，不是方法）
int length = numbers.length;  // 5

// ⚠️ 注意：String 使用 length() 方法，数组使用 length 属性
String s = "hello";
s.length();       // 方法
numbers.length;   // 属性
```

### 遍历数组

```java
int[] numbers = {1, 2, 3, 4, 5};

// 传统 for 循环
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// 增强 for 循环（推荐）
for (int num : numbers) {
    System.out.println(num);
}
```

### 多维数组

```java
// 二维数组
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// 访问元素
int value = matrix[0][1];  // 2

// 遍历
for (int[] row : matrix) {
    for (int value : row) {
        System.out.print(value + " ");
    }
    System.out.println();
}

// 不规则数组（每行长度不同）
int[][] irregular = {
    {1, 2},
    {3, 4, 5, 6},
    {7, 8, 9}
};
```

### Arrays 工具类

`java.util.Arrays` 提供数组操作的实用方法。

```java
import java.util.Arrays;

int[] numbers = {5, 2, 8, 1, 9};

// 排序
Arrays.sort(numbers);  // [1, 2, 5, 8, 9]

// 查找（二分查找，需要先排序）
int index = Arrays.binarySearch(numbers, 5);  // 2

// 填充
Arrays.fill(numbers, 10);  // [10, 10, 10, 10, 10]

// 复制
int[] copy = Arrays.copyOf(numbers, numbers.length);
int[] partial = Arrays.copyOfRange(numbers, 1, 3);  // [2, 3]

// 比较
Arrays.equals(arr1, arr2);  // 比较内容

// 转字符串
Arrays.toString(numbers);       // [1, 2, 3]
Arrays.deepToString(matrix);    // [[1, 2], [3, 4]]

// 转 List（固定大小）
List<String> list = Arrays.asList("a", "b", "c");
```

### 可变参数（Varargs）

```java
public static int sum(int... numbers) {  // 本质是 int[]
    int total = 0;
    for (int num : numbers) {
        total += num;
    }
    return total;
}

sum(1, 2, 3);  // 6
```

**限制：** 可变参数必须是最后一个参数，一个方法只能有一个可变参数。
