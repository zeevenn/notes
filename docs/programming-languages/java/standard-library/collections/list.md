---
title: List
date: 2026-08-05
category: java
---

`List<E>` 表示允许重复元素并支持索引访问的有序序列。这里的“有序”指元素有明确的先后位置，不表示元素已经按大小排序。

`ArrayList` 和 `LinkedList` 都实现 `List` 接口。`ArrayList` 使用动态数组，适合按索引访问；`LinkedList` 使用双向链表，还实现了 `Deque`，支持首尾操作。两者都不是线程安全的。

`Vector` 是带同步方法的历史数组实现，`Stack` 继承它来提供栈操作。普通列表通常使用 `ArrayList`，栈通常使用 [Deque](./queue-and-deque.md#把-deque-当作栈)。

下面沿 OpenJDK 的字段和关键方法分析实现，源码片段省略无关注释。数组增长比例、节点布局和修改计数属于实现细节，不是 `List` 接口对所有实现的保证。

## `ArrayList`

### 数组、元素数量与容量

[`ArrayList` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/ArrayList.java) 用 `Object[]` 保存元素引用，`size` 记录有效元素数：

```java
private static final int DEFAULT_CAPACITY = 10;
private static final Object[] EMPTY_ELEMENTDATA = {};
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
transient Object[] elementData;
private int size;
```

有效元素位于 `[0, size)`，数组长度 `elementData.length` 是容量。容量可以大于元素数；数组保存的是引用，不要求被引用的对象在内存中相邻。

无参构造方法只指向一个共享空数组，并没有立即分配十个位置：

```java
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}
```

显式指定容量时，正数会立即分配数组，`0` 则使用另一个空数组标记：

```java
public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {
        this.elementData = EMPTY_ELEMENTDATA;
    } else {
        throw new IllegalArgumentException("Illegal Capacity: "+
                                           initialCapacity);
    }
}
```

两个空数组长度都是 `0`，但对象身份不同。这个区别会影响第一次扩容：无参构造使用默认容量，显式指定 `0` 则按本次实际需要增长。无论初始容量是多少，新列表的 `size` 都是 `0`。

### 追加与扩容：`add()` → `grow()`

尾部追加先更新 `modCount`（迭代期间用来检测修改的计数器），再进入内部的 `add()`：

```java
public boolean add(E e) {
    modCount++;
    add(e, elementData, size);
    return true;
}
```

```java
private void add(E e, Object[] elementData, int s) {
    if (s == elementData.length)
        elementData = grow();
    elementData[s] = e;
    size = s + 1;
}
```

还有空位时，直接写入下标 `size`，再增加元素数。数组已满时，`grow()` 以 `size + 1` 为最低容量要求，进入下面的方法：

```java
private Object[] grow(int minCapacity) {
    int oldCapacity = elementData.length;
    if (oldCapacity > 0 || elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        int newCapacity = ArraysSupport.newLength(oldCapacity,
                minCapacity - oldCapacity, /* minimum growth */
                oldCapacity >> 1           /* preferred growth */);
        return elementData = Arrays.copyOf(elementData, newCapacity);
    } else {
        return elementData = new Object[Math.max(DEFAULT_CAPACITY, minCapacity)];
    }
}
```

这里有两条路径：

- 默认空数组：容量取 `10` 与最低需求的较大值，普通第一次 `add()` 因而分配长度为 `10` 的数组。
- 已有数组或显式零容量：`ArraysSupport.newLength()` 同时接收最低增长量和期望增长量 `oldCapacity >> 1`，在正常大小范围内满足两者中较大的一个；它还处理溢出和大数组边界。

因此，“扩容为原来的 1.5 倍”只是通常的期望增长策略。连续单个追加时，容量会经历 `10 → 15 → 22 → 33`；批量加入的元素超过期望增长空间时，会直接满足更大的最低需求。`new ArrayList<>(0)` 第一次追加只需要容量 `1`，也不经过默认容量 `10`。

`Arrays.copyOf()` 创建新数组并复制已有引用。单次扩容成本为 `O(n)`，但每次都会预留一段空位，连续追加的总复制量按几何级数增长，所以追加的摊还成本为 `O(1)`。`addAll()` 先取得输入元素数组，按 `size + 新元素数` 检查容量，再批量复制，避免逐个触发扩容检查。

### 索引读写与中间插入

`get()` 检查的是有效元素数，而不是底层容量：

```java
public E get(int index) {
    Objects.checkIndex(index, size);
    return elementData(index);
}
```

`elementData(index)` 只是读取数组并转换为 `E`。`set()` 同样直接替换对应位置，返回旧元素；它不改变 `size`，也不增加 `modCount`。

按索引插入需要先腾出位置：

```java
public void add(int index, E element) {
    rangeCheckForAdd(index);
    modCount++;
    final int s;
    Object[] elementData;
    if ((s = size) == (elementData = this.elementData).length)
        elementData = grow();
    System.arraycopy(elementData, index,
                     elementData, index + 1,
                     s - index);
    elementData[index] = element;
    size = s + 1;
}
```

`System.arraycopy()` 把 `[index, size)` 整段右移一格，即使源数组与目标数组相同、区域重叠，也能正确复制。比如 `[A, B, C]` 在索引 `1` 插入 `X`，先将 `B、C` 右移，再写入 `X`，得到 `[A, X, B, C]`。这一步决定了中间插入的 `O(n)` 成本。

### 删除、清空与容量回收

`remove(int)` 完成索引检查并保存旧值后，调用 `fastRemove()`；`remove(Object)` 则先线性查找第一个相等元素，再调用同一个方法：

```java
private void fastRemove(Object[] es, int i) {
    modCount++;
    final int newSize;
    if ((newSize = size - 1) > i)
        System.arraycopy(es, i + 1, es, i, newSize - i);
    es[size = newSize] = null;
}
```

删除位置之后的元素左移，原来的最后一个有效槽位设为 `null`。清空这个引用可以避免列表继续持有已移除对象，但不意味着对象一定会立即被垃圾回收。

删除不会缩小数组。`clear()` 也只是清空有效槽位并把 `size` 设为 `0`，保留容量供后续使用；显式调用 `trimToSize()` 才会尝试把容量收缩到当前元素数。

`List<Integer>` 中的 `remove(1)` 仍按索引删除；要删除值 `1`，应传入 `Integer.valueOf(1)`。两个重载最终可能调用相同的搬移逻辑，但查找删除位置的方式不同。

### 迭代器与修改计数

`ArrayList.Itr` 保存三个状态：

```java
int cursor; // 下一个要返回的位置
int lastRet = -1; // 最近返回的位置
int expectedModCount = modCount;
```

`next()` 检查 `modCount` 是否仍等于 `expectedModCount`。通过列表直接增删，会改变前者；通过迭代器自身删除，则会同步更新检查值：

```java
public void remove() {
    if (lastRet < 0)
        throw new IllegalStateException();
    checkForComodification();

    try {
        ArrayList.this.remove(lastRet);
        cursor = lastRet;
        lastRet = -1;
        expectedModCount = modCount;
    } catch (IndexOutOfBoundsException ex) {
        throw new ConcurrentModificationException();
    }
}
```

删除使后续元素左移，因此 `cursor` 必须退回 `lastRet`，否则会跳过一个元素。把 `lastRet` 重置为 `-1`，则阻止在下一次 `next()` 之前重复删除。

这就是 fail-fast（尽早发现错误）的实现线索。它用于检测错误，不提供线程安全；`hasNext()` 只比较游标与 `size`，并不会检查修改计数，因此不能依赖所有错误修改都一定抛异常。遍历的对外约定见[遍历、比较与排序](./iteration-and-comparison.md#iterator)。

## `LinkedList`

### 节点与首尾引用

[`LinkedList` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/LinkedList.java) 用双向链表保存元素：

```java
transient int size = 0;
transient Node<E> first;
transient Node<E> last;

private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;

    Node(Node<E> prev, E element, Node<E> next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}
```

空表的 `first`、`last` 都是 `null`。节点不要求连续存放，列表顺序由 `next` 和 `prev` 连接起来；因此它没有数组容量，也没有整块数组扩容。

### 尾插：`linkLast()`

`add(E)`、`addLast(E)` 最终都进入 `linkLast()`：

```java
void linkLast(E e) {
    final Node<E> l = last;
    final Node<E> newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
}
```

新增节点的 `prev` 指向旧尾节点，再把旧尾的 `next` 指向新节点。空表没有旧尾，需要同时设置 `first`；这也是单节点列表的首尾引用为何指向同一个节点。整个过程不遍历链表，时间为 `O(1)`，但每次都要分配一个节点对象。

### 按索引定位：`node()`

`get(index)`、`set(index, value)` 以及按索引删除，都要先定位节点：

```java
Node<E> node(int index) {

    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
        Node<E> x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}
```

根据索引位于前半段还是后半段，选择从头或尾开始。首尾附近的访问很快，中间位置仍可能遍历约半条链，最坏时间为 `O(n)`。对整个 `LinkedList` 反复调用 `get(i)`，会把一次遍历变成 `O(n²)`。

### 中间插入与解除连接

`add(index, element)` 在索引等于 `size` 时直接尾插，否则先调用 `node(index)`，再在目标节点之前插入：

```java
void linkBefore(E e, Node<E> succ) {
    final Node<E> pred = succ.prev;
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}
```

删除节点由 `unlink()` 完成：

```java
E unlink(Node<E> x) {
    final E element = x.item;
    final Node<E> next = x.next;
    final Node<E> prev = x.prev;

    if (prev == null) {
        first = next;
    } else {
        prev.next = next;
        x.prev = null;
    }

    if (next == null) {
        last = prev;
    } else {
        next.prev = prev;
        x.next = null;
    }

    x.item = null;
    size--;
    modCount++;
    return element;
}
```

中间节点的前驱和后继重新相连；首节点或尾节点则还需要更新 `first`、`last`。断开被删除节点保存的引用后，再减少元素数。

连接和断开本身是 `O(1)`，按索引寻找位置却是 `O(n)`。只有已经通过 `ListIterator` 定位，或直接操作首尾时，才省去了这次查找。“链表增删快”不能脱离定位成本来判断。若只需要队列或栈语义，还应与[循环数组实现的 ArrayDeque](./queue-and-deque.md#arraydeque)比较。

### 批量插入：定位一次，连接一段新链

`addAll(index, c)` 不会对每个元素重复调用 `add(index, e)`。它先把输入转换成数组，定位插入点的前驱 `pred` 与后继 `succ`，再依次创建新节点，最后把新链尾部接回原后继。下面是定位之后的源码：

```java
for (Object o : a) {
    @SuppressWarnings("unchecked") E e = (E) o;
    Node<E> newNode = new Node<>(pred, e, null);
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    pred = newNode;
}

if (succ == null) {
    last = pred;
} else {
    pred.next = succ;
    succ.prev = pred;
}

size += numNew;
modCount++;
```

插入 `m` 个元素只需一次位置查找和 `m` 次节点创建，成本为定位成本加 `O(m)`；非空批次完成后，`modCount` 增加一次。它记录的是需要使迭代器失效的修改，并不是新增节点数量。

### `clear()` 为什么逐个断开节点

```java
public void clear() {
    for (Node<E> x = first; x != null; ) {
        Node<E> next = x.next;
        x.item = null;
        x.next = null;
        x.prev = null;
        x = next;
    }
    first = last = null;
    size = 0;
    modCount++;
}
```

仅把 `first`、`last` 设为 `null`，在没有其他引用时也能让整条链变得不可达。但旧迭代器可能还持有其中一个节点；保留节点之间的连接，就可能间接保留后续节点与元素。逐个清空 `item`、`next`、`prev` 可以解除这些引用，所以这里的清空是 `O(n)`，而不是仅重置首尾的 `O(1)`。

## `subList()` 是视图

`ArrayList.SubList` 没有复制元素数组，只保存根列表、偏移和自己的元素数：

```java
private final ArrayList<E> root;
private final SubList<E> parent;
private final int offset;
private int size;
```

视图读取下标 `index`，实际读取的是 `root.elementData(offset + index)`。通过视图插入时，也委托给根列表，再同步当前视图及其父视图的大小和修改计数：

```java
public void add(int index, E element) {
    rangeCheckForAdd(index);
    checkForComodification();
    root.add(offset + index, element);
    updateSizeAndModCount(1);
}
```

这解释了视图修改会反映到原列表，以及在视图之外增删原列表会使视图失效。一个很小的视图也会通过 `root` 保留整个原列表；需要独立结果时，用 `new ArrayList<>(source.subList(from, to))` 复制选中的元素引用。

## 数组与 List 转换

`Arrays.asList()` 返回的是 `Arrays` 的内部类 `ArrayList`，并不是 `java.util.ArrayList`。它直接保存传入数组的引用，核心实现如下：

```java
private final E[] a;

ArrayList(E[] array) {
    a = Objects.requireNonNull(array);
}

public int size() {
    return a.length;
}

public E get(int index) {
    return a[index];
}

public E set(int index, E element) {
    E oldValue = a[index];
    a[index] = element;
    return oldValue;
}
```

`size()` 永远返回数组长度，`set()` 直接写回原数组；它没有实现改变长度的 `add(int, E)`、`remove(int)`，继承的默认方法会抛出 `UnsupportedOperationException`。因此它是固定大小视图，而不是不可修改列表。

```java
String[] array = {"A", "B"};
List<String> view = Arrays.asList(array);
view.set(0, "X");
System.out.println(array[0]); // X
```

`new ArrayList<>(view)` 会通过 `toArray()` 得到一份元素引用数组，从而与原数组的槽位替换隔离；需要不可修改快照时则使用 `List.copyOf(view)`，见[不可修改集合与防御性复制](./immutable-collections.md)。

`asList(T... a)` 的参数要求引用类型元素。传入 `int[]` 时，整个数组被当作一个元素，结果是大小为 `1` 的 `List<int[]>`，不会逐项装箱。需要 `List<Integer>` 时，可以通过 `Arrays.stream(scores).boxed().toList()` 转换。

## 首尾与反向视图 [Java 21+]

Java 21 起，`List` 作为 `SequencedCollection` 提供统一的首尾操作：

```java
List<String> names = new ArrayList<>(List.of("Alice", "Bob"));
String first = names.getFirst();
String last = names.getLast();
names.addFirst("Admin");
names.addLast("Guest");

List<String> reversed = names.reversed();
```

`reversed()` 返回反向顺序视图，不是副本。若实现允许修改该视图，修改会写回原列表；原列表的修改是否在视图中可见，要看具体实现。对这里使用的 `ArrayList`，两边的修改会相互反映。
