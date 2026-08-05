---
title: Map
date: 2026-08-05
category: java
---

`Map<K, V>` 保存键到值的映射。键不能重复；对已存在的键调用 `put()` 会替换旧值。不同键可以映射到相同值。

```java
Map<Long, User> usersById = new HashMap<>();
usersById.put(1L, new User(1L, "Alice"));
usersById.put(2L, new User(2L, "Bob"));

User user = usersById.get(1L);
```

`Map` 不继承 `Collection`。它的操作围绕键值映射，而不是单独的元素。

## 创建与基本操作

```java
Map<String, Integer> scores = new HashMap<>();

Integer previous = scores.put("Alice", 90);
scores.put("Bob", 85);

Integer alice = scores.get("Alice");
int carol = scores.getOrDefault("Carol", 0);
boolean hasAlice = scores.containsKey("Alice");
boolean hasScore90 = scores.containsValue(90);
Integer removed = scores.remove("Bob");
```

`put()` 返回此前与键关联的值；没有旧映射时通常返回 `null`。

### 区分“键不存在”和“值为 null”

允许 `null` 值的 Map 中，`get()` 返回 `null` 有两种可能：

```java
Map<String, String> values = new HashMap<>();
values.put("present", null);

values.get("missing"); // null
values.get("present"); // null
```

需要区分时使用 `containsKey()`。更简单的边界是避免用 `null` 同时表示真实值和缺失状态。

## 按键更新

### `putIfAbsent()`

只在键没有关联非 `null` 值时写入：

```java
usersById.putIfAbsent(user.id(), user);
```

这比“先 `containsKey()` 再 `put()`”更直接；在支持原子操作的并发 Map 中也具有正确的并发语义。

### `computeIfAbsent()`

常用于按键延迟创建值：

```java
Map<String, List<String>> membersByTeam = new HashMap<>();

membersByTeam
        .computeIfAbsent("backend", key -> new ArrayList<>())
        .add("Alice");
```

映射函数应短小并避免修改同一个 Map。它返回 `null` 时不会建立映射。

### `merge()`

合并新值与旧值，适合计数和聚合：

```java
Map<String, Integer> counts = new HashMap<>();

for (String word : words) {
    counts.merge(word, 1, Integer::sum);
}
```

键不存在时直接写入 `1`；存在时调用合并函数。合并函数返回 `null` 会删除该键。

### `compute()`

需要同时根据键和旧值决定结果时使用：

```java
scores.compute("Alice", (name, oldScore) ->
        oldScore == null ? 0 : Math.min(100, oldScore + 5));
```

简单写入优先使用 `put()`、`putIfAbsent()` 或 `merge()`，避免把所有更新都写成难读的 `compute()`。

## 遍历 Map

只需要键：

```java
for (String name : scores.keySet()) {
    System.out.println(name);
}
```

只需要值：

```java
for (int score : scores.values()) {
    System.out.println(score);
}
```

同时需要键和值时遍历 `entrySet()`，避免每次再执行一次 `get()`：

```java
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}
```

也可以使用：

```java
scores.forEach((name, score) ->
        System.out.println(name + " = " + score));
```

`keySet()`、`values()` 和 `entrySet()` 通常是由 Map 支持的视图，不是独立副本。通过视图删除元素会影响 Map，Map 的修改也会反映到视图。

## `HashMap`

`HashMap` 是普通键查找的默认实现。正常哈希分布下，`get()` 和 `put()` 平均为 `O(1)`。

```java
Map<String, User> users = new HashMap<>();
```

它允许一个 `null` 键和多个 `null` 值，不保证遍历顺序，也不是线程安全的。

键的 `hashCode()` 用于定位桶，`equals()` 用于确认相等。键对象加入 Map 后不应改变参与这两个方法的字段。

### 按预计映射数量创建 [Java 19+]

Java 19 起，已知预计映射数量时可使用：

```java
HashMap<String, User> users = HashMap.newHashMap(expectedSize);
```

它根据预计映射数选择适当容量，比把“预计元素数”直接误当成底层容量更清楚。

## `LinkedHashMap`

`LinkedHashMap` 维护明确的相遇顺序。默认是插入顺序：更新已有键的值不会把它移到末尾。

```java
Map<String, Integer> scores = new LinkedHashMap<>();
scores.put("Bob", 80);
scores.put("Alice", 90);

System.out.println(scores.keySet()); // [Bob, Alice]
```

它也可以使用访问顺序，常用于实现有界缓存的基础结构，但并不自动提供线程安全或完整缓存策略。

### SequencedMap API [Java 21+]

Java 21 起 `LinkedHashMap` 实现 `SequencedMap`，可以访问首尾映射，并通过 `reversed()` 获得反向视图。Java 17 中仍通过 `entrySet()` 的迭代顺序使用 `LinkedHashMap`，没有统一的首尾 Map API。

## `TreeMap`

`TreeMap` 基于有序树实现 `NavigableMap`，键按自然顺序或 `Comparator` 排列，基本查找和更新为 `O(log n)`。

```java
NavigableMap<Integer, String> levels = new TreeMap<>();
levels.put(10, "warning");
levels.put(20, "error");
levels.put(5, "info");

Map.Entry<Integer, String> floor = levels.floorEntry(12); // 10=warning
Map.Entry<Integer, String> higher = levels.higherEntry(10); // 20=error
```

范围视图：

```java
NavigableMap<Integer, String> range = levels.subMap(5, true, 20, false);
```

视图与原 Map 共享数据。比较器结果为 `0` 的键被视为同一个键，因此比较规则必须完整表达键唯一性。

## `EnumMap`

键是单一枚举类型时优先使用 `EnumMap`：

```java
EnumMap<OrderStatus, String> labels = new EnumMap<>(OrderStatus.class);
labels.put(OrderStatus.CREATED, "待支付");
labels.put(OrderStatus.PAID, "已支付");
```

它不允许 `null` 键，按枚举声明顺序遍历，并以紧凑结构保存值。

## 键类型的要求

稳定的 Map 键应具备：

- 一致的 `equals()` 与 `hashCode()`；
- 加入 Map 后不变化的相等字段；
- 若用于 `TreeMap`，还需要稳定且最好与 `equals()` 一致的比较规则；
- 清晰的业务唯一性，例如用户 ID、订单号或不可变复合键。

Record 常适合不可变复合键：

```java
record ProductKey(long shopId, String sku) {}

Map<ProductKey, Product> products = new HashMap<>();
```

## 实现选择

| 需求 | 选择 |
| --- | --- |
| 普通键查找 | `HashMap` |
| 保持插入或访问顺序 | `LinkedHashMap` |
| 键始终排序、需要范围查询 | `TreeMap` |
| 键是枚举 | `EnumMap` |
| 多线程共享并更新 | 根据操作语义评估 `ConcurrentHashMap` |

## 相关内容

- [集合框架总览](./collections-overview.md)
- [Set](./set.md)
- [遍历、比较与排序](./iteration-and-comparison.md)
- [Object 的通用契约](../language/object-contract.md)
- [不可修改集合与防御性复制](./immutable-collections.md)

## 参考资料

- [Dev.java：Using Maps to Store Key Value Pairs](https://dev.java/learn/api/collections-framework/maps/)
- [Java SE 17 API：Map](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html)
- [Java SE 17 API：HashMap](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/HashMap.html)
- [Java SE 17 API：TreeMap](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/TreeMap.html)
- [JEP 431：Sequenced Collections](https://openjdk.org/jeps/431)
