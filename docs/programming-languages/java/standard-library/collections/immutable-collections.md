---
title: 不可修改集合与防御性复制
date: 2026-08-05
category: java
---

不可修改（unmodifiable）集合不支持通过自身增删或替换元素，但底层数据和元素对象仍可能变化。选择 API 时，需要区分不可修改集合、实时视图和独立快照。

## `List.of()`、`Set.of()` 与 `Map.of()`

直接声明固定内容时使用 `of()` 工厂：

```java
List<String> names = List.of("Alice", "Bob");
Set<String> roles = Set.of("reader", "writer");
Map<String, Integer> scores = Map.of(
        "Alice", 90,
        "Bob", 85);
```

这些集合：

- 不支持添加、删除或替换；
- 不允许 `null` 元素、键或值；
- `Set.of()` 不允许重复元素；
- `Map.of()` 不允许重复键；
- 不保证返回对象的具体实现类；
- `Set` 和 `Map` 的遍历顺序不应被依赖。

调用 `add()`、`set()`、`put()` 等方法修改这些集合会抛出 `UnsupportedOperationException`。

超过十组或由动态数据创建 Map 时使用 `Map.ofEntries()`：

```java
Map<String, Integer> scores = Map.ofEntries(
        Map.entry("Alice", 90),
        Map.entry("Bob", 85));
```

## `copyOf()` 创建不可修改快照

```java
List<String> source = new ArrayList<>();
source.add("Alice");

List<String> snapshot = List.copyOf(source);
source.add("Bob");

System.out.println(snapshot); // [Alice]
```

对应方法包括 `List.copyOf()`、`Set.copyOf()` 和 `Map.copyOf()`。源集合后续增删或替换元素，不会改变结果保存的元素引用；元素对象本身仍然共享。这些方法拒绝 `null` 元素、键或值。

`List.copyOf()` 保留源集合的遍历顺序；`Set.copyOf()`、`Map.copyOf()` 不保证保留源集合的顺序。需要保留插入顺序的不可修改映射时，可以用 `Collections.unmodifiableMap(new LinkedHashMap<>(sourceMap))`，先复制再包装，并且不再修改内部副本。

如果输入已经是合适的不可修改集合，实现可能直接返回原对象；不要依赖返回对象是否与输入具有相同身份。

`Set.copyOf()` 从含重复元素的普通 `Collection` 创建 Set 时，只保留一个相等元素，不会因为重复而失败。`Set.of()` 在参数本身重复时则抛出 `IllegalArgumentException`。

## `Collections.unmodifiableXxx()` 创建只读视图

```java
List<String> source = new ArrayList<>();
source.add("Alice");

List<String> view = Collections.unmodifiableList(source);
source.add("Bob");

System.out.println(view); // [Alice, Bob]
```

不可修改视图阻止调用方通过 `view` 修改，但仍然反映底层集合的变化。

对应方法包括 `unmodifiableList()`、`unmodifiableSet()`、`unmodifiableMap()` 等。

选择依据：

- 调用方需要观察内部集合的后续变化，但不能直接修改：不可修改视图；
- 调用方需要稳定结果，不应受后续变化影响：`copyOf()` 快照；
- 直接声明少量固定值：`of()` 工厂。

`Arrays.asList()` 返回的固定大小列表仍允许替换元素，不属于不可修改集合，详见 [数组与 List 转换](./list.md#数组与-list-转换)。

## 构造时防御性复制

直接保存调用方提供的可变集合，会让外部修改影响对象内部状态。构造时用 `copyOf()` 隔离输入：

```java
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

构造时复制后，调用方继续修改原列表不会改变 `Team`。列表不可修改，元素 `String` 也不可变，因此访问器可以直接返回它。

## 不可修改集合不是深层不可变

集合复制只复制元素引用，不会冻结或自动复制元素对象：

```java
List<String> group = new ArrayList<>(List.of("Alice"));
List<List<String>> groups = List.copyOf(List.of(group));

group.set(0, "Bob");
System.out.println(groups); // [[Bob]]
```

外层列表不可修改，但它与输入共享内部列表。需要稳定的对象边界时，优先使用不可变元素类型；仅在构造时复制可变元素，仍不能阻止调用方通过访问器修改复制后的元素。

## 返回集合的 API 契约

方法签名 `List<User>` 不表达可变性，需要由 API 名称、文档和实现约定说明：

- 返回值能否修改；
- 是实时视图还是固定快照；
- 是否允许 `null`；
- 是否保证顺序；
- 元素是否与内部对象共享；
- 多线程读取期间是否稳定。

除非修改就是 API 的目的，否则公共方法通常不应直接暴露内部可修改集合。
