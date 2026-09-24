---
title: 继承与方法重写
date: 2026-09-24
category: java
---

继承通过 `extends` 建立子类与父类的类型关系。子类对象也可以作为父类类型使用，并按规则继承父类的字段和方法，补充状态或重写行为。

```java
class Document {
    private final String title;

    Document(String title) {
        this.title = title;
    }

    public String title() {
        return title;
    }

    public String summary() {
        return title;
    }
}

class Report extends Document {
    private final int pages;

    Report(String title, int pages) {
        super(title);
        this.pages = pages;
    }

    @Override
    public String summary() {
        return super.summary() + " (" + pages + " pages)";
    }
}
```

`Report` 继承可访问的 `title()` 方法，并重写 `summary()`。父类的私有字段不是子类继承的成员，但完整子类对象仍包含父类所定义的实例状态，由父类代码维护。

## 继承范围

普通类只有一个直接父类，可以实现多个接口。除 `Object` 自身外，没有显式声明父类的普通类直接继承 `Object`。

| 声明 | 继承关系中的行为 |
| --- | --- |
| `public`、`protected` 成员 | 可以被继承，访问仍受权限规则约束 |
| 包访问成员 | 继承受包边界限制，跨包子类不能直接继承访问 |
| `private` 成员 | 不被子类继承 |
| 构造方法、初始化块 | 不继承，按构造和初始化规则执行 |
| `final` 实例方法 | 可以继承，不能重写 |
| 静态方法 | 可以继承或隐藏，不参与实例方法的动态分派 |

具体访问条件见[封装与访问控制](./encapsulation-and-access.md)。

## 实例方法重写

重写为继承的实例方法提供新的实现。常见情况下，方法名和参数类型相同；泛型方法还涉及签名擦除和子签名规则。

- 返回类型相同；引用类型返回值允许缩小为子类型，称为协变返回类型。
- 访问权限不能缩小，例如不能把 `public` 改为 `protected`。
- 不能新增或扩大父类方法未允许的受检异常；非受检异常不受这一约束。
- `final` 方法不能重写；`private` 方法不被继承，同名子类方法是另一个方法。
- 静态方法不能重写实例方法，实例方法也不能重写静态方法。

`@Override` 让编译器检查该方法是否确实重写或实现了某个方法，能发现参数拼错等问题。受检异常的分类见[异常处理](./exceptions.md)。

## 重写、重载与隐藏

**重载**是同名方法具有不同参数列表；这些方法可以声明在当前类，也可以来自继承。编译器根据调用处的类型和参数选择签名，不能只靠返回类型区分重载。

**重写**影响选定签名后执行哪个实例方法实现，见[多态与类型转换](./polymorphism.md)。

**隐藏**适用于同名字段及符合规则的同签名静态方法。它们不会按对象实际类型动态选择：

```java
class Parent {
    public String label = "parent";
    public static String kind() { return "parent"; }
    public String describe() { return "parent"; }
}

class Child extends Parent {
    public String label = "child";
    public static String kind() { return "child"; }
    @Override public String describe() { return "child"; }
}

Parent value = new Child();
System.out.println(value.label);      // parent
System.out.println(Parent.kind());    // parent
System.out.println(Child.kind());     // child
System.out.println(value.describe()); // child
```

静态方法应通过类名调用，避免通过对象表达式调用造成动态分派的错觉。字段同名会形成两份独立状态，通常应避免。

## 父类构造方法与 super

`super(...)` 初始化对象中的父类部分；它不会额外创建一个独立的父类对象。构造方法可以通过 `this(...)` 委托，但最终必须沿父类构造链执行。

```java
class Base {
    Base(String name) {}
}

class Child extends Base {
    Child() {
        this("default");
    }

    Child(String name) {
        super(name);
    }
}
```

Java 17 要求显式构造方法委托位于构造方法体首句。如果没有显式委托，会隐式调用 `super()`；父类没有可访问的无参构造方法时，这种隐式调用会导致编译失败。

`super.method()` 用于调用父类的方法实现；`super.field` 用于访问被隐藏且可访问的父类字段。初始化顺序见[类与对象的初始化](./initialization.md)。

## 类型关系与复用边界

继承会把父类的公开操作一起带入子类。声明子类时，应检查子类是否能满足调用方对父类行为的约定；仅仅需要复用几段代码，不足以说明存在合理的子类型关系。

若需要独立控制公开操作，或替换内部实现，可以使用[组合与委托](./composition.md)。需要统一行为而不共享父类状态时，可以通过[接口](./abstract-and-interface.md)定义契约。

## 参考资料

- [Java SE 17 JLS：Inheritance, Overriding, and Hiding](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.4.8)
- [Java SE 17 JLS：Class Members](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.2)
- [Dev.java：Inheritance](https://dev.java/learn/inheritance/)
