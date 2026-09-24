---
title: 构造方法与 this
date: 2026-09-24
category: java
---

构造方法在创建对象时为字段建立初始值。它与类同名，没有返回类型；`new` 后面的参数会传入相应构造方法。

```java
class User {
    String name;

    User(String initialName) {
        name = initialName;
    }
}
```

```java
User user = new User("Alice");
System.out.println(user.name); // Alice
```

`User("Alice")` 把初始姓名交给构造方法，构造方法把它保存在新对象的 `name` 字段中。构造方法只参与对象创建，不能在已有对象上像普通方法一样再次调用。

## this 表达当前对象

`this` 表示当前正在操作的对象。构造方法的参数与字段同名时，`this.name` 指对象字段，单独的 `name` 指参数。

```java
class User {
    String name;

    User(String name) {
        this.name = name;
    }
}
```

普通实例方法也可以使用 `this`，例如把当前对象传给其他方法，或者返回当前对象以支持连续调用：

```java
class Counter {
    private int value;

    Counter add(int value) {
        this.value += value;
        return this;
    }

    int value() {
        return value;
    }
}

Counter counter = new Counter();
counter.add(2).add(3);
System.out.println(counter.value()); // 5
```

`add()` 每次都返回同一个计数器，因此下一个 `.add()` 继续修改它。带 `static` 的方法通过类调用，没有当前对象，不能使用 `this`。

## 默认构造方法

普通类没有声明任何构造方法时，编译器会提供无参的默认构造方法。声明了任何构造方法后，就不再自动补充它。

```java
class Empty {}

class User {
    User(String name) {}
}

Empty empty = new Empty(); // 可以
// User user = new User(); // 编译错误：没有无参构造方法
```

“无参构造方法”描述参数列表，“默认构造方法”特指编译器提供的构造方法。手写的无参构造方法不属于后者。

默认构造方法的访问权限与类一致：例如公开类获得公开的默认构造方法，没有 `public` 的类获得同包可访问的默认构造方法。

## 重载与构造方法委托

一个类可以声明多个参数列表不同的构造方法，这称为重载。Java 没有参数默认值语法，可以用 `this(...)` 调用同类中的另一个构造方法，集中完成赋值。

```java
class Page {
    int number;
    int size;

    Page() {
        this(1, 20);
    }

    Page(int number, int size) {
        this.number = number;
        this.size = size;
    }
}

Page page = new Page();
System.out.println(page.number); // 1
System.out.println(page.size);   // 20
```

Java 17 要求 `this(...)` 是构造方法体的第一条语句。它是特殊的构造方法委托语法，与普通的 `this.method()` 调用不同。构造方法之间不能形成循环调用。

## 父类构造方法与 super

`class Child extends Parent` 表示 `Child` 继承 `Parent`。创建 `Child` 时，也需要初始化父类定义的状态，这由 `super(...)` 调用父类构造方法完成。

```java
class Parent {
    String name;

    Parent(String name) {
        this.name = name;
    }
}

class Child extends Parent {
    Child() {
        super("Alice");
    }
}

Child child = new Child();
System.out.println(child.name); // Alice
```

在 Java 17 中，显式的 `super(...)` 也必须位于构造方法体首句。同一个构造方法体中不能同时直接调用 `this(...)` 和 `super(...)`；通过 `this(...)` 委托时，最终由委托链中的另一个构造方法调用父类。

若没有显式委托，编译器隐式调用 `super()`。父类没有可访问的无参构造方法时，这种隐式调用会编译失败，必须像上例一样提供参数。

## 参考资料

- [Java SE 17 JLS：Constructor Declarations](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.8)
- [Java SE 17 JLS：The this Keyword](https://docs.oracle.com/javase/specs/jls/se17/html/jls-15.html#jls-15.8.3)
- [Dev.java：Providing Constructors](https://dev.java/learn/classes-objects/defining-constructors/)
