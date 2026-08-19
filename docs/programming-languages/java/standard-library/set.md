---
title: Set
date: 2026-08-05
category: java
---

`Set<E>` 表示不包含重复元素的集合。它适合表达成员关系、去重结果和集合运算，不提供索引访问。

```java
Set<String> tags = new HashSet<>();
tags.add("java");
tags.add("backend");
tags.add("java");

System.out.println(tags.size()); // 2
```

`add()` 在集合因本次调用发生变化时返回 `true`，元素已存在时返回 `false`。

## 常用操作

```java
Set<String> permissions = new HashSet<>();

boolean added = permissions.add("read");
boolean exists = permissions.contains("read");
boolean removed = permissions.remove("read");
int size = permissions.size();
boolean empty = permissions.isEmpty();
```

从集合或其他元素容器去重：

```java
List<String> names = List.of("Alice", "Bob", "Alice");
Set<String> uniqueNames = new HashSet<>(names);
```

使用哪种 Set 实现决定去重后是否保留输入顺序。

## `HashSet`

`HashSet` 使用哈希表，根据 `hashCode()` 定位候选位置，再使用 `equals()` 判断元素是否相同。

```java
Set<User> users = new HashSet<>();
users.add(new User(1L, "Alice"));

boolean exists = users.contains(new User(1L, "Alice"));
```

正常哈希分布下，`add()`、`contains()` 和 `remove()` 平均为 `O(1)`。它不保证遍历顺序，不能依赖当前观察到的输出顺序。

`HashSet` 允许一个 `null` 元素，但在业务模型中是否允许缺失值应由 API 明确决定，不应只依据实现能力。

## `LinkedHashSet`

`LinkedHashSet` 在哈希表之外维护明确的相遇顺序，常用于“去重但保留首次出现顺序”：

```java
Set<String> names = new LinkedHashSet<>();
names.add("Bob");
names.add("Alice");
names.add("Bob");

System.out.println(names); // [Bob, Alice]
```

它仍具有接近 `HashSet` 的基本查找特征，但为维护顺序付出额外内存成本。

### SequencedSet API [Java 21+]

Java 21 起 `LinkedHashSet` 实现 `SequencedSet`，可使用 `getFirst()`、`getLast()`、`addFirst()`、`addLast()` 和 `reversed()`。Java 17 中仍使用原有的 `Set` 接口；需要读取首个元素时通过迭代器表达，不应假设 `HashSet` 具有顺序。

## `TreeSet`

`TreeSet` 基于有序树实现 `NavigableSet`，元素始终按自然顺序或提供的 `Comparator` 排列。

```java
NavigableSet<Integer> scores = new TreeSet<>();
scores.add(80);
scores.add(95);
scores.add(70);

System.out.println(scores);       // [70, 80, 95]
System.out.println(scores.floor(90));   // 80
System.out.println(scores.ceiling(90)); // 95
```

`add()`、`contains()` 和 `remove()` 为 `O(log n)`。常用导航方法：

| 方法 | 含义 |
| --- | --- |
| `lower(x)` | 严格小于 `x` 的最大元素 |
| `floor(x)` | 小于或等于 `x` 的最大元素 |
| `ceiling(x)` | 大于或等于 `x` 的最小元素 |
| `higher(x)` | 严格大于 `x` 的最小元素 |
| `subSet()` | 返回指定范围的视图 |

自然顺序要求元素实现 `Comparable`；否则构造时传入 `Comparator`：

```java
Set<User> users = new TreeSet<>(Comparator.comparing(User::name));
```

在 `TreeSet` 中，比较结果为 `0` 就表示元素重复。比较器只按姓名比较时，两个同名但 ID 不同的用户只能保留一个。比较规则应完整表达 Set 所需的唯一性，并尽量与 `equals()` 一致。

## `EnumSet`

枚举元素应优先考虑 `EnumSet`。它为枚举值使用紧凑的位表示，语义明确且效率高。

```java
enum Permission {
    READ, WRITE, DELETE
}

EnumSet<Permission> editable = EnumSet.of(Permission.READ, Permission.WRITE);
EnumSet<Permission> all = EnumSet.allOf(Permission.class);
EnumSet<Permission> none = EnumSet.noneOf(Permission.class);
```

`EnumSet` 不允许 `null`，遍历顺序与枚举常量声明顺序一致。

## 集合运算

`Set` 继承的批量操作可以表达并集、交集和差集。操作会修改接收者，因此通常先复制：

```java
Set<String> left = Set.of("A", "B");
Set<String> right = Set.of("B", "C");

Set<String> union = new HashSet<>(left);
union.addAll(right); // [A, B, C]

Set<String> intersection = new HashSet<>(left);
intersection.retainAll(right); // [B]

Set<String> difference = new HashSet<>(left);
difference.removeAll(right); // [A]
```

子集判断：

```java
boolean subset = union.containsAll(left);
```

## 可变元素会破坏哈希查找

对象加入 `HashSet` 后，如果参与 `equals()` 或 `hashCode()` 的字段改变，集合可能无法再找到或删除它。

```java
Set<Account> accounts = new HashSet<>();
Account account = new Account("alice@example.com");
accounts.add(account);

account.setEmail("new@example.com");
```

Set 元素应使用稳定标识或不可变值。完整规则见 [Object 的通用契约](../language/object-contract.md)。

## 实现选择

| 需求 | 选择 |
| --- | --- |
| 只需唯一性和快速成员查询 | `HashSet` |
| 唯一且保持插入/相遇顺序 | `LinkedHashSet` |
| 唯一且始终排序、需要范围查询 | `TreeSet` |
| 元素类型是枚举 | `EnumSet` |

## 相关内容

- [集合框架总览](./collections-overview.md)
- [Map](./map.md)
- [遍历、比较与排序](./iteration-and-comparison.md)
- [Object 的通用契约](../language/object-contract.md)

## 参考资料

- [Dev.java：Set, SortedSet and NavigableSet](https://dev.java/learn/api/collections-framework/sets/)
- [Java SE 17 API：Set](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html)
- [Java SE 17 API：TreeSet](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/TreeSet.html)
- [JEP 431：Sequenced Collections](https://openjdk.org/jeps/431)
