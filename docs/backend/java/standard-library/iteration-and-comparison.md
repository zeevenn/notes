---
title: 遍历、比较与排序
date: 2026-08-05
category: java
---

集合遍历方式决定了能否安全删除元素、是否需要索引以及怎样表达转换。排序则依赖元素的自然顺序或外部 `Comparator`。

## 增强 `for` 循环

只需要依次读取元素时使用增强 `for`：

```java
for (String name : names) {
    System.out.println(name);
}
```

它适用于实现 `Iterable` 的类型，内部通过 `Iterator` 遍历。循环变量只是当前元素值的局部变量，给它重新赋值不会替换列表元素：

```java
for (String name : names) {
    name = name.toUpperCase(); // 不会修改 names 中保存的引用
}
```

需要替换元素时使用索引、`ListIterator.set()` 或 `List.replaceAll()`。

## `Iterator`

需要在遍历中安全删除当前元素时显式使用迭代器：

```java
Iterator<String> iterator = names.iterator();

while (iterator.hasNext()) {
    String name = iterator.next();
    if (name.isBlank()) {
        iterator.remove();
    }
}
```

不要在增强 `for` 中直接修改同一个集合的结构：

```java
for (String name : names) {
    if (name.isBlank()) {
        // names.remove(name); // 通常抛出 ConcurrentModificationException
    }
}
```

通用集合的 fail-fast 迭代器会尽力检测迭代期间的意外结构修改。它是错误检测机制，不是并发安全保证，也不能把捕获 `ConcurrentModificationException` 当成控制流程。

只按条件删除时可以直接使用：

```java
names.removeIf(String::isBlank);
```

## `ListIterator`

`ListIterator` 支持双向移动、获取索引，并能在当前位置安全地插入或替换元素：

```java
ListIterator<String> iterator = names.listIterator();

while (iterator.hasNext()) {
    String name = iterator.next();
    if (name.isBlank()) {
        iterator.set("unknown");
    }
}
```

反向遍历：

```java
ListIterator<String> iterator = names.listIterator(names.size());
while (iterator.hasPrevious()) {
    System.out.println(iterator.previous());
}
```

### 反向视图 [Java 21+]

Java 21 起，对具有相遇顺序的集合还可以使用 `reversed()` 视图。Java 17 需要使用反向 `ListIterator`、倒序索引循环，或者复制后调用 `Collections.reverse()`。

## 按索引遍历

确实需要位置或修改对应元素时使用索引：

```java
for (int index = 0; index < names.size(); index++) {
    names.set(index, names.get(index).trim());
}
```

这适合 `ArrayList`，但对 `LinkedList` 反复调用 `get(index)` 会导致整体 `O(n²)`。不需要索引时优先增强 `for` 或迭代器。

## 遍历 Map

同时需要键和值时遍历 `entrySet()`：

```java
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    String name = entry.getKey();
    int score = entry.getValue();
    System.out.println(name + " = " + score);
}
```

只需要键或值时分别使用 `keySet()`、`values()`。Lambda 形式：

```java
scores.forEach((name, score) ->
        System.out.println(name + " = " + score));
```

遍历顺序由具体 Map 决定：`HashMap` 不保证顺序，`LinkedHashMap` 有明确相遇顺序，`TreeMap` 按键排序。

## 自然顺序 `Comparable`

类型只有一个明确的默认顺序时，可以实现 `Comparable<T>`：

```java
public record Version(int major, int minor) implements Comparable<Version> {
    @Override
    public int compareTo(Version other) {
        int byMajor = Integer.compare(major, other.major);
        if (byMajor != 0) {
            return byMajor;
        }
        return Integer.compare(minor, other.minor);
    }
}
```

`compareTo()` 返回负数、零或正数，只表达大小关系。不要用减法比较整数：

```java
// return left - right; // 可能整数溢出
return Integer.compare(left, right);
```

比较关系应满足反对称性、传递性和一致性。用于 `TreeSet`、`TreeMap` 时，比较结果为 `0` 会被当作相同元素或键，因此自然顺序最好与 `equals()` 一致。

## 外部顺序 `Comparator`

同一类型存在多个排序方式时使用 `Comparator<T>`：

```java
Comparator<User> byName = Comparator.comparing(User::name);

Comparator<User> byAgeThenName =
        Comparator.comparingInt(User::age)
                  .thenComparing(User::name);
```

常用组合方法：

```java
Comparator<User> descendingAge =
        Comparator.comparingInt(User::age).reversed();

Comparator<User> nullableName =
        Comparator.comparing(
                User::name,
                Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
```

注意 `reversed()` 作用于它之前构造出的整个比较器：

```java
Comparator<User> byAgeDescThenNameAsc =
        Comparator.comparingInt(User::age)
                  .reversed()
                  .thenComparing(User::name);
```

## 排序 List

原地排序会修改可变列表：

```java
names.sort(Comparator.naturalOrder());
users.sort(Comparator.comparing(User::name));
```

不应修改输入时先复制：

```java
List<User> sorted = new ArrayList<>(users);
sorted.sort(Comparator.comparing(User::name));
```

`Collections.sort(list)` 是较早的静态形式；现代代码可以直接调用 `list.sort(comparator)`。

不可修改列表不支持原地排序：

```java
List<String> names = List.of("Bob", "Alice");
// names.sort(Comparator.naturalOrder()); // UnsupportedOperationException
```

## 二分查找的前置条件

`Collections.binarySearch()` 要求列表已经按同一个顺序排序：

```java
List<Integer> values = new ArrayList<>(List.of(30, 10, 20));
values.sort(Comparator.naturalOrder());

int index = Collections.binarySearch(values, 20); // 1
```

未找到时返回负数，可由它计算插入点：

```java
int result = Collections.binarySearch(values, 25);
int insertionPoint = -result - 1;
```

如果排序和查找使用不同比较规则，返回结果没有意义。

## 集合自身的相等规则

- `List.equals()`：元素数量、顺序及每个位置的元素都相等；
- `Set.equals()`：包含相同元素，遍历顺序无关；
- `Map.equals()`：包含相同的键值映射，遍历顺序无关。

因此 `ArrayList` 与 `LinkedList` 可以相等，`HashSet` 与 `TreeSet` 也可以相等；相等性由接口契约决定，不要求实现类相同。

## 相关内容

- [List](./list.md)
- [Set](./set.md)
- [Map](./map.md)
- [Queue 与 Deque](./queue-and-deque.md)
- [Lambda 与方法引用](../language/lambda-and-method-references.md)

## 参考资料

- [Dev.java：Iterating over the Elements of a Collection](https://dev.java/learn/api/collections-framework/iterating/)
- [Java SE 17 API：Comparator](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Comparator.html)
- [Java SE 17 API：Collections](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Collections.html)
