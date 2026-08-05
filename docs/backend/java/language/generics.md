---
title: 泛型
date: 2026-08-05
category: java
---

泛型把类型作为类、接口或方法的参数。它让编译器在使用点检查类型关系，减少显式强制转换，并让同一份实现安全地处理多种类型。

没有泛型时，容器只能以 `Object` 接收和返回值，错误可能推迟到运行时：

```java
List values = new ArrayList();
values.add("Java");
values.add(42);

String language = (String) values.get(1); // 运行时 ClassCastException
```

使用参数化类型后，错误会在编译期暴露：

```java
List<String> values = new ArrayList<>();
values.add("Java");
// values.add(42); // 编译错误

String language = values.get(0); // 不需要强制转换
```

## 泛型类与接口

类型参数写在类型名之后：

```java
public final class Box<T> {
    private T value;

    public Box(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }

    public void set(T value) {
        this.value = value;
    }
}
```

使用时为 `T` 提供具体类型实参：

```java
Box<String> text = new Box<>("hello");
Box<Integer> number = new Box<>(42);
```

右侧的 `<>` 称为菱形语法，编译器从上下文推断类型实参。

常见类型参数名称：

- `T`：Type；
- `E`：Element；
- `K`、`V`：Key、Value；
- `R`：Result。

名称只是惯例。复杂领域类型可使用更有含义的名称。

## 泛型方法

方法可以声明独立于所属类的类型参数。类型参数列表位于修饰符之后、返回类型之前。

```java
public static <T> T first(List<T> values) {
    if (values.isEmpty()) {
        throw new IllegalArgumentException("values must not be empty");
    }
    return values.get(0);
}

String name = first(List.of("Alice", "Bob"));
Integer number = first(List.of(1, 2, 3));
```

通常不必显式写类型实参，编译器会根据参数和赋值上下文推断。必要时可以写成 `TypeName.<String>method(...)`。

## 有界类型参数

上界限制类型参数必须是某个类型的子类型：

```java
public static <T extends Number> double sum(List<T> values) {
    double total = 0;
    for (T value : values) {
        total += value.doubleValue();
    }
    return total;
}
```

多个上界使用 `&`，类上界必须放在最前面：

```java
<T extends Number & Comparable<T>> T max(T left, T right) {
    return left.compareTo(right) >= 0 ? left : right;
}
```

## 泛型是不变的

即使 `Integer` 是 `Number` 的子类型，`List<Integer>` 也不是 `List<Number>` 的子类型：

```java
List<Integer> integers = List.of(1, 2, 3);
// List<Number> numbers = integers; // 编译错误
```

如果允许该赋值，调用方就能向 `numbers` 添加 `Double`，从而破坏原本只保存 `Integer` 的列表。

需要表达一组相关的参数化类型时使用通配符。

## 通配符

### 无界通配符 `?`

`List<?>` 表示元素类型未知的列表。可以安全读取为 `Object`，但通常不能添加非 `null` 元素。

```java
static int sizeOf(List<?> values) {
    return values.size();
}
```

当方法只使用与元素具体类型无关的操作时，无界通配符比原始类型 `List` 安全。

### 上界通配符 `? extends T`

上界适合从结构中读取 `T`：

```java
static double sumNumbers(List<? extends Number> values) {
    double total = 0;
    for (Number value : values) {
        total += value.doubleValue();
    }
    return total;
}
```

调用方可以传入 `List<Integer>`、`List<Long>` 或其他 `Number` 子类型列表。由于实际元素类型未知，方法不能安全地添加一个普通 `Number`。

### 下界通配符 `? super T`

下界适合向结构中写入 `T`：

```java
static void addDefaults(List<? super Integer> target) {
    target.add(0);
    target.add(1);
}
```

调用方可以传入 `List<Integer>`、`List<Number>` 或 `List<Object>`。读取时只能确定结果是 `Object`。

常用记忆方式是 PECS：

- Producer Extends：参数向方法提供数据时使用 `? extends T`；
- Consumer Super：参数接收方法写入的数据时使用 `? super T`；
- 同时需要精确读写时，使用明确的类型参数，不使用通配符。

这描述的是 API 中的数据方向，不表示 `extends` 容器严格不可变。

## 原始类型

省略类型实参的 `List`、`Box` 称为原始类型（raw type）。它主要用于兼容泛型出现之前的代码。

```java
List raw = new ArrayList();
```

原始类型绕过部分编译期检查并产生 unchecked 警告。新代码应使用 `List<String>`、`List<?>` 等参数化类型，不应使用 `@SuppressWarnings` 隐藏尚未验证的类型问题。

## 类型擦除

Java 泛型主要由编译器实现。编译后大部分类型参数信息被擦除，编译器在需要的位置插入类型转换，并可能生成桥接方法维持多态。

因此：

```java
List<String> names = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();

System.out.println(names.getClass() == numbers.getClass()); // true
```

类型擦除带来一些限制：

- 不能直接写 `new T()`；
- 不能创建 `new List<String>[10]`；
- 不能用 `instanceof List<String>` 检查元素类型；
- 类的静态字段不能使用该类的类型参数；
- 两个方法擦除后签名相同时不能重载。

运行时需要创建对象时，可以显式接收工厂：

```java
static <T> T create(Supplier<T> factory) {
    return factory.get();
}

User user = create(User::new);
```

## 泛型与数组的区别

数组在运行时知道组件类型，并且具有协变关系；泛型通常在运行时擦除，并且是不变的。

```java
Number[] numbers = new Integer[1];
// numbers[0] = 3.14; // 编译通过，运行时抛出 ArrayStoreException
```

泛型在编译期拒绝对应的不安全关系，因此通用容器通常优先使用泛型集合而不是对象数组。

## 相关内容

- [引用类型与对象](./reference-types.md)
- [抽象类与接口](./abstract-and-interface.md)
- [String 与数组](./string-array.md)
- [异常处理](./exceptions.md)
- [集合框架总览](../standard-library/collections-overview.md)

## 参考资料

- [Dev.java：Generics](https://dev.java/learn/generics/)
- [Dev.java：Wildcards](https://dev.java/learn/generics/wildcards/)
- [Dev.java：Type Erasure](https://dev.java/learn/generics/type-erasure/)
- [Java Language Specification 17：Type Parameters](https://docs.oracle.com/javase/specs/jls/se17/html/jls-4.html#jls-4.4)
