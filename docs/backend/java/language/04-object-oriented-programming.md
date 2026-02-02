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

## static 关键字

`static` 关键字用于定义**类级别**的成员（属于类本身，而非对象实例）。

### 静态变量（类变量）

静态变量被所有实例共享，只有一份，通常被用做为：

- 存储计数器
- 生成唯一 ID
- 存储不会改变的常量，比如 PI
- 创建和控制对共享资源的访问

```java
public class Counter {
    private static int count = 0;  // 静态变量，所有实例共享
    private int id;                // 实例变量，每个实例独立

    public Counter() {
        count++;
        this.id = count;
    }

    public static int getCount() {
        return count;
    }
}

Counter c1 = new Counter();  // count = 1, c1.id = 1
Counter c2 = new Counter();  // count = 2, c2.id = 2
Counter c3 = new Counter();  // count = 3, c3.id = 3

System.out.println(Counter.getCount());  // 输出：3（通过类名访问）
```

### 静态方法

静态方法属于类，不需要创建对象就可以调用：

```java
public class MathUtils {
    public static int add(int a, int b) {
        return a + b;
    }

    public static double square(double x) {
        return x * x;
    }
}

// 通过类名调用，不需要创建对象
int result = MathUtils.add(5, 3);      // 8
double squared = MathUtils.square(4);  // 16.0
```

**静态方法的限制：**

```java
public class Person {
    private String name;           // 实例变量
    private static int count = 0;  // 静态变量

    public static void printCount() {
        System.out.println(count);        // ✅ 可以访问静态变量
        // System.out.println(name);      // ❌ 不能访问实例变量
        // System.out.println(this.name); // ❌ 不能使用 this
    }

    public void printName() {
        System.out.println(name);   // ✅ 实例方法可以访问实例变量
        System.out.println(count);  // ✅ 实例方法也可以访问静态变量
    }
}
```

### 静态代码块

静态代码块在**类加载时执行一次**，用于初始化静态变量：

```java
public class Config {
    private static String apiUrl;
    private static int timeout;

    // 静态代码块：类加载时执行
    static {
        apiUrl = "https://api.example.com";
        timeout = 3000;
        System.out.println("Config initialized");
    }

    // 可以有多个静态代码块，按顺序执行
    static {
        System.out.println("Second static block");
    }
}
```

> [!TIP]
> TypeScript/JavaScript 没有静态代码块这个特性。

**执行顺序：**

```java
public class Demo {
    private static int x = 1;  // 1. 静态变量初始化

    static {                   // 2. 静态代码块
        System.out.println("Static block: x = " + x);
        x = 2;
    }

    private int y = 10;        // 3. 实例变量初始化（创建对象时）

    {                          // 4. 实例代码块（创建对象时）
        System.out.println("Instance block: y = " + y);
    }

    public Demo() {            // 5. 构造方法（创建对象时）
        System.out.println("Constructor: x = " + x + ", y = " + y);
    }
}

// 输出：
// Static block: x = 1         （类加载时执行一次）
// Instance block: y = 10      （每次 new 时执行）
// Constructor: x = 2, y = 10  （每次 new 时执行）
```

### 静态导入

可以直接导入静态成员，避免重复写类名：

```java
import static java.lang.Math.*;  // 导入 Math 类的所有静态成员

public class Test {
    public void calculate() {
        double result = sqrt(16) + PI;  // 不需要写 Math.sqrt() 和 Math.PI
        System.out.println(result);
    }
}
```

### 与 TypeScript 的区别

| 特性              | Java                     | TypeScript           |
| ----------------- | ------------------------ | -------------------- |
| 静态方法中的 this | ❌ 不能使用              | ✅ 指向类本身        |
| 静态代码块        | ✅ 支持 `static { ... }` | ❌ 不支持            |
| 静态导入          | ✅ `import static`       | ❌ 没有类似语法      |
| 访问静态成员      | 推荐用类名访问           | 类名或 `this` 都可以 |

### 常见使用场景

**1. 工具类方法**

```java
public class StringUtils {
    public static boolean isEmpty(String str) {
        return str == null || str.length() == 0;
    }

    public static String capitalize(String str) {
        if (isEmpty(str)) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
```

**2. 常量定义**

```java
public class Constants {
    public static final String APP_NAME = "MyApp";
    public static final int MAX_CONNECTIONS = 100;
    public static final double PI = 3.14159;
}
```

**3. 单例模式**

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {  // 私有构造方法
    }

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

**4. 计数器/共享状态**

```java
public class User {
    private static int totalUsers = 0;
    private String name;

    public User(String name) {
        this.name = name;
        totalUsers++;
    }

    public static int getTotalUsers() {
        return totalUsers;
    }
}
```
