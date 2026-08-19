---
title: 集合框架总览
date: 2026-08-05
category: java
---

Java 集合框架（Collections Framework）用一组接口和实现类表示内存中的多元素容器。接口描述集合能够做什么，实现类决定顺序、查找方式、时间复杂度、空值支持和并发行为。

```java
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
```

变量通常声明为接口类型 `List<String>`，创建对象时再选择 `ArrayList`。调用方依赖“有序、可按索引访问”的契约，而不是依赖可变数组的内部实现。

## 接口层次

集合框架有两个主要分支：元素集合与键值映射。

```text
Iterable<E>
└── Collection<E>
    ├── List<E>
    ├── Set<E>
    │   └── SortedSet<E> / NavigableSet<E>
    └── Queue<E>
        └── Deque<E>

Map<K, V>
└── SortedMap<K, V> / NavigableMap<K, V>
```

`Map` 不继承 `Collection`。它保存键值映射，并通过 `keySet()`、`values()` 和 `entrySet()` 提供集合视图。

## 根据数据约束选择接口

| 需要表达的约束 | 接口 | 常用实现 |
| --- | --- | --- |
| 保留顺序、允许重复、按索引访问 | `List` | `ArrayList` |
| 元素唯一，不要求顺序 | `Set` | `HashSet` |
| 元素唯一，保留插入顺序 | `Set` | `LinkedHashSet` |
| 元素唯一并保持排序 | `NavigableSet` | `TreeSet` |
| 通过唯一键查找值 | `Map` | `HashMap` |
| 键保留插入顺序 | `Map` | `LinkedHashMap` |
| 键保持排序 | `NavigableMap` | `TreeMap` |
| 先进先出处理 | `Queue` | `ArrayDeque` |
| 两端插入和删除，或后进先出栈 | `Deque` | `ArrayDeque` |
| 按优先级取出元素 | `Queue` | `PriorityQueue` |

先选择能表达业务约束的接口，再根据访问模式和性能选择实现。不要只因为熟悉 `ArrayList` 或 `HashMap` 就让它们承担所有数据结构角色。

## Sequenced Collections [Java 21+]

Java 21 增加了 `SequencedCollection`、`SequencedSet` 和 `SequencedMap`，统一表示具有明确相遇顺序、能够访问首尾元素并获得反向视图的容器。`List`、`Deque`、`LinkedHashSet`、`TreeSet` 和 `LinkedHashMap` 等类型接入了相应接口。

Java 17 中仍然可以使用这些具体容器及其原有操作，只是没有统一的 `Sequenced*` 接口。例如，Java 17 的 `List` 使用 `get(0)` 和 `get(size() - 1)` 访问首尾元素，升级到 Java 21 后才可以统一使用 `getFirst()` 和 `getLast()`。

## 数组与集合

数组长度固定，可以存放基本类型或引用；集合能够动态扩容，只保存引用类型。

```java
int[] scores = {90, 85};
List<Integer> scoreList = new ArrayList<>();
scoreList.add(90); // int 自动装箱为 Integer
```

选择数组的常见情况：

- 长度固定并且自然由索引表示；
- 需要直接保存大量基本类型，避免装箱；
- API 明确要求数组。

选择集合的常见情况：

- 元素数量会变化；
- 需要去重、键查找、队列、排序视图等语义；
- 希望使用统一的遍历和批量操作。

## 接口操作可能是可选的

`Collection`、`List`、`Set` 和 `Map` 中部分修改方法属于可选操作。接口上存在 `add()` 不表示每个实现都允许修改：

```java
List<String> names = List.of("Alice", "Bob");
// names.add("Carol"); // 抛出 UnsupportedOperationException
```

API 应明确说明返回的是可修改集合、不可修改视图还是独立快照。只看变量类型 `List<String>` 无法判断可变性。

## 泛型与元素类型

集合接口使用泛型约束元素类型：

```java
List<String> names = new ArrayList<>();
Map<Long, User> usersById = new HashMap<>();
```

编译器阻止把不兼容类型放入集合，并在读取时提供明确类型。不要使用省略类型参数的原始类型：

```java
// List values = new ArrayList(); // 避免：丢失元素类型检查
```

接口参数只读取元素时，可以使用上界通配符；只写入时，可以使用下界通配符：

```java
double sum(List<? extends Number> values) { /* ... */ }
void addDefaults(List<? super Integer> target) { /* ... */ }
```

具体规则见[泛型](../language/generics.md)。

## 相等性决定包含、去重与键查找

集合通常通过元素的 `equals()` 判断是否包含某个值。哈希集合和哈希映射还依赖 `hashCode()`：

```java
Set<User> users = new HashSet<>();
users.add(new User(1L, "Alice"));

boolean exists = users.contains(new User(1L, "Alice"));
```

只有 `User.equals()` 与 `hashCode()` 一致表达用户身份时，查询结果才符合预期。对象放入 `HashSet` 或作为 `HashMap` 键之后，不应修改参与相等判断的字段。

排序集合使用自然顺序或 `Comparator` 判断位置和元素是否重复。比较结果为 `0` 的两个值在 `TreeSet` 中视为同一个元素，即使其 `equals()` 返回 `false`；比较规则最好与 `equals()` 一致。

## 顺序不是同一个概念

- 索引顺序：`List` 中每个元素有位置；
- 插入顺序：`LinkedHashSet`、默认模式的 `LinkedHashMap`；
- 排序顺序：`TreeSet`、`TreeMap`；
- 优先级顺序：`PriorityQueue` 只保证队首是当前最小或最高优先级元素；
- 未指定顺序：`HashSet`、`HashMap`，不能依赖观察到的遍历顺序。

若顺序会影响序列化、测试或业务结果，应在类型与实现选择中明确表达，而不是依赖某次运行的偶然顺序。

## 时间复杂度是实现属性

同一个接口的不同实现可能具有不同复杂度：

| 操作 | `ArrayList` | `HashSet` / `HashMap` | `TreeSet` / `TreeMap` |
| --- | --- | --- | --- |
| 按索引读取 | `O(1)` | 不支持 | 不支持 |
| 按值或键查找 | `O(n)` | 平均 `O(1)` | `O(log n)` |
| 保持排序 | 不自动保持 | 不保持 | 自动保持 |

复杂度描述基于正常哈希分布、比较器稳定等前提。数据规模小或操作不频繁时，语义清晰通常比微小的常数差异更重要。

## 并发边界

`ArrayList`、`HashSet`、`HashMap`、`ArrayDeque` 等通用实现不是线程安全的。多个线程共享且至少一个线程修改集合时，需要由对象所有权、同步或并发集合建立明确边界。

并发场景常见类型包括 `ConcurrentHashMap`、`CopyOnWriteArrayList` 和 `BlockingQueue`。它们具有不同一致性与性能取舍，应在并发专题中结合内存模型学习；不能简单地把所有集合替换成同步包装器。

## 相关内容

- [List](./list.md)
- [Set](./set.md)
- [Map](./map.md)
- [Queue 与 Deque](./queue-and-deque.md)
- [遍历、比较与排序](./iteration-and-comparison.md)
- [不可修改集合与防御性复制](./immutable-collections.md)

## 参考资料

- [Dev.java：The Collections Framework](https://dev.java/learn/api/collections-framework/)
- [Java SE 17 API：Collections Framework Overview](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/doc-files/coll-overview.html)
- [JEP 431：Sequenced Collections](https://openjdk.org/jeps/431)
