---
title: Inheritance and Polymorphism
date: 2026-02-02
category: java
---

## 继承（Inheritance）

使用 `extends` 关键字实现继承。

```java
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);  // 调用父类构造方法
    }

    public void bark() {
        System.out.println(name + " is barking");
    }
}
```

### 与 TypeScript 的区别

| 特性        | Java                                   | TypeScript                                    |
| ----------- | -------------------------------------- | --------------------------------------------- |
| 多继承      | ❌ 只支持单继承                        | ❌ 只支持单继承                               |
| 接口多实现  | ✅ 支持实现多个接口                    | ✅ 支持                                       |
| 根类/原型   | ✅ 所有类隐式继承 `Object`             | ✅ 所有对象继承自 `Object.prototype`          |
| 访问修饰符  | `public/protected/private`（运行时生效） | `public/protected/private`（仅编译时检查） |

### Object 类

所有 Java 类都**隐式继承** `Object` 类。

```java
public class Person {
    // 隐式 extends Object
}
```

常用方法：`toString()`、`equals()`、`hashCode()`、`getClass()` 等。

## 方法重写（Override）

子类可以重写父类的方法，提供自己的实现。

```java
public class Animal {
    public void makeSound() {
        System.out.println("Animal sound");
    }
}

public class Dog extends Animal {
    @Override  // 推荐使用注解，编译器会检查方法签名
    public void makeSound() {
        System.out.println("Woof!");
    }
}
```

### 方法重写的规则

1. **方法签名必须相同**（方法名、参数列表）
2. **返回类型必须相同或是协变类型**（子类型）
3. **访问修饰符不能更严格**（可以更宽松，如 `protected` → `public`）
4. **不能重写 `private`、`final`、`static` 方法**

### 方法重写 vs 方法重载

| 特性     | 方法重写（Override）   | 方法重载（Overload）   |
| -------- | ---------------------- | ---------------------- |
| 定义     | 子类重新实现父类的方法 | 同一个类中多个同名方法 |
| 参数列表 | 必须相同               | 必须不同               |
| 返回类型 | 相同或协变             | 可以不同               |
| 发生时机 | 运行时（动态绑定）     | 编译时（静态绑定）     |

## super 关键字

`super` 关键字用于引用父类的成员。

### 调用父类构造方法

```java
public class Dog extends Animal {
    public Dog(String name) {
        super(name);  // 必须是第一条语句
    }
}
```

> [!WARNING]
> `super()` 必须是构造方法的**第一条语句**。

### 访问父类方法

```java
public class Dog extends Animal {
    @Override
    public void eat() {
        super.eat();  // 调用父类的 eat 方法
        System.out.println("Dog is eating dog food");
    }
}
```

### 访问父类字段

当子类字段与父类字段同名时，使用 `super` 访问父类字段。

```java
System.out.println(super.name);  // 父类字段
```

## 多态（Polymorphism）

多态是指**同一个方法调用**，在不同对象上会产生不同的行为。

### 向上转型（Upcasting）

子类对象可以赋值给父类引用，这是**自动**的。

```java
Animal animal = new Dog("Buddy");  // 向上转型（自动）
animal.eat();   // ✅ 可以调用 Animal 的方法
// animal.bark();  // ❌ 不能调用 Dog 特有的方法

// 多态应用
Animal[] animals = {new Dog("Buddy"), new Cat("Whiskers")};
for (Animal animal : animals) {
    animal.makeSound();  // 每个对象调用自己的实现
}
```

### 向下转型（Downcasting）

父类引用转换为子类引用，需要**显式转换**，且可能失败。

```java
Animal animal = new Dog("Buddy");
Dog dog = (Dog) animal;  // 向下转型（显式）
dog.bark();  // ✅

// ❌ 危险：如果 animal 实际不是 Dog，会抛出 ClassCastException
```

### instanceof 关键字

在向下转型前，使用 `instanceof` 检查对象类型，避免 `ClassCastException`。

```java
Animal animal = new Dog("Buddy");

if (animal instanceof Dog) {
    Dog dog = (Dog) animal;
    dog.bark();  // 安全
}
```

**Java 16+ 模式匹配：**

```java
// 自动转换，无需手动类型转换
if (animal instanceof Dog dog) {
    dog.bark();
}
```

### 动态绑定

Java 在**运行时**根据对象的实际类型调用相应的方法（运行时多态）。

```java
Animal animal = new Dog("Buddy");
// animal 的编译时类型是 Animal，运行时类型是 Dog
animal.makeSound();  // 调用 Dog 的 makeSound()
```

## 构造方法链

创建子类对象时，会**自动调用父类的构造方法**。

```java
public class Parent {
    public Parent() {
        System.out.println("Parent constructor");
    }
}

public class Child extends Parent {
    public Child() {
        // super();  // 隐式调用，编译器自动添加
        System.out.println("Child constructor");
    }
}
```

> [!WARNING]
> 如果父类没有无参构造方法，子类构造方法必须显式调用 `super(参数)`。

### 初始化顺序

创建子类对象的完整初始化顺序：

1. 父类静态变量 + 静态代码块（类加载时，只执行一次）
2. 子类静态变量 + 静态代码块（类加载时，只执行一次）
3. 父类实例变量 + 实例代码块
4. 父类构造方法
5. 子类实例变量 + 实例代码块
6. 子类构造方法

## 最佳实践

1. **优先使用组合而非继承**：如果只是为了复用代码，考虑使用组合（Composition）
2. **继承用于 "is-a" 关系**：Dog is an Animal（继承），Car has an Engine（组合）
3. **使用 `@Override` 注解**：明确标识重写方法，避免错误
4. **避免继承层次过深**：一般不超过 3-4 层，否则代码难以维护
5. **父类构造方法**：如果父类没有无参构造方法，子类必须显式调用 `super()`
6. **向下转型前使用 `instanceof`**：避免 `ClassCastException`
7. **protected 用于继承**：需要被子类访问的成员使用 `protected`
