---
title: Object 类与通用方法
date: 2026-08-05
category: java
---

`Object` 是 Java 类层次的根。除它自身外，其他类直接或间接继承它；数组对象也支持它提供的方法。引用声明为 `Object` 后，可以使用这些通用方法，但访问具体类型的额外成员需要相应类型信息。

普通类不需要自己声明 `toString()` 或 `equals()` 就能调用它们，因为这些方法已经由 `Object` 提供。类可以重新定义其中一些方法的实现，这称为重写。

```java
class Note {}

Note first = new Note();
Note second = new Note();
System.out.println(first.equals(first));  // true
System.out.println(first.equals(second)); // false
System.out.println(first.toString());    // 例如 Note@1a2b3c，后半部分不固定
```

这些默认行为分别用于比较对象和生成描述文本。需要按业务数据比较对象时，再为类定义相应规则。

## 身份相等与逻辑相等

`==` 判断两个引用是否指向同一个对象，`equals()` 判断类所定义的逻辑相等关系。

没有重写时，`Object.equals()` 的行为与引用身份比较相同。例如两个用户对象的编号相同，就可以按业务规则认为它们代表同一个用户，即使它们是分别创建的对象。这种由类定义的相等关系称为逻辑相等。

## `equals()` 的约束

对任意非 `null` 引用，正确的 `equals()` 应满足：

- 自反性：`x.equals(x)` 为 `true`；
- 对称性：`x.equals(y)` 与 `y.equals(x)` 结果一致；
- 传递性：如果 `x` 等于 `y` 且 `y` 等于 `z`，则 `x` 等于 `z`；
- 一致性：参与比较的状态没有变化时，多次调用结果一致；
- 非空性：`x.equals(null)` 为 `false`。

## `hashCode()` 必须与 `equals()` 一致

哈希值是一个用于快速缩小查找范围的整数。基于哈希值保存数据的容器先按它定位候选位置，再用 `equals()` 确认是否找到目标。因此必须满足：

> 如果 `a.equals(b)` 为 `true`，那么 `a.hashCode() == b.hashCode()` 必须为 `true`。

反过来不成立：不同对象可以产生相同哈希值，容器会继续用 `equals()` 区分它们。

只重写 `equals()` 而不重写 `hashCode()`，可能使逻辑相等的对象得到不同哈希值，导致查找失败。

下面的 `User` 按用户编号 `id` 判断相等。`@Override` 表示重写已有方法，由编译器检查签名；`final` 字段只能赋值一次，`final` 类不能再定义子类，避免子类增加另一套比较规则。

```java
public final class User {
    private final long id;
    private final String name;

    public User(long id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof User)) {
            return false;
        }
        User user = (User) other;
        return id == user.id;
    }

    @Override
    public int hashCode() {
        return Long.hashCode(id);
    }

    @Override
    public String toString() {
        return "User[id=" + id + ", name=" + name + "]";
    }
}
```

`instanceof User` 确认参数是用户对象，再通过 `(User) other` 以 `User` 类型访问其编号。`Long.hashCode(id)` 根据 `long` 数值计算整数哈希值。这里两个方法都依据稳定的 `id`，因此编号相同的对象具有相同哈希值。

```java
User first = new User(1L, "Alice");
User second = new User(1L, "Alice");

System.out.println(first == second);      // false
System.out.println(first.equals(second)); // true：编号相同
```

例如 `HashSet` 是按哈希值保存不重复元素的集合，`Set<User>` 表示集合里存放 `User` 对象。`add()` 加入元素，`contains()` 检查是否存在逻辑相等的元素：

```java
import java.util.Set;
import java.util.HashSet;

Set<User> users = new HashSet<>();
users.add(new User(1L, "Alice"));

boolean found = users.contains(new User(1L, "Alice"));
```

要保证查找遵守逻辑相等规则，两个方法必须满足“相等对象具有相同哈希值”的约束。按同一组稳定字段实现是常用方式；不同对象的哈希值仍然允许相同。

## 哈希查找中的可变字段

如果用某个字段计算哈希值，把对象放入集合后再修改该字段，新的哈希值可能指向另一处查找位置，导致无法找到原对象。

因此，上例的 `id` 在构造后保持不变。若按姓名判断相等并计算哈希值，又允许修改姓名，就需要在对象进入哈希集合时额外约束修改行为。参与相等判断的字段是否稳定，取决于对象的使用方式。

## `toString()` 用于可读表示

`Object.toString()` 默认生成 `getClass().getName() + "@" + Integer.toHexString(hashCode())`。其中是哈希值的十六进制表示，不是对象内存地址；默认结果通常不包含业务状态。

重写后可改善日志、调试和失败信息：

```java
@Override
public String toString() {
    return "User[id=" + id + ", name=" + name + "]";
}
```

不要在 `toString()` 中输出密码、令牌、完整身份证号等敏感数据，也不要让它执行数据库查询或其他昂贵操作。

## getClass 与运行时类型

`getClass()` 返回一个描述实际对象类型的 `Class` 对象。可以通过它的 `getName()` 读取类名，或与 `类型名.class` 比较，判断是否为精确的同一个类型。

```java
class Note {}

Object value = new Note();
System.out.println(value.getClass().getName()); // Note
System.out.println(value.getClass() == Note.class); // true
```

变量声明为 `Object`，实际创建的仍然是 `Note` 对象，所以结果取决于实际对象。`instanceof Note` 则检查对象是否为 `Note` 或其子类型。对 `null` 调用 `getClass()` 会失败，而 `null instanceof Note` 为 `false`。

通过 `Class` 进一步检查字段和调用方法的能力称为反射，属于运行时类型信息的扩展用法。

## clone 与浅复制

浅复制创建一个新对象，再复制原对象的字段值；如果字段指向其他对象，复制结果仍指向那些对象。

`Object.clone()` 提供这种复制行为。它的 `protected` 权限允许子类使用，但普通外部代码不能直接调用。类通过 `implements Cloneable` 声明支持复制；`Cloneable` 只是一个标记，不包含需要实现的方法。不提供这个标记时，调用 `Object.clone()` 会抛出 `CloneNotSupportedException`，表示不支持复制。

下面把复制方法公开给调用方，`super.clone()` 调用 `Object` 提供的实现：

```java
class Snapshot implements Cloneable {
    int[] values;

    Snapshot(int[] values) {
        this.values = values;
    }

    @Override
    public Snapshot clone() {
        try {
            return (Snapshot) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(e);
        }
    }
}

Snapshot original = new Snapshot(new int[] {1, 2});
Snapshot copy = original.clone();
copy.values[0] = 9;
System.out.println(original == copy); // false
System.out.println(original.values[0]); // 9
```

`Object.clone()` 创建新的对象并复制字段值，不会递归复制引用字段指向的对象，也不会执行该对象的构造方法。例子中两份对象仍共享数组。若需要独立数组，要显式复制它；更复杂的对象图则需要定义具体的复制边界。

数组可以直接调用公开的 `clone()`。对于自定义业务对象，复制构造方法或命名工厂也能表达复制语义，并让初始化逻辑更明确。

## wait、notify 与线程协调

`wait()`、`notify()` 和 `notifyAll()` 是 `Object` 提供的线程协调方法，用于在对象上等待条件变化和通知等待线程。

调用时必须先通过 `synchronized` 获得对应对象的监视器锁，否则抛出 `IllegalMonitorStateException`。等待、释放锁、通知以及重新检查条件的流程见[线程基础中的信箱示例](./thread-basics.md#等待条件成立-wait-与-notifyall)。

## finalize 与资源释放

`finalize()` 自 Java 9 起被标记为废弃。它不提供及时执行保证，不能用于保证文件、连接或锁等外部资源的释放。

`AutoCloseable` 表示资源提供 `close()` 关闭方法；`try-with-resources` 是在代码块结束时自动调用该方法的语法，具体例子见[异常处理](./exceptions.md#try-with-resources)。`final` 是语言修饰符，`finally` 是异常处理结构，二者也都不是 `finalize()` 的替代名称。

## 常见错误

- 使用 `==` 比较 `String` 或包装类内容；
- `equals()` 判断相等的对象产生不同的哈希值；
- 把可变字段纳入哈希键的相等语义；
- 在继承层次中让父类和子类采用不兼容的相等规则；
- 为了测试方便而让所有字段都参与实体相等判断；
- 在 `toString()` 中泄露敏感信息。

## 方法概览

| 方法 | 默认行为或用途 | 是否可以重写 |
| --- | --- | --- |
| `getClass()` | 获取对象的运行时类型 | 否，`final` |
| `equals(Object)` | 默认比较是否为同一对象 | 是 |
| `hashCode()` | 为哈希结构提供哈希值 | 是，必须与 `equals()` 一致 |
| `toString()` | 默认生成类名和哈希值形式的文本 | 是 |
| `clone()` | 受保护的浅复制入口 | 是，受 `Cloneable` 约束 |
| `wait()`、`notify()`、`notifyAll()` | 在对象监视器上进行线程等待与通知 | 否，`final` |
| `finalize()` | 历史上的终结回调，Java 9 起废弃 | 技术上可以，不应作为资源清理机制 |
