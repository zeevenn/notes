---
title: 密封类与密封接口
date: 2026-09-24
category: java
---

密封类型通过 `sealed` 和 `permits` 限定直接子类型，表达由模型所有者控制的类型边界。

## 密封类型限制实现集合

`sealed` 限定哪些类型可以直接继承类或实现接口：

```java
public sealed interface Shape permits Circle, Rectangle {
}

public record Circle(double radius) implements Shape {
}

public record Rectangle(double width, double height) implements Shape {
}
```

直接子类必须满足以下一种状态；Record 隐式为 `final`。直接子接口则应声明为 `sealed` 或 `non-sealed`：

- `final`：不能继续扩展；
- `sealed`：继续限制允许的直接子类型；
- `non-sealed`：重新开放继承。

```java
public sealed class Account permits PersonalAccount, BusinessAccount {
}

public final class PersonalAccount extends Account {
}

public non-sealed class BusinessAccount extends Account {
}
```

密封类型适合编译期已知、并由同一模型控制的有限分支，例如语法树节点、支付结果或命令结果。希望第三方自由扩展的公共插件接口不适合密封。

## permits 的边界

许可的直接子类型必须与密封类型位于同一命名模块；在未命名模块中，必须位于同一包。子类型必须直接继承或实现被许可的父类型，不能只依靠间接继承出现在 `permits` 列表中。

如果直接子类型都声明在同一个编译单元中，可以省略 `permits`，由编译器推断。`non-sealed` 会重新开放该分支，所以密封不一定意味着整个后代集合都有限。

## 与枚举、Record 和多态的关系

枚举限制的是固定实例集合；密封类型限制的是直接子类型集合，每个子类型仍可创建多个实例。Record 可以作为密封接口的一种数据实现，但普通类也可以。

Java 17 中可以通过普通多态方法或 `instanceof` 条件处理密封层次。模式 `switch` 的正式版本用法见[模式匹配](./pattern-matching.md)的 Java 21+ 部分。

## 参考资料

- [JEP 409：Sealed Classes](https://openjdk.org/jeps/409)
- [Java SE 17 JLS：Permitted Direct Subclasses](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.1.6)
