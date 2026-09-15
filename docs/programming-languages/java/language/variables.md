---
title: 变量
date: 2026-08-05
category: java
---

变量把一个名称绑定到某种类型的值。Java 是静态类型语言：每个变量在编译期都有确定的类型，后续赋值必须与该类型兼容。

`int` 表示整数类型，声明变量时写出类型、名称和初始值：

```java
int count = 3;
count = 4;
System.out.println(count); // 4
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

| 种类     | 声明位置                         | 生命周期           | 是否有默认值 |
| -------- | -------------------------------- | ------------------ | ------------ |
| 类变量   | 类中，带 `static`                | 从类初始化到类卸载 | 有           |
| 实例变量 | 类中，不带 `static`              | 与对象一致         | 有           |
| 参数     | 方法、构造方法或 Lambda 参数列表 | 本次调用期间       | 由调用方传入 |
| 局部变量 | 方法或代码块内部                 | 所在代码块执行期间 | 没有         |

类变量和实例变量统称为**字段**，即直接声明在类中、方法外的变量。字段没有显式初始化时会得到默认值，例如数值为 `0`、`boolean` 为 `false`、引用为 `null`。局部变量必须在读取前明确赋值：

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

## 参考资料

- [Dev.java：Java Language Basics](https://dev.java/learn/language-basics/)
- [Java Language Specification 17：Types, Values, and Variables](https://docs.oracle.com/javase/specs/jls/se17/html/jls-4.html)
