---
title: Set
date: 2026-08-05
category: java
---

`Set<E>` 不保存重复元素。`HashSet`、`LinkedHashSet` 和 `TreeSet` 分别复用 `HashMap`、`LinkedHashMap` 和 `TreeMap` 的存储与查找机制，把元素当作 Map 的键。

下面摘录 OpenJDK 的关键实现。理解 Set 时，重点是它如何把成员操作转换成 Map 操作；哈希扩容、树平衡和顺序维护见 [Map](./map.md)。

## `HashSet`

### 元素作为键，值使用占位对象

[`HashSet` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/HashSet.java) 保存一个 `HashMap`，所有元素共用同一个占位值 `PRESENT`：

```java
private transient HashMap<E,Object> map;
private static final Object PRESENT = new Object();

public HashSet() {
    map = new HashMap<>();
}
```
```java
public boolean add(E e) {
    return map.put(e, PRESENT)==null;
}
```

Map 中的键就是 Set 元素，值仅用于区分映射是否存在。第一次 `put()` 返回 `null`，`add()` 返回 `true`；键已存在时，返回之前的 `PRESENT`，`add()` 返回 `false`。Set 的“不重复”由 HashMap 的键相等判断完成，不需要另一套去重算法。

```java
public boolean contains(Object o) {
    return map.containsKey(o);
}
```

```java
public boolean remove(Object o) {
    return map.remove(o)==PRESENT;
}
```

```java
public Iterator<E> iterator() {
    return map.keySet().iterator();
}
```

这些委托关系也决定了 HashSet 的行为：支持一个 `null` 元素，不保证遍历顺序；正常哈希分布下，添加、包含判断和删除平均为 `O(1)`。遍历既要扫桶数组又要访问节点，成本与元素数和容量之和有关。

### `hashCode()` 筛选位置，`equals()` 判定重复

HashMap 先根据哈希值选择桶，再比较节点缓存的哈希值和键。哈希值不同可以快速排除；相同则还需要判断是否为同一对象或 `equals()` 相等，不能只凭哈希值去重。

```java
record User(long id, String name) {}

Set<User> users = new HashSet<>();
System.out.println(users.add(new User(1L, "Alice"))); // true
System.out.println(users.add(new User(1L, "Alice"))); // false
System.out.println(users.contains(new User(1L, "Alice"))); // true
```

Record 按这里的两个字段共同生成相等性与哈希值；普通类若沿用 `Object.equals()`，两个字段相同的新对象仍不相等。业务只按 ID 去重时，应该按 ID 定义相等性，或直接让 ID 成为 Map 的键。

### 可变元素会破坏哈希查找

节点保存的是插入时计算的哈希值，元素对象变化不会通知 HashMap 重建索引：

```java
Set<List<String>> groups = new HashSet<>();
List<String> group = new ArrayList<>(List.of("A"));
groups.add(group);

group.add("B");
System.out.println(groups.contains(group)); // OpenJDK 17 中本例为 false
```

`List` 的哈希值随内容变化。查询根据新哈希值找位置，节点却仍保留旧哈希值。修改参与相等判断的字段后，Set 的行为不再有契约保证；这个输出是具体实现的观察，不能推导成每次修改都一定查不到。相等性规则见 [Object 类与通用方法](../../language/object-contract.md)。

## `LinkedHashSet`

### 继承 `HashSet`，替换底层 Map

[`LinkedHashSet` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/LinkedHashSet.java) 没有自己维护另一张哈希表。默认构造方法调用 HashSet 的包内构造方法：

```java
public LinkedHashSet() {
    super(16, .75f, true);
}
```

```java
HashSet(int initialCapacity, float loadFactor, boolean dummy) {
    map = new LinkedHashMap<>(initialCapacity, loadFactor);
}
```

`dummy` 参数只用于区分构造方法，不决定集合行为；真正的区别是底层对象从 `HashMap` 换成了 `LinkedHashMap`。

`add()`、`contains()` 和 `iterator()` 仍沿用 HashSet 的实现。遍历虽然仍调用 `map.keySet().iterator()`，动态调用的却是 LinkedHashMap 的迭代器，它沿双向链表依次返回键，因而保留插入顺序。

```java
Set<String> names = new LinkedHashSet<>();
names.add("Bob");
names.add("Alice");
names.add("Bob");
System.out.println(names); // [Bob, Alice]
```

重复 `add()` 只更新已存在键对应的占位值，不创建新节点，也不调整默认插入顺序。顺序链表让遍历只访问实际节点，时间为 `O(n)`，代价是每个节点多保存前后引用。

## `TreeSet`

### 复用 TreeMap 的排序与键查找

[`TreeSet` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/TreeSet.java) 保存的是 `NavigableMap`，默认实际对象为 TreeMap：

```java
private transient NavigableMap<E,Object> m;
private static final Object PRESENT = new Object();

public TreeSet() {
    this(new TreeMap<>());
}

TreeSet(NavigableMap<E,Object> m) {
    this.m = m;
}
```
```java
public boolean add(E e) {
    return m.put(e, PRESENT)==null;
}
```

TreeMap 沿红黑树查找键，用自然顺序或 `Comparator` 决定向左还是向右。比较结果为 `0` 时命中已有键，TreeSet 因而认为元素重复；这里不依赖哈希值。

```java
record User(long id, String name) {}
Set<User> byName = new TreeSet<>(Comparator.comparing(User::name));
System.out.println(byName.add(new User(1L, "Alice"))); // true
System.out.println(byName.add(new User(2L, "Alice"))); // false
```

比较器只按姓名比较，就只保留一个同名用户。若要同时保留不同 ID，并与这个 Record 的相等性一致，可用 `Comparator.comparing(User::name).thenComparingLong(User::id)`。只需要排序而不去重时，应使用 List 排序。

### 导航方法与范围视图

`floor(e)` 寻找不大于 `e` 的最大元素，直接委托给底层 Map：

```java
public E floor(E e) {
    return m.floorKey(e);
}
```

`lower()`、`ceiling()`、`higher()` 同样对应 TreeMap 的键导航方法；查找依靠树的排序关系，不需要全表扫描。基本增删查和这些导航操作为 `O(log n)`。

范围操作也不复制树：

```java
public NavigableSet<E> subSet(E fromElement, boolean fromInclusive,
                              E toElement,   boolean toInclusive) {
    return new TreeSet<>(m.subMap(fromElement, fromInclusive,
                                   toElement,   toInclusive));
}
```

新的 TreeSet 包装的是原 Map 的范围视图，因此两者共享节点。通过视图删除会影响原集合，向视图添加边界之外的元素则会抛出 `IllegalArgumentException`。

## `EnumSet`

枚举集合使用另一条实现路径。枚举常量的 `ordinal()` 从 `0` 连续编号，可以直接用二进制位表示某个常量是否存在。

`EnumSet.noneOf()` 根据枚举类型的常量总数选择实现：不超过 `64` 个时使用 `RegularEnumSet` 的一个 `long`，更多时使用 `JumboEnumSet` 的 `long[]`。这里判断的是枚举类型的常量数，不是当前集合的元素数。

`RegularEnumSet.add()` 的核心操作是：

```java
public boolean add(E e) {
    typeCheck(e);

    long oldElements = elements;
    elements |= (1L << ((Enum<?>)e).ordinal());
    return elements != oldElements;
}
```

把第 `ordinal()` 位设为 `1` 就完成添加，位模式不变则说明元素原本已经存在。交集和并集可以分别转换成按位与、按位或；它不需要为每个元素分配哈希节点，也不允许 `null`。

## SequencedSet API [Java 21+]

Java 21 起 `LinkedHashSet` 提供 `getFirst()`、`getLast()` 和 `reversed()`。`addFirst()`、`addLast()` 可以指定位置，已有元素会被移到指定端点；普通 `add()` 仍保持已有位置。
