---
title: Object-Oriented Programming
date: 2026-01-26
category: java
---

在 Java 中，新建文件夹就是新建一个软件包（package），它对应你在项目里用来组织类的目录。

简单理解：

- 包（package） = 文件夹
- 类（class） = 文件

在类文件开头写 package 包名来声明它属于这个包。

> [!TIP]
> 如果不声明一个包，那么类会隐式属于 default package，不推荐这么使用。

```java
package org.example.utils;

public class Date {
    // 类定义
}
```

## 访问修饰符（Access Modifiers）

访问修饰符用于控制类、方法和变量的可见性和访问权限。Java 提供了四种访问级别。

### 类级别的访问修饰符

**顶级类**（Top-level Class）是指直接定义在源文件中，而不是嵌套在其他类、类型或方法内部的类。

顶级类只有**两种**有效的访问修饰符选项：

| 访问修饰符 | 描述                                                               |
| ---------- | ------------------------------------------------------------------ |
| `public`   | 任何其他包中的类都可以访问此类                                     |
| 无修饰符   | **包访问**（Package Access），只有同一包中的类可以访问此类（默认） |

```java
// 公共类：任何包都可以访问
public class PublicClass {
    // ...
}

// 包访问类：只有同一包内的类可以访问
class PackageClass {
    // ...
}
```

> [!TIP]
> 一个 `.java` 文件中只能有一个 `public` 类，且文件名必须与该类名相同。

### 成员级别的访问修饰符

成员（Member）包括类的字段（Field）和方法（Method）。成员级别的访问修饰符允许更细粒度的访问控制。

以下按**从宽到严**的顺序列出四种访问修饰符：

| 访问修饰符  | 同一类 | 同一包 | 子类（不同包） | 任何地方 | 描述                                       |
| ----------- | ------ | ------ | -------------- | -------- | ------------------------------------------ |
| `public`    | ✅     | ✅     | ✅             | ✅       | 任何其他类都可以访问                       |
| `protected` | ✅     | ✅     | ✅             | ❌       | 同一包内的类 + 其他包中的子类可以访问      |
| 无修饰符    | ✅     | ✅     | ❌             | ❌       | **包访问**，只有同一包内的类可以访问       |
| `private`   | ✅     | ❌     | ❌             | ❌       | 只有当前类内部可以访问，其他任何类都不可以 |

```java
public class AccessExample {
    public int publicField = 1;        // 任何地方都可以访问
    protected int protectedField = 2;  // 同包 + 子类可以访问
    int packageField = 3;              // 同包可以访问（无修饰符）
    private int privateField = 4;      // 只有本类可以访问

    public void publicMethod() {
        // 任何地方都可以调用
    }

    protected void protectedMethod() {
        // 同包 + 子类可以调用
    }

    void packageMethod() {
        // 同包可以调用（无修饰符）
    }

    private void privateMethod() {
        // 只有本类可以调用
    }
}
```

### 访问级别总结

**可见性从高到低：**

```
public > protected > 包访问（无修饰符）> private
```

**常用场景：**

- `public`：对外暴露的 API、公共接口
- `protected`：希望子类可以访问或重写的方法
- 无修饰符：同一包内共享的工具方法或字段
- `private`：类的内部实现细节，不希望外部访问

> [!TIP]
> **封装原则**：默认情况下，应该将字段设为 `private`，通过 `public` 的 getter/setter 方法来访问和修改，这是面向对象编程的最佳实践。

```java
public class Person {
    private String name;  // 私有字段
    private int age;

    // 公共 getter
    public String getName() {
        return name;
    }

    // 公共 setter
    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age > 0) {  // 可以添加验证逻辑
            this.age = age;
        }
    }
}
```

## 构造方法（Constructor）

构造方法是一种特殊的方法，用于**初始化对象**。在使用 `new` 关键字创建对象时自动调用。

### 构造方法的特点

1. **方法名必须与类名完全相同**（包括大小写）
2. **没有返回值类型**（连 `void` 都不写）
3. **在创建对象时自动调用**
4. **可以重载**（可以有多个构造方法，参数列表不同）

```java
public class Person {
    private String name;
    private int age;

    // 构造方法：方法名与类名相同，无返回值类型
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

// 创建对象时调用构造方法
Person person = new Person("Alice", 25);
```

> [!TIP]
> JavaScript 使用固定的 `constructor` 关键字，且一个类只能有一个构造函数。
> Java 的构造方法名必须与类名相同，但可以通过重载定义多个。

### 构造方法重载

可以定义多个构造方法，参数列表不同：

```java
public class Person {
    private String name;
    private int age;

    // 无参构造方法
    public Person() {
        this.name = "Unknown";
        this.age = 0;
    }

    // 单参数构造方法
    public Person(String name) {
        this.name = name;
        this.age = 0;
    }

    // 双参数构造方法
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

// 使用不同的构造方法创建对象
Person p1 = new Person();                  // 调用无参构造
Person p2 = new Person("Alice");           // 调用单参数构造
Person p3 = new Person("Bob", 25);         // 调用双参数构造
```

### 参数默认值

> [!WARNING]
> **Java 不支持参数默认值！** 这与 JavaScript、Python 等语言不同。

**JavaScript 可以这样写：**

```javascript
class Person {
  constructor(name = 'Unknown', age = 0) {
    this.name = name
    this.age = age
  }
}

const p = new Person() // name: "Unknown", age: 0
```

**Java 不能这样写：**

```java
public class Person {
    private String name;
    private int age;

    // ❌ 编译错误：Java 不支持参数默认值
    public Person(String name = "Unknown", int age = 0) {
        this.name = name;
        this.age = age;
    }
}
```

**Java 的解决方案：通过方法重载模拟默认值**

```java
public class Person {
    private String name;
    private int age;

    // 主构造方法
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 模拟 age 的默认值
    public Person(String name) {
        this(name, 0);  // age 默认为 0
    }

    // 模拟 name 和 age 的默认值
    public Person() {
        this("Unknown", 0);  // name 默认为 "Unknown", age 默认为 0
    }
}

Person p1 = new Person("Alice", 25);  // name: "Alice", age: 25
Person p2 = new Person("Bob");        // name: "Bob", age: 0
Person p3 = new Person();             // name: "Unknown", age: 0
```

**对比总结：**

| 语言       | 支持参数默认值 | 实现方式                    |
| ---------- | -------------- | --------------------------- |
| JavaScript | ✅ 支持        | `function(param = value)`   |
| Python     | ✅ 支持        | `def func(param=value)`     |
| Java       | ❌ 不支持      | 通过方法重载（Overloading） |

### 字段的默认值

在 Java 中，如果字段（实例变量）**没有显式赋值**，Java 会自动赋予**默认值**：

| 数据类型         | 默认值     |
| ---------------- | ---------- |
| `byte`           | `0`        |
| `short`          | `0`        |
| `int`            | `0`        |
| `long`           | `0L`       |
| `float`          | `0.0f`     |
| `double`         | `0.0`      |
| `char`           | `'\u0000'` |
| `boolean`        | `false`    |
| 引用类型（对象） | `null`     |

```java
public class Person {
    private String name;     // 默认值：null
    private int age;         // 默认值：0
    private boolean active;  // 默认值：false

    public Person() {
        // 即使构造方法为空，字段也有默认值
    }

    public void printInfo() {
        System.out.println("Name: " + name);      // 输出：Name: null
        System.out.println("Age: " + age);        // 输出：Age: 0
        System.out.println("Active: " + active);  // 输出：Active: false
    }
}

Person p = new Person();
p.printInfo();
```

> [!TIP]
> JavaScript 中未初始化的类字段值为 `undefined`，而 Java 会根据类型自动赋予默认值。

**局部变量没有默认值：**

```java
public class Test {
    private int instanceVar;  // 实例变量，默认值为 0

    public void method() {
        int localVar;  // 局部变量，没有默认值
        // System.out.println(localVar);  // ❌ 编译错误：局部变量未初始化

        System.out.println(instanceVar);  // ✅ 正确：实例变量有默认值 0
    }
}
```

> [!WARNING]
> **局部变量**（方法内定义的变量）**必须显式初始化**才能使用，否则会编译错误。只有**字段**（类的成员变量）才有默认值。

### 默认构造方法

如果你**没有定义任何构造方法**，Java 编译器会自动提供一个**无参的默认构造方法**：

```java
public class Person {
    private String name;
    // 没有显式定义构造方法，Java 自动提供：
    // public Person() { }
}

Person p = new Person();  // ✅ 可以正常创建对象
```

但是，一旦你定义了**任何一个构造方法**，默认构造方法就**不会自动生成**：

```java
public class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }
}

Person p1 = new Person("Alice");  // ✅ 正确
Person p2 = new Person();         // ❌ 编译错误：没有无参构造方法
```

> [!WARNING]
> 如果定义了有参构造方法，但仍需要无参构造方法，必须显式定义。

### 构造方法中调用其他构造方法

可以使用 `this()` 在一个构造方法中调用同一个类的另一个构造方法，避免代码重复：

```java
public class Person {
    private String name;
    private int age;

    // 主构造方法
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 调用主构造方法
    public Person(String name) {
        this(name, 0);  // 调用 Person(String, int)
    }

    // 无参构造方法
    public Person() {
        this("Unknown", 0);  // 调用 Person(String, int)
    }
}
```

> [!WARNING]
> `this()` 必须是构造方法的**第一条语句**，且一个构造方法中只能调用一次其他构造方法。

### 构造方法 vs 普通方法

```java
public class Person {
    private String name;

    // 构造方法：方法名与类名相同，无返回值类型
    public Person(String name) {
        this.name = name;
    }

    // 普通方法：有返回值类型（即使是 void）
    public void person(String name) {
        this.name = name;
    }
}
```

| 特性       | 构造方法                 | 普通方法                  |
| ---------- | ------------------------ | ------------------------- |
| 方法名     | 必须与类名相同           | 任意合法标识符            |
| 返回值类型 | 没有（连 `void` 都不写） | 必须声明（可以是 `void`） |
| 调用时机   | 创建对象时自动调用       | 手动调用                  |
| 可以重载   | ✅ 可以                  | ✅ 可以                   |
| 可以被继承 | ❌ 不能被继承            | ✅ 可以被继承             |

## this 关键字

`this` 是一个引用变量，指向当前对象实例。

> [!TIP]
> 与 JavaScript 不同，Java 的 `this` **永远**指向当前对象实例，不会因为调用方式改变。
> JavaScript 的 `this` 取决于函数调用方式（函数调用、方法调用、`call/apply/bind` 等）。

### 用法 1：区分实例变量与参数

当参数名与实例变量同名时，使用 `this` 区分：

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;  // this.name 是实例变量，name 是参数
        this.age = age;
    }

    public void setName(String name) {
        this.name = name;  // 使用 this 明确指定是实例变量
    }
}
```

### 用法 2：构造方法中调用其他构造方法

在一个构造方法中调用同一个类的另一个构造方法，避免代码重复：

```java
public class Person {
    private String name;
    private int age;

    // 主构造方法
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 调用主构造方法
    public Person(String name) {
        this(name, 0);  // 调用 Person(String, int)
    }

    // 无参构造方法
    public Person() {
        this("Unknown", 0);  // 调用 Person(String, int)
    }
}
```

> [!WARNING]
> `this()` 必须是构造方法的**第一条语句**，且一个构造方法中只能调用一次其他构造方法。

### 用法 3：在方法中返回当前对象

返回 `this` 可以实现链式调用（Method Chaining）：

```java
public class Person {
    private String name;
    private int age;

    public Person setName(String name) {
        this.name = name;
        return this;  // 返回当前对象
    }

    public Person setAge(int age) {
        this.age = age;
        return this;  // 返回当前对象
    }
}

// 使用链式调用
Person person = new Person()
    .setName("Alice")
    .setAge(25);
```

### 用法 4：将当前对象作为参数传递

```java
public class Person {
    private String name;

    public void register(Database db) {
        db.save(this);  // 将当前对象传递给其他方法
    }
}
```

### 静态方法中不能使用 this

静态方法属于类而不是对象，因此不能使用 `this`：

```java
public class Person {
    private String name;
    private static int count = 0;

    public static void incrementCount() {
        count++;
        // this.name = "test";  // ❌ 编译错误：不能在静态方法中使用 this
    }
}
```

> [!TIP]
> JavaScript 的静态方法中 `this` 指向类本身，而 Java 的静态方法完全不能使用 `this`。

### this vs JavaScript 对比

| 特性     | Java `this`        | JavaScript `this`                      |
| -------- | ------------------ | -------------------------------------- |
| 指向     | 永远是当前对象实例 | 取决于调用方式（函数/方法/箭头函数等） |
| 绑定时机 | 编译时确定         | 运行时确定                             |
| 是否可变 | 不可变             | 可变（`call`/`apply`/`bind` 可改变）   |
| 静态方法 | 不能使用           | 指向类本身                             |
| 复杂度   | 简单、可预测       | 复杂，需要注意 `this` 丢失问题         |
