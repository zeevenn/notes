---
title: Queue 与 Deque
date: 2026-08-05
category: java
---

`Queue<E>` 表示等待处理的元素容器，通常以先进先出（FIFO）顺序取出；`Deque<E>` 是双端队列，可以在首尾两端插入、查看和删除元素，也能表达后进先出（LIFO）栈。

## Queue 的两组方法

队列为失败情况提供两组操作：一组抛出异常，另一组返回特殊值。

| 操作 | 失败时抛异常 | 失败时返回特殊值 |
| --- | --- | --- |
| 插入 | `add(e)` | `offer(e)` 返回 `false` |
| 删除队首 | `remove()` | `poll()` 返回 `null` |
| 查看队首 | `element()` | `peek()` 返回 `null` |

```java
Queue<String> jobs = new ArrayDeque<>();

jobs.offer("compile");
jobs.offer("test");

String next = jobs.peek(); // compile，不删除
String first = jobs.poll(); // compile
String second = jobs.poll(); // test
String missing = jobs.poll(); // null
```

容量受限队列中，`offer()` 可以明确表示“当前无法加入”。普通读取流程通常使用 `poll()` 和 `peek()`，避免把空队列当成异常。

队列实现通常不允许 `null`，因为 `poll()` 和 `peek()` 使用 `null` 表示为空。

## `ArrayDeque`

`ArrayDeque` 使用可扩容循环数组实现 `Deque`，是单线程普通队列和栈的默认选择。

```java
Deque<String> deque = new ArrayDeque<>();

deque.addLast("A");
deque.addLast("B");

System.out.println(deque.removeFirst()); // A
```

它不允许 `null`，不是线程安全的。大多数首尾操作为摊还 `O(1)`；按值查找和删除需要 `O(n)`。

与 `LinkedList` 相比，`ArrayDeque` 通常对象开销更低、缓存局部性更好。与旧的 `Stack` 相比，它提供更完整的双端队列接口且没有继承 `Vector` 的历史负担。

## Deque 的首尾操作

`Deque` 同样为容量或空队列失败提供异常与特殊值两套方法。

| 位置 | 插入 | 查看 | 删除 |
| --- | --- | --- | --- |
| 首端，异常形式 | `addFirst(e)` | `getFirst()` | `removeFirst()` |
| 首端，特殊值形式 | `offerFirst(e)` | `peekFirst()` | `pollFirst()` |
| 尾端，异常形式 | `addLast(e)` | `getLast()` | `removeLast()` |
| 尾端，特殊值形式 | `offerLast(e)` | `peekLast()` | `pollLast()` |

方法名明确写出操作端点，适合实现滑动窗口、撤销栈、广度或深度遍历等结构。

## 把 Deque 当作队列

先进先出：尾部加入，首部取出。

```java
Deque<Task> queue = new ArrayDeque<>();

queue.offerLast(firstTask);
queue.offerLast(secondTask);

Task task = queue.pollFirst();
```

也可以通过 `Queue` 接口声明：

```java
Queue<Task> queue = new ArrayDeque<>();
queue.offer(firstTask);
Task task = queue.poll();
```

当调用方只需要 FIFO 语义时，使用较窄的 `Queue` 类型能减少误用另一端的机会。

## 把 Deque 当作栈

后进先出：同一端压入和弹出。

```java
Deque<String> stack = new ArrayDeque<>();

stack.push("first");
stack.push("second");

System.out.println(stack.peek()); // second
System.out.println(stack.pop());  // second
System.out.println(stack.pop());  // first
```

对应关系：

| 栈操作 | Deque 操作 |
| --- | --- |
| `push(e)` | `addFirst(e)` |
| `pop()` | `removeFirst()` |
| `peek()` | `peekFirst()` |

新代码应优先 `Deque`/`ArrayDeque`，不使用遗留的 `Stack` 类。

## `PriorityQueue`

`PriorityQueue` 每次从队首取出自然顺序最小或比较器优先级最高的元素，不是普通 FIFO 队列。

```java
Queue<Task> tasks = new PriorityQueue<>(
        Comparator.comparingInt(Task::priority)
                  .thenComparing(Task::createdAt));

tasks.offer(lowPriorityTask);
tasks.offer(highPriorityTask);

Task next = tasks.poll();
```

插入和删除队首为 `O(log n)`，查看队首为 `O(1)`。

遍历 `PriorityQueue` 不保证得到完整排序顺序：

```java
for (Task task : tasks) {
    // 这里的迭代顺序不保证按 priority 排好
}
```

需要按优先级依次处理时反复调用 `poll()`；需要保留队列同时得到排序快照时，复制后再 `poll()` 或复制到列表并排序。

比较结果为 `0` 的元素仍可重复存在。优先级相同元素的取出顺序没有稳定保证，需要稳定规则时在比较器中加入序号或时间等次级条件。

## 队列与并发

`ArrayDeque` 和 `PriorityQueue` 不支持无同步的多线程共享修改。并发生产者/消费者通常需要：

- `ArrayBlockingQueue`：固定容量数组阻塞队列；
- `LinkedBlockingQueue`：可选容量的链式阻塞队列；
- `ConcurrentLinkedQueue`：非阻塞无界队列；
- `DelayQueue`、`PriorityBlockingQueue`：具有特殊调度语义的阻塞队列。

选择并发队列必须同时考虑容量、背压、阻塞、关闭和取消策略，不能只替换类名。

## 实现选择

| 需求 | 选择 |
| --- | --- |
| 单线程 FIFO 队列 | `Queue` + `ArrayDeque` |
| 单线程双端队列或栈 | `Deque` + `ArrayDeque` |
| 每次处理最高优先级元素 | `PriorityQueue` |
| 多线程生产者/消费者 | 根据容量和阻塞语义选择 `BlockingQueue` |

## 相关内容

- [集合框架总览](./collections-overview.md)
- [List](./list.md)
- [遍历、比较与排序](./iteration-and-comparison.md)

## 参考资料

- [Dev.java：Storing Elements in Stacks and Queues](https://dev.java/learn/api/collections-framework/stacks-queues/)
- [Java SE 17 API：Queue](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Queue.html)
- [Java SE 17 API：Deque](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html)
- [Java SE 17 API：ArrayDeque](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ArrayDeque.html)
