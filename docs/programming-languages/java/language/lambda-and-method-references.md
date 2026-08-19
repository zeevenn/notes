---
title: Lambda 与方法引用
date: 2026-08-05
category: java
---

Lambda 表达式把一段行为作为值传递。它的目标类型必须是函数式接口：只有一个抽象方法的接口。

```java
@FunctionalInterface
public interface StringRule {
    boolean test(String value);
}

StringRule notBlank = value -> value != null && !value.isBlank();
boolean valid = notBlank.test("Java");
```

`@FunctionalInterface` 不是成为函数式接口的必要条件，但能让编译器检查接口是否始终只有一个抽象方法。

## Lambda 语法

Lambda 由参数列表、箭头和方法体组成：

```java
(parameters) -> expression
(parameters) -> {
    statements;
}
```

常见形式：

```java
Runnable task = () -> System.out.println("run");
Predicate<String> empty = value -> value.isEmpty();
BinaryOperator<Integer> add = (left, right) -> left + right;
Consumer<String> print = value -> {
    String normalized = value.trim();
    System.out.println(normalized);
};
```

单个可推断类型的参数可以省略括号；表达式方法体会隐式返回表达式结果。代码块方法体需要显式 `return`，除非目标方法返回 `void`。

Lambda 本身没有独立类型，必须由赋值、参数或返回值上下文提供目标函数式接口：

```java
// var rule = value -> value.isBlank(); // 编译错误：缺少目标类型
Predicate<String> rule = value -> value.isBlank();
```

## 常用函数式接口

`java.util.function` 提供了常用接口：

| 接口 | 抽象方法 | 含义 |
| --- | --- | --- |
| `Predicate<T>` | `boolean test(T value)` | 判断条件 |
| `Function<T, R>` | `R apply(T value)` | 把 `T` 转换为 `R` |
| `Consumer<T>` | `void accept(T value)` | 消费一个值，不返回结果 |
| `Supplier<T>` | `T get()` | 不接收参数，提供一个值 |
| `UnaryOperator<T>` | `T apply(T value)` | 同类型一元运算 |
| `BinaryOperator<T>` | `T apply(T left, T right)` | 同类型二元运算 |

基本类型特化接口如 `IntPredicate`、`IntFunction<R>`、`ToIntFunction<T>` 可以减少装箱和拆箱。

```java
IntPredicate positive = value -> value > 0;
ToIntFunction<String> length = String::length;
```

优先复用标准接口。只有标准接口无法表达有意义的领域契约或需要声明特定异常时，才定义新函数式接口。

## 方法引用

当 Lambda 只负责调用一个已有方法时，可以使用方法引用。

| 形式 | 示例 | 近似 Lambda |
| --- | --- | --- |
| 静态方法 | `Integer::parseInt` | `text -> Integer.parseInt(text)` |
| 特定对象的实例方法 | `logger::info` | `message -> logger.info(message)` |
| 任意对象的实例方法 | `String::length` | `text -> text.length()` |
| 构造方法 | `ArrayList::new` | `() -> new ArrayList<>()` |

```java
Function<String, Integer> parse = Integer::parseInt;
Supplier<List<String>> listFactory = ArrayList::new;
Comparator<String> ignoreCase = String::compareToIgnoreCase;
```

方法引用不一定更清晰。需要参数重排、额外校验或业务命名时，Lambda 或普通方法更合适。

## 捕获外部变量

Lambda 可以读取实例字段、静态字段以及 `final` 或有效 final 的局部变量。

```java
String prefix = "user:";
Function<String, String> addPrefix = value -> prefix + value;

// prefix = "account:"; // 如果重新赋值，前面的 Lambda 将无法编译
```

“有效 final”表示变量只赋值一次，即使没有显式写 `final`。局部变量位于线程调用栈中，Lambda 捕获的是稳定值，而不是一个之后还能随意变化的局部变量槽。

字段没有这项限制，但从 Lambda 修改共享可变状态可能产生并发问题和难以追踪的副作用。

### Lambda 中的 `this`

Lambda 不创建新的 `this`；其中的 `this` 与外围上下文相同。匿名类则拥有自己的 `this`。

```java
public class Worker {
    private final String name = "worker";

    Runnable task() {
        return () -> System.out.println(this.name);
    }
}
```

## 组合函数

标准函数式接口提供组合方法：

```java
Predicate<String> notNull = value -> value != null;
Predicate<String> notBlank = value -> !value.isBlank();
Predicate<String> valid = notNull.and(notBlank);

Function<String, String> trim = String::trim;
Function<String, Integer> length = String::length;
Function<String, Integer> trimmedLength = trim.andThen(length);
```

组合适合小而纯粹的转换与条件。包含多步状态变更、异常恢复或复杂分支时，提取为具名方法通常更清楚。

## 受检异常

大多数标准函数式接口没有在抽象方法上声明受检异常，因此下面的代码不能直接编译：

```java
// Function<Path, String> read = Files::readString;
```

可选方案取决于边界：

- 在 Lambda 内捕获并转换为当前层的非受检异常；
- 定义声明了相应异常的领域函数式接口；
- 把可能失败的操作移到普通方法，让方法边界显式声明异常。

不要只为塞进 Stream 流程就无条件吞掉异常或包装成缺少上下文的 `RuntimeException`。

## Lambda 不是对象模型的替代品

Lambda 适合传递单一行为，例如过滤条件、映射规则、回调和工厂。需要多个相关操作、明确状态、不变量或生命周期时，普通类和接口仍然更合适。

## 相关内容

- [方法](./methods.md)
- [抽象类与接口](./abstract-and-interface.md)
- [枚举与嵌套类](./enums-and-nested-classes.md)
- [泛型](./generics.md)

## 参考资料

- [Dev.java：Lambda Expressions](https://dev.java/learn/lambdas/)
- [Java SE 17 API：java.util.function](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/function/package-summary.html)
- [Java Language Specification 17：Lambda Expressions](https://docs.oracle.com/javase/specs/jls/se17/html/jls-15.html#jls-15.27)
