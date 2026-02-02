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

封装是面向对象编程的核心原则之一，指将数据（字段）和操作数据的方法绑定在一起，并隐藏内部实现细节。

### 封装的原则

1. **字段私有化**：使用 `private` 修饰字段
2. **提供公共接口**：通过 `public` 的 getter/setter 方法访问和修改字段
3. **隐藏实现细节**：外部只能通过方法访问，不能直接操作字段

**不好的做法：**

```java
public class Person {
    public String name;  // ❌ 字段暴露，任何人都可以随意修改
    public int age;
}

Person person = new Person();
person.age = -5;  // ❌ 可以设置不合理的值，没有验证
```

**好的做法：**

```java
public class Person {
    private String name;  // ✅ 字段私有化
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

Person person = new Person();
person.setAge(25);   // ✅ 通过方法设置，有验证逻辑
// person.setAge(-5);  // ✅ 抛出异常，不允许不合理的值
```

### Getter 和 Setter 命名规范

Java 遵循 **JavaBeans** 命名规范：

| 方法类型 | 命名规则                     | 示例                             |
| -------- | ---------------------------- | -------------------------------- |
| Getter   | `get` + 字段名（首字母大写） | `getName()`, `getAge()`          |
| Setter   | `set` + 字段名（首字母大写） | `setName(String)`, `setAge(int)` |
| Boolean  | `is` + 字段名（首字母大写）  | `isActive()`, `isMarried()`      |

```java
public class User {
    private String username;
    private boolean active;
    private boolean married;

    // Getter：get + 字段名
    public String getUsername() {
        return username;
    }

    // Setter：set + 字段名
    public void setUsername(String username) {
        this.username = username;
    }

    // Boolean 类型的 Getter：is + 字段名
    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isMarried() {
        return married;
    }

    public void setMarried(boolean married) {
        this.married = married;
    }
}
```

> [!TIP]
> 现代 IDE（如 IntelliJ IDEA）可以自动生成符合规范的 getter/setter 方法。

### 只读属性

如果只提供 getter 而不提供 setter，字段就是**只读的**：

```java
public class Product {
    private final String id;  // 一旦设置就不能修改
    private String name;
    private double price;

    public Product(String id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    // 只提供 getter，不提供 setter → 只读属性
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        this.price = price;
    }
}

Product product = new Product("P001", "Laptop", 999.99);
System.out.println(product.getId());  // ✅ 可以读取
// product.setId("P002");  // ❌ 编译错误：没有 setId 方法
```

### 计算属性

Getter 方法可以返回计算的结果，而不一定直接返回字段值：

```java
public class Rectangle {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        if (width <= 0) {
            throw new IllegalArgumentException("Width must be positive");
        }
        this.width = width;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        if (height <= 0) {
            throw new IllegalArgumentException("Height must be positive");
        }
        this.height = height;
    }

    // 计算属性：没有对应的字段，每次调用时计算
    public double getArea() {
        return width * height;
    }

    public double getPerimeter() {
        return 2 * (width + height);
    }
}

Rectangle rect = new Rectangle(10, 5);
System.out.println(rect.getArea());       // 50.0
System.out.println(rect.getPerimeter());  // 30.0
```

### 封装的优势

1. **数据验证**：在 setter 中添加验证逻辑，防止不合法的数据
2. **灵活性**：可以随时修改内部实现，不影响外部代码
3. **只读/只写控制**：通过提供或不提供 getter/setter 控制访问权限
4. **计算属性**：可以提供动态计算的属性，而不是直接暴露字段
5. **调试和日志**：可以在 getter/setter 中添加日志，追踪数据变化

## JavaBeans 规范

JavaBeans 是一种 Java 类的设计规范，广泛用于各种框架（如 Spring、Hibernate、JSP 等）。

### JavaBeans 的要求

一个标准的 JavaBean 必须满足：

1. **必须有一个无参的公共构造方法**
2. **字段必须是私有的**
3. **通过公共的 getter/setter 方法访问字段**
4. **可序列化**（实现 `Serializable` 接口，可选）

```java
import java.io.Serializable;

public class User implements Serializable {
    // 1. 字段私有化
    private String username;
    private String email;
    private int age;

    // 2. 无参构造方法（必须）
    public User() {
    }

    // 3. 有参构造方法（可选，但推荐提供）
    public User(String username, String email, int age) {
        this.username = username;
        this.email = email;
        this.age = age;
    }

    // 4. Getter/Setter 方法
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

### JavaBeans 的使用场景

**1. 框架自动绑定**

很多框架会通过反射调用 getter/setter 方法：

```java
// Spring MVC 自动将请求参数绑定到 JavaBean
@PostMapping("/users")
public String createUser(User user) {  // 自动调用 setter 方法填充数据
    // user 对象已经被自动填充
    System.out.println(user.getUsername());
    return "success";
}
```

**2. ORM 框架（如 Hibernate、JPA）**

```java
@Entity
@Table(name = "users")
public class User implements Serializable {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "username")
    private String username;

    // 必须有无参构造方法，Hibernate 需要用它创建对象
    public User() {
    }

    // Getter/Setter 方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
```

**3. JSON 序列化/反序列化（如 Jackson、Gson）**

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public class Demo {
    public void test() throws Exception {
        User user = new User("alice", "alice@example.com", 25);

        // 序列化为 JSON：调用 getter 方法
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(user);
        System.out.println(json);  // {"username":"alice","email":"alice@example.com","age":25}

        // 反序列化：调用无参构造方法 + setter 方法
        User user2 = mapper.readValue(json, User.class);
        System.out.println(user2.getUsername());  // alice
    }
}
```

### 常见的增强方法

除了基本的 getter/setter，JavaBean 通常还会添加这些方法：

```java
import java.io.Serializable;
import java.util.Objects;

public class User implements Serializable {
    private String username;
    private String email;
    private int age;

    public User() {
    }

    public User(String username, String email, int age) {
        this.username = username;
        this.email = email;
        this.age = age;
    }

    // Getter/Setter 略...

    // toString()：方便调试和日志
    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", age=" + age +
                '}';
    }

    // equals()：判断两个对象是否相等
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return age == user.age &&
                Objects.equals(username, user.username) &&
                Objects.equals(email, user.email);
    }

    // hashCode()：用于 HashMap、HashSet 等集合
    @Override
    public int hashCode() {
        return Objects.hash(username, email, age);
    }
}
```

> [!TIP]
> 现代 IDE 可以自动生成 `toString()`、`equals()` 和 `hashCode()` 方法。
> Lombok 库可以通过注解自动生成这些方法：`@Data`、`@Getter`、`@Setter` 等。

### 最佳实践

1. **遵循命名规范**：严格按照 `get`/`set`/`is` 规范命名，否则框架可能无法识别
2. **提供无参构造方法**：即使有有参构造方法，也要显式提供无参构造方法
3. **字段验证**：在 setter 中添加必要的验证逻辑
4. **实现 Serializable**：如果对象需要序列化（网络传输、缓存、持久化），实现 `Serializable` 接口
5. **重写 toString()**：方便调试和日志输出
6. **按需重写 equals() 和 hashCode()**：如果对象需要用于集合或比较，务必正确实现这两个方法
