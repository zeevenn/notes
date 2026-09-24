---
title: 条件与循环
date: 2026-09-24
category: java
---

条件语句选择执行分支，循环重复执行语句。Java 的 `if`、`while`、`for` 条件必须是 `boolean`；变量能否在分支外读取，还受作用域和明确赋值规则约束。

## 条件分支与代码块

```java
int score = 85;
String grade;
if (score >= 90) {
    grade = "A";
} else if (score >= 60) {
    grade = "B";
} else {
    grade = "C";
}
System.out.println(grade); // B
```

每条分支都为 `grade` 赋值，因此后续可以读取。`else` 与最近的未配对 `if` 关联，保留花括号可以让分支归属明确。块内声明的变量不能在块外访问，见[变量与作用域](./variables.md)。

## switch 语句与贯穿

Java 17 的普通 `switch` 支持 `byte`、`short`、`char`、`int` 及其包装类型，以及 `String` 和枚举；不支持 `long`、浮点类型或 `boolean`。引用选择器为 `null` 时会抛出 `NullPointerException`。

传统冒号形式从匹配标签开始执行，遇到 `break` 才退出；缺少 `break` 时会继续执行后续分支。

```java
int month = 2;
switch (month) {
    case 1:
    case 2:
    case 3:
        System.out.println("first quarter");
        break;
    default:
        System.out.println("other quarter");
}
```

箭头形式不贯穿，多个标签可以使用逗号合并：

```java
switch (month) {
    case 1, 2, 3 -> System.out.println("first quarter");
    default -> System.out.println("other quarter");
}
```

## switch 表达式

`switch` 也可以产生值，表达式必须覆盖所有可能的输入。普通数值或字符串选择器通常需要 `default`；枚举覆盖全部常量时可以省略它。

```java
int days = switch (month) {
    case 4, 6, 9, 11 -> 30;
    case 2 -> 28;
    case 1, 3, 5, 7, 8, 10, 12 -> 31;
    default -> throw new IllegalArgumentException("invalid month");
};
```

这个示例按非闰年计算。分支需要多条语句时，用代码块和 `yield` 给出表达式结果：

```java
String label = switch (days) {
    case 28 -> "short";
    default -> {
        String text = days + " days";
        yield text;
    }
};
```

`yield` 返回当前 `switch` 表达式的值，`return` 则结束方法。按对象类型匹配的 `switch` 放在[模式匹配的 Java 21+ 部分](./pattern-matching.md#switch-模式匹配-java-21)。

## for、while 与 do-while

```java
int total = 0;
for (int i = 0; i < 3; i++) {
    total += i;
}
System.out.println(total); // 3

int remaining = 3;
while (remaining > 0) {
    remaining--;
}

int attempts = 0;
do {
    attempts++;
} while (attempts < 1);
```

`for` 依次执行初始化、条件检查、循环体、更新表达式；初始化只执行一次。`while` 先检查条件，`do-while` 先执行循环体，所以后者至少执行一次。

增强 `for` 可以遍历数组和实现了 `Iterable` 的对象：

```java
int[] values = {1, 2, 3};
for (int value : values) {
    value *= 2;
}
System.out.println(values[0]); // 1
```

循环变量得到当前元素的值，重新给它赋值不会替换数组元素。需要修改元素或使用下标时，应使用普通 `for`。对象元素还涉及共享引用，见[引用与对象语义](./reference-types.md)。

## break、continue 与 return

- `break` 结束最近一层循环或 `switch` 语句。
- `continue` 跳过本次循环剩余部分；普通 `for` 会继续执行更新表达式，再判断条件。
- `return` 结束整个方法，无论处于多少层循环内。

标签可以让 `break` 退出指定的外层语句；带标签的 `continue` 只能指向循环。

```java
int[][] rows = {{1, 2}, {3, 4}};
boolean found = false;
search:
for (int[] row : rows) {
    for (int value : row) {
        if (value == 3) {
            found = true;
            break search;
        }
    }
}
System.out.println(found); // true
```

当多层循环只是为了寻找并返回一个结果时，也可以提取方法，通过 `return` 直接表达结果。

## 参考资料

- [Java SE 17 JLS：Blocks and Statements](https://docs.oracle.com/javase/specs/jls/se17/html/jls-14.html)
- [Java SE 17 JLS：switch Expressions](https://docs.oracle.com/javase/specs/jls/se17/html/jls-15.html#jls-15.28)
- [Dev.java：Java Language Basics](https://dev.java/learn/language-basics/)
- [廖雪峰：流程控制](https://liaoxuefeng.com/books/java/quick-start/flow/index.html)
