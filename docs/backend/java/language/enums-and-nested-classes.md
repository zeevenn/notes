---
title: 枚举与嵌套类
date: 2026-08-05
category: java
---

枚举用于表示一组有限、已知且具有类型约束的取值。嵌套类则把只服务于某个类型的实现放在该类型内部，缩小名称和访问范围。

## 枚举

```java
public enum OrderStatus {
    CREATED,
    PAID,
    SHIPPED,
    CANCELLED
}
```

枚举常量是 `OrderStatus` 类型的对象，不是整数或字符串：

```java
OrderStatus status = OrderStatus.PAID;

if (status == OrderStatus.PAID) {
    System.out.println("paid");
}
```

枚举常量是固定的单例对象，因此比较枚举时使用 `==` 是安全且惯用的。

### 枚举字段与方法

枚举可以有字段、构造方法、方法，并实现接口：

```java
public enum HttpMethod {
    GET(false),
    POST(true),
    PUT(true),
    DELETE(false);

    private final boolean hasRequestBody;

    HttpMethod(boolean hasRequestBody) {
        this.hasRequestBody = hasRequestBody;
    }

    public boolean hasRequestBody() {
        return hasRequestBody;
    }
}
```

枚举构造方法不能被外部调用；常量声明时的参数用于构造固定实例。

### 遍历与解析

```java
for (OrderStatus status : OrderStatus.values()) {
    System.out.println(status.name());
}

OrderStatus parsed = OrderStatus.valueOf("PAID");
```

`valueOf()` 要求文本与常量名完全一致，否则抛出 `IllegalArgumentException`。外部协议值不一定适合直接绑定到枚举名称；需要稳定兼容时，应定义独立字段和显式解析方法。

不要把 `ordinal()` 当作持久化值。调整常量顺序会改变序号，导致已有数据含义变化。

### 枚举与 `switch`

枚举适合与 `switch` 表达式组合：

```java
String label = switch (status) {
    case CREATED -> "待支付";
    case PAID -> "已支付";
    case SHIPPED -> "已发货";
    case CANCELLED -> "已取消";
};
```

覆盖全部枚举常量后不需要 `default`。新增常量时，编译器可以提示遗漏的分支。

## 静态嵌套类

带 `static` 的嵌套类不依赖外部类实例。它可以访问外部类的私有静态成员，但访问外部实例状态需要显式接收对象。

```java
public class User {
    private final String name;

    private User(String name) {
        this.name = name;
    }

    public static class Builder {
        private String name;

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public User build() {
            return new User(name);
        }
    }
}

User user = new User.Builder().name("Alice").build();
```

当辅助类型只属于某个外部类型的 API 或实现时，静态嵌套类可以避免污染包级命名空间。

## 内部类

不带 `static` 的成员嵌套类称为内部类。每个内部类对象都关联一个外部类对象，可以直接访问其私有实例成员。

```java
public class Sequence {
    private final int[] values = {1, 2, 3};

    public class Cursor {
        private int index;

        public boolean hasNext() {
            return index < values.length;
        }

        public int next() {
            return values[index++];
        }
    }
}

Sequence sequence = new Sequence();
Sequence.Cursor cursor = sequence.new Cursor();
```

内部类会隐式持有外部实例引用。若不需要访问外部对象，应优先使用静态嵌套类，避免不必要地延长外部对象生命周期。

## 局部类与匿名类

局部类声明在方法或代码块内部，只在该作用域中使用：

```java
Runnable task(String message) {
    class PrintTask implements Runnable {
        @Override
        public void run() {
            System.out.println(message);
        }
    }
    return new PrintTask();
}
```

匿名类在创建对象的同时定义一次性实现：

```java
Comparator<String> byLength = new Comparator<>() {
    @Override
    public int compare(String left, String right) {
        return Integer.compare(left.length(), right.length());
    }
};
```

匿名类仍然是类，可以声明字段和额外方法。只需要实现函数式接口的一段行为时，Lambda 通常更简洁：

```java
Comparator<String> byLength =
        (left, right) -> Integer.compare(left.length(), right.length());
```

局部类、匿名类和 Lambda 只能捕获 `final` 或有效 final 的局部变量，即变量赋值后没有再次改变。

## 选择类型的位置

- 多个无关调用方都需要使用：顶级类型；
- 类型属于某个外部类型，但不依赖外部对象：静态嵌套类；
- 类型必须绑定外部对象状态：内部类；
- 只在单个方法中使用且需要命名实现：局部类；
- 一次性扩展类或实现非函数式接口：匿名类；
- 提供一段函数式接口行为：Lambda。

## 相关内容

- [类与封装](./classes-and-encapsulation.md)
- [控制流](./control-flow.md)
- [Lambda 与方法引用](./lambda-and-method-references.md)

## 参考资料

- [Dev.java：Enums](https://dev.java/learn/classes-objects/enums/)
- [Dev.java：Nested Classes](https://dev.java/learn/classes-objects/nested-classes/)
- [Java Language Specification 17：Enum Classes](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.9)
