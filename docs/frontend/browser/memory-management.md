---
title: 内存管理
date: 2022-01-13
icon: gc
category:
  - browser
tag:
  - 垃圾回收
---

像 C、C++ 等编程语言都需要手动管理内存，在创建变量时需要申请（`malloc()`），不需要用了之后在释放内存空间（`free()`）。而 JavaScript、Java、Python 等都是自动管理内存，在创建变量时自动分配内存，而在不使用后自动释放，释放的过程称为 **垃圾回收**。

虽然不同语言管理内存的方式不同，但是内存声明周期是基本一致的：

1. 分配你所需要的内存
2. 使用分配到的内存（读、写）
3. 不需要时将其释放

第二步的使用内存就很常见了，我们写的代码就是这一步，因此这里介绍第一步和第三步的基本内容。

## 分配内存空间

现在来看看 V8 引擎是如何给不同变量分配内存的。

V8 主要有三种内存空间：

- 代码空间：主要存储可执行代码；
- 栈空间：JavaScript 对于 **基本数据类型** 内存的分配会在执行时直接在栈空间进行分配；
- 堆空间：JavaScript 对于 **复杂数据类型** 内存的分配会在堆内存中开辟一块空间，并且将这块空间的指针（地址）返回给变量引用（存放在栈空间）。

下面看看例子：

```js
function foo() {
  var a = 1
  var b = { name: 'heap' }
}
foo()
```

当代码执行到第二行时，栈底是 `a`，栈顶是 `b`，此时 `b` 的值是一个复杂数据类型，那么会在堆空间中为这个数据分配一个空间，并把 `b` 的变量值赋值为这个空间的地址。

![V8-stack-heap](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/V8-stack-heap.png)

那么，为什么要将复杂数据类型放在堆空间，而不是一起放在栈空间呢？

因为 V8 引擎需要用栈来维护程序执行期间上下文的状态，如果栈空间分配的内存过大，那么会影响到上下文切换的效率，从而导致代码执行速度过慢。

因此，栈空间不会设置太大，主要用来存放基本数据类型（占用空间小），而像复杂数据类型，因为他们的占用空间一般较大，因此会被存放在堆空间中。

## 常见的垃圾回收算法

了解了如何分配不同变量的内存后，第二步的读写其实已经包含在代码里了，最关键的一步就是如何将不再需要的 **内存回收**。

在整个垃圾回收的过程中，最困难的地方在于如何找到「哪些被分配的内存确实已经不再需要了」，而这个步骤没有任何算法可以准确的判断，只是一个近似的过程。

下面先介绍几种常见的垃圾回收算法，再介绍 V8 的垃圾回收机制。

### 引用计数算法

这是最初级的垃圾收集算法。此算法把「对象是否不再需要」简化定义为「对象有没有其他对象引用到它」。当一个对象有一个引用指向它时，它的引用数就会 `+1`；当没有引用时，即引用数为 `0`，这个对象就可以被销毁了。

但是一个很大的弊端是会产生循环引用。

```js
function f() {
  var o = {}
  var o2 = {}
  o.a = o2 // o 引用 o2
  o2.a = o // o2 引用 o

  return 'azerty'
}

f()
```

在执行 `f()` 时，创建了两个对象并相互引用。函数执行结束后，会离开函数作用域，因此它们已经没有用了，按照常理来说应该被销毁。但是因为它们至少都有一次引用，所以不会被回收，造成内存泄露。

### 标记清除算法

这个算法把「对象是否不再需要」简化定义为「对象是否可以获得」，简称「可达性」。

这个算法假定设置一个叫做根（root）的对象（在 Javascript 里，根是全局对象）。垃圾回收器将定期从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象。

<img src="https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/mark-clear.png" style="background-color: #fff">

在上图中，`g` 和 `h` 对象互相引用，如果采用 **引用计数算法**，那么这两个对象将不会被垃圾回收。但是使用标记清除算法，因为根对象没有对它们引用，因此会被垃圾回收。这样，循环引用的问题就不存在了。

## V8 垃圾回收机制

在过去几年，V8 垃圾回收发生了很多变化。以前的垃圾回收器是一个连续的过程，在进行垃圾回收的过程中会暂停其他活动（全停顿，stop-the-world），而现在 V8 的垃圾回收器转变成了具有 **增量回退** 的 **并行**、**并发** 垃圾回收器。

任何垃圾回收器都会执行下面几个基本任务：

1. **标记** 活动对象和非活动对象

2. **回收或者重排** 非活动对象占据的内存

3. **合并或者整理** 内存（可选）

这些任务可以按顺序执行，也可以任意交错执行。一种直接的方法是暂停 JavaScript 执行，并在主线程上按顺序执行这些任务。这可能会导致主线程出现卡顿和延迟问题，并降低程序吞吐量。

### V8 内存限制

在介绍 V8 垃圾回收机制之前，我们先来探讨一下为什么需要垃圾回收。

- 当创建一个对象时，就会分配大量内存
- 在 V8 中限制 64 位的机器大约 1.4GB，32 位机器大约为 0.7GB
- 操作系统会自动进行栈内存的分配和释放，而堆内存，则由 V8 引擎进行释放

### 分代堆布局

V8 中的堆被分成不同的区域，称为代：分为新生代（进一步分为 `nursery` 和 `intermediate`），和一个老生代。对象首先被分配到 `nursery`。如果它们在下一个 GC 中幸存下来，这时候我们把它们移动到 `intermediate` 子代，如果再经过下一次垃圾回收这个对象仍然存活，这时候我们就会把这个对象移动到老生代（这个策略称为 **对象晋升策略**）。

![generations](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/generations.svg)

::: tip

在垃圾回收中有一个重要的术语：「代际假说」，指大多数对象在新生代就会被回收。从垃圾回收的角度来看，大部分对象一经分配之后就几乎马上变成不可达状态。

:::

根据 V8 堆中分为不同的区域，可以容易地想到 V8 有两个不同的垃圾回收器：清理新生区的副垃圾回收器和清理老生区的主垃圾回收器。

下面就一一介绍 V8 中的两个垃圾回收器。

### 副垃圾回收器——清道夫（Scavenge）

副垃圾回收器（Scavenger）从新生代中回收垃圾。

在清理时，初始的空闲区域称之为 `To-Space`，复制对象过来的区域称之为 `From-Space`；在最坏的情况下，如果每一个对象在清理的时候存活了下来，那我们就要从 `From-Space` 复制每一个对象到 `To-Space` 中。

清除步骤（Evacuation）会将所有的活动对象移动到连续的一块内存中，并且标记它们（图中的小圆圈，代表已经经历过一次 GC）；然后会将两块内存空间互换，即把 `To-Space` 变成 `From-Space`，`From-Space` 变成 `To-Space`。

![Scavenge-1](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/Scavenge-1.svg)

如果仅仅是凭借这一策略，我们就会很快的耗尽新生代的内存空间；为了新生代的内存空间不被耗尽，在下一次垃圾回收的时候，我们会把活动对象移动（evacuate）到老生代，而不是 `To-Space`。

在下图中，两块内存空间已经互换，而且 `From-Space` 又有一个新的对象，假定这个对象在第一次 GC 时存活了下来，那么它将被复制到 `To-Space` 中。而 `From-Space` 中已经经历过一次 GC 的对象（通过这个小圆圈的标记得知），假如它们又存活下来，则会被复制到老生区（**对象晋升策略**）。

Scavenge 的最后一步是把移动后的对象的指针地址更新，每一个被复制对象都会留下一个转发地址（forwarding-address），用于更新指针以指向新的地址。

![Scavenge-2](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/Scavenge-2.svg)

在副垃圾回收器回收过程中，实际上执行了三个步骤：标记、清除和指针更新。

### 主垃圾回收器 —— 全量标记和整理（Full Mark-Compact）

主垃圾回收器从整个堆（heap）中收集垃圾。

![three-phases](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/three-phases.svg)

标记阶段是利用对象的可达性确定对象是否活跃。从初始的根对象开始，垃圾回收器会跟踪每一个指向其他对象的指针，将其标记为可访问的，同时跟踪对象中每一个属性的指针。整个过程递归进行，直到标记到运行时每一个可访问的对象。

![marking](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/marking.png =50%x50%)

清除阶段将非活动对象进行清除。

![sweeping](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/sweeping.png =50%x50%)

一般来说，频繁回收对象后，内存中就会存在大量不连续空间，我们把这些不连续的内存空间称为内存碎片。当内存中出现了大量的内存碎片之后，如果需要分配较大连续内存的时候，就有可能出现内存不足的情况。所以最后一步需要整理这些内存碎片，但这步其实是可选的，因为有的垃圾回收器不会产生内存碎片。

![compaction](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/compaction.png =50%x50%)

## Orinoco

Orinoco 是 V8 垃圾回收器项目的代号，它利用最新的和最好的垃圾回收技术来降低主线程挂起的时间， 比如：并行（parallel）垃圾回收，增量（incremental）垃圾回收和并发（concurrent）垃圾回收。

2011 年，V8 从 stop-the-world 标记切换到增量标记。

2018 年，GC 技术又有了一个重大突破，这项技术名为并发标记。在 Chrome 64 和 Node.js v10 中已启用，它将标记时间缩短了 60%~70%。还有并行技术，它将新生代的垃圾回收时间缩短了 20%~50%。

### 并行垃圾回收（Parallel）

并行是主线程和协助线程同时执行同样的工作，但是这仍然是一种 `stop-the-world` 的垃圾回收方式，但是垃圾回收全停顿时间等于总时间除以参与的线程数量（加上一些同步开销）。

![parallel](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/parallel.svg)

### 增量垃圾回收（Incremental）

增量式垃圾回收是主线程间歇性的去做少量的垃圾回收的方式。同时让垃圾回收和 JavaScript 应用逻辑交替进行，这意味着堆的状态可能已经发生了变化，有可能会导致之前的增量回收工作完全无效。

从图中可以看出并没有减少主线程暂停的总时间（事实上，通常会略微增加）。通过允许 JavaScript 间歇执行，同时也间歇性地去做垃圾回收工作，应用程序仍然可以在用户输入或者执行动画的时候得到及时的响应。

![incremental](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/incremental.svg)

### 并发垃圾回收（Concurrent）

并发是主线程持续执行 JavaScript，而辅助线程完全在后台执行垃圾回收。这种方式是这三种技术中最难的一种：JavaScript 堆里面的内容随时都有可能发生变化，从而使之前做的工作完全无效，主线程和辅助线程极有可能在同一时间去更改同一个对象。这种方式的优势也非常明显，主线程不会被挂起，JavaScript 可以自由地执行。

![concurrent](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/concurrent.svg)

## 总结

首先介绍了内存管理的一般流程，分为三大步：分配、使用、释放。

然后是 V8 如何分配内存：基本数据类型存放在栈空间，复杂数据类型存放在堆空间，以及为什么要这样做。

接着又介绍了常见的垃圾回收算法，主要包括引用计数法和标记清除法。

最后介绍了 V8 的垃圾回收机制以及做出的优化。

## 参考链接

- [Trash talk: the Orinoco garbage collector · V8](https://v8.dev/blog/trash-talk)
- [内存管理 - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)
- [12 | 栈空间和堆空间：数据是如何存储的？](https://time.geekbang.org/column/article/129596)
- [一文搞懂 V8 引擎的垃圾回收](https://juejin.cn/post/6844904016325902344)
- [Memory 内存管理和 V8 垃圾回收机制 (nodejs.red)](https://www.nodejs.red/#/nodejs/memory?id=v8垃圾回收机制)
