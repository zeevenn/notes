---
title: 枚举
date: 2026-09-24
category: java
---

枚举用于表示一组有限、已知且具有类型约束的取值，例如订单状态。

## 声明有限取值

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

## 枚举字段与方法

枚举可以有字段、构造方法、方法，并实现接口：

```java
public enum Priority {
    LOW(1),
    NORMAL(2),
    HIGH(3);

    private final int code;

    Priority(int code) {
        this.code = code;
    }

    public int code() {
        return code;
    }
}
```

枚举构造方法不能被外部调用；常量声明时的参数用于构造固定实例。

## 遍历与解析

```java
for (OrderStatus status : OrderStatus.values()) {
    System.out.println(status.name());
}

OrderStatus parsed = OrderStatus.valueOf("PAID");
```

`valueOf()` 要求文本与常量名完全一致，否则抛出 `IllegalArgumentException`。外部协议值不一定适合直接绑定到枚举名称；需要稳定兼容时，应定义独立字段和显式解析方法。

不要把 `ordinal()` 当作持久化值。调整常量顺序会改变序号，导致已有数据含义变化。

## 枚举与 `switch`

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

## 类型约束

枚举隐式继承 `Enum<E>`，不能再继承其他类，但可以实现接口。不能使用 `new` 创建枚举常量之外的实例。常量还可以有自己的类体，用来重写枚举声明的方法。

## 参考资料

- [Dev.java：Enums](https://dev.java/learn/classes-objects/enums/)
- [Java SE 17 JLS：Enum Classes](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.9)
