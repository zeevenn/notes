---
title: 模式匹配
date: 2026-09-24
category: java
---

模式匹配把结构检查与变量绑定组合起来。Java 17 的主线是 `instanceof` 类型模式；模式 `switch` 与 Record 模式在下方按 Java 21+ 单独组织。

本篇代码中的 `value` 是待检查的 `Object` 类型变量。

## `instanceof` 类型模式

传统代码需要先检查类型再强制转换：

```java
if (value instanceof String) {
    String text = (String) value;
    System.out.println(text.length());
}
```

类型模式把检查和局部变量声明合并：

```java
if (value instanceof String text) {
    System.out.println(text.length());
}
```

模式变量只在编译器能确定匹配成功的范围内可用：

```java
if (!(value instanceof String text)) {
    return;
}

System.out.println(text.length());
```

短路逻辑也会影响作用域：

```java
if (value instanceof String text && !text.isBlank()) {
    System.out.println(text);
}
```

## switch 模式匹配 [Java 21+]

模式 `switch` 在 Java 21 正式发布，可以按类型分支，并使用守卫条件进一步限制模式。以下两节使用的模型为：

```java
sealed interface Shape permits Circle, Rectangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}
```

按形状计算面积：

```java
static double area(Shape shape) {
    return switch (shape) {
        case Circle circle -> Math.PI * circle.radius() * circle.radius();
        case Rectangle rectangle
                when rectangle.width() == rectangle.height()
                -> rectangle.width() * rectangle.width();
        case Rectangle rectangle -> rectangle.width() * rectangle.height();
    };
}
```

对于密封层次，编译器知道允许的直接子类型，可以检查 `switch` 是否穷尽所有分支。通常不应添加无意义的 `default`，否则将来新增允许子类型时，编译器无法提示这里需要处理新分支。

`case` 按从上到下匹配。宽泛类型放在具体类型之前会遮蔽后续分支并产生编译错误。

## Record 模式 [Java 21+]

Record 模式可以在类型检查的同时解构组件：

```java
static double area(Shape shape) {
    return switch (shape) {
        case Circle(double radius) -> Math.PI * radius * radius;
        case Rectangle(double width, double height) -> width * height;
    };
}
```

模式可以嵌套，适合解构结构稳定的小型数据模型：

```java
record Point(int x, int y) {}
record Segment(Point start, Point end) {}

if (value instanceof Segment(Point(int x1, int y1), Point(int x2, int y2))) {
    System.out.println((x2 - x1) + ", " + (y2 - y1));
}
```

当模式变得很长、重复或包含复杂业务判断时，应提取为普通方法或让对象自己提供行为，避免把所有领域逻辑集中到一个大型 `switch`。

## 参考资料

- [Java SE 17 JLS：The instanceof Operator](https://docs.oracle.com/javase/specs/jls/se17/html/jls-15.html#jls-15.20.2)
- [Dev.java：Pattern Matching](https://dev.java/learn/pattern-matching/)
- [JEP 440：Record Patterns](https://openjdk.org/jeps/440)
- [JEP 441：Pattern Matching for switch](https://openjdk.org/jeps/441)
