---
title: Static and Final
date: 2026-02-02
category: java
---

## static 关键字

`static` 关键字用于定义**类级别**的成员（属于类本身，而非对象实例）。

### 静态变量（类变量）

静态变量被所有实例共享，只有一份。

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

Counter c1 = new Counter();  // count = 1
Counter c2 = new Counter();  // count = 2
System.out.println(Counter.getCount());  // 2（通过类名访问）
```

### 静态方法

静态方法属于类，不需要创建对象就可以调用。

```java
public class MathUtils {
    public static int add(int a, int b) {
        return a + b;
    }
}

int result = MathUtils.add(5, 3);  // 通过类名调用
```

**限制：**

- ❌ 静态方法不能访问实例变量
- ❌ 静态方法不能使用 `this` 关键字
- ✅ 静态方法可以访问静态变量
- ✅ 实例方法可以访问静态变量

### 静态代码块

静态代码块在**类加载时执行一次**，用于初始化静态变量。

```java
public class Config {
    private static String apiUrl;

    static {
        apiUrl = "https://api.example.com";
        System.out.println("Config initialized");
    }
}
```

**初始化顺序：**

1. 静态变量初始化
2. 静态代码块（类加载时执行一次）
3. 实例变量初始化（创建对象时）
4. 实例代码块（创建对象时）
5. 构造方法（创建对象时）

### 静态导入

可以直接导入静态成员，避免重复写类名。

```java
import static java.lang.Math.*;

double result = sqrt(16) + PI;  // 不需要写 Math.sqrt() 和 Math.PI
```

### 与 TypeScript 的区别

| 特性              | Java                     | TypeScript           |
| ----------------- | ------------------------ | -------------------- |
| 静态方法中的 this | ❌ 不能使用              | ✅ 指向类本身        |
| 静态代码块        | ✅ 支持 `static { ... }` | ❌ 不支持            |
| 静态导入          | ✅ `import static`       | ❌ 没有类似语法      |
| 访问静态成员      | 推荐用类名访问           | 类名或 `this` 都可以 |

### 常见使用场景

**1. 工具类**

```java
public class StringUtils {
    public static boolean isEmpty(String str) {
        return str == null || str.length() == 0;
    }
}
```

**2. 常量定义**

```java
public class Constants {
    public static final String APP_NAME = "MyApp";
    public static final int MAX_CONNECTIONS = 100;
}
```

**3. 单例模式**

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {
    }

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

## final 关键字

`final` 关键字用于声明**不可变**的实体，可以修饰变量、方法和类。

### final 变量

`final` 变量一旦赋值后就**不能再修改**。

```java
final int x = 10;
// x = 20;  // ❌ 编译错误

final StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");  // ✅ 引用不可变，但对象内容可变
// sb = new StringBuilder();  // ❌ 不能改变引用
```

> [!TIP]
> 类似于 JavaScript 的 `const`：基本类型不可变，引用类型的引用不可变但内容可变。

**final 实例变量必须初始化：**

```java
public class Person {
    private final String name;  // 必须在构造方法中初始化

    public Person(String name) {
        this.name = name;
    }
}
```

**类常量（static final）：**

```java
public class Constants {
    public static final String APP_NAME = "MyApp";  // 命名规范：全大写
    public static final int MAX_CONNECTIONS = 100;
}
```

### final 方法

`final` 方法**不能被子类重写**。

```java
public class Parent {
    public final void calculate() {
        System.out.println("Cannot override");
    }
}

public class Child extends Parent {
    // ❌ 编译错误：不能重写 final 方法
    // public void calculate() { }
}
```

**使用场景：** 防止子类改变关键的业务逻辑。

### final 类

`final` 类**不能被继承**。

```java
public final class ImmutablePerson {
    private final String name;
    private final int age;

    public ImmutablePerson(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge() { return age; }
}

// ❌ 编译错误：不能继承 final 类
// public class Child extends ImmutablePerson { }
```

**常见的 final 类：** `String`、`Integer`、`Math`、`System` 等。

**使用场景：**

- 不可变类（所有字段都是 `final`）
- 工具类（所有方法都是 `static`）

### 总结

| 修饰对象 | 效果            | 常见用途         |
| -------- | --------------- | ---------------- |
| 变量     | 值/引用不能改变 | 常量定义         |
| 方法     | 不能被子类重写  | 保护关键逻辑     |
| 类       | 不能被继承      | 不可变类、工具类 |

### 最佳实践

1. **常量命名**：`public static final` 常量使用全大写 + 下划线

   ```java
   public static final int MAX_SIZE = 100;
   ```

2. **不可变类设计**：类和所有字段都用 `final` 修饰，只提供 getter

   ```java
   public final class Point {
       private final int x;
       private final int y;
       // 构造方法 + getter，无 setter
   }
   ```

3. **工具类设计**：类用 `final` 修饰，构造方法私有化

   ```java
   public final class Utils {
       private Utils() { }  // 防止实例化
       public static void doSomething() { }
   }
   ```
