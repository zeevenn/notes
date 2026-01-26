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

| 访问修饰符 | 描述                                                                 |
| ---------- | -------------------------------------------------------------------- |
| `public`   | 任何其他包中的类都可以访问此类                                       |
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
