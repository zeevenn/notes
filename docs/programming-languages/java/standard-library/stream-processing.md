---
title: Stream 与集合数据处理
date: 2026-09-29
category: java
---

从订单列表中筛选已支付订单，再提取编号，可以把处理步骤连成一条 Stream 流水线。集合保存数据，Stream 描述如何处理这些数据；操作中的判断和转换由 [Lambda 与方法引用](../language/lambda-and-method-references.md) 提供。

## 从订单列表得到处理结果

下面的例子共用这组订单，金额以分为单位：

```java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

record Order(String id, String customer, long totalCents,
             boolean paid, List<String> items) {}

List<Order> orders = List.of(
        new Order("A001", "Alice", 1200, true, List.of("book", "pen")),
        new Order("A002", "Bob", 800, false, List.of("pen")),
        new Order("A003", "Alice", 2000, true, List.of("notebook", "pen")),
        new Order("A004", "Carol", 1500, true, List.of("book")));

List<String> paidIds = orders.stream()
        .filter(Order::paid)
        .map(Order::id)
        .toList();

System.out.println(paidIds); // [A001, A003, A004]
```

这条处理链由三部分组成：

| 部分 | 示例 | 作用 |
| --- | --- | --- |
| 数据源 | `orders.stream()` | 从订单列表创建流 |
| 中间操作 | `filter()`、`map()` | 筛选订单，再把每个订单转换成编号 |
| 终止操作 | `toList()` | 执行处理并生成结果列表 |

`filter()` 保留满足条件的元素，`map()` 将每个元素转换成另一个值，因此这里从 `Stream<Order>` 变成了 `Stream<String>`。原来的 `orders` 不会因为筛选而删除未支付订单。

## 排序与展开

### 按金额排序并取前两项

```java
List<String> topPaidIds = orders.stream()
        .filter(Order::paid)
        .sorted(Comparator.comparingLong(Order::totalCents).reversed())
        .limit(2)
        .map(Order::id)
        .toList();

System.out.println(topPaidIds); // [A003, A004]
```

`sorted()` 按比较器排序，`limit(2)` 最多保留两个元素。这里先排序再截取，得到金额最高的两笔已支付订单；如果先截取再排序，就只是在最先遇到的两笔订单中排序。

### `flatMap()` 展开一对多结果

每个订单包含多个商品。提取所有订单涉及的商品名，并去重、排序：

```java
List<String> itemNames = orders.stream()
        .flatMap(order -> order.items().stream())
        .distinct()
        .sorted()
        .toList();

System.out.println(itemNames); // [book, notebook, pen]
```

`map(Order::items)` 得到的是 `Stream<List<String>>`，每个元素仍是一整个列表。`flatMap()` 让每个订单先产生商品流，再把这些流展开成一个 `Stream<String>`。

`distinct()` 按元素的 `equals()` 语义去重；它不会根据业务字段自动判断两个对象是否相同。

## 汇总、判断与查找

汇总已支付金额时，先用 `mapToLong()` 转成基本类型流 `LongStream`，再求和：

```java
long paidTotal = orders.stream()
        .filter(Order::paid)
        .mapToLong(Order::totalCents)
        .sum();

long paidCount = orders.stream()
        .filter(Order::paid)
        .count();

System.out.println(paidTotal); // 4700
System.out.println(paidCount); // 3
```

数值流还提供 `min()`、`max()`、`average()` 等操作。`sum()` 对空流返回 `0`；最值和平均值可能没有结果，使用 Optional 类型表达。

如果只需要判断是否存在，不必先收集整个结果列表：

```java
boolean hasUnpaid = orders.stream().anyMatch(order -> !order.paid());

String firstPaidId = orders.stream()
        .filter(Order::paid)
        .map(Order::id)
        .findFirst()
        .orElse("none");

System.out.println(hasUnpaid);  // true
System.out.println(firstPaidId); // A001
```

`anyMatch()` 在找到满足条件的元素后即可结束；`findFirst()` 返回第一个结果。后者的返回值是 `Optional<String>`，表示可能有值，也可能为空；这里用 `orElse("none")` 处理没有已支付订单的情况。

## 收集为集合与 Map

### 结果列表的可修改性

`Stream.toList()` 返回不可修改列表。需要继续添加、删除元素时，可以指定结果容器：

```java
List<String> editableIds = orders.stream()
        .filter(Order::paid)
        .map(Order::id)
        .collect(Collectors.toCollection(ArrayList::new));

editableIds.add("A005");
System.out.println(editableIds); // [A001, A003, A004, A005]
```

`collect()` 按收集规则构造结果；`Collectors` 提供常见规则。另一种常见写法 `collect(Collectors.toList())` 不保证返回列表的具体类型或可修改性，需要可变结果时使用上面的明确形式。集合与元素的可变性区别见 [不可修改集合与防御性复制](./immutable-collections.md)。

### 按订单编号建立索引

```java
Map<String, Order> ordersById = orders.stream()
        .collect(Collectors.toMap(Order::id, order -> order));

System.out.println(ordersById.get("A003").customer()); // Alice
```

`toMap()` 的两个函数分别生成键和值。这个例子要求订单编号唯一；两参数形式遇到重复键会抛出 `IllegalStateException`。如果一个键需要对应多条记录，应使用分组。

## 分组与组内汇总

按客户把已支付订单分组：

```java
Map<String, List<Order>> paidByCustomer = orders.stream()
        .filter(Order::paid)
        .collect(Collectors.groupingBy(Order::customer));

System.out.println(paidByCustomer.get("Alice").size()); // 2
```

`groupingBy()` 用客户名作为键，将同一客户的订单收集成列表。如果只关心每位客户的总金额，可以为每个组指定汇总规则：

```java
Map<String, Long> paidTotals = orders.stream()
        .filter(Order::paid)
        .collect(Collectors.groupingBy(
                Order::customer,
                Collectors.summingLong(Order::totalCents)));

System.out.println(paidTotals.get("Alice")); // 3200
System.out.println(paidTotals.get("Carol")); // 1500
```

第二个参数在每个组内执行，因此结果从 `Map<String, List<Order>>` 变成 `Map<String, Long>`。这些默认 Map 收集器不保证键的遍历顺序，输出顺序有要求时应另行排序或指定 Map 实现。

## 惰性执行与一次性消费

创建流、调用中间操作时，只是在描述处理步骤；终止操作才触发结果计算：

```java
Stream<Order> paidOrders = orders.stream().filter(Order::paid);
// 尚未执行筛选

List<String> selectedIds = paidOrders.map(Order::id).toList();
System.out.println(selectedIds); // [A001, A003, A004]
```

终止操作完成后，这条流就已经消费，不能再对 `paidOrders` 求和或计数。需要再次处理同一批数据时，从 `orders.stream()` 创建新的流，而不是保存一个 Stream 反复使用。

惰性执行也不意味着所有操作都能提前结束。筛选后查找第一个结果可以只处理部分数据；排序通常需要先取得全部输入，不能因为后面有 `limit(2)` 就认为只读取了两个元素。

## 与普通循环的取舍

筛选、转换、分组和汇总能清楚地表达成一条数据处理链时，Stream 可以减少手动维护中间集合的代码。处理过程中有复杂分支、多个相互影响的变量、逐项异常恢复或外部 I/O 时，普通循环往往更直接。

不要在处理链中增删正在遍历的源集合，也不要为了收集结果，在 `forEach()` 中不断向外部列表追加；使用 `toList()` 或 `collect()` 表达结果的构造。Stream 本身也不会让集合中的元素变成不可变对象。
