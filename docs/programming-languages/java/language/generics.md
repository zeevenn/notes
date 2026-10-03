---
title: 泛型
date: 2026-08-05
category: java
---

泛型把类型作为类、接口或方法的参数。它让编译器在使用点检查类型关系，减少显式强制转换，并让同一份实现安全地处理多种类型。

`List` 是按位置保存元素的列表接口，`ArrayList` 是它的一种实现。例子中的 `add()` 加入元素，`get(下标)` 取出元素。若不声明列表的元素类型，取出的值只按公共父类型 `Object` 处理，调用方需要自己确认它的具体类型：

```java
import java.util.List;
import java.util.ArrayList;

List values = new ArrayList();
values.add("Java");
values.add(42);

String language = (String) values.get(1); // 运行时 ClassCastException
```

`(String)` 强制把取出的值作为字符串使用，但位置 1 保存的是整数对象，因此运行时会报告类型转换错误。

省略类型实参的 `List` 称为原始类型（raw type），主要用于兼容泛型出现之前的代码。通过原始类型写入元素会绕过部分类型检查，并产生 unchecked 警告。

把类型写进尖括号后，`List<String>` 明确要求元素是字符串。这样的写法称为参数化类型，编译器会提前阻止加入不兼容的值：

```java
List<String> values = new ArrayList<>();
values.add("Java");
// values.add(42); // 编译错误

String language = values.get(0); // 不需要强制转换
```

新代码应使用参数化类型，不应使用 `@SuppressWarnings` 隐藏尚未验证的类型问题。

## 泛型类与接口

类型参数写在类型名之后。`T` 是一个待确定的类型名称，字段、参数和返回值可以用它保持类型一致。下面的 `ValueSource<T>` 约定返回 `T` 类型的值，`Box<T>` 实现这个接口并保留类型参数：

```java
interface ValueSource<T> {
    T get();
}

public final class Box<T> implements ValueSource<T> {
    private T value;

    public Box(T value) {
        this.value = value;
    }

    @Override
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

实现类也可以直接确定接口的类型实参，自身不再声明类型参数：

```java
class Greeting implements ValueSource<String> {
    @Override
    public String get() {
        return "hello";
    }
}
```

`Box<T>` 将类型的选择留给使用方，`Greeting` 则固定实现 `ValueSource<String>`。两者都可以通过相应的接口类型使用：

```java
ValueSource<Integer> numberSource = new Box<>(42);
ValueSource<String> greeting = new Greeting();
Integer number = numberSource.get();
String message = greeting.get();
```

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

## 类型参数的约束

求和方法需要把列表中的数值转成 `double`。如果只声明 `<T>`，编译器只知道 `T` 可以作为 `Object` 使用，无法确定它有没有 `doubleValue()` 方法。

`Integer`、`Long`、`Double` 等数值类型都继承 `Number`，而 `Number` 定义了 `doubleValue()`。声明 `<T extends Number>` 后，`T` 就只能是 `Number` 或它的子类型，方法内可以调用这个公共方法：

```java
public static <T extends Number> double sum(List<T> values) {
    double total = 0;
    for (T value : values) {
        total += value.doubleValue();
    }
    return total;
}
```

```java
double integers = sum(List.of(1, 2, 3));     // 6.0，T 为 Integer
double decimals = sum(List.of(1.5, 2.5));    // 4.0，T 为 Double
// sum(List.of("1", "2"));                 // 编译错误，String 不是 Number 的子类型
```

这种带类型限制的参数称为**有界类型参数**。“界”指类型的范围，不是数值的大小。按父类型在上、子类型在下的关系理解，`Number` 是这里的**上界**：允许的类型是 `Number` 本身及其下面的子类型。

这里的 `extends` 也可以跟接口，例如 `<T extends Runnable>` 表示 `T` 必须实现 `Runnable`。

<a id="list-integer-不能当作-list-number"></a>

## 泛型的不变性

一个 `Integer` 对象可以赋给 `Number` 变量，但这个关系不会自动延伸到列表：

```java
Number number = Integer.valueOf(1); // 可以

List<Integer> integers = new ArrayList<>();
// List<Number> numbers = integers; // 编译错误
```

`List<Number>` 允许加入 `Integer`，也允许加入 `Double`。假如上面的赋值成立，就可以通过 `numbers.add(3.14)` 把 `Double` 放进原本只允许 `Integer` 的同一个列表。

因此，`List<Integer>` 不是 `List<Number>` 的子类型。这种类型参数之间不随继承关系变化的性质称为**不变性**。

但求和方法只需读取数字，不需要添加元素。如果参数写成 `List<Number>`，就会拒绝 `List<Integer>`、`List<Double>` 等本来可以处理的列表。通配符用于表达这种更宽的接收范围。

## 通配符

`?` 表示一个未知的类型。例如 `List<?>` 可以指向 `List<String>`，也可以指向 `List<Integer>`；通过这个引用，编译器不知道元素的具体类型。

### 上界通配符

`List<? extends Number>` 表示“元素类型是 `Number` 或它的某个子类型的列表”。它既能接收 `List<Integer>`，也能接收 `List<Double>`：

```java
static double sumNumbers(List<? extends Number> values) {
    double total = 0;
    for (Number value : values) {
        total += value.doubleValue();
    }
    return total;
}

double total = sumNumbers(List.of(1, 2, 3)); // 6.0
```

具体元素类型虽然未知，但取出的值一定能作为 `Number` 使用，所以可以调用 `doubleValue()`。

反过来，方法不能随意往这个列表里添加数字：

```java
List<? extends Number> values = new ArrayList<Integer>();
// values.add(3.14); // 编译错误，实际列表可能只允许 Integer
// values.add(1);    // 也编译错误，声明本身没有保证实际列表允许 Integer
```

`? extends Number` 称为**上界通配符**。它保证“读出来能当作 `Number`”，却没有确定“写进去必须是哪种数”。

无法通过 `List<? extends Number>` 直接添加非 `null` 值，不代表列表不可修改。例如，它仍允许调用 `clear()`；操作能否执行取决于实际列表是否支持它。

### 下界通配符

添加默认整数的方法，可以接收 `List<Integer>`，也可以接收能容纳整数的 `List<Number>` 或 `List<Object>`：

```java
static void addDefaults(List<? super Integer> target) {
    target.add(0);
    target.add(1);
}

List<Number> numbers = new ArrayList<>();
numbers.add(3.14);
addDefaults(numbers);
System.out.println(numbers); // [3.14, 0, 1]
```

`? super Integer` 表示未知类型是 `Integer` 本身或它的父类型。这些类型都能接收 `Integer`，所以 `target.add(1)` 是安全的。

但已有元素不一定是整数。示例中的 `List<Number>` 还保存了 `Double`；若传入 `List<Object>`，里面也可能有字符串。因此，通过 `target.get(0)` 读取时只能按 `Object` 处理。

这称为**下界通配符**：以 `Integer` 为下界，允许沿父类型方向选择 `Number`、`Object` 等类型。

### 无界通配符

只统计列表长度或打印元素时，不需要知道具体元素类型，也不需要把范围限定在数字类型上：

```java
static void printAll(List<?> values) {
    for (Object value : values) {
        System.out.println(value);
    }
}

printAll(List.of("Java", "Go"));
printAll(List.of(1, 2, 3));
```

单独的 `?` 称为**无界通配符**，表示不额外限制元素类型。读取的值可以作为 `Object` 使用，但不能直接添加非 `null` 值，因为实际列表可能是 `List<String>`、`List<Integer>` 或其他类型。

`List<Object>` 则明确允许添加各种对象，不能用它替代 `List<?>` 来接收任意元素类型的列表。

### 通配符的读写约束

| 参数类型 | 可以接收的列表 | 读取时可直接使用的类型 | 可以直接添加的非 `null` 值 |
| --- | --- | --- | --- |
| `List<? extends Number>` | `List<Number>`、`List<Integer>`、`List<Double>` 等 | `Number` | 无 |
| `List<? super Integer>` | `List<Integer>`、`List<Number>`、`List<Object>` 等 | `Object` | `Integer` |
| `List<?>` | 任意元素类型的列表 | `Object` | 无 |

上表描述编译器允许的操作；实际添加元素还要求列表支持修改。

方法从参数中取出 `T` 类型的数据时，通常使用 `? extends T`；向参数中放入 `T` 类型的数据时，通常使用 `? super T`。这个规则简称 **PECS**：Producer Extends（提供数据的一侧用 `extends`），Consumer Super（接收数据的一侧用 `super`）。

例如，把源列表的元素复制到目标列表：

```java
static <T> void copy(List<? extends T> source, List<? super T> target) {
    for (T value : source) {
        target.add(value);
    }
}

List<Integer> source = List.of(1, 2, 3);
List<Number> target = new ArrayList<>();
copy(source, target);
System.out.println(target); // [1, 2, 3]
```

方法声明中的 `<T>` 声明了本次调用使用的类型参数。两个参数中的 `T` 是同一个类型，用来保证源列表提供的值能被目标列表接收：

- `List<? extends T> source`：源列表的元素类型是 `T` 或它的子类型，因此读取的元素可以赋给 `T value`。
- `List<? super T> target`：目标列表的元素类型是 `T` 或它的父类型，因此可以把这个 `T value` 添加进去。

对于 `copy(source, target)` 这次调用，可以按 `T` 为 `Integer` 来理解。源列表是 `List<Integer>`，取出的整数可以作为 `Integer` 使用；目标列表是 `List<Number>`，而 `Number` 能接收 `Integer`，所以满足 `? super Integer` 的要求。两个列表的元素类型不必相同，只要取出的值能放进目标列表。

循环依次取出 `1`、`2`、`3`，通过 `target.add(value)` 追加到目标列表末尾。目标列表原先为空，因此打印结果是 `[1, 2, 3]`；如果目标列表已有元素，新元素会排在它们之后。源列表仍保留原来的三个元素。

反方向则不成立：`List<Number>` 中可能有 `Double`，不能保证每个元素都能放进 `List<Integer>`，因此下面的调用会被编译器拒绝：

```java
List<Number> source = List.of(1, 2.5);
List<Integer> target = new ArrayList<>();
// copy(source, target); // 编译错误，源列表可能提供非 Integer 的数值
```

## 多个类型约束

类型参数还可以同时满足多个约束。例如，比较两个数并返回较大的那个，需要 `T` 既是 `Number` 的子类型，又能与同类型的值比较。

`Comparable<T>` 接口定义了 `compareTo(T other)`，返回负数、零、正数分别表示小于、等于、大于：

```java
static <T extends Number & Comparable<T>> T max(T left, T right) {
    return left.compareTo(right) >= 0 ? left : right;
}

Integer larger = max(3, 5); // 5
```

`&` 表示这些约束需要同时满足。若包含一个类，该类必须放在最前面，其余约束只能是接口；这里 `Number` 是类，`Comparable<T>` 是接口。

## 类型擦除

泛型的类型检查主要发生在编译期。运行时不会为 `ArrayList<String>` 和 `ArrayList<Integer>` 各生成一个类，两者使用同一个 `ArrayList` 类：

```java
List<String> names = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();

System.out.println(names.getClass() == numbers.getClass()); // true
```

这种处理称为**类型擦除**：`List<String>` 擦除后是 `List`；类型参数 `T` 擦除为它的第一个上界，没有显式约束时是 `Object`。编译器会在需要的位置插入类型转换，例如把 `List<String>` 取出的元素转换为 `String`。

类型擦除带来一些限制：

- 不能直接写 `new T()`；
- 不能创建 `new List<String>[10]`；
- 不能用 `instanceof List<String>` 检查元素类型；
- 类的静态字段不能使用该类的类型参数；
- 两个方法擦除后签名相同时不能重载。

运行时需要创建对象时，可以显式接收工厂。`Supplier<T>` 用 `get()` 提供一个 `T` 类型的对象，构造方法引用 `User::new` 可以充当这个工厂：

```java
static <T> T create(Supplier<T> factory) {
    return factory.get();
}

User user = create(User::new);
```
