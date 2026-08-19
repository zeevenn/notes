---
title: 不可修改集合与防御性复制
date: 2026-08-05
category: java
---

集合 API 中需要区分三件事：调用方能否通过当前引用修改、底层数据是否仍会变化，以及集合中的元素对象是否可变。

```text
不可修改引用 ≠ 独立快照 ≠ 元素深层不可变
```

Java 标准库通常使用“不可修改”（unmodifiable）描述不支持增删改的集合。即使集合结构不能修改，其中保存的可变对象仍可能改变状态。

## `List.of()`、`Set.of()` 与 `Map.of()`

Java 9 起可以创建紧凑的不可修改集合：

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

修改会抛出 `UnsupportedOperationException`：

```java
// names.add("Carol");
// scores.put("Carol", 88);
```

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

对应方法包括 `List.copyOf()`、`Set.copyOf()` 和 `Map.copyOf()`。它们创建与后续源集合结构变化隔离的不可修改结果，并拒绝 `null`。

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

不可修改视图阻止调用方通过 `view` 修改，但仍然反映底层集合的变化：

```java
// view.add("Carol"); // UnsupportedOperationException
source.add("Carol");  // view 随之变化
```

对应方法包括 `unmodifiableList()`、`unmodifiableSet()`、`unmodifiableMap()` 等。

选择依据：

- 调用方需要观察内部集合的后续变化，但不能直接修改：不可修改视图；
- 调用方需要稳定结果，不应受后续变化影响：`copyOf()` 快照；
- 直接声明少量固定值：`of()` 工厂。

## `Arrays.asList()` 只是固定大小

```java
String[] array = {"A", "B"};
List<String> list = Arrays.asList(array);
```

它返回由数组支持的固定大小列表：

```java
list.set(0, "X");           // 允许
System.out.println(array[0]); // X

// list.add("C");           // UnsupportedOperationException
// list.remove("B");        // UnsupportedOperationException
```

它既不是普通可变 `ArrayList`，也不是完全不可修改集合。需要可变副本时：

```java
List<String> mutable = new ArrayList<>(Arrays.asList(array));
```

需要不可修改快照时：

```java
List<String> snapshot = List.copyOf(Arrays.asList(array));
```

## 不可修改集合不是深层不可变

```java
List<User> users = List.of(new User("Alice"));
users.get(0).setName("Bob");
```

列表结构没有变化，但其中的 `User` 状态发生了变化。建立深层不可变边界需要元素本身不可变，或者在边界处复制元素。

```java
public record Team(List<Member> members) {
    public Team {
        List<Member> copied = new ArrayList<>(members.size());
        for (Member member : members) {
            copied.add(member.copy());
        }
        members = List.copyOf(copied);
    }
}
```

是否进行深复制取决于对象所有权。盲目深复制大型对象图可能成本很高，也可能无法定义共享资源的复制语义；优先使用不可变值对象和清晰的所有权边界。

## 构造时防御性复制

保存调用方提供的可变集合会泄露内部状态：

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

构造时复制后，调用方继续修改原列表不会改变 `Team`。字段本身已经是不可修改集合，因此访问器可以直接返回它。

如果元素可变且不应被共享，还需要复制元素或改用不可变元素类型。

## 返回集合的 API 契约

方法签名 `List<User>` 不表达可变性，需要由 API 名称、文档和实现约定说明：

- 返回值能否修改；
- 是实时视图还是固定快照；
- 是否允许 `null`；
- 是否保证顺序；
- 元素是否与内部对象共享；
- 多线程读取期间是否稳定。

除非修改就是 API 的目的，否则公共方法通常不应直接暴露内部可修改集合。

## 常见错误

- 把 `List.of()` 当成可修改列表；
- 把 `Arrays.asList()` 当成 `ArrayList`；
- 认为 `Collections.unmodifiableList()` 会复制数据；
- 认为不可修改集合会冻结其中的对象；
- 为了返回只读结果，每次都复制大型集合，却没有评估调用频率和所有权；
- 返回内部可修改集合，让调用方绕过验证和不变量。

## 相关内容

- [List](./list.md)
- [Set](./set.md)
- [Map](./map.md)
- [引用类型与对象](../language/reference-types.md)
- [Record、密封类与模式匹配](../language/records-sealed-patterns.md)

## 参考资料

- [Dev.java：Creating and Processing Data with Collection Factory Methods](https://dev.java/learn/api/collections-framework/immutable-collections/)
- [Java SE 17 Core Libraries Guide：Unmodifiable Collections](https://docs.oracle.com/en/java/javase/17/core/creating-immutable-lists-sets-and-maps.html)
- [Java SE 17 API：Collections](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Collections.html)
