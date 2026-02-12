---
title: Composition
date: 2026-02-12
category: java
---

## 组合（Composition）

组合是指**一个类包含另一个类的实例作为成员变量**，通过委托的方式复用代码，而不是通过继承。

### 基本示例

```java
// 组合：Car "has-a" Engine
public class Engine {
    private String type;

    public Engine(String type) {
        this.type = type;
    }

    public void start() {
        System.out.println(type + " engine starting...");
    }

    public void stop() {
        System.out.println(type + " engine stopping...");
    }
}

public class Car {
    private Engine engine;  // 组合：Car 包含 Engine
    private String brand;

    public Car(String brand, String engineType) {
        this.brand = brand;
        this.engine = new Engine(engineType);  // 创建 Engine 实例
    }

    public void start() {
        System.out.println(brand + " car starting...");
        engine.start();  // 委托给 Engine
    }

    public void stop() {
        engine.stop();  // 委托给 Engine
        System.out.println(brand + " car stopped.");
    }
}

// 使用
public class Test {
    public static void main(String[] args) {
        Car car = new Car("Toyota", "V6");
        car.start();
        // 输出：
        // Toyota car starting...
        // V6 engine starting...
    }
}
```

## 组合 vs 继承

### 关键区别

| 特性     | 继承（Inheritance）          | 组合（Composition）            |
| -------- | ---------------------------- | ------------------------------ |
| 关系     | "is-a" 关系（Dog is Animal） | "has-a" 关系（Car has Engine） |
| 耦合度   | 强耦合（子类依赖父类）       | 弱耦合（通过接口解耦）         |
| 灵活性   | 编译时确定，难以改变         | 运行时可以动态改变             |
| 代码复用 | 自动继承父类所有成员         | 需要显式委托                   |
| 多重复用 | 只能继承一个父类             | 可以组合多个类                 |
| 可见性   | 子类可以访问父类 protected   | 只能通过公共接口访问           |
| 破坏封装 | 可能破坏（子类依赖父类实现） | 不会破坏（通过接口交互）       |

### 继承的问题

```java
// ❌ 不好的设计：为了复用代码而继承
public class Stack extends ArrayList<Integer> {
    public void push(Integer item) {
        add(item);
    }

    public Integer pop() {
        return remove(size() - 1);
    }
}

// 问题：
// 1. Stack 暴露了 ArrayList 的所有方法（add, remove, clear 等）
// 2. 用户可以在任意位置插入元素，破坏了栈的 LIFO 特性
Stack stack = new Stack();
stack.push(1);
stack.add(0, 999);  // ❌ 可以调用，但不应该允许
```

### 使用组合改进

```java
// ✅ 好的设计：使用组合
public class Stack {
    private ArrayList<Integer> elements = new ArrayList<>();  // 组合

    public void push(Integer item) {
        elements.add(item);
    }

    public Integer pop() {
        if (elements.isEmpty()) {
            throw new EmptyStackException();
        }
        return elements.remove(elements.size() - 1);
    }

    public Integer peek() {
        if (elements.isEmpty()) {
            throw new EmptyStackException();
        }
        return elements.get(elements.size() - 1);
    }

    public boolean isEmpty() {
        return elements.isEmpty();
    }

    // 只暴露栈需要的方法，隐藏了 ArrayList 的其他方法
}
```

## 何时使用继承，何时使用组合

### 使用继承的场景

继承适用于**真正的 "is-a" 关系**：

- 子类是父类的特化版本（Dog is Animal）
- 需要多态行为（统一处理不同子类）
- 符合里氏替换原则（子类可以替换父类）

```java
// ✅ 需要统一处理不同类型的图形
public abstract class Shape {
    public abstract double area();
}

public class Circle extends Shape {
    private double radius;

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

// 多态使用
public double totalArea(Shape[] shapes) {
    double total = 0;
    for (Shape shape : shapes) {
        total += shape.area();  // 多态调用
    }
    return total;
}
```

### 使用组合的场景

组合适用于**"has-a" 关系**或**仅为了复用功能**：

**1. 仅为了代码复用**

```java
// ❌ 不要这样做
public class Employee extends ArrayList<String> { }

// ✅ 应该这样做
public class Employee {
    private List<String> skills = new ArrayList<>();  // 组合

    public void addSkill(String skill) {
        skills.add(skill);
    }
}
```

**2. 需要运行时改变行为**

```java
// 策略模式
public interface PaymentStrategy {
    void pay(double amount);
}

public class ShoppingCart {
    private PaymentStrategy paymentStrategy;  // 组合

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;  // 动态切换
    }

    public void checkout(double amount) {
        paymentStrategy.pay(amount);
    }
}
```

**3. 需要组合多个功能**

```java
public class SmartPhone {
    private Camera camera;
    private GPS gps;
    private MusicPlayer player;
    // 组合多个功能
}
```

## 组合的实现方式

### 1. 直接创建（强组合）

```java
public class Car {
    private Engine engine = new Engine();  // Car 创建 Engine
    // 当 Car 被销毁时，Engine 也会被销毁
}
```

### 2. 依赖注入（松耦合）

```java
public class Car {
    private Engine engine;

    public Car(Engine engine) {
        this.engine = engine;  // 从外部注入
    }
}

Engine engine = new Engine("V8");
Car car1 = new Car(engine);
Car car2 = new Car(engine);  // 多个 Car 可以共享同一个 Engine
```

### 3. 通过接口解耦（最佳实践）

```java
// 定义接口
public interface Engine {
    void start();
}

// Car 依赖接口，而不是具体实现
public class Car {
    private Engine engine;

    public Car(Engine engine) {
        this.engine = engine;
    }

    public void start() {
        engine.start();  // 不关心具体是什么引擎
    }
}

// 灵活使用不同的实现
Car electricCar = new Car(new ElectricEngine());
Car gasCar = new Car(new GasEngine());
```

## 实际案例对比

### 案例 1：文本编辑器的撤销功能

```java
// ❌ 继承：暴露了 Stack 的所有方法，破坏封装
public class UndoManager extends Stack<Command> {
    public void executeCommand(Command cmd) {
        push(cmd);
    }
}

// ✅ 组合：只暴露需要的方法
public class UndoManager {
    private Stack<Command> history = new Stack<>();

    public void executeCommand(Command cmd) {
        history.push(cmd);
    }

    public void undo() {
        if (!history.isEmpty()) {
            history.pop().undo();
        }
    }
}
```

### 案例 2：员工系统

```java
// ✅ 继承：真正的 "is-a" 关系，需要多态
public abstract class Employee {
    public abstract double calculateSalary();
}

public class FullTimeEmployee extends Employee {
    @Override
    public double calculateSalary() {
        return baseSalary;
    }
}

// 多态使用
public double calculateTotalPayroll(Employee[] employees) {
    double total = 0;
    for (Employee emp : employees) {
        total += emp.calculateSalary();  // 多态
    }
    return total;
}
```

```java
// ✅ 组合：需要混合多种能力
public class Employee {
    private List<Skill> skills = new ArrayList<>();  // 组合

    public void addSkill(Skill skill) {
        skills.add(skill);
    }
}

// 一个员工可以有多种技能
Employee alice = new Employee("Alice");
alice.addSkill(new JavaSkill());
alice.addSkill(new DesignSkill());  // 灵活组合
```

## 设计原则

### 组合复用原则（Composite Reuse Principle）

**优先使用对象组合，而不是类继承来实现代码复用。**

原因：

1. 继承破坏封装性，子类依赖父类的实现细节
2. 继承是静态的（编译时确定），组合是动态的（运行时可变）
3. Java 只支持单继承，但可以组合多个对象

### 依赖倒置原则（Dependency Inversion Principle）

**依赖抽象（接口），而不是具体实现。**

```java
// ❌ 依赖具体实现：强耦合
public class OrderService {
    private MySQLDatabase db = new MySQLDatabase();
}

// ✅ 依赖抽象：可以轻松切换实现
public class OrderService {
    private Database db;  // 依赖接口

    public OrderService(Database db) {
        this.db = db;
    }
}

OrderService service1 = new OrderService(new MySQLDatabase());
OrderService service2 = new OrderService(new MongoDatabase());
```

## 最佳实践

1. **优先考虑组合**：除非明确是 "is-a" 关系且需要多态，否则使用组合
2. **使用接口解耦**：组合时依赖接口，而不是具体类
3. **依赖注入**：通过构造方法或 setter 注入依赖，提高可测试性
4. **避免过度设计**：如果关系简单明确，不要为了组合而组合
5. **组合 + 接口 = 灵活性**：结合接口使用组合，可以获得最大的灵活性
6. **封装性**：组合不会暴露内部实现，保持良好的封装性
7. **单一职责**：每个类只负责一件事，通过组合多个类实现复杂功能

## 总结

| 选择依据               | 继承                  | 组合                    |
| ---------------------- | --------------------- | ----------------------- |
| 关系类型               | is-a（Dog is Animal） | has-a（Car has Engine） |
| 是否需要多态           | ✅ 需要               | ❌ 不需要               |
| 是否需要运行时改变行为 | ❌ 不支持             | ✅ 支持                 |
| 是否需要复用多个类     | ❌ 只能继承一个父类   | ✅ 可以组合多个         |
| 耦合度                 | 强耦合                | 弱耦合                  |
| 封装性                 | 可能破坏              | 保持良好                |
| 推荐度                 | 谨慎使用              | 优先使用                |

**原则：优先使用组合，只在真正的 "is-a" 关系且需要多态时才使用继承。**
