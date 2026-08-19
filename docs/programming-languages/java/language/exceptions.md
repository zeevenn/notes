---
title: 异常处理
date: 2026-08-05
category: java
---

异常表示程序无法沿当前正常路径继续执行。抛出异常时，Java 会沿调用栈向上查找能够处理该异常的 `catch`；如果一直没有找到，当前线程终止并报告异常及调用栈。

```java
int parsePort(String text) {
    int port = Integer.parseInt(text);
    if (port < 1 || port > 65535) {
        throw new IllegalArgumentException("port out of range: " + port);
    }
    return port;
}
```

异常不是普通分支的替代品。可预期且频繁发生的业务结果，通常应由返回值或明确的结果类型表达；无法在当前层完成的失败才适合抛出或继续传播。

## `Throwable` 层次

```text
Throwable
├── Error
└── Exception
    ├── RuntimeException
    └── 其他受检异常
```

- `Error`：虚拟机或运行环境的严重问题，例如 `OutOfMemoryError`。应用通常不尝试恢复；
- 受检异常（checked exception）：`Exception` 中不属于 `RuntimeException` 的类型，例如 `IOException`。编译器要求捕获或声明；
- 非受检异常（unchecked exception）：`RuntimeException` 及其子类，例如 `IllegalArgumentException`、`NullPointerException`。编译器不强制处理。

受检和非受检描述的是编译期规则，不代表异常一定能否恢复。选择异常类型时需要看调用方是否能采取有意义的恢复措施。

## 捕获异常

`try` 包含可能失败的操作，`catch` 处理匹配的异常类型：

```java
try {
    int port = Integer.parseInt(input);
    System.out.println("port = " + port);
} catch (NumberFormatException exception) {
    System.err.println("端口必须是整数：" + input);
}
```

多个 `catch` 要从具体类型写到一般类型，否则后面的具体分支不可达：

```java
try {
    loadConfig(path);
} catch (NoSuchFileException exception) {
    System.err.println("配置文件不存在：" + path);
} catch (IOException exception) {
    System.err.println("读取配置失败：" + exception.getMessage());
}
```

处理逻辑相同的异常可以使用 multi-catch：

```java
try {
    importData(path);
} catch (IOException | ParseException exception) {
    reportFailure(exception);
}
```

不要为了让编译通过而写空的 `catch`。如果当前层无法恢复，应保留原因并向上传播，而不是悄悄丢弃失败。

## `finally` 与清理

`finally` 通常会在 `try` 正常结束、抛出异常或提前 `return` 后执行，适合恢复必须由当前方法维护的状态。

```java
lock.lock();
try {
    updateState();
} finally {
    lock.unlock();
}
```

不要在 `finally` 中 `return` 或抛出无关异常，否则可能覆盖原有返回值或失败原因。文件、流、连接等 `AutoCloseable` 资源应优先使用 try-with-resources。

## try-with-resources

括号内声明的资源会在代码块结束时自动关闭，关闭顺序与声明顺序相反。

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

String firstLine(Path path) throws IOException {
    try (BufferedReader reader = Files.newBufferedReader(path)) {
        return reader.readLine();
    }
}
```

只要对象实现 `AutoCloseable`，就可以作为资源。即使读取过程抛出异常，`close()` 仍会被调用。

如果业务操作和关闭资源都失败，业务操作的异常作为主异常传播，关闭失败可通过 `getSuppressed()` 查看。这样不会像手写错误的 `finally` 那样丢失原始失败。

## `throw` 与 `throws`

`throw` 抛出一个具体异常对象：

```java
if (amount.signum() < 0) {
    throw new IllegalArgumentException("amount must not be negative");
}
```

`throws` 在方法签名中声明调用方需要知道的异常：

```java
Config load(Path path) throws IOException {
    // ...
}
```

方法可以直接传播底层异常，也可以转换为更符合当前抽象层的异常。转换时应把原异常作为 cause 保留下来：

```java
try {
    return repository.load(id);
} catch (SQLException exception) {
    throw new UserRepositoryException("failed to load user " + id, exception);
}
```

## 自定义异常

自定义异常应表达调用方能够理解的领域或边界失败，而不是简单重复底层异常名称。

```java
public class InsufficientBalanceException extends RuntimeException {
    private final long accountId;

    public InsufficientBalanceException(long accountId, String message) {
        super(message);
        this.accountId = accountId;
    }

    public long accountId() {
        return accountId;
    }
}
```

继承 `Exception` 会创建受检异常；继承 `RuntimeException` 会创建非受检异常。没有必要为每个失败点都创建一个新类型，只有调用方确实需要按类型区分处理时才有价值。

## 异常边界

异常通常在能够补充上下文、重试、回退或转换协议响应的层级处理。

```text
底层 I/O / 数据库异常
        ↓ 保留 cause，转换抽象
应用或领域异常
        ↓ 统一映射
HTTP / CLI / 消息处理结果
```

常见处理方式：

- 当前层能恢复：捕获并执行明确的回退或重试；
- 当前层只能补充上下文：包装后继续抛出，并保留 cause；
- 当前层无法增加任何信息：不要捕获，直接传播；
- 进程或请求边界：记录一次完整上下文并转换为对外结果。

不要在每一层重复记录同一个异常，否则日志会出现多份相同调用栈。

## 常见错误

- `catch (Exception)` 后继续正常执行，使程序处于未知状态；
- 只记录 `exception.getMessage()`，丢失类型、调用栈和 cause；
- 记录异常后又抛出，导致多个层级重复记录；
- 使用异常处理普通循环终止或常规查询未命中；
- 捕获 `Error` 并假设应用仍能安全运行；
- 手动关闭资源但没有处理中途失败；
- 抛出缺少操作对象、参数和边界信息的宽泛异常。

## 相关内容

- [方法](./methods.md)
- [控制流](./control-flow.md)
- [引用类型与对象](./reference-types.md)

## 参考资料

- [Dev.java：Exceptions](https://dev.java/learn/exceptions/)
- [Dev.java：Catching and Handling Exceptions](https://dev.java/learn/catching-and-handling-exceptions/)
- [Java Language Specification 17：Exceptions](https://docs.oracle.com/javase/specs/jls/se17/html/jls-11.html)
