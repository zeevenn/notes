---
title: 遍历、比较与排序
date: 2026-08-05
category: java
---

集合遍历方式决定了能否安全删除元素、是否需要索引以及怎样表达转换。排序则依赖元素的自然顺序或外部 `Comparator`。

## 增强 `for` 循环

只需要依次读取元素时使用增强 `for`：

```java
List<String> names = new ArrayList<>(List.of("Bob", " ", "Alice"));

for (String name : names) {
    System.out.println(name);
}
```

增强 `for` 可以遍历数组，也可以遍历实现 `Iterable` 的类型；遍历集合时使用其 `Iterator`。循环变量只是当前元素值的局部变量，给它重新赋值不会替换列表元素：

```java
for (String name : names) {
    name = name.toUpperCase(); // 不会修改 names 中保存的引用
}
```

需要替换元素时使用索引、`ListIterator.set()` 或 `List.replaceAll()`。

## `Iterator`

需要在遍历中删除元素时，使用支持删除的迭代器。下面从前面的可修改列表中删除空白字符串：

```java
Iterator<String> iterator = names.iterator();

while (iterator.hasNext()) {
    String name = iterator.next();
    if (name.isBlank()) {
        iterator.remove();
    }
}

System.out.println(names); // [Bob, Alice]
```

`hasNext()` 检查是否还有元素，`next()` 取出下一个元素并移动迭代位置。`remove()` 删除最近一次 `next()` 返回的元素，每次 `next()` 之后至多调用一次；在首次 `next()` 之前删除或重复删除，会抛出 `IllegalStateException`。不支持删除的迭代器会抛出 `UnsupportedOperationException`。

不要在增强 `for` 中直接修改同一个集合的结构：

```java
for (String name : names) {
    if (name.isBlank()) {
        // names.remove(name); // 通常抛出 ConcurrentModificationException
    }
}
```

`ArrayList` 等集合的迭代器采用 fail-fast（尽早发现错误）机制，尽力检测遍历期间绕过迭代器执行的增删等结构修改。同一个线程也能触发 `ConcurrentModificationException`；没有抛出异常也不能证明修改是安全的。

只按条件删除时，可以使用集合支持的 `removeIf()`：

```java
names.removeIf(String::isBlank);
```

## `ListIterator`

`ListIterator` 的游标位于两个元素之间，支持双向移动和获取索引。在支持修改的列表上，`set()` 替换最近一次 `next()` 或 `previous()` 返回的元素：

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

`add()` 则在游标位置插入元素，插入后游标位于新元素之后：

```java
List<String> letters = new ArrayList<>(List.of("A", "C"));
ListIterator<String> cursor = letters.listIterator(1); // A | C
cursor.add("B");                                     // A B | C
System.out.println(cursor.next()); // C
System.out.println(letters);       // [A, B, C]
```

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

只需要键或值时分别使用 `keySet()`、`values()`。`Map.forEach()` 可以配合 Lambda 使用：

```java
scores.forEach((name, score) ->
        System.out.println(name + " = " + score));
```

遍历顺序由具体 Map 决定：`HashMap` 不保证顺序，`LinkedHashMap` 默认按插入顺序，`TreeMap` 按键排序。

## 自然顺序 `Comparable`

自然顺序是类型自身定义的默认比较规则，例如整数按数值大小、字符串按字典顺序。`Comparator.naturalOrder()` 使用这套规则：

```java
List<Integer> versions = new ArrayList<>(List.of(3, 1, 2));
versions.sort(Comparator.naturalOrder());
System.out.println(versions); // [1, 2, 3]
```

自定义类型可以实现 `Comparable<T>`，通过 `compareTo()` 定义自然顺序。下面按主版本号、次版本号依次比较：

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

比较规则必须自洽：交换比较对象后，结果符号相反；若 `a > b` 且 `b > c`，则必须有 `a > c`；比较为 `0` 的两个对象与第三个对象比较时，结果符号也必须一致。一般排序不强制比较结果与 `equals()` 一致；`TreeSet`、`TreeMap` 则将比较结果为 `0` 的元素或键视为相同，见 [Set 的比较规则](./set.md#treeset)。

## 外部顺序 `Comparator`

同一类型存在多个排序方式，或不便修改类型本身时，可以用 `Comparator<T>` 在外部定义比较规则：

```java
record User(String name, int age) {}

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

`comparingInt(User::age)` 先比较年龄，`thenComparing(User::name)` 仅在年龄相同时比较姓名。`nullableName` 处理的是姓名字段为 `null`，并不允许 `User` 对象本身为 `null`；后者需要在整个比较器外包装 `Comparator.nullsLast(byName)`。

## List.sort() 排序

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

`List.sort()` 保证稳定排序：比较结果为 `0` 的元素保留原来的相对顺序。它只要求列表支持替换元素，不要求支持增删，因此 `Arrays.asList()` 返回的固定大小列表也可以排序。`Collections.sort(list)` 是对应的工具类方法。

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
int result = Collections.binarySearch(values, 25); // -3
int insertionPoint = -result - 1;                 // 2
```

插入点是保持排序时新元素应插入的位置，只有返回值为负数时才使用该公式。如果排序和查找使用不同比较规则，结果没有保证。

## 集合自身的相等规则

- `List.equals()`：元素数量、顺序及每个位置的元素都相等；
- `Set.equals()`：包含相同元素，遍历顺序无关；
- `Map.equals()`：包含相同的键值映射，遍历顺序无关。

因此 `ArrayList` 与 `LinkedList` 可以相等，`HashSet` 与 `TreeSet` 也可以相等；相等性由接口契约决定，不要求实现类相同。

## 反向视图 [Java 21+]

Java 21 起可以通过 `List.reversed()` 反向遍历，见 [List 的首尾与反向视图](./list.md#首尾与反向视图-java-21)。
