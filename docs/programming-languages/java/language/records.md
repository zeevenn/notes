---
title: Record
date: 2026-09-24
category: java
---

Record 用组件声明数据值，并提供与组件对应的访问器及通用对象方法。它适合以组件共同定义相等性的模型。

## Record 表达数据值

Record 用一组组件声明数据形状：

```java
public record Point(int x, int y) {
}
```

编译器根据组件生成：

- `private final` 字段；
- 规范构造方法；
- 与组件同名的访问器 `x()`、`y()`；
- 基于全部组件的 `equals()` 和 `hashCode()`；
- 可读的 `toString()`。

```java
Point point = new Point(3, 4);
System.out.println(point.x());
System.out.println(point); // Point[x=3, y=4]
```

Record 隐式继承 `java.lang.Record`，并且是 `final`，不能继承其他类，也不能被继承；它可以实现接口。

## 紧凑构造方法

紧凑构造方法适合校验或规范化组件。参数赋给字段的代码由编译器补充：

```java
public record ProductCode(String value) {
    public ProductCode {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("code must not be blank");
        }
        value = value.strip().toUpperCase(java.util.Locale.ROOT);
    }
}
```

校验应保持 Record 的规范：组件访问器返回的值能够重新构造出相等对象。

## Record 不保证深层不可变

组件字段不能重新赋值，但组件引用指向的对象仍可能可变：

```java
public record Team(List<String> members) {
    public Team {
        members = List.copyOf(members);
    }
}
```

如果不复制，调用方可通过原列表改变 `Team` 的可观察状态，并可能破坏 `equals()` 和 `hashCode()` 的稳定性。

Record 适合所有组件共同定义值的类型，例如坐标、金额和数据传输值。具有独立身份、复杂生命周期或大量可变状态的实体不一定适合 Record。

## 声明限制

Record 不能额外声明实例字段或实例初始化块；可以声明静态字段、静态初始化块和普通方法。额外的非规范构造方法必须通过 `this(...)` 委托到其他构造方法，最终到达规范构造方法。

组件访问器使用 `name()` 形式，而不是 JavaBeans 的 `getName()`。与框架结合时，需要确认框架如何读取组件和创建实例。

## 参考资料

- [Java SE 17 JLS：Record Classes](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.10)
- [Dev.java：Records](https://dev.java/learn/records/)
