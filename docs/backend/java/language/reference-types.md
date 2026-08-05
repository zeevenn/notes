---
title: 引用类型与对象
date: 2026-08-05
category: java
---

Java 的值分为基本类型值和引用值。基本类型变量直接保存 `int`、`double`、`boolean` 等值；引用类型变量保存一个引用，通过它访问对象或数组。

```java
int count = 3;                  // 基本类型变量
User user = new User("Alice"); // 引用类型变量
```

`User` 是变量的声明类型，`new User("Alice")` 创建对象，表达式结果是指向该对象的引用。变量与对象不是同一件事。

## 声明类型与运行时对象

引用变量的声明类型决定编译期允许访问哪些成员，实际对象类型决定被重写的实例方法如何执行。

```java
Animal animal = new Dog();
animal.makeSound(); // 编译器按 Animal 检查，运行时调用 Dog 的实现
```

同一个引用变量可以在不同时刻指向不同对象，只要赋值满足类型兼容关系：

```java
Animal animal = new Dog();
animal = new Cat();
```

这种“引用类型较宽、运行时对象较具体”的关系是多态的基础。

## `null` 表示没有对象

引用类型的值可以是 `null`，表示当前没有指向任何对象。

```java
User user = null;
```

对 `null` 解引用会抛出 `NullPointerException`：

```java
// user.getName(); // 运行时抛出 NullPointerException
```

处理可能缺失的值时，应先明确其业务含义：

- 必须存在：在构造方法或方法入口校验，尽早拒绝 `null`；
- 可以缺失：使用清楚的命名、文档或返回类型表达；
- 返回多个结果：空集合通常比 `null` 更容易使用；
- 单个查询结果可能不存在：在 API 边界可考虑 `Optional<T>`。

`Objects.requireNonNull()` 可以在边界处检查必填引用：

```java
import java.util.Objects;

public User(String name) {
    this.name = Objects.requireNonNull(name, "name must not be null");
}
```

## 多个引用可以指向同一个对象

复制引用不会复制对象：

```java
User first = new User("Alice");
User second = first;

second.setName("Bob");
System.out.println(first.getName()); // Bob
```

`first` 和 `second` 是两个变量，但保存了指向同一对象的引用。这种关系称为别名（aliasing）。通过任一引用修改可变对象，另一方都能观察到修改。

重新绑定变量不会影响另一个变量：

```java
second = new User("Carol");

System.out.println(first.getName());  // Bob
System.out.println(second.getName()); // Carol
```

## `final` 限制引用，不冻结对象

`final` 引用只能赋值一次，但对象是否可变由对象自身的 API 决定。

```java
final User user = new User("Alice");
user.setName("Bob");        // 可以：修改对象状态
// user = new User("Carol"); // 编译错误：不能重新赋值
```

不可变对象则不会在构造完成后改变可观察状态。`String`、包装类以及设计正确的 Record 都常作为不可变值使用。

```java
String text = "hello";
String upper = text.toUpperCase();

System.out.println(text);  // hello
System.out.println(upper); // HELLO
```

## `==` 比较什么

对基本类型使用 `==`，比较的是数值。对引用类型使用 `==`，比较的是两个引用是否指向同一个对象。

```java
User first = new User("Alice");
User second = new User("Alice");
User same = first;

System.out.println(first == second); // false：两个对象
System.out.println(first == same);   // true：同一个对象
```

对象的业务内容是否相等由 `equals()` 定义：

```java
System.out.println(first.equals(second));
```

如果类没有重写 `equals()`，它会继承 `Object.equals()` 的身份比较行为。`String`、包装类、集合和 Record 已经定义了内容相等语义。

比较可能为 `null` 的引用时，可以使用 `Objects.equals()`：

```java
boolean sameName = Objects.equals(firstName, secondName);
```

它在两个值都为 `null` 时返回 `true`，只有一个为 `null` 时返回 `false`，否则调用第一个值的 `equals()`。

## 数组也是对象

数组变量保存数组对象的引用，复制数组变量同样不会复制元素。

```java
int[] first = {1, 2, 3};
int[] second = first;

second[0] = 99;
System.out.println(first[0]); // 99
```

创建独立的浅复制可使用 `clone()` 或 `Arrays.copyOf()`：

```java
int[] copy = first.clone();
copy[0] = 1;
System.out.println(first[0]); // 99
```

对于对象数组，浅复制只创建新的数组容器，数组元素引用仍可能指向相同对象。

```java
User[] users = {new User("Alice")};
User[] copied = users.clone();

copied[0].setName("Bob");
System.out.println(users[0].getName()); // Bob
```

是否需要深复制取决于对象所有权和变更边界。与其默认实现通用深复制，通常更适合使用不可变值或提供符合领域含义的复制方法。

## 对象何时可以被回收

对象没有任何可达的强引用后，便具备被垃圾收集器回收的条件；“具备条件”不表示立即回收。局部变量离开作用域、字段被重新赋值或集合移除元素，都可能使对象失去引用。

Java 不依赖垃圾收集器关闭文件、网络连接等外部资源。这类资源应通过 `try-with-resources` 确定地关闭。

## 相关内容

- [基本数据类型](./primitive-types.md)
- [Object 的通用契约](./object-contract.md)
- [方法](./methods.md)
- [继承与多态](./inheritance-and-polymorphism.md)
- [异常处理](./exceptions.md)

## 参考资料

- [Java Language Specification 17：Types, Values, and Variables](https://docs.oracle.com/javase/specs/jls/se17/html/jls-4.html)
- [Dev.java：Creating and Using Objects](https://dev.java/learn/classes-objects/creating-objects/)
