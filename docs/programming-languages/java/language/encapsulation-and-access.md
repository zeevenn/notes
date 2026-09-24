---
title: 封装与访问控制
date: 2026-09-24
category: java
---

封装把对象的状态和操作组织在一起，通过公开行为控制状态变化，隐藏调用方不需要依赖的内部表示。访问修饰符是建立边界的语言工具，边界是否有效还取决于公开方法暴露了什么。

## 用行为维护状态约束

账户要求余额非负。`private` 字段只供类内部使用，`public` 方法对外提供操作；调用方要改变余额，就需要经过这些方法的检查。例子中的 `throw` 会中止不合法的操作，并报告参数错误。

```java
public class Account {
    private long balance;

    public Account(long openingBalance) {
        if (openingBalance < 0) {
            throw new IllegalArgumentException("negative balance");
        }
        balance = openingBalance;
    }

    public void deposit(long amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("amount must be positive");
        }
        balance = Math.addExact(balance, amount);
    }

    public void withdraw(long amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalArgumentException("invalid withdrawal");
        }
        balance -= amount;
    }

    public long balance() {
        return balance;
    }
}
```

`Math.addExact()` 计算加法，在超出 `long` 范围时报告错误，避免溢出后得到错误余额。

余额非负是对象必须持续满足的约束，也称为不变式。构造方法建立它，公开操作维护它。这里不提供 `setBalance()`，因为任意覆盖余额不属于这个对象允许的操作。

Getter 是读取属性的方法，setter 是修改属性的方法。它们可以表达属性访问，但字段私有化后自动为所有字段生成 setter，并不自动形成合理的封装。

## 类型和成员的访问权限

包通过 `package` 声明把类组织到命名空间中，例如 `package example.orders;`。同包与跨包代码拥有不同访问条件。

直接声明在源文件中的类称为顶级类；声明在另一个类内部的类型称为嵌套类型；通过 `extends` 继承某个类的类称为它的子类。普通顶级类可以是 `public` 或包访问，字段和方法等成员可以使用下列四种访问级别。

| 访问级别 | 同一顶级类型的内部代码 | 同包其他类型 | 跨包子类 | 跨包其他类型 |
| --- | --- | --- | --- | --- |
| `private` | 可访问，包括嵌套类型之间 | 不可访问 | 不可访问 | 不可访问 |
| 无修饰符（包访问） | 可访问 | 可访问 | 不可直接访问 | 不可访问 |
| `protected` | 可访问 | 可访问 | 满足子类访问规则时可访问 | 不可访问 |
| `public` | 可访问 | 可访问 | 可访问 | 可访问 |

访问成员还要求其所属类型可访问。

构造方法也可以声明访问权限；例如私有构造方法可限制外部直接创建实例。局部变量没有访问修饰符，其可见范围由[作用域](./variables.md)决定。

## protected 的跨包规则

`protected` 允许同包访问。跨包时，访问必须位于子类代码内；对于实例字段和实例方法，点号前的对象表达式称为接收者，它的声明类型还必须是当前子类或它的子类型。例如下例 `child.value` 的接收者声明为 `Child`，而 `base.value` 的接收者声明为 `Base`。

```java
// p/Base.java
package p;
public class Base {
    protected int value;
}
```

```java
// q/Child.java
package q;
import p.Base;

public class Child extends Base {
    void read(Child child, Base base) {
        System.out.println(this.value);  // 可以
        System.out.println(child.value); // 可以
        // System.out.println(base.value); // 编译错误
    }
}
```

这使子类能够使用自己的继承状态，同时限制它通过任意父类引用访问其他对象的受保护状态。

## 不泄露内部可变状态

即使字段是 `private`，直接保存外部传入的可变对象，或把它原样返回，也会让外部绕过方法修改内部状态。

下面的 `List<String>` 是保存字符串的列表；`List.copyOf()` 复制列表内容并得到一个不允许增删或替换元素的列表：

```java
import java.util.List;

public final class Team {
    private final List<String> members;

    public Team(List<String> members) {
        this.members = List.copyOf(members);
    }

    public List<String> members() {
        return members;
    }
}
```

这里复制列表结构，并返回不可修改的列表。元素是不可变的 `String`，因此调用方也不能通过元素改变成员姓名。若元素本身可变，还需要明确元素的共享或复制策略，见[不可修改集合与防御性复制](../standard-library/immutable-collections.md)。

## JavaBeans 属性约定

JavaBeans 使用 `getName()`、`setName(...)`、布尔属性的 `isActive()` 等命名约定，让工具识别属性。只读属性可以只有 getter；属性也不要求与某个字段一一对应。

这是属性发现和访问的约定。是否需要公共无参构造方法、setter 或序列化能力，应以具体工具的实例化和绑定要求为准，不应由此要求所有业务类暴露可写属性。

## 参考资料

- [Java SE 17 JLS：Access Control](https://docs.oracle.com/javase/specs/jls/se17/html/jls-6.html#jls-6.6)
- [Java SE 17 API：Introspector](https://docs.oracle.com/en/java/javase/17/docs/api/java.desktop/java/beans/Introspector.html)
- [Dev.java：Objects, Classes, Interfaces, Packages, and Inheritance](https://dev.java/learn/oop/)
