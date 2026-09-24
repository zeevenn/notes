---
title: 嵌套类、内部类与匿名类
date: 2026-09-24
category: java
---

嵌套类把属于某个类型的辅助实现或局部实现放在相应声明范围内。是否依赖外部类实例，决定了创建方式和成员访问规则。

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

非静态成员类是内部类的一种，每个这样的对象都关联一个外部类对象，可以直接访问其私有实例成员。局部类和匿名类也可以属于内部类，但位于静态上下文时没有隐式的外部实例。

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

非静态成员类会隐式持有外部实例引用。若不需要访问外部对象，应优先使用静态嵌套类，避免不必要地延长外部对象生命周期。

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

## 参考资料

- [Dev.java：Nested Classes](https://dev.java/learn/classes-objects/nested-classes/)
- [Java SE 17 JLS：Inner Classes and Enclosing Instances](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.1.3)
