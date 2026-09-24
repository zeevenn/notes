---
title: static 与 final
date: 2026-02-02
category: java
---

`static` 区分类级成员与实例成员；`final` 限制变量重新赋值、方法重写或类继承。两者可以组合，但表达的是不同约束。

## 类字段与实例字段

实例字段属于对象；静态字段属于类，不会为每个实例重新建立一份。

```java
class Counter {
    private static int created;
    private int value;

    Counter(int value) {
        this.value = value;
        created++;
    }

    static int created() {
        return created;
    }

    int value() {
        return value;
    }
}

Counter first = new Counter(1);
Counter second = new Counter(2);
System.out.println(Counter.created()); // 2
System.out.println(first.value());     // 1
System.out.println(second.value());    // 2
```

这里的静态计数只演示共享状态，并未提供并发递增的同步保证。同名类由不同类加载器定义时是不同的运行时类型，也拥有各自的静态状态。

## 静态方法

静态方法没有隐式的当前对象，因此不能使用 `this`、`super`，也不能直接通过简单名称访问实例字段。它可以通过显式传入的对象访问实例成员。

```java
class CounterReader {
    static int read(Counter counter) {
        return counter.value();
    }
}
```

静态方法通过类名调用，例如 `Math.max(3, 5)`。它们不参与实例方法的动态分派；同签名静态方法涉及隐藏，见[继承与方法重写](./inheritance.md)。

省略静态成员所属类名的语法见[包与导入：静态导入](./packages-and-imports.md#静态导入)。

## 静态代码块

静态代码块在类初始化时执行，适合需要多条语句建立的类级状态。

```java
class Lookup {
    static final int[] SQUARES = new int[4];

    static {
        for (int i = 0; i < SQUARES.length; i++) {
            SQUARES[i] = i * i;
        }
    }
}
```

类初始化与类加载是不同阶段，执行触发条件以及字段、代码块的顺序统一见[类与对象的初始化](./initialization.md)。

## final 变量

`final` 变量只允许赋值一次。对引用变量，限制的是引用重新赋值，不会冻结对象内容。

```java
final StringBuilder text = new StringBuilder("A");
text.append("B"); // 可以改变对象
// text = new StringBuilder("C"); // 不能重新赋值
```

没有初始化表达式的 `final` 实例字段，可以在实例初始化块或构造方法中完成赋值，编译器会检查赋值路径。静态 `final` 字段可以在声明或静态初始化块中赋值。

```java
class User {
    private final String name;

    User(String name) {
        this.name = name;
    }
}
```

## static final 与编译期常量

`static final` 表示类级、不可重新赋值的变量。它不一定是编译期常量：只有基本类型或 `String` 类型、以常量表达式初始化的 `final` 变量才属于常量变量。

```java
class Settings {
    static final int LIMIT = 10 * 2;                 // 编译期常量
    static final String LABEL = "api-" + "v1";      // 编译期常量
    static final Integer BOXED = 20;                 // 不是
    static final long STARTED = System.nanoTime();   // 不是
}
```

编译期常量可能被写入调用方的字节码。修改库中的常量值后，未重新编译的调用方可能仍使用旧值。读取这类常量通常不会触发声明类的初始化。

## final 方法与类

`final` 实例方法可以被继承，但不能被子类重写；`final` 类不能有子类。它们限制扩展方式，不代表类的实例一定不可变。

```java
final class MutableCounter {
    private int value;

    void increment() {
        value++;
    }
}
```

上面的类不能继承，但对象仍然可变。不可变对象还需要控制字段、状态变更和可变引用的暴露，见[封装与访问控制](./encapsulation-and-access.md)。

## 参考资料

- [Java SE 17 JLS：Field Declarations](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.3)
- [Java SE 17 JLS：final Variables](https://docs.oracle.com/javase/specs/jls/se17/html/jls-4.html#jls-4.12.4)
- [Java SE 17 JLS：Initialization](https://docs.oracle.com/javase/specs/jls/se17/html/jls-12.html#jls-12.4)
