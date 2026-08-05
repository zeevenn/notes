---
title: Object 的通用契约
date: 2026-08-05
category: java
---

普通类都直接或间接继承 `java.lang.Object`。其中最常需要根据业务语义重写的方法是 `equals()`、`hashCode()` 和 `toString()`。

```java
public class User {
    private final long id;
    private final String name;

    // 构造方法和其他成员省略
}
```

如果两个 `User` 对象只要 `id` 相同就代表同一个业务用户，那么这个规则必须由 `equals()` 和 `hashCode()` 一致表达。

## 身份相等与逻辑相等

`==` 判断两个引用是否指向同一个对象，`equals()` 判断类所定义的逻辑相等关系。

```java
User first = new User(1L, "Alice");
User second = new User(1L, "Alice");

System.out.println(first == second);      // false
System.out.println(first.equals(second)); // 取决于 User.equals() 的实现
```

没有重写时，`Object.equals()` 的行为与引用身份比较相同。值对象、集合元素和 Map 键通常需要逻辑相等；表示独立实体且没有稳定业务标识时，不应随意按全部可变字段判断相等。

## `equals()` 的约束

对任意非 `null` 引用，正确的 `equals()` 应满足：

- 自反性：`x.equals(x)` 为 `true`；
- 对称性：`x.equals(y)` 与 `y.equals(x)` 结果一致；
- 传递性：如果 `x` 等于 `y` 且 `y` 等于 `z`，则 `x` 等于 `z`；
- 一致性：参与比较的状态没有变化时，多次调用结果一致；
- 非空性：`x.equals(null)` 为 `false`。

一个按稳定 `id` 判断相等的实现：

```java
import java.util.Objects;

public final class User {
    private final long id;
    private final String name;

    public User(long id, String name) {
        this.id = id;
        this.name = Objects.requireNonNull(name);
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof User user)) {
            return false;
        }
        return id == user.id;
    }

    @Override
    public int hashCode() {
        return Long.hashCode(id);
    }

    @Override
    public String toString() {
        return "User[id=" + id + ", name=" + name + "]";
    }
}
```

示例把类声明为 `final`，避免子类增加相等性状态后破坏对称性或传递性。允许继承的类需要更谨慎地设计相等语义。

## `hashCode()` 必须与 `equals()` 一致

哈希集合和哈希映射先根据哈希值定位候选位置，再使用 `equals()` 判断具体元素。因此必须满足：

> 如果 `a.equals(b)` 为 `true`，那么 `a.hashCode() == b.hashCode()` 必须为 `true`。

反过来不成立：不同对象可以产生相同哈希值，集合会继续用 `equals()` 区分它们。

只重写 `equals()` 而不重写 `hashCode()` 会使逻辑相等的对象落入不同哈希位置：

```java
Set<User> users = new HashSet<>();
users.add(new User(1L, "Alice"));

boolean found = users.contains(new User(1L, "Alice"));
```

只有两个方法基于相同字段实现时，`found` 才能稳定得到 `true`。

## 不要修改哈希键参与相等判断的字段

对象加入 `HashSet` 或作为 `HashMap` 键之后，如果其哈希相关字段发生变化，集合可能无法再在原位置找到它。

```java
Set<Account> accounts = new HashSet<>();
Account account = new Account("alice@example.com");
accounts.add(account);

account.setEmail("new@example.com");
// contains/remove 的结果可能不再符合预期
```

适合作为键的类型通常满足以下条件之一：

- 参与 `equals()` 和 `hashCode()` 的字段不可变；
- 使用不会变化的稳定标识；
- 类型本身是不可变值对象。

## `toString()` 用于可读表示

`Object.toString()` 默认返回类名和哈希值形式的文本，通常不包含业务状态。重写后可改善日志、调试和失败信息：

```java
@Override
public String toString() {
    return "User[id=" + id + ", name=" + name + "]";
}
```

不要在 `toString()` 中输出密码、令牌、完整身份证号等敏感数据，也不要让它执行数据库查询或其他昂贵操作。

## Record 的值语义

Record 会根据全部组件自动生成 `equals()`、`hashCode()` 和 `toString()`：

```java
public record Point(int x, int y) {}

Point first = new Point(1, 2);
Point second = new Point(1, 2);

System.out.println(first.equals(second)); // true
System.out.println(first.hashCode() == second.hashCode()); // true
```

这适合“所有组件共同定义这个值”的类型。如果业务实体只按某个标识判断相等，不应仅为了减少代码就改成 Record。

Record 的组件引用是 `final`，但组件指向的对象仍可能可变：

```java
public record Group(List<String> members) {}
```

如果 `members` 会被外部修改，Record 的可观察状态和哈希值仍可能变化。构造时使用 `List.copyOf()` 可以建立不可变边界。

## 常见错误

- 使用 `==` 比较 `String` 或包装类内容；
- `equals()` 使用一个字段，`hashCode()` 使用另一组字段；
- 把可变字段纳入哈希键的相等语义；
- 在继承层次中让父类和子类采用不兼容的相等规则；
- 为了测试方便而让所有字段都参与实体相等判断；
- 在 `toString()` 中泄露敏感信息。

## 相关内容

- [引用类型与对象](./reference-types.md)
- [类与封装](./classes-and-encapsulation.md)
- [Record、密封类与模式匹配](./records-sealed-patterns.md)
- [继承与多态](./inheritance-and-polymorphism.md)
- [Set](../standard-library/set.md)
- [Map](../standard-library/map.md)

## 参考资料

- [Java SE 17 API：Object](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Object.html)
- [Dev.java：Object as a Superclass](https://dev.java/learn/inheritance/objects/)
