---
title: 抽象类与接口
date: 2026-02-13
category: java
---

抽象类在共享状态和实现的同时，为子类保留待实现的操作；接口声明一种调用契约，让具有不同继承关系的类提供相同能力。两者都能作为引用类型参与多态。

## 抽象类与抽象方法

`abstract` 类不能直接实例化，但可以拥有构造方法、实例字段、普通方法和抽象方法。抽象方法只有声明，没有方法体；具体子类必须实现尚未实现的抽象方法。

```java
abstract class Report {
    private final String title;

    protected Report(String title) {
        this.title = title;
    }

    public final String render() {
        return title + "\n" + body();
    }

    protected abstract String body();
}

class TextReport extends Report {
    TextReport(String title) {
        super(title);
    }

    @Override
    protected String body() {
        return "report body";
    }
}
```

这里父类固定 `render()` 的执行框架，子类实现 `body()`，属于模板方法的一种形式。抽象类也可以没有抽象方法，仅用来禁止直接实例化。

抽象方法要求子类提供实现，因此不能同时是 `private`、`static` 或 `final`。抽象类的构造方法由子类构造链调用，见[继承与方法重写](./inheritance.md)。

## 接口声明与实现

接口可以被多个类实现，一个类也可以实现多个接口。

```java
interface Named {
    String name();
}

interface Printable {
    String print();
}

class Receipt implements Named, Printable {
    @Override
    public String name() {
        return "receipt";
    }

    @Override
    public String print() {
        return name();
    }
}
```

普通接口抽象方法隐式为 `public abstract`，实现方法必须是 `public`。接口可以通过 `extends` 继承多个接口，继承的是相应契约。

接口没有构造方法或实例字段。字段隐式为 `public static final`，但如果字段引用可变对象，接口并不会冻结该对象。

## 默认、静态与私有方法

Java 17 的接口可以提供默认方法、静态方法和私有辅助方法。

```java
interface Named {
    String name();

    default String label() {
        return normalize(name());
    }

    private String normalize(String value) {
        return value.strip();
    }

    static Named of(String name) {
        return () -> name;
    }
}
```

- `default` 方法提供可继承的实例实现，实现类可以重写。
- 静态方法通过接口名调用，例如 `Named.of("Alice")`，不会作为实例方法继承给实现类。
- 私有方法复用接口内部的实现，不向实现类开放，也不被继承；私有辅助方法还可以是静态方法。

示例中的 Lambda 实现唯一的抽象方法，详细条件见 [Lambda 与方法引用](./lambda-and-method-references.md)。

## 默认方法冲突

类层次中的方法声明优先于接口默认方法；更具体的子接口可以重写父接口的默认方法。两个无继承关系的接口提供同签名默认方法时，实现类需要显式解决冲突。

```java
interface Left {
    default String label() { return "left"; }
}

interface Right {
    default String label() { return "right"; }
}

class Both implements Left, Right {
    @Override
    public String label() {
        return Left.super.label() + "/" + Right.super.label();
    }
}
```

同名方法的返回类型也必须兼容；并非任意接口组合都能由一个类同时实现。

## 抽象类与接口的边界

| 关注点 | 抽象类 | 接口 |
| --- | --- | --- |
| 实例状态 | 可定义字段和构造逻辑 | 不定义实例字段或构造方法 |
| 继承数量 | 一个类只能直接继承一个类 | 一个类可实现多个接口 |
| 实现复用 | 可以提供普通方法和受保护扩展点 | 可提供默认方法及内部辅助方法 |
| 类型关系 | 建立父子类关系 | 建立实现类对契约的承诺 |

需要共享并约束一组实例状态时，可以使用抽象类。需要为不同实现提供统一入口时，可以使用接口。两者也可以配合：接口描述公开能力，抽象类作为可选的公共实现基础。

设计接口时，应让操作围绕调用方实际需要的能力组织。让实现类为不支持的操作一律抛出异常，通常说明接口包含了不属于同一个契约的职责。

## 参考资料

- [Java SE 17 JLS：Abstract Classes](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.1.1.1)
- [Java SE 17 JLS：Interfaces](https://docs.oracle.com/javase/specs/jls/se17/html/jls-9.html)
- [Dev.java：Interfaces](https://dev.java/learn/interfaces/)
