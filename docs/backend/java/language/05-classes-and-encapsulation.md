---
title: Classes and Encapsulation
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

**可见性从高到低：** `public > protected > 包访问（无修饰符）> private`

> [!TIP]
> **封装原则**：字段应该设为 `private`，通过 `public` 的 getter/setter 方法访问。

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

### 构造方法重载与参数默认值

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

**Java 的解决方案：通过构造方法重载模拟默认值**

```java
public class Person {
    private String name;
    private int age;

    // 主构造方法
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 模拟 age 的默认值为 0
    public Person(String name) {
        this(name, 0);
    }

    // 模拟 name 和 age 的默认值
    public Person() {
        this("Unknown", 0);
    }
}

Person p1 = new Person("Alice", 25);  // name: "Alice", age: 25
Person p2 = new Person("Bob");        // name: "Bob", age: 0
Person p3 = new Person();             // name: "Unknown", age: 0
```

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

### 主要用法

**1. 区分实例变量与参数**

```java
public Person(String name, int age) {
    this.name = name;  // this.name 是实例变量，name 是参数
    this.age = age;
}
```

**2. 构造方法中调用其他构造方法**

```java
public Person(String name) {
    this(name, 0);  // 调用 Person(String, int)，必须是第一条语句
}
```

**3. 返回当前对象（链式调用）**

```java
public Person setName(String name) {
    this.name = name;
    return this;  // 返回当前对象
}

// 链式调用
Person person = new Person().setName("Alice").setAge(25);
```

**4. 将当前对象作为参数传递**

```java
public void register(Database db) {
    db.save(this);  // 将当前对象传递给其他方法
}
```

## 封装（Encapsulation）

封装是面向对象编程的核心原则之一，指将数据（字段）私有化，通过公共方法（getter/setter）来访问和修改，以便控制访问权限和添加验证逻辑。

```java
public class Person {
    private String name;  // 字段私有化
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("Age must be between 0 and 150");
        }
        this.age = age;
    }
}
```

### Getter/Setter 命名规范

| 方法类型 | 命名规则                     | 示例                        |
| -------- | ---------------------------- | --------------------------- |
| Getter   | `get` + 字段名（首字母大写） | `getName()`, `getAge()`     |
| Setter   | `set` + 字段名（首字母大写） | `setName()`, `setAge()`     |
| Boolean  | `is` + 字段名（首字母大写）  | `isActive()`, `isMarried()` |

> [!TIP]
> 现代 IDE 可以自动生成 getter/setter 方法。

## JavaBeans 规范

JavaBeans 是一种 Java 类的设计规范，广泛用于各种框架（如 Spring、Hibernate 等）。

### 基本要求

1. **必须有无参的公共构造方法**
2. **字段私有化**
3. **通过 getter/setter 方法访问字段**
4. **可序列化**（可选）

```java
public class User {
    private String username;
    private int age;

    // 无参构造方法（必须）
    public User() {
    }

    // Getter/Setter 方法
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

> [!TIP]
> 很多框架（如 Spring MVC、Hibernate、Jackson）通过反射调用 getter/setter 方法来自动填充或序列化对象。

### Record（Java 14+）

**Java 14** 引入了 `record` 关键字，用于创建**不可变数据类**，自动生成构造方法、getter、`equals()`、`hashCode()` 和 `toString()` 方法。

```java
// 传统写法：需要手写大量样板代码
public class Person {
    private final String name;
    private final int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    @Override
    public boolean equals(Object o) {
        // ... 很多代码
    }

    @Override
    public int hashCode() {
        // ... 很多代码
    }

    @Override
    public String toString() {
        // ... 很多代码
    }
}

// Record 写法：一行搞定
public record Person(String name, int age) {
}
```

**Record 的特点：**

- **自动生成构造方法**：`new Person("Alice", 25)`
- **自动生成 getter**：`person.name()`（注意：不是 `getName()`）
- **自动生成 `equals()`、`hashCode()`、`toString()`**
- **所有字段都是 `final`**，对象不可变
- **不能被继承**（隐式 `final`）

```java
public record User(String username, String email, int age) {
}

// 使用
User user = new User("alice", "alice@example.com", 25);
System.out.println(user.username());  // alice（getter 方法名是字段名，不是 getUsername）
System.out.println(user.age());       // 25
System.out.println(user);             // User[username=alice, email=alice@example.com, age=25]
```

**Record 可以添加自定义方法和验证逻辑：**

```java
public record Person(String name, int age) {
    // 自定义构造方法：添加验证逻辑
    public Person {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
    }

    // 自定义方法
    public boolean isAdult() {
        return age >= 18;
    }
}

Person person = new Person("Alice", 25);
System.out.println(person.isAdult());  // true
```

**Record vs 传统类：**

| 特性           | Record                   | 传统类                     |
| -------------- | ------------------------ | -------------------------- |
| 不可变性       | ✅ 强制不可变            | ❌ 需要手动用 `final` 实现 |
| Getter 方法名  | `fieldName()`            | `getFieldName()`           |
| 样板代码       | ✅ 自动生成              | ❌ 需要手写或 IDE/Lombok   |
| 继承           | ❌ 不能被继承            | ✅ 可以继承                |
| 实现接口       | ✅ 可以                  | ✅ 可以                    |
| 适用场景       | 纯数据对象（DTO、VO 等） | 需要可变性或继承的业务对象 |

> [!TIP]
> Record 非常适合用作 DTO（Data Transfer Object）、API 响应对象、配置类等纯数据承载对象。

### 最佳实践

1. **JavaBean**：用于需要框架支持（Spring、Hibernate 等）或需要可变性的场景
2. **Record**：用于不可变的数据对象，如 DTO、值对象、配置类
3. **重写 `toString()`、`equals()`、`hashCode()`**：JavaBean 需要手动或用 IDE/Lombok 生成，Record 自动生成
4. **无参构造方法**：JavaBean 必须提供，Record 不支持无参构造
