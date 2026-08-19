---
title: 方法
date: 2026-08-05
category: java
---

方法用名称封装一段操作，通过参数接收输入，并通过返回值给出结果。方法必须声明在类、接口、枚举或 Record 等类型内部；不能在普通类式源码中直接声明顶层方法。

```java
public class PriceCalculator {
    public int total(int unitPrice, int quantity) {
        return unitPrice * quantity;
    }
}
```

这个方法包含：

- `public`：访问修饰符；
- `int`：返回类型；
- `total`：方法名；
- `(int unitPrice, int quantity)`：参数列表；
- `{ ... }`：方法体。

## 实例方法与静态方法

实例方法属于对象，可以访问对象的实例字段；调用前通常需要创建对象。

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

Counter counter = new Counter();
counter.increment();
System.out.println(counter.value()); // 1
```

静态方法属于类，不依赖某个对象，也不能直接访问实例字段或使用 `this`。

```java
public class Numbers {
    public static int max(int left, int right) {
        return left >= right ? left : right;
    }
}

int result = Numbers.max(3, 5);
```

只在操作确实不依赖对象状态时使用静态方法。需要替换实现或表达对象行为时，实例方法通常更合适。

## 参数与返回值

参数只在方法体内有效。每次调用都会创建一组新的参数变量。

```java
public boolean isAdult(int age) {
    return age >= 18;
}
```

返回类型为 `void` 的方法不返回值，可以使用不带表达式的 `return` 提前结束：

```java
public void printPositive(int value) {
    if (value <= 0) {
        return;
    }
    System.out.println(value);
}
```

除 `void` 外，编译器要求每一条能够正常结束的方法路径都返回兼容类型的值。

```java
public String sign(int value) {
    if (value > 0) {
        return "positive";
    }
    if (value < 0) {
        return "negative";
    }
    return "zero";
}
```

## Java 只有值传递

调用方法时，Java 会把实参的值复制给形参。基本类型复制具体数值，引用类型复制“对象引用的值”。两者都属于值传递。

### 基本类型参数

```java
static void increment(int value) {
    value++;
}

int count = 1;
increment(count);
System.out.println(count); // 1
```

方法修改的是参数副本，不会改变调用方的 `count`。

### 引用类型参数

```java
static void rename(User user) {
    user.setName("Bob");
}

static void replace(User user) {
    user = new User("Carol");
}

User user = new User("Alice");
rename(user);
System.out.println(user.getName()); // Bob

replace(user);
System.out.println(user.getName()); // 仍然是 Bob
```

`rename()` 中复制的引用仍指向同一个对象，所以能修改对象状态。`replace()` 只让形参副本指向新对象，不会改写调用方变量保存的引用。

## 方法重载

同一个类型中可以声明多个同名方法，只要参数列表不同。编译器根据调用点的参数数量和类型选择方法。

```java
public static int area(int side) {
    return side * side;
}

public static int area(int width, int height) {
    return width * height;
}

public static double area(double radius) {
    return Math.PI * radius * radius;
}
```

方法签名由方法名和参数类型组成，不包含返回类型。下面两个方法不能同时存在：

```java
// int parse(String text) { ... }
// long parse(String text) { ... } // 编译错误：签名相同
```

避免设计会导致模糊调用的重载：

```java
static void print(String value) {}
static void print(Integer value) {}

// print(null); // 编译错误：无法判断选择哪个重载
```

重载是编译期选择；子类的方法重写则依赖对象的运行时类型。两者不要混为一谈。

## 可变参数

可变参数允许调用方传入零个或多个同类型参数。方法内部把它作为数组处理。

```java
public static int sum(int... values) {
    int result = 0;
    for (int value : values) {
        result += value;
    }
    return result;
}

sum();
sum(1, 2, 3);
sum(new int[] {1, 2, 3});
```

一个方法最多有一个可变参数，并且它必须位于参数列表最后。可变参数是调用便利语法，不适合替代具有明确业务含义的参数对象。

## 递归调用

方法可以调用自身，但必须存在能够终止递归的条件。

```java
public static long factorial(int value) {
    if (value < 0) {
        throw new IllegalArgumentException("value must be non-negative");
    }
    if (value <= 1) {
        return 1;
    }
    return value * factorial(value - 1);
}
```

每次调用都会占用调用栈空间。Java 不保证尾调用优化，递归层级取决于输入且可能很深时，应考虑循环或显式栈。

## 方法设计的边界

- 方法名表达动作或查询结果，例如 `calculateTotal()`、`findUser()`；
- 参数过多通常说明缺少一个有意义的对象；
- 查询方法应尽量避免隐藏的状态修改；
- 不用特殊返回值同时表达正常结果和失败，失败模型应明确选择异常、空集合或 `Optional`；
- 对外方法要说明参数是否允许为 `null`、可能抛出的异常以及副作用。

## 相关内容

- [类与封装](./classes-and-encapsulation.md)
- [引用类型与对象](./reference-types.md)
- [继承与多态](./inheritance-and-polymorphism.md)
- [异常处理](./exceptions.md)

## 参考资料

- [Dev.java：Defining Methods](https://dev.java/learn/classes-objects/defining-methods/)
- [Java Language Specification 17：Method Declarations](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.4)
