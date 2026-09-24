---
title: 类与对象的初始化
date: 2026-09-24
category: java
---

初始化是在使用类或对象之前建立其初始状态。声明带 `static` 的字段属于类，其他普通字段属于每个对象；因此两者各有初始化过程。

字段声明中等号右侧的表达式称为字段初始化器，例如 `int value = 1` 中的 `1`。`static { ... }` 是静态初始化块，`{ ... }` 是实例初始化块，用于执行多条初始化语句。与类同名的构造方法则在创建对象时执行。

## 字段初始化器与代码块按文本顺序执行

静态字段先获得零、`false` 或 `null` 等默认值，再完成显式初始化。编译时已经确定的常量先初始化；其余静态字段初始化器与静态代码块按源代码中的先后顺序执行。

实例字段在对象分配时获得默认值。父类构造返回后，当前类的实例字段初始化器和实例代码块按文本顺序执行，随后执行当前构造方法的剩余语句。

```java
class Parent {
    static int a = mark("parent static field");
    static { mark("parent static block"); }

    int b = mark("parent instance field");
    { mark("parent instance block"); }

    Parent() { mark("parent constructor"); }

    static int mark(String text) {
        System.out.println(text);
        return 1;
    }
}

class Child extends Parent {
    static { mark("child static block"); }
    static int c = mark("child static field");

    { mark("child instance block"); }
    int d = mark("child instance field");

    Child() { mark("child constructor"); }
}

public class InitializationDemo {
    public static void main(String[] args) {
        new Child();
    }
}
```

首次主动使用 `Child` 时，输出为：

```text
parent static field
parent static block
child static block
child static field
parent instance field
parent instance block
parent constructor
child instance block
child instance field
child constructor
```

再次创建 `Child` 时，只重复实例相关的六行。这里子类的代码块写在字段初始化器之前，所以也先执行，不能概括成“字段总是先于代码块”。

## 构造方法委托只执行一次实例初始化

使用 `this(...)` 时，沿委托链找到调用 `super(...)` 的构造方法。父类构造完成后，当前类的实例初始化器执行一次，再逐层返回各个构造方法的剩余代码。

```java
class Sample {
    { System.out.println("instance"); }

    Sample() {
        this(1);
        System.out.println("no-arg");
    }

    Sample(int value) {
        System.out.println("with-arg");
    }
}

// new Sample() 依次输出 instance、with-arg、no-arg
```

## 构造期间的动态分派

子类可以为父类方法提供新的实现，这称为重写。即使对象尚未初始化完成，父类构造方法调用这个方法时，仍可能执行子类的实现；这种根据实际对象选择实现的行为称为动态分派。

```java
class Base {
    Base() {
        show();
    }

    void show() {}
}

class Derived extends Base {
    private int value = 42;

    @Override
    void show() {
        System.out.println(value);
    }
}

// new Derived() 输出 0
```

父类构造期间，`Derived.value` 已有默认值 `0`，但显式初始化器尚未赋值 `42`。因此构造方法应避免依赖可被子类重写的方法建立状态。

## 补充：类初始化的触发条件

类加载是把类的定义读入运行环境；类初始化则执行建立静态状态的代码，二者不是同一阶段。类初始化发生在特定的主动使用之前，例如创建实例、调用该类声明的静态方法、读取或写入该类声明的非编译期常量静态字段。

编译期常量是编译时就能确定的基本类型或字符串常量，例如 `static final int LIMIT = 10`。读取它通常不会触发声明类的初始化；`SomeClass.class` 类字面量和创建 `SomeClass[]` 数组也不会仅因此初始化 `SomeClass`。

类初始化时，先确保父类已初始化。若相关父接口声明了默认方法，即接口提供了可继承的方法实现，也会参与这一初始化过程。

成功的类初始化只执行一次，由 Java 虚拟机协调多个线程的访问。这里“一次”针对同一个运行时类；负责装入类的不同类加载器可以分别定义同名类。若初始化失败，后续主动使用可能得到 `NoClassDefFoundError`，不会正常重试初始化。

## 参考资料

- [Java SE 17 JLS：Initialization of Classes and Interfaces](https://docs.oracle.com/javase/specs/jls/se17/html/jls-12.html#jls-12.4)
- [Java SE 17 JLS：Creation of New Class Instances](https://docs.oracle.com/javase/specs/jls/se17/html/jls-12.html#jls-12.5)
