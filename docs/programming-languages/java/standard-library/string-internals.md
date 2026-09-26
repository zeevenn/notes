---
title: 字符串实现与源码分析
date: 2026-09-26
category: java
---

字符串的创建、内容比较与常用操作见 [String 与字符串处理](../language/string.md)。

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

`intern()` 返回池中内容相同的实例；若不存在，则把当前实例加入池并返回它。字面量之间的 `==` 恰好为 `true`，不代表可以用 `==` 比较任意字符串的内容。
