---
title: Control Flow
date: 2026-01-28
category: java
---

控制流语句用于控制程序的执行顺序。Java 提供了条件语句、循环语句和跳转语句。

## if-else 语句

`if-else` 用于根据条件执行不同的代码块。

```java
int score = 85;

if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 80) {
    System.out.println("良好");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}
```

单行语句可以省略大括号，但不推荐：

```java
if (score >= 60)
    System.out.println("及格");  // 不推荐
else
    System.out.println("不及格");
```

## 三元运算符

三元运算符是 `if-else` 的简化形式，用于简单的条件赋值。

```java
int score = 85;
String result = score >= 60 ? "及格" : "不及格";
```

## switch 语句

### 传统 switch 语句

传统的 `switch` 语句使用 `case` 和 `break`：

```java
int day = 3;
String dayName;

switch (day) {
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    default:
        dayName = "Unknown";
        break;
}
```

> [!WARNING]
> 传统 switch 语句容易忘记 `break`，导致 fall-through（继续执行下一个 case）。

### Switch 表达式（Java 14+）

Java 14 引入了 **switch 表达式**，使用 `->` 箭头语法，不需要 `break`，更加简洁和安全。

#### 基本语法

```java
int day = 3;
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    case 4 -> "Thursday";
    case 5 -> "Friday";
    case 6 -> "Saturday";
    case 7 -> "Sunday";
    default -> "Unknown";
};
```

**特点：**

- 使用 `->` 替代 `:` 和 `break`
- 自动返回值，可以直接赋值给变量
- 不会发生 fall-through
- 更加简洁和易读

#### 多个 case 标签

可以将多个 case 合并：

```java
String dayType = switch (day) {
    case 1, 2, 3, 4, 5 -> "工作日";
    case 6, 7 -> "周末";
    default -> "无效";
};
```

#### 代码块形式

如果需要执行多条语句，使用代码块和 `yield` 返回值：

```java
int day = 3;
String message = switch (day) {
    case 1, 2, 3, 4, 5 -> {
        System.out.println("这是工作日");
        yield "需要工作";
    }
    case 6, 7 -> {
        System.out.println("这是周末");
        yield "可以休息";
    }
    default -> {
        System.out.println("无效的日期");
        yield "错误";
    }
};
```

> [!TIP]
> 使用代码块时，必须用 `yield` 关键字返回值，而不是 `return`。

#### 传统 case 与箭头语法混用

虽然可以混用，但**不推荐**：

```java
String result = switch (day) {
    case 1:
        yield "Monday";  // 传统形式需要 yield
    case 2 -> "Tuesday";  // 箭头形式
    default -> "Unknown";
};
```

#### Switch 表达式的完整性

Switch 表达式必须是**穷尽的**（exhaustive），即覆盖所有可能的情况。

```java
// 编译错误：缺少 default 分支
String dayType = switch (day) {
    case 1, 2, 3, 4, 5 -> "工作日";
    case 6, 7 -> "周末";
    // 缺少 default，编译器会报错
};
```

对于枚举类型，如果覆盖了所有枚举值，可以不需要 `default`：

```java
enum Day { MONDAY, TUESDAY, WEDNESDAY }

Day day = Day.MONDAY;
String type = switch (day) {
    case MONDAY, TUESDAY, WEDNESDAY -> "工作日";
    // 所有枚举值都覆盖了，不需要 default
};
```

### 模式匹配（Java 17 预览，Java 21 正式）

Java 17 的预览特性引入了 switch 的**模式匹配**，Java 21 正式发布。

```java
Object obj = "Hello";

String result = switch (obj) {
    case String s -> "这是字符串: " + s;
    case Integer i -> "这是整数: " + i;
    case null -> "这是 null";
    default -> "未知类型";
};
```

**带条件的模式匹配（guarded patterns）：**

```java
Object obj = "Hello";

String result = switch (obj) {
    case String s when s.length() > 5 -> "长字符串";
    case String s -> "短字符串";
    case Integer i when i > 0 -> "正整数";
    case Integer i -> "非正整数";
    case null -> "null 值";
    default -> "其他类型";
};
```

## 循环语句

### for 循环

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
```

### 增强 for 循环（for-each）

```java
int[] numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
    System.out.println(num);
}
```

### while 循环

```java
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}
```

### do-while 循环

```java
int i = 0;
do {
    System.out.println(i);
    i++;
} while (i < 5);
```

## 跳转语句

### break

跳出循环或 switch 语句：

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // 跳出循环
    }
    System.out.println(i);
}
```

### continue

跳过当前循环的剩余部分，继续下一次循环：

```java
for (int i = 0; i < 5; i++) {
    if (i == 2) {
        continue;  // 跳过 i=2
    }
    System.out.println(i);  // 输出: 0, 1, 3, 4
}
```

### return

从方法中返回：

```java
public int add(int a, int b) {
    return a + b;
}
```

## 总结

**推荐使用：**

- 优先使用 **switch 表达式**（箭头语法）而不是传统 switch 语句
- 使用 `yield` 在代码块中返回值
- switch 表达式更安全、简洁，避免了 fall-through 问题

**Java 17 的 switch 新特性：**

- ✅ Switch 表达式（正式）
- ✅ 箭头语法 `->`（正式）
- ✅ 多 case 标签（正式）
- 🔄 模式匹配（预览，Java 21 正式）
