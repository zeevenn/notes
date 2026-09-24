---
title: 数组
date: 2026-01-25
category: java
---

数组用来保存一组相同类型的元素，例如一组成绩。数组创建后长度固定，但其中的元素可以修改。

## 固定长度与默认值

`int[]` 表示元素为整数的数组。花括号直接列出初始元素，`new int[3]` 创建一个长度为 3 的数组：

```java
int[] zeros = new int[3];
int[] numbers = {10, 20, 30};
numbers[0] = 99;
System.out.println(zeros[0]);       // 0
System.out.println(numbers[0]);     // 99
System.out.println(numbers.length); // 3
```

元素没有显式赋值时，数值类型默认为零，`char` 为 `'\u0000'`，`boolean` 为 `false`，对象类型的元素为 `null`，表示该位置尚未指向对象。数组用 `numbers.length` 读取长度；字符串则用 `text.length()` 调用方法读取长度。

下标范围是 `0` 到 `length - 1`；上例读取 `numbers[3]` 会抛出 `ArrayIndexOutOfBoundsException`（数组下标越界异常）。需要改变长度时，可以创建新数组，再复制原有元素。

## 赋值与复制

数组变量保存的是访问数组的引用。`same = original` 会让两个变量指向同一个数组，修改其中一个位置时，两边看到的都是同一份数据。

```java
int[] original = {1, 2, 3};
int[] same = original;
same[0] = 9;
System.out.println(original[0]); // 9
```

要获得独立数组，可以使用标准库的 `Arrays.copyOf()`。`Arrays` 是集中提供数组操作的工具类，下面的 `import` 让代码可以直接使用它的简单名称。

```java
import java.util.Arrays;

int[] original = {1, 2, 3};
int[] copy = Arrays.copyOf(original, original.length);
copy[0] = 9;
System.out.println(original[0]); // 1
System.out.println(copy[0]);     // 9
```

`copyOf()` 的第二个参数指定新数组长度。长度更小时截去末尾元素，更大时以元素类型的默认值补齐。对象数组复制的是各个位置保存的对象引用，因此数组独立后，其中的对象仍可能共享。

## 内容比较与输出

`==` 检查两个变量是否指向同一个数组。数组的 `equals()` 也采用这个规则，不比较元素；逐个比较元素应使用 `Arrays.equals()`。

```java
import java.util.Arrays;

int[] first = {1, 2, 3};
int[] second = {1, 2, 3};
System.out.println(first == second);             // false
System.out.println(first.equals(second));        // false
System.out.println(Arrays.equals(first, second)); // true
System.out.println(Arrays.toString(first));      // [1, 2, 3]
```

直接打印数组不会列出所有元素。`Arrays.toString()` 生成上面这样的内容文本，适合查看一维数组。

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

数组与字符串互转见 [String：与数组互转](../standard-library/string.md#与数组互转)；数组与列表之间的转换见 [List：数组与 List 转换](../standard-library/list.md#数组与-list-转换)；方法参数中的 `int...` 写法见[方法：可变参数](./methods.md#可变参数)。

## 参考资料

- [Dev.java：Creating Arrays in Your Programs](https://dev.java/learn/language-basics/arrays/)
- [Java 17：Arrays](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Arrays.html)
