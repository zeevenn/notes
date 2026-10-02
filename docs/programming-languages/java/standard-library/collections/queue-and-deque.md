---
title: Queue 与 Deque
date: 2026-08-05
category: java
---

`Queue` 通过队首取出下一项，`Deque` 在此基础上提供首尾两端操作。`ArrayDeque` 用循环数组实现双端队列，`PriorityQueue` 用堆让最小元素位于队首；`LinkedList` 也实现 Deque，其节点连接逻辑见 [List](./list.md#linkedlist)。

下面沿 OpenJDK 源码分析数组下标、扩容和堆调整。`ArrayDeque` 与 `PriorityQueue` 都不允许 `null`，也不提供线程安全的共享修改。

## `ArrayDeque`

### 循环数组、`head` 与 `tail`

[`ArrayDeque` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/ArrayDeque.java) 保存一个数组和两个下标：

```java
transient Object[] elements;
transient int head;
transient int tail;
```

`head` 指向第一个元素，`tail` 指向尾部下一个可写位置。有效元素不一定是一段从小下标到大下标的区域：走到数组尾部之后，还可以绕回下标 `0`。

通常保留至少一个空槽位，空队列用 `head == tail` 表示。插入临时填满最后空位时，会立即扩容，恢复“空位分隔首尾”的状态；数组中未使用的位置为 `null`。

默认构造分配长度为 `17` 的数组，初始可以容纳 `16` 个元素。这里的数组长度不要求为 2 的幂，索引回绕通过分支处理：

```java
static final int inc(int i, int modulus) {
    if (++i >= modulus) i = 0;
    return i;
}
```

因此不能把旧实现中 `(index + 1) & (length - 1)` 的位运算直接套到这里。`size()` 则计算 `tail - head`，结果为负时再加上数组长度。

### 尾插与头取

尾部插入写入 `tail`，再把它向后移动一个位置：

```java
public void addLast(E e) {
    if (e == null)
        throw new NullPointerException();
    final Object[] es = elements;
    es[tail] = e;
    if (head == (tail = inc(tail, es.length)))
        grow(1);
}
```

移动后首尾相遇，说明本次插入用完空位，需要 `grow(1)`。头部取出则读取 `head`，清空槽位，再向后移动：

```java
public E pollFirst() {
    final Object[] es;
    final int h;
    E e = elementAt(es = elements, h = head);
    if (e != null) {
        es[h] = null;
        head = inc(h, es.length);
    }
    return e;
}
```

取到 `null` 表示队列为空，直接返回，不移动下标。正因为空槽和空结果都依赖 `null`，这个实现拒绝插入 `null` 元素。

例如长度为 `5` 的数组在 `head = 3`、`tail = 1` 时，元素按下标 `3、4、0` 排列。取出队首只需清空位置 `3` 并把 `head` 改为 `4`，不必把后面的元素整体左移。

### 头插与尾取

`head` 指向已有的首元素，所以头部插入必须先向前移动，再写入新值：

```java
public void addFirst(E e) {
    if (e == null)
        throw new NullPointerException();
    final Object[] es = elements;
    es[head = dec(head, es.length)] = e;
    if (head == tail)
        grow(1);
}
```

`dec()` 在下标 `0` 向前移动时返回数组最后一个位置。与尾插一样，写入后首尾相遇才触发扩容。

`tail` 指向空位，因此尾部删除也要先向前找到最后一个元素：

```java
public E pollLast() {
    final Object[] es;
    final int t;
    E e = elementAt(es = elements, t = dec(tail, es.length));
    if (e != null)
        es[tail = t] = null;
    return e;
}
```

找到非空元素后，才清空槽位并更新 `tail`；队列为空时保持下标不动。这四个首尾方法构成了队列和栈操作的基础。

### 扩容与回绕数据搬迁

`grow()` 先复制数组，再处理跨越尾部的有效区间：

```java
private void grow(int needed) {
    final int oldCapacity = elements.length;
    int newCapacity;
    int jump = (oldCapacity < 64) ? (oldCapacity + 2) : (oldCapacity >> 1);
    if (jump < needed
        || (newCapacity = (oldCapacity + jump)) - MAX_ARRAY_SIZE > 0)
        newCapacity = newCapacity(needed, jump);
    final Object[] es = elements = Arrays.copyOf(elements, newCapacity);
    if (tail < head || (tail == head && es[head] != null)) {
        int newSpace = newCapacity - oldCapacity;
        System.arraycopy(es, head,
                         es, head + newSpace,
                         oldCapacity - head);
        for (int i = head, to = (head += newSpace); i < to; i++)
            es[i] = null;
    }
}
```

小数组的增长量为 `oldCapacity + 2`，新长度相当于旧长度的两倍再加 `2`；达到 `64` 后，期望增长量改为旧长度的一半。最低空间需求和大数组边界可能使结果不同。

如果数据发生回绕，就把旧数组 `[head, oldCapacity)` 的那一段搬到新数组末端，调整 `head`，并清空原位置；数组前半段的数据保持原位。这样无需把所有数据重新排成从下标 `0` 开始的一段，也能维持正确的首尾关系。

通常的首尾操作只读写一个位置，为 `O(1)`；扩容需要复制数组，单次为 `O(n)`，连续插入的摊还成本为 `O(1)`。按值查找、删除仍需要扫描元素；删除内部位置时还要移动距离较近的一侧，不能套用首尾删除的复杂度。

## 把 Deque 当作队列

先进先出对应“尾部加入、头部取出”。在 ArrayDeque 中，`offer()` 委托给 `offerLast()`，`poll()` 委托给 `pollFirst()`，因此 Queue 接口与首尾操作共用同一套循环数组逻辑。

ArrayDeque 没有固定容量上限，空间不足时扩容；构造参数只是初始容量，不会让 `offer()` 在达到该数值时返回 `false`。

## 把 Deque 当作栈

后进先出对应在同一端压入和弹出。ArrayDeque 的栈方法直接委托给首端操作：

```java
public void push(E e) {
    addFirst(e);
}
```

```java
public E pop() {
    return removeFirst();
}
```

因此栈操作也不需要独立的存储结构。历史类型 `Stack` 继承 Vector，普通栈需求使用 Deque 即可。

## `PriorityQueue`

### 数组表示的二叉堆

[`PriorityQueue` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/PriorityQueue.java) 同样使用数组，但数组表示的是完全二叉树：除最后一层外每层填满，最后一层从左到右排列。

```java
transient Object[] queue;
int size;
private final Comparator<? super E> comparator;
```

下标为 `k` 的节点，其父节点是 `(k - 1) >>> 1`，左右孩子是 `2 * k + 1` 和 `2 * k + 2`。小顶堆只要求父节点不大于孩子，根节点 `queue[0]` 就是最小元素；兄弟节点之间、不同子树之间不必有序。

`comparator` 非空时按外部比较规则维护堆，否则使用元素的自然顺序。反向比较器可以让数值较大的元素先出队，但底层仍是“比较器认定的最小值在根部”。

### 入队：尾部空位开始上浮

```java
public boolean offer(E e) {
    if (e == null)
        throw new NullPointerException();
    modCount++;
    int i = size;
    if (i >= queue.length)
        grow(i + 1);
    siftUp(i, e);
    size = i + 1;
    return true;
}
```

`i = size` 是新元素的候选位置。容量不足时先扩容，再通过 `siftUp()` 选择自然顺序或比较器路径。自然顺序版本如下：

```java
private static <T> void siftUpComparable(int k, T x, Object[] es) {
    Comparable<? super T> key = (Comparable<? super T>) x;
    while (k > 0) {
        int parent = (k - 1) >>> 1;
        Object e = es[parent];
        if (key.compareTo((T) e) >= 0)
            break;
        es[k] = e;
        k = parent;
    }
    es[k] = key;
}
```

新元素小于父节点时，把父节点下移，继续向上寻找新元素的位置；直到父节点不再大于它，或到达根部，再写入新元素。每次移动跨越一层，堆高为 `O(log n)`。

例如堆数组 `[2, 5, 3]` 插入 `1`，先把父节点 `5` 下移，再把根 `2` 下移，最后得到 `[1, 2, 3, 5]`。这里恰好整体有序只是这个输入的结果，并不是堆的不变量。

### 出队：末尾元素补根后下沉

```java
public E poll() {
    final Object[] es;
    final E result;

    if ((result = (E) ((es = queue)[0])) != null) {
        modCount++;
        final int n;
        final E x = (E) es[(n = --size)];
        es[n] = null;
        if (n > 0) {
            final Comparator<? super E> cmp;
            if ((cmp = comparator) == null)
                siftDownComparable(0, x, es, n);
            else
                siftDownUsingComparator(0, x, es, n, cmp);
        }
    }
    return result;
}
```

队首的空位由原来的最后一个元素填补，末尾槽位清空；如果还有元素，就从根部开始下沉。自然顺序版本如下：

```java
private static <T> void siftDownComparable(int k, T x, Object[] es, int n) {
    Comparable<? super T> key = (Comparable<? super T>)x;
    int half = n >>> 1;           // loop while a non-leaf
    while (k < half) {
        int child = (k << 1) + 1; // assume left child is least
        Object c = es[child];
        int right = child + 1;
        if (right < n &&
            ((Comparable<? super T>) c).compareTo((T) es[right]) > 0)
            c = es[child = right];
        if (key.compareTo((T) c) <= 0)
            break;
        es[k] = c;
        k = child;
    }
    es[k] = key;
}
```

每次选左右孩子中较小的一个。若待放入元素已经不大于这个孩子，就找到了位置；否则把较小孩子上移，继续向下。选较小孩子能保证上移后的父节点仍不大于两侧孩子。

`peek()` 直接读取根，为 `O(1)`。上浮、下沉为 `O(log n)`；入队遇到数组扩容时，单次还可能发生 `O(n)` 复制。`contains()`、`remove(Object)` 需要先线性搜索，不能因为底层是堆就按二分查找理解。

### 任意位置删除：下沉之后可能还要上浮

`remove(Object)` 先通过 `equals()` 线性查找元素位置，再调用 `removeAt()`：

```java
E removeAt(int i) {
    final Object[] es = queue;
    modCount++;
    int s = --size;
    if (s == i) // removed last element
        es[i] = null;
    else {
        E moved = (E) es[s];
        es[s] = null;
        siftDown(i, moved);
        if (es[i] == moved) {
            siftUp(i, moved);
            if (es[i] != moved)
                return moved;
        }
    }
    return null;
}
```

删除末尾只需清空槽位；删除其他位置则用末尾元素补位。与删除堆顶不同，补位元素既可能大于孩子，也可能小于父节点。源码先尝试下沉，如果引用仍留在原位置，就再尝试上浮。

例如合法堆数组 `[1, 10, 2, 11, 12, 3, 4]` 删除 `12` 后，用末尾的 `4` 填补索引 `4`。这个位置没有孩子，所以下沉不会移动它，但它比父节点 `10` 小，必须继续上浮，最终得到 `[1, 4, 2, 11, 10, 3]`。

上浮还可能把一个尚未遍历的元素移到迭代器游标之前。`removeAt()` 在这种情况下返回被移动的元素，供迭代器记录并稍后返回，避免遍历中删除时漏掉它。

### 堆顺序与遍历顺序

迭代器按数组下标读取元素，不执行出队后的下沉过程，因此遍历不保证有序。比较结果为 `0` 的元素可以同时存在，但先后出队没有稳定保证；如果业务需要同优先级按入队顺序处理，比较器必须再比较唯一递增序号。

对象入队后修改参与比较的字段，也不会触发自动上浮或下沉。需要改变优先级时，应先移除，再修改并重新入队。

## Queue 的两组方法

两组 API 共用存储逻辑，区别在容量不足或没有元素时如何返回：

| 条件 | 抛异常 | 返回特殊值 |
| --- | --- | --- |
| 有界队列插入时已满 | `add(e)` 抛 `IllegalStateException` | `offer(e)` 返回 `false` |
| 删除时为空 | `remove()` 抛 `NoSuchElementException` | `poll()` 返回 `null` |
| 查看时为空 | `element()` 抛 `NoSuchElementException` | `peek()` 返回 `null` |

例如 ArrayDeque 的 `removeFirst()` 先调用 `pollFirst()`，结果为 `null` 时才抛出异常。特殊返回值只处理表中的条件，`offer(null)` 等非法输入仍会抛出异常。

## 队列与并发

ArrayDeque 和 PriorityQueue 不支持无同步的共享修改。线程之间传递数据时，可以使用 `BlockingQueue`：有界队列的 `put()` 在满时等待空位，`take()` 在空时等待元素，等待可被中断。

`ArrayBlockingQueue` 使用固定容量数组；`LinkedBlockingQueue` 使用链式节点，可以指定容量。这些实现还需要锁、条件等待和线程间可见性机制，不能仅依据底层是数组或链表来类比普通集合。相关中断和协作约定见[线程基础](../../language/thread-basics.md)。
