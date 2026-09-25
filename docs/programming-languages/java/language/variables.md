---
title: 变量与作用域
date: 2026-08-05
category: java
---

变量用名称保存一个值。Java 声明变量时需要确定类型，例如 `int` 保存整数，`double` 保存浮点数，`boolean` 保存 `true` 或 `false`。

```java
int count = 3;
count = 4;
System.out.println(count); // 4
```

`int count = 3` 同时声明变量并给出初始值；`count = 4` 为已有变量重新赋值。变量类型已经确定，不能再把字符串赋给 `count`。这种在编译时检查类型的方式称为静态类型检查。

## 局部变量需要先赋值

声明在方法或代码块内部的变量称为局部变量，例如写在 `main` 方法中的 `count`。局部变量必须在读取前赋值：

```java
int result;
// System.out.println(result); // 编译错误：尚未赋值
result = 42;
System.out.println(result); // 42
```

如果赋值发生在条件分支里，编译器会检查是否存在“没有赋值就读取”的路径。

```java
boolean ready = false;
int result;
if (ready) {
    result = 42;
} else {
    result = 0;
}
System.out.println(result); // 0
```

去掉 `else` 后，编译器无法保证执行到最后一行时 `result` 已经赋值，因此不能通过编译。这项检查称为明确赋值检查，主要依据语句结构，不会根据普通局部变量 `ready` 的当前值推断分支一定执行；即使将其初始值改为 `true`，去掉 `else` 后仍会报错。

## 块级作用域

作用域是源码中可以使用某个变量名称的范围。局部变量从声明处开始，在所属的 `{ ... }` 代码块剩余部分可见。

```java
int total = 10;
{
    int extra = 2;
    total += extra;
}
System.out.println(total); // 12
// System.out.println(extra); // 编译错误：已经离开 extra 所在的代码块
```

内层代码块可以使用外层变量。重叠的局部作用域中不能重复声明同名变量，例如不能在上面的内层块再声明一个 `int total`。两个互不重叠的代码块可以各自使用同一个变量名。

内层块结束后，也可以在外层块中声明同名变量：

```java
{
    int myFirstNumber = 1;
}
int myFirstNumber = 5;
System.out.println(myFirstNumber); // 5
```

第一个 `myFirstNumber` 的作用域在内层块结束时终止；第二个虽然声明在外层块中，但作用域从自己的声明处才开始，不会覆盖前面的内层块。两者作用域不重叠，因此声明合法，它们是两个不同的变量。如果把 `int myFirstNumber = 5;` 移到内层块之前，内层的同名声明就会因作用域重叠而编译失败。

`for` 的初始化部分声明的变量，在循环条件、更新表达式和循环体中可用，离开循环后不可用：

```java
for (int i = 0; i < 3; i++) {
    System.out.println(i);
}
// System.out.println(i); // 编译错误
```

## var 省略显式类型 [Java 10+]

`var` 让编译器从初始值推断局部变量的类型，变量的类型仍然固定。

```java
var count = 3;   // 推断为 int
var price = 2.5; // 推断为 double
count = 4;
// count = 4.5;  // 编译错误：double 不能直接赋给 int
```

普通局部变量使用 `var` 时必须立即给出初始值，不能只写 `var count;`。`var` 也不能代替普通方法声明中的参数类型或返回类型。

## final 限制重新赋值

在变量声明前加 `final`，表示这个变量只允许赋值一次。

```java
final int limit = 10;
// limit = 20; // 编译错误
```

也可以先声明，再赋值。编译器会同时检查“读取前已经赋值”和“没有重复赋值”：

```java
final int limit;
limit = 10;
System.out.println(limit); // 10
```

## 参考资料

- [Java SE 17 JLS：Local Variable Declaration Statements](https://docs.oracle.com/javase/specs/jls/se17/html/jls-14.html#jls-14.4)
- [Java SE 17 JLS：Scope of a Declaration](https://docs.oracle.com/javase/specs/jls/se17/html/jls-6.html#jls-6.3)
- [Dev.java：Java Language Basics](https://dev.java/learn/language-basics/)
