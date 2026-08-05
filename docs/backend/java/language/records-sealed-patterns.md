---
title: Record、密封类与模式匹配
date: 2026-08-05
category: java
---

Record、密封类（sealed class）和模式匹配用于更直接地表达数据形状、受限类型层次以及按类型拆解数据的逻辑。Java 17 基线可以使用 Record、密封类型和 `instanceof` 类型模式；模式 `switch` 与 Record 模式属于 Java 21 扩展。

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

### 紧凑构造方法

紧凑构造方法适合校验或规范化组件。参数赋给字段的代码由编译器补充：

```java
public record EmailAddress(String value) {
    public EmailAddress {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("email must not be blank");
        }
        value = value.trim().toLowerCase();
    }
}
```

校验应保持 Record 的规范：组件访问器返回的值能够重新构造出相等对象。

### Record 不保证深层不可变

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

直接子类型必须明确选择一种状态：

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

## `switch` 模式匹配 [Java 21+]

模式 `switch` 可以按类型分支，并使用守卫条件进一步限制模式：

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

## 选择建模方式

| 需求 | 适合的工具 |
| --- | --- |
| 一组组件共同定义不可变数据值 | Record |
| 类型层次只有受控的有限分支 | 密封类或密封接口 |
| 在条件中检查并使用具体类型 | `instanceof` 类型模式 |
| 对有限分支生成结果 | Java 17 使用普通多态或条件判断；Java 21+ 可用模式 `switch` |
| 拆解 Record 组件 | Java 21+ 的 Record 模式 |
| 对象自身拥有稳定且可扩展的行为 | 普通多态方法 |

这些特性可以组合，但不要求同时使用。先让领域约束决定类型结构，再选择能直接表达约束的语法。

## 相关内容

- [类与封装](./classes-and-encapsulation.md)
- [继承与多态](./inheritance-and-polymorphism.md)
- [抽象类与接口](./abstract-and-interface.md)
- [控制流](./control-flow.md)
- [Object 的通用契约](./object-contract.md)

## 参考资料

- [Dev.java：Records](https://dev.java/learn/records/)
- [Dev.java：Pattern Matching](https://dev.java/learn/pattern-matching/)
- [JEP 409：Sealed Classes](https://openjdk.org/jeps/409)
- [JEP 440：Record Patterns](https://openjdk.org/jeps/440)
- [JEP 441：Pattern Matching for switch](https://openjdk.org/jeps/441)
