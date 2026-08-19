---
title: List
date: 2026-08-05
category: java
---

`List<E>` 表示具有稳定顺序、允许重复元素并支持索引访问的序列。

```java
import java.util.ArrayList;
import java.util.List;

List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Alice");
```

遍历顺序与列表顺序一致，索引从 `0` 开始。

## 创建列表

可修改的空列表：

```java
List<String> names = new ArrayList<>();
```

从已有集合复制：

```java
List<String> copied = new ArrayList<>(source);
```

创建不可修改列表：

```java
List<String> fixed = List.of("Alice", "Bob");
List<String> snapshot = List.copyOf(source);
```

`List.of()` 和 `List.copyOf()` 不允许 `null` 元素，也不支持增删改。它们不是 Java 列表字面量，而是接口提供的静态工厂方法。

## 常用操作

```java
List<String> names = new ArrayList<>();

names.add("Alice");          // 追加
names.add(0, "Admin");      // 在索引 0 插入
String first = names.get(0); // 读取
names.set(0, "Owner");      // 替换并返回旧值
boolean found = names.contains("Alice");
int index = names.indexOf("Alice");
String removed = names.remove(0);
boolean changed = names.remove("Alice");
int size = names.size();
```

索引必须处于方法允许的范围，否则抛出 `IndexOutOfBoundsException`。插入允许索引等于当前 `size()`，读取和替换不允许。

### `remove()` 的重载陷阱

`List<Integer>` 同时存在按索引删除和按元素删除：

```java
List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30));

numbers.remove(1);                  // 删除索引 1 的 20
numbers.remove(Integer.valueOf(10)); // 删除值 10
```

传入 `int` 会选择 `remove(int index)`。需要按整数值删除时，显式提供 `Integer`。

## `ArrayList`

`ArrayList` 使用可扩容数组保存元素，是普通列表的默认选择。

| 操作 | 典型复杂度 |
| --- | --- |
| `get(index)`、`set(index, value)` | `O(1)` |
| 末尾追加 | 摊还 `O(1)` |
| 在中间插入或删除 | `O(n)`，需要移动后续元素 |
| `contains()`、`indexOf()` | `O(n)` |

容量不足时会分配更大的内部数组并复制元素，因此单次追加偶尔是 `O(n)`，连续追加的平均成本仍为摊还 `O(1)`。

已知会加入大量元素时可以提供初始容量，但容量不是元素数量：

```java
List<User> users = new ArrayList<>(expectedSize);
System.out.println(users.size()); // 0
```

不要为了避免扩容随意设置过大的容量，这会浪费内存。

## `LinkedList`

`LinkedList` 使用双向链表，并同时实现 `List` 和 `Deque`。

| 操作 | 典型复杂度 |
| --- | --- |
| `get(index)` | `O(n)` |
| 首尾插入和删除 | `O(1)` |
| 已定位迭代器处插入和删除 | `O(1)` |
| 按值查找 | `O(n)` |

“链表中间插入是 `O(1)`”只在已经持有目标节点位置（例如 `ListIterator`）时成立；先按索引定位仍需要 `O(n)`。节点对象和指针也会带来额外内存与较差的缓存局部性。

普通列表通常优先 `ArrayList`。只需要队列或栈语义时，优先使用 `ArrayDeque`；确实需要在已定位位置频繁插入删除时，再评估 `LinkedList`。

## 首尾与反向视图 [Java 21+]

Java 21 起，`List` 作为 `SequencedCollection` 提供统一的首尾操作：

```java
String first = names.getFirst();
String last = names.getLast();
names.addFirst("Admin");
names.addLast("Guest");

List<String> reversed = names.reversed();
```

`reversed()` 返回反向顺序视图，不是副本。修改允许修改的原列表会反映到视图，反之亦然。

## `subList()` 是视图

```java
List<String> names = new ArrayList<>(List.of("A", "B", "C", "D"));
List<String> middle = names.subList(1, 3); // [B, C]

middle.set(0, "X");
System.out.println(names); // [A, X, C, D]
```

起始索引包含，结束索引不包含。`subList()` 与原列表共享数据；在视图之外对原列表做结构性修改后再使用视图，行为可能未定义并常抛出 `ConcurrentModificationException`。

需要独立列表时显式复制：

```java
List<String> copiedMiddle = new ArrayList<>(names.subList(1, 3));
```

## 数组与 List 转换

```java
String[] array = {"A", "B"};
List<String> fixedSize = Arrays.asList(array);
```

`Arrays.asList()` 返回由原数组支持的固定大小列表：允许 `set()`，不允许 `add()` 和 `remove()`，对数组或列表元素的替换会相互反映。

需要普通可修改列表：

```java
List<String> mutable = new ArrayList<>(Arrays.asList(array));
```

转回数组：

```java
String[] copied = names.toArray(String[]::new);
```

## 暴露列表的边界

直接返回内部可修改列表会让调用方绕过对象约束：

```java
public List<String> members() {
    return List.copyOf(members);
}
```

返回快照适合调用方只读且不应观察后续变化的场景。若要提供动态只读视图，可以使用 `Collections.unmodifiableList()`，但需要明确它会反映底层列表的变化。

## 相关内容

- [集合框架总览](./collections-overview.md)
- [遍历、比较与排序](./iteration-and-comparison.md)
- [不可修改集合与防御性复制](./immutable-collections.md)

## 参考资料

- [Dev.java：Extending Collection with List](https://dev.java/learn/api/collections-framework/lists/)
- [Java SE 17 API：List](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html)
- [Java SE 17 API：ArrayList](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ArrayList.html)
- [JEP 431：Sequenced Collections](https://openjdk.org/jeps/431)
