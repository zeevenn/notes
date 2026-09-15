---
title: 数组
date: 2026-01-25
category: java
---

数组用来保存一组相同类型的元素，例如一组成绩。数组创建后长度固定，但其中的元素可以修改。

## 固定长度与默认值

Java 数组可以保存基本类型值，也可以保存对象引用：

```java
int[] zeros = new int[3];
int[] numbers = {10, 20, 30};
numbers[0] = 99;
System.out.println(zeros[0]);       // 0
System.out.println(numbers[0]);     // 99
System.out.println(numbers.length); // 3
```

新数组的数值元素默认为零，`char` 为 `'\u0000'`，`boolean` 为 `false`，引用元素为 `null`。数组的长度通过字段 `length` 读取，[字符串](./string.md)则调用 `length()` 方法。

下标范围是 `0` 到 `length - 1`；上例读取 `numbers[3]` 会抛出 `ArrayIndexOutOfBoundsException`（数组下标越界异常）。需要改变长度时，要创建新数组或改用[集合](../standard-library/collections-overview.md)。

## 复制、内容比较与输出

数组赋值只复制引用。`Arrays.copyOf()` 才会创建新的数组；`Arrays` 是 `java.util` 包中的数组工具类：

```java
import java.util.Arrays;

int[] original = {1, 2, 3};
int[] same = original;
int[] copy = Arrays.copyOf(original, original.length);
System.out.println(original == same);          // true
System.out.println(original == copy);          // false
System.out.println(original.equals(copy));     // false：数组没有重写内容比较
System.out.println(Arrays.equals(original, copy)); // true：逐个比较元素

copy[0] = 9;
System.out.println(Arrays.toString(original)); // [1, 2, 3]
System.out.println(Arrays.toString(copy));     // [9, 2, 3]
```

直接打印 `int[]` 不会列出元素，使用 `Arrays.toString()` 才能得到上面的输出。对于对象数组，复制的元素仍是对象引用，不会复制对象本身，见[引用类型与对象](./reference-types.md)。

## 排序、查找与区间复制

```java
import java.util.Arrays;

int[] numbers = {5, 2, 8, 1, 9};
Arrays.sort(numbers); // 修改原数组
System.out.println(Arrays.toString(numbers)); // [1, 2, 5, 8, 9]
System.out.println(Arrays.binarySearch(numbers, 5)); // 2

int[] middle = Arrays.copyOfRange(numbers, 1, 3);
System.out.println(Arrays.toString(middle)); // [2, 5]：包含下标 1，不包含下标 3

Arrays.fill(numbers, 10);
System.out.println(Arrays.toString(numbers)); // [10, 10, 10, 10, 10]
System.out.println(Arrays.toString(middle));  // [2, 5]：副本不受影响
```

`binarySearch()` 使用二分查找，前提是数组已经按相同规则排序；未排序时结果没有保证。`sort()` 和 `fill()` 修改原数组，`copyOf()` 和 `copyOfRange()` 返回新数组。

## 多维数组

Java 的二维数组是“数组的数组”，每一行可以有不同长度：

```java
import java.util.Arrays;

int[][] rows = {{1, 2}, {3, 4, 5}};
System.out.println(rows.length);    // 2：行数
System.out.println(rows[0].length); // 2：第一行长度
System.out.println(rows[1].length); // 3：第二行长度
System.out.println(Arrays.deepToString(rows)); // [[1, 2], [3, 4, 5]]
```

嵌套数组的内容输出使用 `Arrays.deepToString()`，内容比较使用 `Arrays.deepEquals()`。

数组与字符串互转见 [String：与数组互转](./string.md#与数组互转)；数组与列表之间的转换见 [List：数组与 List 转换](../standard-library/list.md#数组与-list-转换)；方法参数中的 `int...` 写法见[方法：可变参数](./methods.md#可变参数)。

## 参考资料

- [Dev.java：Creating Arrays in Your Programs](https://dev.java/learn/language-basics/arrays/)
- [Java 17：Arrays](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Arrays.html)
