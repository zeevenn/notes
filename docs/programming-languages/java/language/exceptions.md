---
title: 异常处理
date: 2026-08-05
category: java
---

读取端口配置时，文件可能不存在，文件里的文字也可能无法转换成整数。方法遇到这些问题，就无法按原来的约定返回结果。Java 用一个异常对象描述这次失败：对象的类型说明发生了哪类问题，消息说明具体原因，调用栈记录问题发生的位置。

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

`NumberFormatException` 表示数字格式不合法；它又是一种参数错误，所以继承 `IllegalArgumentException`。`NoSuchFileException` 表示文件不存在；它属于输入输出操作失败，所以继承 `IOException`。异常类型之间的继承关系，会决定后面一个 `catch` 能捕获哪些问题。

### 受检异常与非受检异常

这组分类决定的是**编译器是否要求代码明确交代异常的处理方式**。

`RuntimeException`、`Error` 及其子类属于**非受检异常**（unchecked exception）。例如调用 `Integer.parseInt("abc")`，即使没有写异常处理，代码也可以通过编译，但运行到这里仍会失败。对 `null` 调用方法、数组下标越界也是这一类。

其他可抛出类型属于**受检异常**（checked exception），日常主要接触的是 `Exception` 下不属于 `RuntimeException` 的类型，例如 `IOException`。调用一个可能抛出受检异常的方法时，需要二选一：在当前方法中捕获，或者在方法声明上写明它可能继续向外抛出。两者都不做，编译器会报错。

“受检”不是说异常发生在编译时。文件不存在这种问题仍然在运行时发生；编译器检查的是代码有没有安排它的去向。同样，“非受检”也不表示不应该处理：用户输入了错误的端口，可以捕获后提示重新输入；数组下标写错了，则通常需要修正代码。

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

执行到 `parseInt()` 时，转换失败并抛出 `NumberFormatException`。Java 跳过 `try` 中剩下的语句，找到匹配的 `catch`，把异常对象交给变量 `e`。因此“端口：……”不会输出。

`catch` 正常执行完以后，程序继续执行整个 `try-catch` 后面的代码，**不会回到原来出错的位置重试**。把输入换成 `"8080"`，则转换成功，`catch` 不执行，输出的中间一行变成“端口：8080”。

`e` 是一个普通的异常对象，`e.getMessage()` 可以读取错误消息。例如需要展示具体原因时，可以输出 `"解析失败：" + e.getMessage()`。

## 受检异常：捕获，或者声明 throws

读取文件还涉及另一种失败：代码和输入格式都可能正确，但文件已经被删除了。标准库的 `Files.readAllBytes()` 用 `IOException` 报告读取失败，它是受检异常。

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

`Paths.get(file)` 表示文件路径，`Files.readAllBytes()` 读取文件中的字节，最后一行按 UTF-8 将字节转换成文字。

`readConfig()` 没有捕获读取失败，而是在声明中写了 `throws IOException`。这相当于告诉调用方：这个方法可能无法读出内容，需要由调用方继续处理。因此 `main()` 调用它时，用 `catch (IOException e)` 接住失败。

如果删掉 `readConfig()` 上的 `throws IOException`，编译器会在读取文件的位置报错。如果保留声明，却删掉 `main()` 中的捕获，编译器会在调用 `readConfig()` 的位置报错。**`throws` 把处理责任交给调用方，没有让异常消失，也不会主动制造异常。**

`main()` 本身也可以声明 `throws IOException`，让代码通过编译；但文件读取失败时，这个主线程就会因未捕获异常而结束。它适合临时验证程序，不会自动变成友好的失败提示。

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

发生异常时，Java 从上到下选择第一个匹配的 `catch`，不会把所有匹配的分支都执行一遍。如果把 `IOException` 写在前面，文件不存在的异常也会被它接住，后面的 `NoSuchFileException` 分支将无法到达，编译器会拒绝这样的顺序。

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

捕获异常解决的是“失败后如何处理”。还有一类工作，无论操作成功还是失败，都需要在离开时执行，例如释放已经占用的资源。这部分代码可以放进 `finally`。

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

这里依次输出“开始解析”“格式错误”“本次解析结束”“继续执行后续代码”。换成合法数字时，跳过 `catch`，但仍然执行 `finally`。

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

调用 `result()` 得到的是 `2`。同理，如果清理时又抛出了新异常，原来的失败也可能被遮住。`finally` 应集中完成清理，不在这里重新决定业务返回结果。

## try-with-resources

打开文件后，要关闭对应的读取器。手工在 `finally` 里调用 `close()`，还需要处理“打开失败，没有取得读取器”和“读取失败，关闭时又失败”等情况。

Java 7 引入的 try-with-resources 把这项工作交给语言完成。下面的 `BufferedReader` 是按文本读取文件的对象，`readLine()` 读取一行：

```java
import java.io.BufferedReader;

static String readFirstLine(String file) throws IOException {
    try (BufferedReader reader = Files.newBufferedReader(
            Paths.get(file), StandardCharsets.UTF_8)) {
        return reader.readLine();
    }
}
```

把资源声明写在 `try (...)` 中后，正常返回、读取失败或代码提前结束，都会在离开前调用这个资源的 `close()`。如果连资源都没有成功创建，则没有对应对象需要关闭。空文件的 `readLine()` 返回 `null`。

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

## 用 throw 主动报告不合法的状态

能转换成整数，不代表端口号就合法。`"70000"` 可以通过 `Integer.parseInt()`，但超出了这里允许的 1～65535 范围，因此需要由自己的代码报告失败：

```java
static int parsePort(String text) {
    int port = Integer.parseInt(text);
    if (port < 1 || port > 65535) {
        throw new IllegalArgumentException("端口超出范围：" + port);
    }
    return port;
}
```

`new IllegalArgumentException(...)` 创建异常对象，`throw` 将它抛出并中止当前方法的正常执行。调用 `parsePort("70000")` 时不会执行最后的 `return port`；调用 `parsePort("8080")` 则正常返回 `8080`。

这里选择 `IllegalArgumentException`，因为错误来自传入的参数。它属于非受检异常，所以不要求在方法声明中写 `throws`，调用方仍然可以捕获它。

`throw` 位于方法体中，表示“现在抛出这个异常”；`throws` 位于方法声明上，表示“这类异常可能从这个方法传出去”。它们分别负责发生失败和声明失败，不能互相替代。

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

这里的调用方向是 `main → start → Integer.parseInt`。转换失败后，`start()` 没有捕获异常，于是它也中止正常执行，不会输出“启动端口”。异常传回 `main()`，被那里包围调用的 `catch` 捕获。

`printStackTrace()` 输出异常类型、消息和调用位置。这个例子中，略去 JDK 内部的调用行，可以看到类似信息：

```text
java.lang.NumberFormatException: For input string: "abc"
    ...
    at StartupDemo.start(StartupDemo.java:12)
    at StartupDemo.main(StartupDemo.java:4)
```

`start` 那一行标出发生失败的方法调用，`main` 那一行说明是谁调用了它。调用栈从上往下记录从失败位置向调用方展开的路径；行号会随源码位置变化。`getMessage()` 只有错误消息，不能替代这些定位信息。

## 自定义异常与保留原始原因

直接处理某个数值参数时，`IllegalArgumentException` 已经能表达问题。如果一段代码负责加载整份配置，调用方可能更关心“配置加载失败”，而不是区分底层的文件读取和数值转换细节。这时可以定义自己的异常类型：

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
