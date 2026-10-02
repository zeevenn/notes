---
title: Map
date: 2026-08-05
category: java
---

`Map<K, V>` 保存键到值的映射。`HashMap` 用哈希表定位键，`LinkedHashMap` 在它之上维护遍历顺序，`TreeMap` 用红黑树保持键的排序；`EnumMap` 则利用枚举常量的连续编号直接定位数组。

下面沿 OpenJDK 的字段与增删查路径分析这些实现。桶容量、树化阈值和节点布局属于实现细节，不能当作 `Map` 接口的统一保证。

## `HashMap`

### 桶数组与节点

[`HashMap` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/HashMap.java) 的基本存储单位是节点，桶数组保存各个位置的首节点：

```java
transient Node<K,V>[] table;
transient int size;
int threshold;
final float loadFactor;

static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;
    // 构造方法和接口方法略
}
```

“桶”是数组中的一个位置；多个键定位到同一位置时，通过链表或树在桶内继续区分。`size` 是映射总数，`table.length` 是桶数，`threshold` 是触发常规扩容的映射数量阈值。

默认负载因子 `loadFactor` 为 `0.75`，用于在桶数组空间与冲突程度之间取舍。无参构造不立即分配桶数组，第一次插入才分配默认长度 `16`，并把阈值设为 `12`。指定初始容量的构造方法也延迟分配：此时 `threshold` 暂存向上取整到 2 的幂后的目标桶数，初始化数组后才改为扩容阈值。

### 哈希扰动与桶下标

键的哈希值先经过一次高低位混合：

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

桶下标的计算出现在 `getNode()`、`putVal()` 中：

```java
i = (n - 1) & hash;
```

`n` 是桶数，保持为 2 的幂，所以 `n - 1` 的低位全为 `1`，与运算可以选取相应低位。把原哈希值的高 16 位异或到低位，是为了让高位也参与小容量时的桶分布；这只能改善分布，不能消除冲突。

`null` 键的哈希值为 `0`，所以落在第 `0` 桶。节点把混合后的哈希值缓存下来，之后比较和扩容都可以复用它。

### 插入：`put()` → `putVal()`

`put()` 计算哈希值后，把写入交给 `putVal()`：

```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

这段方法沿三种情况查找位置：桶为空就建立首节点；桶首是树节点就走树的插入；否则遍历链表，找到相等键或在链尾追加。判断键相等时，先比较缓存的 `hash`，再检查对象身份或 `equals()`。

命中已有键时，只更新节点的 `value` 并返回旧值，不增加 `size`。新增节点才增加元素数和修改计数，超过 `threshold` 时扩容。正常哈希分布下，查找和插入平均为 `O(1)`；一次扩容仍需要搬迁整个表中的节点。

`putIfAbsent()` 也调用这个方法，但传入 `onlyIfAbsent = true`：旧值非 `null` 时保留旧值，旧值为 `null` 时仍会替换。这个分支解释了它与“键不存在才写入”的区别；HashMap 的这些步骤没有提供线程安全保证。

### 扩容：为什么节点只会去两个位置

`resize()` 通常把桶数扩大一倍。新掩码比旧掩码多一位，因此原来位于桶 `j` 的节点，只可能留在 `j`，或移动到 `j + oldCap`。

例如旧桶数为 `16`，缓存哈希值 `5` 和 `21` 都落在桶 `5`；扩容到 `32` 后，前者仍在桶 `5`，后者转到桶 `21`。区分两者只需检查 `hash & oldCap`。

下面是 `resize()` 拆分链表桶时的核心循环：

```java
do {
    next = e.next;
    if ((e.hash & oldCap) == 0) {
        if (loTail == null)
            loHead = e;
        else
            loTail.next = e;
        loTail = e;
    } else {
        if (hiTail == null)
            hiHead = e;
        else
            hiTail.next = e;
        hiTail = e;
    }
} while ((e = next) != null);
```

低位链表放回 `newTab[j]`，高位链表放到 `newTab[j + oldCap]`，两条链各自保留原有相对顺序。搬迁使用节点缓存的哈希值，不必重新调用键的 `hashCode()`；但桶位置改变后，Map 的整体遍历顺序仍可能变化。

### 冲突链表与树化

树化把桶内链表转换成红黑树，涉及三个常量：

```java
static final int TREEIFY_THRESHOLD = 8;
static final int UNTREEIFY_THRESHOLD = 6;
static final int MIN_TREEIFY_CAPACITY = 64;
```

不能只把它们记成“8 变树、6 变链表”。对上面的普通 `putVal()` 路径，已有链表包含 8 个不同键时，追加第 9 个节点会调用 `treeifyBin()`；该方法发现桶数组长度小于 `64` 时，优先扩容，而不是树化。`compute()` 等其他写入路径的计数位置不同，也不能直接套用这个触发过程。

`UNTREEIFY_THRESHOLD` 用于扩容拆分树桶时的判断：拆分后某一侧节点数不超过 `6`，可以退化为链表。普通删除树节点时还有按树形判断是否退化的逻辑，不是统一按这个数量判断。

树化缓解长冲突链的查找成本，但不是任意恶劣键分布下 `O(log n)` 的无条件保证。若大量键哈希相同且没有可用的比较顺序，树内判断相等时仍可能搜索两侧子树。

### 查找、删除与可变键

`getNode()` 与插入使用相同的定位规则：

```java
final Node<K,V> getNode(Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n, hash; K k;
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & (hash = hash(key))]) != null) {
        if (first.hash == hash && // always check first node
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        if ((e = first.next) != null) {
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```

`removeNode()` 先按同样的规则定位，再把节点从链表或树中移除；删除成功才减少 `size`。常规删除不会自动缩小桶数组。

键加入 Map 后，不应修改参与 `equals()`、`hashCode()` 的字段。节点仍保存原哈希值，后续查找却从键的新状态计算哈希，可能找不到原映射；扩容复用缓存哈希，也不会自动修复这个问题。

`get()` 返回 `null` 既可能表示没有节点，也可能是节点的值本来就为 `null`。`getOrDefault()` 只在没有节点时使用默认值，判断键是否存在应使用 `containsKey()`。

### 集合视图为何能修改原 Map

`keySet()`、`values()` 和 `entrySet()` 创建的是持有原 Map 的视图，迭代器最终返回原表中的键、值或节点。它们没有复制一份数据。

例如 KeySet 的删除最终调用 `removeNode()`；HashMap 的 Entry 节点实现 `Map.Entry`，其 `setValue()` 直接替换节点中的值。因此通过支持修改的视图删除或更新，会反映到原 Map；视图不支持通过 `add()` 创建新映射。

## `LinkedHashMap`

### 在哈希节点之外维护顺序链

[`LinkedHashMap` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/LinkedHashMap.java) 继承 HashMap，并扩展它的节点类型：

```java
static class Entry<K,V> extends HashMap.Node<K,V> {
    Entry<K,V> before, after;
    // 构造方法略
}

transient LinkedHashMap.Entry<K,V> head;
transient LinkedHashMap.Entry<K,V> tail;
final boolean accessOrder;
```

同一个节点同时参与两套连接：`next` 用于同一个哈希桶中的节点，`before/after` 用于跨桶的遍历顺序。哈希表负责按键定位，顺序链负责按约定次序遍历，两者不相互替代。

HashMap 插入普通节点时调用可覆盖的 `newNode()`。LinkedHashMap 创建扩展节点，再通过 `linkNodeLast()` 把它接到顺序链尾部：

```java
Node<K,V> newNode(int hash, K key, V value, Node<K,V> e) {
    LinkedHashMap.Entry<K,V> p =
        new LinkedHashMap.Entry<>(hash, key, value, e);
    linkNodeLast(p);
    return p;
}
```

HashMap 负责把返回的节点挂入对应桶。删除也分成两步：HashMap 先从桶中移除节点，再回调 `afterNodeRemoval()` 维护顺序链：

```java
void afterNodeRemoval(Node<K,V> e) { // unlink
    LinkedHashMap.Entry<K,V> p =
        (LinkedHashMap.Entry<K,V>)e, b = p.before, a = p.after;
    p.before = p.after = null;
    if (b == null)
        head = a;
    else
        b.after = a;
    if (a == null)
        tail = b;
    else
        a.before = b;
}
```

`b`、`a` 分别是顺序链上的前驱、后继，是否为 `null` 决定是否需要更新 `head`、`tail`。扩容改变桶的位置，但遍历沿 `after` 前进，成本只与映射数有关，不需要扫描空桶。

### 插入顺序与访问顺序

默认 `accessOrder = false`，新节点接在链尾，更新已有键的值不移动节点。设置为 `true` 后，`get()` 等访问会调用 `afterNodeAccess()`：

```java
void afterNodeAccess(Node<K,V> e) { // move node to last
    LinkedHashMap.Entry<K,V> last;
    if (accessOrder && (last = tail) != e) {
        LinkedHashMap.Entry<K,V> p =
            (LinkedHashMap.Entry<K,V>)e, b = p.before, a = p.after;
        p.after = null;
        if (b == null)
            head = a;
        else
            b.after = a;
        if (a != null)
            a.before = b;
        else
            last = b;
        if (last == null)
            head = p;
        else {
            p.before = last;
            last.after = p;
        }
        tail = p;
        ++modCount;
    }
}
```

如果命中的节点已经是尾节点，无需调整；否则先从原位置摘除，再接到尾部，并增加 `modCount`。因此在访问顺序模式下，`get()` 也可能改变遍历结构，不能一边遍历一边随意调用它来重新取值。

```java
Map<String, Integer> recent = new LinkedHashMap<>(16, 0.75f, true);
recent.put("A", 1);
recent.put("B", 2);
recent.get("A");
System.out.println(recent.keySet()); // [B, A]
```

### 插入后的淘汰钩子

新增映射之后会进入：

```java
void afterNodeInsertion(boolean evict) { // possibly remove eldest
    LinkedHashMap.Entry<K,V> first;
    if (evict && (first = head) != null && removeEldestEntry(first)) {
        K key = first.key;
        removeNode(hash(key), key, null, false, true);
    }
}
```

`removeEldestEntry()` 默认返回 `false`。子类可以覆盖它，以 `size() > 容量上限` 为条件移除链首。配合访问顺序，链首就是最久未访问的条目，可形成最近最少使用（LRU）淘汰策略；判断发生在插入之后，且 LinkedHashMap 本身仍不是线程安全的。

## `TreeMap`

### 节点与比较路径

[`TreeMap` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/TreeMap.java) 不使用哈希桶，而是保存红黑树根节点。树节点的关键字段如下：

```java
K key;
V value;
Entry<K,V> left;
Entry<K,V> right;
Entry<K,V> parent;
boolean color = BLACK;
```

比较器决定查找路径：新键比当前键小就向左，大就向右，比较结果为 `0` 就命中已有键。未提供 `Comparator` 时，走键的 `Comparable.compareTo()`。

`put()` 在提供比较器时的查找循环如下，`replaceOld` 在普通 `put()` 调用中为 `true`：

```java
do {
    parent = t;
    cmp = cpr.compare(key, t.key);
    if (cmp < 0)
        t = t.left;
    else if (cmp > 0)
        t = t.right;
    else {
        V oldValue = t.value;
        if (replaceOld || oldValue == null) {
            t.value = value;
        }
        return oldValue;
    }
} while (t != null);
```

比较为 `0` 时更新已有节点的值，不创建新节点，也不再调用 `equals()` 复核。因此，比较器认为相同的两个键会对应同一条映射。要遵守 Map 的相等性契约，比较结果为 `0` 应与 `equals()` 相等一致。

### 插入后的平衡修复

没有找到相等键时，先按普通二叉搜索树的方式接上节点，再修复红黑树约束：

```java
private void addEntry(K key, V value, Entry<K, V> parent, boolean addToLeft) {
    Entry<K,V> e = new Entry<>(key, value, parent);
    if (addToLeft)
        parent.left = e;
    else
        parent.right = e;
    fixAfterInsertion(e);
    size++;
    modCount++;
}
```

红黑树要求根为黑色、红节点没有红孩子，并且从一个节点到各个空叶子的路径包含相同数量的黑节点。这些约束限制树高，避免有序插入把树退化成链表。

`fixAfterInsertion()` 先把新节点设为红色。如果父节点也是红色，就根据叔节点（父节点的兄弟）的颜色选择重新着色或旋转；必要时向上继续修复，最后把根设为黑色。旋转改变局部父子关系，但保留键的大小顺序。例如左旋的实现为：

```java
private void rotateLeft(Entry<K,V> p) {
    if (p != null) {
        Entry<K,V> r = p.right;
        p.right = r.left;
        if (r.left != null)
            r.left.parent = p;
        r.parent = p.parent;
        if (p.parent == null)
            root = r;
        else if (p.parent.left == p)
            p.parent.left = r;
        else
            p.parent.right = r;
        r.left = p;
        p.parent = r;
    }
}
```

原右孩子 `r` 上升到 `p` 的位置，`p` 成为 `r` 的左孩子，`r` 原来的左子树移交给 `p` 的右侧。节点键值不变，查找顺序仍然成立。树高为 `O(log n)`，所以基本增删查也为 `O(log n)`。

### 插入修复的三个分支

以父节点是祖父节点左孩子的情况为例，`fixAfterInsertion()` 的处理可以分成三步，右侧情况与之对称：

1. **叔节点为红色**：父节点与叔节点改为黑色，祖父节点改为红色，再向上检查祖父节点。这保持了各路径的黑节点数量，但可能把连续红节点的问题向上传递。
2. **叔节点为黑色或为空，当前节点是右孩子**：先围绕父节点左旋，把折线关系转成同侧关系。
3. **转成同侧后**：父节点改为黑色，祖父节点改为红色，再围绕祖父节点右旋，消除相邻红节点。

源码中第 2 步直接接着执行第 3 步：

```java
if (x == rightOf(parentOf(x))) {
    x = parentOf(x);
    rotateLeft(x);
}
setColor(parentOf(x), BLACK);
setColor(parentOf(parentOf(x)), RED);
rotateRight(parentOf(parentOf(x)));
```

旋转不是为了让每个节点左右子树高度完全相同，而是配合颜色调整恢复红黑约束。分支中的形状关系可结合 [TreeMap 旋转与修复图解](https://pdai.tech/md/java/collection/java-map-TreeMap%26TreeSet.html)阅读。

### 后继节点与有序遍历

中序后继是排序中紧随当前节点的节点。`successor()` 有两条路径：有右子树就取右子树的最左节点；没有右子树，就沿父引用向上，直到当前分支第一次作为左孩子连接到某个祖先。

```java
static <K,V> TreeMap.Entry<K,V> successor(Entry<K,V> t) {
    if (t == null)
        return null;
    else if (t.right != null) {
        Entry<K,V> p = t.right;
        while (p.left != null)
            p = p.left;
        return p;
    } else {
        Entry<K,V> p = t.parent;
        Entry<K,V> ch = t;
        while (p != null && ch == p.right) {
            ch = p;
            p = p.parent;
        }
        return p;
    }
}
```

这个祖先才是下一个更大的节点；如果一直回溯到根之外，当前节点就是最大节点。TreeMap 的升序迭代器从最左节点开始，反复查找后继，所以不需要复制键再排序。单次找后继可能向上跨越多层，但完整遍历只需线性数量的边移动，整体为 `O(n)`。

### 删除与范围查询

删除节点有两个孩子时，源码先用中序后继（右子树中的最小节点）的键值覆盖它，再转为删除后继节点：

```java
if (p.left != null && p.right != null) {
    Entry<K,V> s = successor(p);
    p.key = s.key;
    p.value = s.value;
    p = s;
}
```

后继至多只有一个孩子，因而可以通过一次替换或断链移除。若移除黑节点破坏了路径上的黑节点数量，还需要调用 `fixAfterDeletion()` 恢复平衡。

`floorEntry(key)` 沿比较路径寻找不大于目标键的最大节点；走到无法继续的左分支时，还可以通过 `parent` 向上寻找候选祖先。它利用树序完成定位，不需要收集所有键后再排序。

`subMap()` 返回持有原 TreeMap 和上下界的范围视图。它把边界检查加在原树操作之前，仍共享原树；不满足边界的新增键会被拒绝。`TreeSet` 正是利用这些键导航与范围操作来实现排序集合。

## `EnumMap`

枚举键可以通过 `ordinal()` 得到声明位置，因此 [`EnumMap` 源码](https://github.com/openjdk/jdk17u/blob/jdk-17.0.17%2B10/src/java.base/share/classes/java/util/EnumMap.java) 用 `keyUniverse` 保存枚举常量，用同样长度的 `vals` 保存对应值：

```java
public V put(K key, V value) {
    typeCheck(key);

    int index = key.ordinal();
    Object oldValue = vals[index];
    vals[index] = maskNull(value);
    if (oldValue == null)
        size++;
    return unmaskNull(oldValue);
}
```

`typeCheck()` 保证键属于对应枚举类型，之后直接按下标访问。`vals[index] == null` 表示没有映射；用户存入的 `null` 则通过 `maskNull()` 转成内部占位对象，读取时再还原，因此“没有键”和“键的值为 null”仍能区分。遍历按数组下标进行，自然对应枚举声明顺序。

## 按预计映射数量创建 [Java 19+]

Java 19 起，已知预计映射数量时可使用：

```java
HashMap<String, Integer> counts = HashMap.newHashMap(100);
```

它根据预计映射数选择适当容量，比把“预计元素数”直接误当成底层容量更清楚。

## SequencedMap API [Java 21+]

Java 21 起 `LinkedHashMap` 实现 `SequencedMap`，可以通过 `firstEntry()`、`lastEntry()` 访问首尾映射，并通过 `reversed()` 获得反向视图。
