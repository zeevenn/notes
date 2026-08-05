---
title: 程序基本结构
date: 2026-08-05
category: java
---

普通 Java 程序由源码文件中的类型声明组成。命令行应用启动时，`java` 启动器加载指定类并调用一个可启动的 `main` 方法。

```java
public class App {
    public static void main(String[] args) {
        System.out.println("Hello, Java");
    }
}
```

这段代码建立了最小完整流程：

```text
App.java 源码
    ↓ javac 编译
App.class 字节码
    ↓ java 启动
JVM 加载 App 并调用 main
```

## JDK、JVM 与 Java 命令

- JDK（Java Development Kit，Java 开发工具包）：包含编译器、启动器、调试和文档工具，以及运行程序所需的组件；
- JVM（Java Virtual Machine，Java 虚拟机）：执行 `.class` 字节码，负责类加载、运行时内存和垃圾收集等；
- `javac`：把 `.java` 源码编译为 `.class` 字节码；
- `java`：启动 JVM 并运行指定类、JAR 或源码文件。

查看当前工具版本：

```bash
java --version
javac --version
```

编译器和运行时应使用兼容版本。用较新 JDK 编译出的 class 文件，较旧 JVM 可能无法读取。

## 编译并运行第一个程序

假设当前目录包含 `App.java`：

```java
public class App {
    public static void main(String[] args) {
        System.out.println("Hello, Java");
    }
}
```

执行：

```bash
javac App.java
java App
```

`javac` 生成 `App.class`。`java App` 接收的是类名，不是 `App.class` 文件名。

源码文件名需要与其中的 `public` 顶级类型名称一致。一个源码文件可以声明多个顶级类型，但最多只能有一个 `public` 顶级类型。

## `main` 方法

长期以来最常见的入口形式是：

```java
public static void main(String[] args)
```

各部分含义：

- `public`：启动器能够访问该方法；
- `static`：传统入口不需要先创建 `App` 对象；
- `void`：不返回退出状态；
- `main`：启动器识别的方法名；
- `String[] args`：命令行参数。

```java
public class App {
    public static void main(String[] args) {
        for (int index = 0; index < args.length; index++) {
            System.out.println(index + ": " + args[index]);
        }
    }
}
```

运行：

```bash
java App hello Java
```

输出：

```text
0: hello
1: Java
```

一个项目可以有多个包含 `main` 的类。启动命令选择其中一个作为本次进程入口，并不存在“整个工程只能有一个 `main`”的限制。

## 类、文件与执行

普通 Java 源码的顶层结构是类型声明，例如类、接口、枚举、Record 和注解类型。普通类式源码不能直接把可执行语句写在类型外部：

```java
// System.out.println("Hello"); // 普通编译单元中不合法

public class App {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

`import` 只影响源码中的名称解析，不表示“执行被导入文件”。类型首次主动使用时，JVM 才根据运行时规则加载并初始化相关类。

应用入口通常只负责组装依赖和启动主流程，不应承载全部业务逻辑：

```java
public class App {
    public static void main(String[] args) {
        Application application = Application.create();
        application.run(args);
    }
}
```

## 包中的程序

真实项目通常使用具名包。源码 `src/com/example/App.java`：

```java
package com.example;

public class App {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

编译和运行：

```bash
javac -d out src/com/example/App.java
java -cp out com.example.App
```

启动器使用全限定类名 `com.example.App`。`-cp out` 告诉运行时从 `out` 类路径根目录查找 `com/example/App.class`。

## Java 11 的单文件源码启动

Java 11 增加了直接启动单个源码文件的能力：

```bash
java App.java
```

在 Java 11 中，源码仍然需要普通类声明和标准 `main` 方法：

```java
public class App {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

启动器在内存中编译源码并立即运行，省去了手动执行 `javac` 的步骤。它没有在 Java 11 中引入顶层语句或省略 `main` 的语法。

这种模式适合单文件示例和小工具。多文件工程仍应使用正常编译流程及 Maven、Gradle 等构建工具管理依赖与产物。

## 紧凑源文件与实例 main [Java 25+]

Java 25 正式引入紧凑源文件（compact source file）和实例 `main` 方法。入门示例可以省略显式类声明以及传统入口修饰符：

```java
void main() {
    System.out.println("Hello, Java");
}
```

保存为 `Hello.java` 后可直接运行：

```bash
java Hello.java
```

编译器会把紧凑源文件视为隐式声明了一个类；文件中的字段和方法是这个隐式类的成员。紧凑源文件没有允许任意语句直接出现在文件顶层，语句仍然位于方法体中。

这是一条降低入门样板代码的语法路径，不是独立脚本语言。学习变量、控制流和方法后，可以把同样的成员放入显式类，并逐步加入包、访问控制和模块边界。

本知识库以 Java 17 为默认基线，因此主学习路径仍使用传统类和 `public static void main(String[] args)`。只有项目明确以 Java 25 或更高版本为最低要求时，才把紧凑源文件作为默认入口形式。

## 编译错误与运行时错误

基础阶段需要区分错误发生在哪个阶段：

| 阶段 | 示例 | 典型结果 |
| --- | --- | --- |
| 编译期 | 类型不匹配、局部变量未初始化、语法错误 | `javac` 失败，不生成可用字节码 |
| 启动期 | 类路径中找不到入口类 | `ClassNotFoundException` 或启动器错误 |
| 链接/加载期 | 依赖版本不一致、缺少方法 | `NoClassDefFoundError`、`NoSuchMethodError` |
| 运行期 | 空引用解引用、数组越界 | 抛出相应异常 |

先判断失败阶段，再检查源码、编译参数、类路径或运行数据，可以缩小排查范围。

## 相关内容

- [包与导入](./packages-and-imports.md)
- [变量与运算符](./variables-and-operators.md)
- [方法](./methods.md)
- [类与封装](./classes-and-encapsulation.md)
- [Maven](../maven.md)

## 参考资料

- [JEP 330：Launch Single-File Source-Code Programs](https://openjdk.org/jeps/330)
- [JEP 512：Compact Source Files and Instance Main Methods](https://openjdk.org/jeps/512)
- [Java Virtual Machine Specification 17：Virtual Machine Start-Up](https://docs.oracle.com/javase/specs/jvms/se17/html/jvms-5.html#jvms-5.2)
