---
title: Map
date: 2026-08-05
category: java
---

`Map<K, V>` 保存键到值的映射。键不能重复；对已存在的键调用 `put()` 会替换旧值。不同键可以映射到相同值。

```java
record User(long id, String name) {}

Map<Long, User> usersById = new HashMap<>();
usersById.put(1L, new User(1L, "Alice"));
usersById.put(2L, new User(2L, "Bob"));

User user = usersById.get(1L);
System.out.println(user.name()); // Alice
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

`put()` 返回此前与键关联的值；没有旧映射时返回 `null`。

### 区分“键不存在”和“值为 null”

允许 `null` 值的 Map 中，`get()` 返回 `null` 有两种可能：

```java
Map<String, String> values = new HashMap<>();
values.put("present", null);

values.get("missing"); // null
values.get("present"); // null
```

需要区分时使用 `containsKey()`。`getOrDefault()` 只在键不存在时使用默认值，不会替换已经关联的 `null`：

```java
System.out.println(values.getOrDefault("missing", "default")); // default
System.out.println(values.getOrDefault("present", "default")); // null
```

因此，把可能为 `null` 的 `Integer` 结果直接赋给 `int`，仍会在自动拆箱时抛出 `NullPointerException`。

## 按键更新

### `putIfAbsent()`

只在键没有关联非 `null` 值时写入：

```java
usersById.putIfAbsent(user.id(), user);
```

键已经映射到 `null` 时也会写入，因此它与“仅在 `containsKey()` 为 `false` 时调用 `put()`”不同。`HashMap` 的这个操作不保证线程安全；`ConcurrentHashMap.putIfAbsent()` 则保证检查和写入不可被其他线程的操作插入打断，即原子执行。

### `computeIfAbsent()`

常用于按键延迟创建值：

```java
Map<String, List<String>> membersByTeam = new HashMap<>();

membersByTeam
        .computeIfAbsent("backend", key -> new ArrayList<>())
        .add("Alice");

System.out.println(membersByTeam.get("backend")); // [Alice]
```

没有对应键或旧值为 `null` 时，才调用映射函数；返回非空结果时写入并返回它，返回 `null` 时不建立新映射。映射函数不应修改同一个 Map。

换成 `ConcurrentHashMap` 只能保证创建映射的原子性，不会让值中的 `ArrayList` 或后续 `.add()` 自动变得线程安全。

### `merge()`

合并新值与旧值，适合计数和聚合：

```java
Map<String, Integer> counts = new HashMap<>();
List<String> words = List.of("java", "map", "java");

for (String word : words) {
    counts.merge(word, 1, Integer::sum);
}

System.out.println(counts.get("java")); // 2
```

键不存在或旧值为 `null` 时直接写入 `1`；旧值非 `null` 时调用合并函数。合并函数返回 `null` 会删除该键。

### `compute()`

需要同时根据键和旧值决定结果时使用：

```java
scores.compute("Alice", (name, oldScore) ->
        oldScore == null ? 0 : Math.min(100, oldScore + 5));
```

`compute()` 总会调用函数，即使键不存在；函数返回 `null` 时删除已有映射，或让不存在的键继续保持不存在。

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

`Map.forEach()` 也可以遍历键值对：

```java
scores.forEach((name, score) ->
        System.out.println(name + " = " + score));
```

`keySet()`、`values()` 和 `entrySet()` 是由 Map 支持的视图，不是独立副本。以可修改的 `HashMap` 为例：

```java
Map<String, Integer> stock = new HashMap<>();
stock.put("book", 3);
Set<String> products = stock.keySet();
products.remove("book");
System.out.println(stock.isEmpty()); // true

stock.put("pen", 5);
System.out.println(products.contains("pen")); // true
```

通过视图删除元素会删除对应映射；这些视图不支持 `add()`、`addAll()`，新增映射应调用 Map 的方法。`values()` 可以包含重复值，因此它是 `Collection<V>`，不是 `Set<V>`。

## `HashMap`

`HashMap` 是普通键查找的默认实现。正常哈希分布下，`get()` 和 `put()` 平均为 `O(1)`。

```java
Map<String, User> users = new HashMap<>();
```

它允许一个 `null` 键和多个 `null` 值，不保证遍历顺序，也不是线程安全的。

键的 `hashCode()` 用于定位桶，`equals()` 用于确认相等。键对象加入 Map 后不应改变参与这两个方法的字段。

## `LinkedHashMap`

`LinkedHashMap` 默认维护插入顺序：更新已有键的值不会把它移到末尾。

```java
Map<String, Integer> scores = new LinkedHashMap<>();
scores.put("Bob", 80);
scores.put("Alice", 90);

System.out.println(scores.keySet()); // [Bob, Alice]
```

构造时设置 `accessOrder = true`，可以改为按访问顺序排列，最近访问的键移到末尾：

```java
Map<String, Integer> recent = new LinkedHashMap<>(16, 0.75f, true);
recent.put("A", 1);
recent.put("B", 2);
recent.get("A");
System.out.println(recent.keySet()); // [B, A]
```

这可以作为按最近访问情况淘汰缓存条目的基础，但还需要另行实现容量与淘汰规则；`LinkedHashMap` 本身也不是线程安全的。

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

视图与原 Map 共享数据。比较器结果为 `0` 的键被视为同一个键。要遵守 `Map` 的相等性约定，比较结果为 `0` 应与 `equals()` 为 `true` 一致；否则 `TreeMap` 仍能运行，但可能破坏 Map 之间的相等性判断。

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
- 若用于 `TreeMap`，还需要稳定且与 `equals()` 一致的比较规则；
- 清晰的业务唯一性，例如用户 ID、订单号或不可变复合键。

字段本身不可变的 Record 可以作为复合键：

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

## 按预计映射数量创建 [Java 19+]

Java 19 起，已知预计映射数量时可使用：

```java
HashMap<String, User> users = HashMap.newHashMap(expectedSize);
```

它根据预计映射数选择适当容量，比把“预计元素数”直接误当成底层容量更清楚。

## SequencedMap API [Java 21+]

Java 21 起 `LinkedHashMap` 实现 `SequencedMap`，可以通过 `firstEntry()`、`lastEntry()` 访问首尾映射，并通过 `reversed()` 获得反向视图。
