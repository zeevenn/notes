---
title: 变量与运算符
date: 2026-08-05
category: java
---

变量把一个名称绑定到某种类型的值。Java 是静态类型语言：每个变量在编译期都有确定的类型，后续赋值必须与该类型兼容。

```java
int count = 3;
String name = "Alice";

count = 4;
// count = "four"; // 编译错误：String 不能赋给 int
```

## 变量的四种位置

变量所处的位置决定了它的生命周期、默认值和可见范围。

```java
public class Counter {
    private static int total; // 类变量：属于 Counter 类
    private int value;        // 实例变量：每个 Counter 对象各有一份

    public void add(int step) { // step 是参数
        int next = value + step; // next 是局部变量
        value = next;
    }
}
```

| 种类 | 声明位置 | 生命周期 | 是否有默认值 |
| --- | --- | --- | --- |
| 类变量 | 类中，带 `static` | 从类初始化到类卸载 | 有 |
| 实例变量 | 类中，不带 `static` | 与对象一致 | 有 |
| 参数 | 方法、构造方法或 Lambda 参数列表 | 本次调用期间 | 由调用方传入 |
| 局部变量 | 方法或代码块内部 | 所在代码块执行期间 | 没有 |

字段没有显式初始化时会得到默认值，例如数值为 `0`、`boolean` 为 `false`、引用为 `null`。局部变量必须在读取前明确赋值：

```java
int result;
// System.out.println(result); // 编译错误：result 可能尚未初始化

result = 42;
System.out.println(result);
```

编译器执行“明确赋值”（definite assignment）分析。它关心的是所有可能执行路径，而不只是代码看起来是否最终会赋值。

```java
int result;
boolean ready = args.length > 0;

if (ready) {
    result = 42;
}

// System.out.println(result); // 编译错误：ready 为 false 时没有赋值
```

## 作用域与遮蔽

变量只在声明所在的作用域内可见。方法参数和局部变量的作用域通常由 `{}` 界定。

```java
int outer = 1;

if (outer > 0) {
    int inner = 2;
    System.out.println(outer + inner);
}

// System.out.println(inner); // 编译错误：inner 已离开作用域
```

局部变量可以遮蔽同名字段，此时使用 `this` 明确访问当前对象的字段：

```java
public class User {
    private String name;

    public void rename(String name) {
        this.name = name;
    }
}
```

同一个局部作用域中不能再次声明同名变量。缩小变量作用域可以减少误用和意外修改。

## 使用 `var` 做局部类型推断

Java 10 起可以在有初始化表达式的局部变量上使用 `var`。类型仍在编译期确定，`var` 不是动态类型。

```java
var message = "hello"; // 推断为 String
var count = 10;        // 推断为 int

// message = 42;       // 编译错误
```

`var` 不能用于字段、方法参数或返回类型，也不能在没有初始化值时使用：

```java
// var value;          // 无法推断类型
// var nothing = null; // 无法从 null 推断具体类型
```

当右侧已经清楚表达类型时，`var` 可以减少重复；当类型影响代码含义时，显式类型通常更易读。

## 运算符与表达式

表达式计算并产生一个值，例如 `price * count`。表达式后加分号通常构成一条语句，例如 `total = price * count;`。

### 算术与自增运算符

```java
int a = 7;
int b = 3;

int sum = a + b;       // 10
int difference = a - b; // 4
int product = a * b;   // 21
int quotient = a / b;  // 2：整数除法舍弃小数部分
int remainder = a % b; // 1
```

整数除法不会自动得到浮点结果。至少一个操作数必须先成为浮点类型：

```java
double ratio = (double) a / b; // 2.333...
```

`++` 和 `--` 分为前缀与后缀形式。两者都会修改变量，但表达式结果不同：

```java
int x = 5;
int first = x++;  // first = 5，随后 x = 6
int second = ++x; // 先把 x 改为 7，再令 second = 7
```

不要在一个复杂表达式中多次修改同一变量；拆成独立语句更容易验证求值顺序。

### 比较、逻辑与短路求值

```java
int age = 20;
boolean adult = age >= 18;
boolean inRange = age >= 18 && age <= 65;
boolean outside = age < 18 || age > 65;
boolean denied = !adult;
```

`&&` 和 `||` 会短路：只要左侧已经能决定结果，就不计算右侧。这可用于安全地检查引用：

```java
if (name != null && !name.isBlank()) {
    System.out.println(name);
}
```

单个 `&` 和 `|` 用于整数时是位运算；用于布尔值时会计算两侧，不会短路。

### 赋值与复合赋值

```java
int total = 10;
total += 5; // 等价于 total = total + 5
total *= 2;
```

复合赋值隐含一次向左侧类型的转换，因此不总是与展开写法完全等价：

```java
byte value = 1;
value += 1;        // 可以编译，结果仍转换为 byte
// value = value + 1; // 编译错误：value + 1 的类型是 int
```

### 位运算与移位

```java
int flags = 0b0101;
int mask = 0b0011;

int and = flags & mask;  // 0001
int or = flags | mask;   // 0111
int xor = flags ^ mask;  // 0110
int not = ~flags;
int left = flags << 1;
int right = flags >> 1;  // 保留符号位
int unsigned = flags >>> 1; // 左侧补 0
```

位运算常见于权限标志、协议字段和底层数值处理；普通业务条件应优先使用清晰的布尔表达式。

## 数值提升与溢出

`byte`、`short` 和 `char` 参与算术运算时通常先提升为 `int`。不同数值类型混合运算时，结果会向能容纳参与者的类型提升。

```java
byte left = 10;
byte right = 20;
int result = left + right;

long count = 10L;
double average = count / 4.0; // 结果为 double
```

整数溢出不会自动抛出异常：

```java
int max = Integer.MAX_VALUE;
System.out.println(max + 1); // -2147483648
```

需要检测溢出时可使用 `Math.addExact()`、`Math.multiplyExact()` 等方法，它们会在溢出时抛出 `ArithmeticException`。

## 运算符优先级

乘除高于加减，比较高于逻辑与/或，赋值通常最后执行。与其记忆完整优先级表，更可靠的做法是用括号表达意图：

```java
boolean allowed = active && (admin || owner);
int total = (basePrice + fee) * quantity;
```

括号不能改变 `&&`、`||` 的从左到右短路规则，但能让条件分组一目了然。

## 相关内容

- [基本数据类型](./primitive-types.md)
- [引用类型与对象](./reference-types.md)
- [控制流](./control-flow.md)
- [static 与 final](./static-and-final.md)

## 参考资料

- [Dev.java：Java Language Basics](https://dev.java/learn/language-basics/)
- [Java Language Specification 17：Types, Values, and Variables](https://docs.oracle.com/javase/specs/jls/se17/html/jls-4.html)
- [Java Language Specification 17：Expressions](https://docs.oracle.com/javase/specs/jls/se17/html/jls-15.html)
