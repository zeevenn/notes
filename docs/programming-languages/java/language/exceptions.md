---
title: 异常处理
date: 2026-08-05
category: java
---

读取端口配置时，文件可能不存在，文件里的文字也可能无法转换成整数。方法遇到这些问题，就无法按原来的约定返回结果。Java 用一个异常对象描述这次失败：对象的类型说明发生了哪类问题，消息说明具体原因，调用栈记录问题发生的位置。

## 用 try-catch 捕获异常

`Integer.parseInt()` 把字符串转换成整数。把这项操作放进 `try`，就可以用 `catch` 处理数字格式错误：

```java
String input = "abc";
System.out.println("开始解析");
try {
    int port = Integer.parseInt(input);
    System.out.println("端口：" + port);
} catch (NumberFormatException e) {
    System.out.println("端口必须是整数");
}
System.out.println("解析流程结束");
```

输出：

```text
开始解析
端口必须是整数
解析流程结束
```

`parseInt()` 失败后，Java 跳过 `try` 中剩余语句，将异常交给匹配的 `catch`。`catch` 正常结束后继续执行整个结构之后的代码，不会回到出错位置重试。

`e` 是捕获到的异常对象，`e.getMessage()` 返回错误消息。

## 用 throw 主动报告不合法的状态

端口号除了能解析为整数，还必须在 1～65535 范围内。可以用 `throw` 主动报告不合法的参数：

```java
static int parsePort(String text) {
    int port = Integer.parseInt(text);
    if (port < 1 || port > 65535) {
        throw new IllegalArgumentException("端口超出范围：" + port);
    }
    return port;
}
```

`throw` 抛出异常对象并中止当前方法的正常执行。这里使用 `IllegalArgumentException` 表示参数不合法：`parsePort("70000")` 抛出异常，`parsePort("8080")` 正常返回 `8080`。

## 异常沿调用链向外传播

某一层没有捕获异常，异常就继续交给调用它的方法。无需每层都写一个 `catch` 再原样抛出。

```java
public class StartupDemo {
    public static void main(String[] args) {
        try {
            start("abc");
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }
        System.out.println("已回到调用方");
    }

    static void start(String text) {
        int port = Integer.parseInt(text);
        System.out.println("启动端口：" + port);
    }
}
```

调用方向是 `main → start → Integer.parseInt`。转换失败后，异常沿调用链向外传播：`start()` 中未执行的语句被跳过，最终由 `main()` 的 `catch` 处理。

`printStackTrace()` 输出异常类型、消息和调用位置。这个例子中，略去 JDK 内部的调用行，可以看到类似信息：

```text
java.lang.NumberFormatException: For input string: "abc"
    ...
    at StartupDemo.start(StartupDemo.java:12)
    at StartupDemo.main(StartupDemo.java:4)
```

调用栈从失败位置向调用方展开；行号随源码位置变化。`getMessage()` 只有错误消息，不能替代调用栈中的定位信息。

## 异常的分类

Java 中能够被抛出的对象，都属于 `Throwable` 类或它的子类。`Throwable` 下有两个主要分支：`Error` 和 `Exception`。

**`Error` 表示运行环境或虚拟机层面的严重问题。** 例如内存不足时的 `OutOfMemoryError`、递归过深时的 `StackOverflowError`。普通业务代码通常没有办法通过一次捕获就让程序恢复正常。

**`Exception` 表示应用执行某项操作时出现的问题。** 例如文件读取失败、输入格式错误。程序可以根据具体情况提示用户、放弃这次操作，或者选择其他处理方式。

`Exception` 内部还要区分 `RuntimeException` 及其子类，以及其他异常。常见类型的关系如下：

```text
Throwable
├── Error
│   ├── OutOfMemoryError
│   └── StackOverflowError
└── Exception
    ├── RuntimeException
    │   ├── NullPointerException
    │   ├── IndexOutOfBoundsException
    │   └── IllegalArgumentException
    │       └── NumberFormatException
    └── IOException
        └── NoSuchFileException
```

异常类型的继承关系决定 `catch` 的匹配范围。例如 `IllegalArgumentException` 包含数字格式错误，`IOException` 包含文件不存在等输入输出错误。

### 受检异常与非受检异常

这组分类决定的是**编译器是否要求代码明确交代异常的处理方式**。

`RuntimeException`、`Error` 及其子类属于**非受检异常**（unchecked exception）。例如调用 `Integer.parseInt("abc")`，即使没有写异常处理，代码也可以通过编译，但运行到这里仍会失败。对 `null` 调用方法、数组下标越界也是这一类。

其他可抛出类型属于**受检异常**（checked exception），日常主要接触的是 `Exception` 下不属于 `RuntimeException` 的类型，例如 `IOException`。调用一个可能抛出受检异常的方法时，需要二选一：在当前方法中捕获，或者在方法声明上写明它可能继续向外抛出。两者都不做，编译器会报错。

受检与非受检描述编译期的处理要求，异常本身仍在运行时发生。是否捕获取决于当前层能否处理失败，而不是只看它是否受检。

## 受检异常：捕获，或者声明 throws

`Files.readAllBytes()` 用受检异常 `IOException` 报告读取失败。

下面把读取操作放进 `readConfig()`，由调用它的 `main()` 决定失败时输出什么：

```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ConfigDemo {
    public static void main(String[] args) {
        try {
            String text = readConfig("port.txt");
            System.out.println("配置内容：" + text);
        } catch (IOException e) {
            System.out.println("无法读取配置：" + e.getMessage());
        }
    }

    static String readConfig(String file) throws IOException {
        byte[] bytes = Files.readAllBytes(Paths.get(file));
        return new String(bytes, StandardCharsets.UTF_8);
    }
}
```

`readConfig()` 通过 `throws IOException` 将处理责任交给调用方，`main()` 再用 `catch` 处理。对受检异常，当前方法必须捕获或声明继续抛出，否则不能通过编译。

`throw` 在方法体中实际抛出异常；`throws` 在方法声明中说明哪些异常可能传出，不会主动抛出异常。前面的 `IllegalArgumentException` 属于非受检异常，因此 `parsePort()` 不必声明它。

`main()` 也可以声明 `throws IOException`；若异常一直未被捕获，主线程会结束并报告异常。

## 一个 catch 能捕获哪些异常

`catch` 不只匹配指定类型，也匹配它的子类型。由于 `NoSuchFileException` 继承 `IOException`，前面的 `catch (IOException e)` 已经能够处理文件不存在的情况。

如果希望把“文件不存在”和“其他读取失败”分开提示，可以复用上面的 `readConfig()`，按从具体到一般的顺序捕获：

```java
import java.nio.file.NoSuchFileException;

try {
    System.out.println(readConfig("port.txt"));
} catch (NoSuchFileException e) {
    System.out.println("请先创建 port.txt");
} catch (IOException e) {
    System.out.println("读取配置失败：" + e.getMessage());
}
```

Java 从上到下选择第一个匹配的 `catch`。若将 `IOException` 放在前面，后面的 `NoSuchFileException` 分支会被覆盖，导致编译错误。

读取成功以后，解析文件内容还可能出现数字格式错误。如果这两类问题只需要同一个提示，可以用 `|` 合并捕获：

```java
try {
    String text = readConfig("port.txt");
    int port = Integer.parseInt(text.trim());
    System.out.println("端口：" + port);
} catch (IOException | NumberFormatException e) {
    System.out.println("请检查配置文件及端口格式：" + e.getMessage());
}
```

`IOException` 和 `NumberFormatException` 没有父子关系，可以这样合并。`IOException | NoSuchFileException` 则不能合并，因为前者已经包含后者。

## finally 在离开时执行

`finally` 用于离开 `try` 结构时执行清理，无论操作成功还是失败。

```java
try {
    System.out.println("开始解析");
    int port = Integer.parseInt("abc");
    System.out.println("端口：" + port);
} catch (NumberFormatException e) {
    System.out.println("格式错误");
} finally {
    System.out.println("本次解析结束");
}
System.out.println("继续执行后续代码");
```

这里依次输出“开始解析”“格式错误”“本次解析结束”“继续执行后续代码”。

即使 `try` 中执行了 `return`，或者异常没有被当前 `catch` 接住，Java 在离开这个结构前仍会执行 `finally`。因此 `finally` 可以用于清理，但它本身不负责处理异常。程序被强制终止或虚拟机退出时，则不能保证它还能执行。

尤其要注意：在 `finally` 中再次 `return` 或抛出异常，会覆盖原本准备返回的结果或继续传播的异常。例如：

```java
static int result() {
    try {
        return 1;
    } finally {
        return 2;
    }
}
```

调用 `result()` 得到 `2`。`finally` 应集中完成清理，避免覆盖业务结果或原始异常。

## try-with-resources

打开文件后，要关闭对应的读取器。手工在 `finally` 里调用 `close()`，还需要处理“打开失败，没有取得读取器”和“读取失败，关闭时又失败”等情况。

Java 7 引入的 try-with-resources 自动管理资源的关闭。下面读取文件的第一行：

```java
import java.io.BufferedReader;

static String readFirstLine(String file) throws IOException {
    try (BufferedReader reader = Files.newBufferedReader(
            Paths.get(file), StandardCharsets.UTF_8)) {
        return reader.readLine();
    }
}
```

`try (...)` 中成功创建的资源会在正常或异常退出时调用 `close()`。这里空文件的 `readLine()` 返回 `null`。

这种语法要求资源实现 `AutoCloseable` 接口，也就是提供约定的 `close()` 方法。多个资源可以用分号分隔，它们按声明的相反顺序关闭。

读取和关闭同时失败时，读取异常继续作为主要异常向外传播，关闭异常附在它的 `getSuppressed()` 结果中。这样既保留最初失败的原因，也没有丢弃清理失败的信息。

### 复用已有资源变量 [Java 9+]

Java 9 起，也可以直接使用已经声明且不再重新赋值的资源变量：

```java
BufferedReader reader = Files.newBufferedReader(
        Paths.get("port.txt"), StandardCharsets.UTF_8);
try (reader) {
    System.out.println(reader.readLine());
}
```

Java 8 使用前面在 `try (...)` 中声明资源的写法。

## 自定义异常与保留原始原因

调用方需要统一处理“配置加载失败”时，可以定义异常类型，将文件读取和数值转换等底层失败包装为这个操作的失败：

```java
class ConfigException extends RuntimeException {
    ConfigException(String message) {
        super(message);
    }

    ConfigException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

这个类继承 `RuntimeException`，因此是非受检异常。若改为直接继承 `Exception`，它就是受检异常，调用方需要捕获或声明。

复用前面的 `readConfig()` 和 `parsePort()`，把底层失败转换成配置加载失败：

```java
static int loadPort(String file) {
    try {
        return parsePort(readConfig(file).trim());
    } catch (IOException | IllegalArgumentException e) {
        throw new ConfigException("无法加载端口配置：" + file, e);
    }
}
```

构造方法中的第二个参数 `e` 是导致这次失败的原始异常，称为 cause。新异常说明当前正在做什么，原异常保留为什么失败。调用方捕获 `ConfigException` 后，可以用 `getCause()` 取得它；打印完整调用栈时，也会看到 `Caused by:` 后面的原始类型和位置。

如果只写 `new ConfigException(e.getMessage())`，复制的只是文字，原异常的类型和调用位置不会自动保留下来。只有当前层能处理失败，或能补充这样的上下文时，捕获才有实际作用；否则直接让异常继续传播即可。
