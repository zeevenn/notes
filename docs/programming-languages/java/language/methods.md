---
title: 方法与参数传递
date: 2026-08-05
category: java
---

方法用名称封装一段操作，通过参数接收输入，并通过返回值给出结果。下面把方法声明在 `PriceCalculator` 类中，再通过对象调用它。

```java
public class PriceCalculator {
    public int total(int unitPrice, int quantity) {
        return unitPrice * quantity;
    }
}
```

```java
PriceCalculator calculator = new PriceCalculator();
int amount = calculator.total(10, 3);
System.out.println(amount); // 30
```

这个方法包含：

- `public`：允许外部代码调用这个方法；
- `int`：返回类型；
- `total`：方法名；
- `(int unitPrice, int quantity)`：参数列表；
- `{ ... }`：方法体。

## 实例方法与静态方法

实例方法通过某个对象调用，可以读取或修改这个对象的字段，也就是对象保存的数据。

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

带 `static` 的方法称为静态方法，通过类名调用，不要求先创建对象。它没有隐式的当前对象，因此不能直接访问某个对象的字段。

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

调用时传入的值称为实参，方法声明中的参数变量称为形参。Java 会把实参的值复制给形参，这称为值传递。整数等基本类型直接复制数值；对象变量保存的是访问对象的引用，复制后两个变量仍可以访问同一个对象。

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
class User {
    private String name;
    User(String name) { this.name = name; }
    void setName(String name) { this.name = name; }
    String getName() { return name; }
}
```

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

编译器区分这里的方法时，使用方法名和参数类型组成的签名，不使用返回类型。下面两个方法不能同时存在：

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

方法重载根据调用处的参数类型和数量选择方法；对象继承关系中的方法选择见[多态与类型转换](./polymorphism.md)。

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

每次调用都需要保存参数、局部变量和返回位置，这些信息所占用的空间称为调用栈。递归层数过深可能耗尽调用栈；深度不可控时，可以改用循环组织计算。

## 参考资料

- [Dev.java：Defining Methods](https://dev.java/learn/classes-objects/defining-methods/)
- [Java Language Specification 17：Method Declarations](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.4)
