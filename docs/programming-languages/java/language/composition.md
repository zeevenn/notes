---
title: 组合与委托
date: 2026-02-12
category: java
---

组合通过持有其他对象来组织功能，委托则把某项操作交给被持有的对象完成。一个类可以只暴露自己的操作，同时复用另一个对象的实现。

## 持有对象并委托行为

```java
interface MessageSender {
    void send(String text);
}

class ConsoleSender implements MessageSender {
    @Override
    public void send(String text) {
        System.out.println(text);
    }
}

class OrderNotifier {
    private final MessageSender sender;

    OrderNotifier(MessageSender sender) {
        this.sender = java.util.Objects.requireNonNull(sender);
    }

    void notifyPaid(String orderId) {
        sender.send("Paid: " + orderId);
    }
}

OrderNotifier notifier = new OrderNotifier(new ConsoleSender());
notifier.notifyPaid("A001"); // Paid: A001
```

`OrderNotifier` 负责构造订单通知，`MessageSender` 负责发送。替换发送实现时，可以保持通知对象的公开操作不变。

这里的“组合”采用代码复用中的宽泛含义，即通过对象持有关系组织功能。UML 中的组合还强调部件所有权和生命周期；构造方法接收一个外部共享对象，并不自动满足这种更严格的关系。

## 与继承的取舍

继承建立子类型关系，并让子类拥有父类可继承的公开行为。组合不会自动把被持有对象的全部 API 暴露出去，公开哪些操作由外层类决定。

例如用 `ArrayList` 实现栈时，继承会同时暴露任意位置插入、删除等列表操作；如果对象只应允许栈操作，可以持有 `Deque` 并委托：

```java
import java.util.ArrayDeque;
import java.util.Deque;

class TextStack {
    private final Deque<String> values = new ArrayDeque<>();

    void push(String value) {
        values.push(value);
    }

    String pop() {
        return values.pop();
    }

    boolean isEmpty() {
        return values.isEmpty();
    }
}
```

这个示例不允许 `null` 元素，空栈 `pop()` 抛出 `NoSuchElementException`，行为来自所用的 `ArrayDeque`。包装对象仍要明确对调用方承诺哪些行为。

当子类可以满足父类契约，并需要以父类类型使用时，继承可以直接表达这种关系。只有实现复用需求时，组合通常更容易控制公开边界，但也需要编写转发代码。

## 对象创建与所有权

被持有对象可以由类内部创建，也可以由构造方法传入。

- 内部创建：实现和生命周期集中在外层对象中，替换实现需要修改内部代码。
- 外部传入：调用方选择实现，也可能共享同一实例，需要明确共享和关闭责任。
- 面向接口持有：外层代码只依赖所需能力，可以提供不同实现或测试替身。

通过构造方法传入依赖是依赖注入的一种形式，不要求使用框架。它也不自动带来低耦合：如果接口泄露具体实现的状态和流程，调用方仍会受到实现变化影响。

## 委托的边界

外层对象可以转换参数、校验约束、组合多个调用并转换结果。但把内部可变对象直接返回，会让调用方绕过外层规则，见[封装与访问控制](./encapsulation-and-access.md)。

与继承不同，被委托对象内部的 `this` 仍指向它自身；包装对象不会自动拦截它对自身其他方法的调用。

## 参考资料

- [Java SE 17 JLS：Field Declarations](https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html#jls-8.3)
- [Java SE 17 API：Deque](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html)
