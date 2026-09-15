---
title: 程序基本结构
date: 2026-08-05
category: java
---

Java 命令行程序从指定类的 `main` 方法开始执行。下面以 Java 17 为基线，完成保存源码、编译和运行的过程。

## 编译并运行第一个程序

需要安装 JDK（Java Development Kit，Java 开发工具包），其中包含编译和运行程序所需的工具。确认命令可用：

```bash
java --version
javac --version
```

将以下代码保存为 `App.java`：

```java
public class App {
    public static void main(String[] args) {
        System.out.println("Hello, Java");
    }
}
```

在文件所在目录执行：

```bash
javac App.java
java App
```

输出：

```text
Hello, Java
```

`javac` 把源码编译成 `App.class`，其中存放的是字节码，即 Java 虚拟机可执行的指令。`java App` 启动 JVM（Java Virtual Machine，Java 虚拟机），调用 `App` 类的 `main` 方法。

```text
App.java → javac 编译 → App.class → java App → 执行 main
```

编译命令接收文件名 `App.java`；上述运行命令接收类名 `App`，不能写成 `java App.class`。修改源码后，需要重新编译才能让 `java App` 执行新代码。

## 示例中的代码结构

这个程序有三层：

- **类**：`class App` 声明名为 `App` 的类，外层 `{}` 包含类的内容。
- **方法**：`main` 是类中的一段可调用代码，它的 `{}` 包含启动后要执行的语句。
- **语句**：`System.out.println("Hello, Java");` 向控制台输出一行文字，末尾的 `;` 表示这条语句结束。

使用 `javac` 编译时，`public class App` 必须保存在 `App.java` 中，大小写也要一致。示例中的输出语句写在 `main` 方法内部，不能直接放到类外。

## `main` 方法与命令行参数

传统入口的写法是：

```java
public static void main(String[] args)
```

- `public`：公开方法，满足传统启动器的访问要求；
- `static`：静态方法，调用入口时不需要先创建 `App` 对象；
- `void`：方法不返回值；
- `main`：启动器识别的方法名；
- `String[] args`：名为 `args` 的字符串数组，用来接收命令行参数。

Java 20 及更早版本要求上述入口形式；从 Java 5 起，`String[] args` 也可写成等价的 `String... args`。无参数的 `public static void main()` 可以编译，但这些版本的启动器不会将它识别为入口。

例如：

```bash
java App hello Java
```

此时 `args` 包含两个字符串：`args[0]` 是 `"hello"`，`args[1]` 是 `"Java"`，数组下标从 `0` 开始。前面的程序没有读取 `args`，所以仍然只输出 `Hello, Java`。不传参数时，`args` 是空数组。

## 直接运行源码 [Java 11+]

前面的 `App.java` 也可以用一条命令运行：

```bash
java App.java
```

启动器在内存中编译源码后立即执行，不向当前目录输出 `.class` 文件。

## 紧凑源文件与实例 main [Java 25+]

Java 25 正式支持紧凑源文件，即可以省略显式类声明的源码文件；入口也可以写成不带 `static` 的实例方法。保存以下代码为 `Hello.java`：

```java
void main() {
    System.out.println("Hello, Java");
}
```

使用 JDK 25 或更高版本运行 `java Hello.java`，输出 `Hello, Java`。启动器会创建对象并调用 `main`，输出语句仍然写在方法内部。

简化入口在 Java 21～24 中属于需要启用 `--enable-preview` 的预览功能。

## 参考资料

- [Oracle Java Tutorials：理解 Hello World 程序](https://docs.oracle.com/javase/tutorial/getStarted/application/index.html)
- [Dev.java：Getting Started with Java](https://dev.java/learn/getting-started/)
- [Java 17：`java` 启动器](https://docs.oracle.com/en/java/javase/17/docs/specs/man/java.html)
- [Java Language Specification 17：顶级类与接口声明](https://docs.oracle.com/javase/specs/jls/se17/html/jls-7.html#jls-7.6)
- [Java 25：紧凑源文件与实例 main](https://docs.oracle.com/en/java/javase/25/language/compact-source-files-instance-main-methods.html)
