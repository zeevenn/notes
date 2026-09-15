---
title: 包装类与装箱拆箱
date: 2026-09-15
category: java
---

`Integer` 是 `int` 的包装类：它把一个整数值保存在对象中。`int` 变量直接保存整数，`Integer` 变量保存对象的引用，也可以是 `null`。当接口要求对象，或需要用 `null` 表示缺少数值时，会用到包装类。

## 基本类型与对象之间的转换

**装箱**是把基本类型值转换为对应包装对象的引用；**拆箱**是从包装对象中取出基本类型值。Java 可以自动完成这两种转换：

```java
int count = 42;
Integer boxed = count; // 自动装箱：int → Integer
int restored = boxed; // 自动拆箱：Integer → int
System.out.println(restored); // 42
```

使用 `javac` 编译时，上面的装箱和拆箱分别对应 `Integer.valueOf(count)` 和 `boxed.intValue()`。装箱可以复用已有对象，不一定创建新对象。

八种基本类型都有对应的包装类，均位于 `java.lang` 包，无需手动导入：

| 基本类型 | 包装类 |
| --- | --- |
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

包装对象不可变。对 `Integer` 变量做 `count++`，会经过拆箱、加一、重新装箱并赋值，不会修改原对象中保存的值。

## `Integer` 缓存：相同数值可能复用对象

`Integer.valueOf(int)` 会复用缓存中的对象，避免为常用数值重复创建对象。它保证缓存 `-128～127`（包含边界），也允许缓存范围外的值。[Java 17 方法文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Integer.html#valueOf(int))

```java
Integer a = 127;
Integer b = 127;
System.out.println(a == b); // true：引用同一个缓存对象

Integer c = 128;
Integer d = 128;
System.out.println(c == d); // 结果取决于是否复用对象，不保证为 false
System.out.println(c.equals(d)); // true：保存的整数值相等
```

缓存的是包装对象。两个 `Integer` 使用 `==` 时比较对象身份，因此不能用它判断数值是否相等。其他包装类的复用规则也不能直接套用 `Integer` 的缓存范围。

## 比较时区分对象和值

两个非空 `Integer` 比较数值可用 `equals()`；与基本类型 `int` 使用 `==` 比较时，`Integer` 会先拆箱：

```java
Integer boxed = 128;
int value = 128;
System.out.println(boxed == value); // true：拆箱后比较整数值

Integer integerValue = 1;
Long longValue = 1L;
System.out.println(integerValue.equals(longValue)); // false：包装类型不同
```

`Integer.equals()` 要求对方也是 `Integer` 且数值相等，不会自动把不同包装类型统一为同一种数值类型。[Java 17 方法文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Integer.html#equals(java.lang.Object))

如果两个引用可能为 `null`，可使用 `Objects.equals()`，它会先处理空值，再比较对象内容：

```java
import java.util.Objects;

Integer first = null;
Integer second = 128;
System.out.println(Objects.equals(first, second)); // false
System.out.println(Objects.equals(first, null));   // true
```

`Objects.equals()` 同样不会把 `Integer` 和 `Long` 视为相同类型。

## 拆箱 `null` 会抛出异常

包装类型允许 `null`，但基本类型无法接收它：

```java
Integer count = null;
int value = count; // 编译通过，运行时抛出 NullPointerException（空指针异常）
```

这里隐含了 `count.intValue()` 调用。算术运算、与基本类型比较，以及把 `Boolean` 用作 `if` 条件时，也可能触发拆箱。[Java 17：拆箱转换](https://docs.oracle.com/javase/specs/jls/se17/html/jls-5.html#jls-5.1.8)

拆箱前需要处理空值；例如只有在业务约定“缺失数量按 0 处理”时，才使用以下默认值：

```java
Integer count = null;
int value = count != null ? count : 0;
System.out.println(value); // 0
```

## 参考资料

- [Dev.java：Numbers](https://dev.java/learn/numbers-strings/numbers/)
- [Oracle Java Tutorials：Autoboxing and Unboxing](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)
- [Java Language Specification 17：装箱转换](https://docs.oracle.com/javase/specs/jls/se17/html/jls-5.html#jls-5.1.7)
