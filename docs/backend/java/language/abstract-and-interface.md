---
title: Abstract Classes and Interfaces
date: 2026-02-13
category: java
---

## 抽象类（Abstract Class）

抽象类是**不能被实例化的类**，使用 `abstract` 关键字定义，通常包含抽象方法（只有声明没有实现）。

### 基本语法

```java
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // 抽象方法：没有方法体
    public abstract void makeSound();

    // 具体方法：有实现
    public void sleep() {
        System.out.println(name + " is sleeping");
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }

    // 必须实现抽象方法
    @Override
    public void makeSound() {
        System.out.println(name + " barks: Woof!");
    }
}

// 使用
Animal dog = new Dog("Buddy");
dog.makeSound();  // 输出：Buddy barks: Woof!
dog.sleep();      // 输出：Buddy is sleeping
```

### 抽象类的特点

1. **不能实例化**

   ```java
   Animal animal = new Animal("Test");  // ❌ 编译错误
   Animal dog = new Dog("Buddy");       // ✅ 可以，多态
   ```

2. **可以有构造方法**（供子类调用）

   ```java
   public abstract class Animal {
       public Animal(String name) {
           this.name = name;
       }
   }
   ```

3. **可以有抽象方法和具体方法**

   ```java
   public abstract class Shape {
       public abstract double area();           // 抽象方法
       public void printInfo() {                // 具体方法
           System.out.println("Area: " + area());
       }
   }
   ```

4. **子类必须实现所有抽象方法**（除非子类也是抽象类）

   ```java
   public class Circle extends Shape {
       private double radius;

       @Override
       public double area() {  // 必须实现
           return Math.PI * radius * radius;
       }
   }
   ```

### 模板方法模式

抽象类常用于定义算法框架，让子类实现具体步骤。

```java
public abstract class DataProcessor {
    // 模板方法：定义算法框架
    public final void process() {
        readData();
        processData();  // 抽象方法，子类实现
        writeData();
    }

    private void readData() {
        System.out.println("Reading data...");
    }

    protected abstract void processData();  // 交给子类实现

    private void writeData() {
        System.out.println("Writing data...");
    }
}

public class CSVProcessor extends DataProcessor {
    @Override
    protected void processData() {
        System.out.println("Processing CSV data...");
    }
}

// 使用
DataProcessor processor = new CSVProcessor();
processor.process();
// 输出：
// Reading data...
// Processing CSV data...
// Writing data...
```

## 接口（Interface）

接口是**完全抽象的类型**，定义一组行为规范（方法签名），实现类必须提供这些方法的具体实现。

### 基本语法

```java
public interface Flyable {
    // 接口中的方法默认是 public abstract
    void fly();
    int getMaxAltitude();
}

public class Bird implements Flyable {
    @Override
    public void fly() {
        System.out.println("Bird is flying");
    }

    @Override
    public int getMaxAltitude() {
        return 10000;
    }
}

// 使用
Flyable bird = new Bird();
bird.fly();
```

### 接口的特点

1. **所有方法默认是 `public abstract`**

   ```java
   public interface Drawable {
       void draw();  // 等同于 public abstract void draw();
   }
   ```

2. **所有变量默认是 `public static final`**（常量）

   ```java
   public interface Constants {
       int MAX_SIZE = 100;  // 等同于 public static final int MAX_SIZE = 100;
   }
   ```

3. **支持多实现**

   ```java
   public class Duck implements Flyable, Swimmable {
       @Override
       public void fly() { ... }

       @Override
       public void swim() { ... }
   }
   ```

4. **接口可以继承接口**

   ```java
   public interface Animal {
       void eat();
   }

   public interface Mammal extends Animal {
       void breathe();
   }
   ```

### 默认方法（Java 8+）

接口可以提供默认实现，实现类可以选择是否覆盖。

```java
public interface Vehicle {
    void start();

    // 默认方法
    default void honk() {
        System.out.println("Beep beep!");
    }
}

public class Car implements Vehicle {
    @Override
    public void start() {
        System.out.println("Car starting...");
    }
    // 不覆盖 honk()，使用默认实现
}

Car car = new Car();
car.honk();  // 输出：Beep beep!
```

### 静态方法（Java 8+）

接口可以有静态方法，通过接口名调用。

```java
public interface MathUtils {
    static int add(int a, int b) {
        return a + b;
    }
}

int result = MathUtils.add(1, 2);  // 直接调用
```

### 私有方法（Java 9+）

接口可以有私有方法，用于复用代码。

```java
public interface Logger {
    default void logInfo(String message) {
        log("INFO", message);
    }

    default void logError(String message) {
        log("ERROR", message);
    }

    // 私有方法，避免代码重复
    private void log(String level, String message) {
        System.out.println("[" + level + "] " + message);
    }
}
```

## 抽象类 vs 接口

### 关键区别

| 特性         | 抽象类                       | 接口                         |
| ------------ | ---------------------------- | ---------------------------- |
| 关键字       | `abstract class`             | `interface`                  |
| 继承/实现    | 单继承（`extends`）          | 多实现（`implements`）       |
| 成员变量     | 可以有实例变量               | 只能有常量（`static final`） |
| 方法实现     | 可以有抽象和具体方法         | 默认抽象（除非 `default`）   |
| 构造方法     | 可以有                       | 不能有                       |
| 访问修饰符   | 可以是任意修饰符             | 方法默认 `public`            |
| 使用场景     | is-a 关系，代码复用          | can-do 能力，定义行为规范    |
| 设计意图     | 表示"是什么"（本质）         | 表示"能做什么"（能力）       |

### 何时使用抽象类

使用抽象类的场景：

1. **多个类有共同的实现和状态**

   ```java
   // ✅ 适合用抽象类：共享 name 和 age
   public abstract class Employee {
       protected String name;
       protected int age;

       public abstract double calculateSalary();

       public void printInfo() {  // 共同的实现
           System.out.println(name + ", " + age + " years old");
       }
   }
   ```

2. **需要定义模板方法**

   ```java
   public abstract class Game {
       public final void play() {  // 模板方法
           initialize();
           startPlay();
           endPlay();
       }

       protected abstract void initialize();
       protected abstract void startPlay();
       protected abstract void endPlay();
   }
   ```

3. **需要非公共成员**（`protected`, `private`）

### 何时使用接口

使用接口的场景：

1. **定义能力（不关心实现）**

   ```java
   // ✅ 适合用接口：定义"可比较"的能力
   public interface Comparable<T> {
       int compareTo(T other);
   }

   public class Person implements Comparable<Person> {
       @Override
       public int compareTo(Person other) {
           return this.age - other.age;
       }
   }
   ```

2. **需要多实现**

   ```java
   // 一个类可以实现多个接口
   public class Duck implements Flyable, Swimmable, Walkable {
       // ...
   }
   ```

3. **解耦和依赖注入**

   ```java
   // 依赖接口，而不是具体实现
   public class OrderService {
       private PaymentService paymentService;

       public OrderService(PaymentService service) {
           this.paymentService = service;
       }
   }
   ```

## 实际案例

### 案例 1：支付系统（接口）

```java
// 定义支付能力
public interface PaymentMethod {
    boolean pay(double amount);
    String getPaymentType();
}

public class CreditCard implements PaymentMethod {
    @Override
    public boolean pay(double amount) {
        System.out.println("Paid " + amount + " with credit card");
        return true;
    }

    @Override
    public String getPaymentType() {
        return "Credit Card";
    }
}

public class PayPal implements PaymentMethod {
    @Override
    public boolean pay(double amount) {
        System.out.println("Paid " + amount + " with PayPal");
        return true;
    }

    @Override
    public String getPaymentType() {
        return "PayPal";
    }
}

// 使用多态
public class PaymentProcessor {
    public void processPayment(PaymentMethod method, double amount) {
        System.out.println("Processing payment via " + method.getPaymentType());
        method.pay(amount);
    }
}

PaymentProcessor processor = new PaymentProcessor();
processor.processPayment(new CreditCard(), 100.0);
processor.processPayment(new PayPal(), 50.0);
```

### 案例 2：图形系统（抽象类 + 接口）

```java
// 接口：定义能力
public interface Drawable {
    void draw();
}

public interface Resizable {
    void resize(double factor);
}

// 抽象类：共享实现
public abstract class Shape implements Drawable {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }

    public abstract double area();

    public void printInfo() {  // 共同实现
        System.out.println("Color: " + color + ", Area: " + area());
    }
}

// 具体类
public class Circle extends Shape implements Resizable {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " circle");
    }

    @Override
    public void resize(double factor) {
        radius *= factor;
    }
}
```

## 设计原则

### 1. 面向接口编程

**依赖抽象（接口/抽象类），而不是具体实现。**

```java
// ❌ 依赖具体实现
public class UserService {
    private MySQLUserRepository repo = new MySQLUserRepository();
}

// ✅ 依赖接口
public class UserService {
    private UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }
}

// 可以轻松切换实现
UserService service1 = new UserService(new MySQLUserRepository());
UserService service2 = new UserService(new MongoUserRepository());
```

### 2. 接口隔离原则（ISP）

**客户端不应该依赖它不使用的方法。**

```java
// ❌ 臃肿的接口
public interface Worker {
    void work();
    void eat();
    void sleep();
}

// ✅ 拆分成多个小接口
public interface Workable {
    void work();
}

public interface Eatable {
    void eat();
}

public interface Sleepable {
    void sleep();
}

// 按需实现
public class Human implements Workable, Eatable, Sleepable {
    // 实现所有方法
}

public class Robot implements Workable {
    // 只实现 work()，不需要 eat() 和 sleep()
}
```

### 3. 里氏替换原则（LSP）

**子类对象可以替换父类对象，程序行为不变。**

```java
public abstract class Bird {
    public abstract void move();
}

public class Sparrow extends Bird {
    @Override
    public void move() {
        System.out.println("Flying");
    }
}

public class Penguin extends Bird {
    @Override
    public void move() {
        System.out.println("Walking");  // 企鹅不会飞，但不违反 move() 的约定
    }
}

// 可以安全替换
Bird bird1 = new Sparrow();
Bird bird2 = new Penguin();
bird1.move();
bird2.move();
```

## 最佳实践

1. **优先使用接口**：接口更灵活，支持多实现，降低耦合度
2. **抽象类用于代码复用**：多个类有共同实现时使用抽象类
3. **接口用于能力定义**：定义"能做什么"而不是"是什么"
4. **合理使用 default 方法**：避免破坏已有实现类，但不要滥用
5. **接口命名**：
   - 能力型接口：`-able` 结尾（`Comparable`, `Runnable`）
   - 监听器接口：`-Listener` 结尾（`ClickListener`）
   - 策略型接口：`-Strategy` 结尾（`PaymentStrategy`）
6. **单一职责**：一个接口只定义一组相关的行为
7. **避免标记接口**：不要定义空接口，使用注解代替

## 常见的 Java 接口

### JDK 核心接口

```java
// Comparable：定义自然排序
public interface Comparable<T> {
    int compareTo(T o);
}

// Runnable：定义可执行任务
public interface Runnable {
    void run();
}

// Iterable：定义可迭代对象
public interface Iterable<T> {
    Iterator<T> iterator();
}

// Serializable：标记接口，表示可序列化
public interface Serializable {
    // 空接口
}
```

## 总结

| 选择依据               | 抽象类           | 接口               |
| ---------------------- | ---------------- | ------------------ |
| 是否需要共享状态       | ✅ 需要          | ❌ 不适合          |
| 是否需要多继承/实现    | ❌ 单继承        | ✅ 多实现          |
| 是否需要定义能力       | ❌ 不适合        | ✅ 适合            |
| 是否需要模板方法       | ✅ 适合          | ❌ 不适合          |
| 是否需要构造方法       | ✅ 可以有        | ❌ 不能有          |
| 设计意图               | 表示"是什么"     | 表示"能做什么"     |

**原则：优先使用接口，除非需要共享实现或状态，才使用抽象类。**
