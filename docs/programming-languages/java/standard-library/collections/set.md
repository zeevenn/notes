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
record User(long id, String name) {}

Set<User> users = new HashSet<>();
System.out.println(users.add(new User(1L, "Alice"))); // true
System.out.println(users.add(new User(1L, "Alice"))); // false

System.out.println(users.contains(new User(1L, "Alice"))); // true
```

这里的 Record 按 `id` 和 `name` 共同生成 `equals()`、`hashCode()`，所以两个不同对象也可以被视为同一个元素。普通类若沿用 `Object.equals()`，只有同一个对象引用才相等；仅仅字段值相同不会自动去重。若业务只按 ID 去重，应按 ID 定义相等性，或用 ID 作为 Map 的键。

相等对象必须具有相同哈希值；哈希值相同并不代表对象相等，这种情况称为哈希冲突，需要继续区分元素。

正常哈希分布下，`add()`、`contains()` 和 `remove()` 平均为 `O(1)`。它不保证遍历顺序，不能依赖当前观察到的输出顺序。

`HashSet` 允许一个 `null` 元素。

## `LinkedHashSet`

`LinkedHashSet` 在哈希表之外维护插入顺序，常用于“去重但保留首次出现顺序”：

```java
Set<String> names = new LinkedHashSet<>();
names.add("Bob");
names.add("Alice");
names.add("Bob");

System.out.println(names); // [Bob, Alice]
```

它仍具有接近 `HashSet` 的基本查找特征，但为维护顺序付出额外内存成本。

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

自然顺序由元素的 `Comparable` 定义，也可以在构造时传入外部比较规则 `Comparator`，见[遍历、比较与排序](./iteration-and-comparison.md#自然顺序-comparable)。下面仍使用前面定义的 `User`：

```java
Set<User> byName = new TreeSet<>(Comparator.comparing(User::name));
System.out.println(byName.add(new User(1L, "Alice"))); // true
System.out.println(byName.add(new User(2L, "Alice"))); // false
```

在 `TreeSet` 中，比较结果为 `0` 就表示元素重复。比较器只按姓名比较时，两个同名但 ID 不同的用户只能保留一个。

要遵守 `Set` 的相等性约定，比较结果为 `0` 应与 `equals()` 为 `true` 一致。不一致时，`TreeSet` 仍能运行，但可能破坏集合之间的相等性判断。

如果要按姓名排序，同时保留不同 ID 的用户，可以用 `Comparator.comparing(User::name).thenComparingLong(User::id)`；它与这里按两个字段判断相等的 `User` 一致。仅展示排序结果而不去重时，用列表排序即可。

## `EnumSet`

元素来自同一种枚举时可以使用 `EnumSet`。它用位表示各个枚举值是否在集合中。

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
union.addAll(right); // 包含 A、B、C，不保证遍历顺序

Set<String> intersection = new HashSet<>(left);
intersection.retainAll(right); // 仅包含 B

Set<String> difference = new HashSet<>(left);
difference.removeAll(right); // 仅包含 A
```

子集判断：

```java
boolean subset = union.containsAll(left);
```

## 可变元素会破坏哈希查找

对象加入 `HashSet` 后，如果参与 `equals()` 或 `hashCode()` 的字段改变，集合可能无法再找到或删除它。

```java
Set<List<String>> groups = new HashSet<>();
List<String> group = new ArrayList<>(List.of("A"));
groups.add(group);

System.out.println(groups.contains(group)); // true
group.add("B");
System.out.println(groups.contains(group)); // OpenJDK 17 中本例为 false
```

`List` 的相等性和哈希值取决于其中的元素。修改列表不会通知 `HashSet` 重新放置元素，后续查找却会使用新哈希值。上面的 `false` 是具体实现中的观察结果；修改参与相等判断的字段后，Set 的行为不再有契约保证，不能依赖查找一定成功或一定失败。

Set 元素应使用稳定标识或不可变值。完整规则见 [Object 类与通用方法](../../language/object-contract.md)。

## 实现选择

| 需求 | 选择 |
| --- | --- |
| 只需唯一性和快速成员查询 | `HashSet` |
| 唯一且保持插入/相遇顺序 | `LinkedHashSet` |
| 唯一且始终排序、需要范围查询 | `TreeSet` |
| 元素类型是枚举 | `EnumSet` |

## SequencedSet API [Java 21+]

Java 21 起 `LinkedHashSet` 实现 `SequencedSet`，提供 `getFirst()`、`getLast()` 和 `reversed()`。`addFirst()`、`addLast()` 可以指定位置；元素已存在时会将它移到指定端点，而普通 `add()` 不改变已有元素的位置。
