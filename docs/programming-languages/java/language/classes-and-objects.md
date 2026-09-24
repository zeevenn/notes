---
title: 类与对象
date: 2026-09-24
category: java
---

类定义一种对象可以保存的数据和执行的操作。对象是根据类创建出来的具体实例；同一个类可以创建多个对象，每个对象有自己的数据。

```java
class Counter {
    int value;

    void increment() {
        value++;
    }
}
```

`Counter` 定义计数器。`value` 是计数器保存的数值，称为字段；`increment()` 是使数值加一的操作，称为方法。`void` 表示这个方法不返回结果。

## 创建和使用对象

`new Counter()` 创建一个计数器对象，把它交给变量后，可以使用点号访问字段和调用方法。

```java
Counter first = new Counter();
first.value = 10;
first.increment();
System.out.println(first.value); // 11

Counter second = new Counter();
System.out.println(second.value); // 0
```

`first` 和 `second` 使用相同的类，但指向两个不同对象。修改 `first.value` 不会修改 `second.value`。没有显式赋初值的 `int` 字段自动从 `0` 开始。

`Counter` 也可以用作变量类型，表示这个变量可以指向哪一类对象。因此 `Counter first` 是声明变量，`new Counter()` 才是创建对象。

## 字段与局部变量

字段直接声明在类中、方法外，用来保存对象状态。方法内部的局部变量用于本次执行中的计算；方法的参数则接收调用方传入的值。

```java
class Counter {
    int value; // 字段

    void add(int step) {      // step 是参数
        int next = value + step; // next 是局部变量
        value = next;
    }
}
```

执行 `counter.add(3)` 时，参数 `step` 得到 `3`，局部变量 `next` 保存计算结果，最后更新对象的 `value`。方法结束后，对象仍保存更新后的字段值。

字段具有默认值：数值类型为零、`boolean` 为 `false`、对象类型为 `null`，其中 `null` 表示尚未指向任何对象。局部变量必须在读取前明确赋值；参数则由调用方提供初始值。

## 用构造方法建立初始状态

构造方法与类同名、没有返回类型，在 `new` 创建对象时执行。它可以要求调用方提供初始数据：

```java
class Counter {
    int value;

    Counter(int initialValue) {
        value = initialValue;
    }

    void increment() {
        value++;
    }
}
```

```java
Counter counter = new Counter(10);
counter.increment();
System.out.println(counter.value); // 11
```

没有声明构造方法时，编译器会为普通类提供一个无参的默认构造方法，因此第一个例子可以使用 `new Counter()`。声明了上面的有参构造方法后，若没有另行提供无参构造方法，就只能传入初始值创建对象。

## 控制对象的使用方式

字段和方法前可以声明访问权限。`private` 表示供类内部使用，`public` 表示向外部调用方公开。

```java
public class Counter {
    private int value;

    public void increment() {
        value++;
    }

    public int value() {
        return value;
    }
}
```

外部代码通过 `increment()` 修改数值，通过 `value()` 读取数值，不能直接给字段赋值。这建立了“调用方使用公开操作、类内部管理状态”的边界。

## 参考资料

- [Java SE 17 JLS：Class Members](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.2)
- [Dev.java：Classes and Objects](https://dev.java/learn/classes-objects/)
- [廖雪峰：面向对象基础](https://liaoxuefeng.com/books/java/oop/basic/index.html)
