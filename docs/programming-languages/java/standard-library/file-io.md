---
title: 文件与 I/O
date: 2026-09-29
category: java
---

`Path` 表示文件或目录的路径，`Files` 提供读写、创建、复制等操作。I/O（输入与输出）负责把文件中的数据读入程序，或把程序中的数据写出。

## 从文本读写开始

下面创建目录，将文本写入文件，再读回内容：

```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileDemo {
    public static void main(String[] args) throws IOException {
        Path file = Path.of("data", "message.txt");
        Files.createDirectories(file.getParent());

        Files.writeString(file, "你好，Java\n", StandardCharsets.UTF_8);
        String text = Files.readString(file, StandardCharsets.UTF_8);

        System.out.print(text); // 你好，Java，并换行
    }
}
```

`Path.of()` 只构造路径，不会创建文件。`data/message.txt` 是相对路径，可用 `file.toAbsolutePath()` 确认实际位置。`createDirectories()` 会创建缺少的目录层级，目录已存在时可继续使用。

`writeString()` 默认创建不存在的文件，或清空已有文件后写入；它不会自动创建父目录。追加内容时需要明确指定打开选项：

```java
import java.nio.file.StandardOpenOption;

Files.writeString(file, "第二行\n", StandardCharsets.UTF_8,
        StandardOpenOption.CREATE, StandardOpenOption.APPEND);
```

`CREATE` 表示不存在时创建，`APPEND` 表示从末尾追加。`readString()`、`writeString()` 会自行打开和关闭文件，但整段读取会将内容放进内存，适合能一次容纳的文件。

## 字节、字符与编码

文件保存的是字节。处理图片、压缩包等二进制内容时，按字节读取；处理文本时，还要知道如何把字节解释成字符。

| 类型 | 读写单位 | 常见接口 |
| --- | --- | --- |
| 字节流 | 字节 | `InputStream`、`OutputStream` |
| 字符流 | 字符编码单元 | `Reader`、`Writer` |

字符集决定文本与字节之间的转换规则。`InputStreamReader` 将字节解码为字符，`OutputStreamWriter` 将字符编码为字节；`Files.newBufferedReader()`、`newBufferedWriter()` 已经组合了这些转换和缓冲功能。

```java
byte[] bytes = "你好".getBytes(StandardCharsets.UTF_8);
String text = new String(bytes, StandardCharsets.UTF_8);

System.out.println(bytes.length); // 6
System.out.println(text);         // 你好
```

读写双方应使用约定的字符集。指定 UTF-8 不会自动识别或纠正其他编码的文件。二进制数据不应先转换成 `String` 再写回，否则可能改变原始字节。

## 分批处理大文件

### 按行处理文本

如果需要读取日志、筛选文本行，可以一边读取一边处理。下面将非空白行写入另一个文件：

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;

static void copyNonBlankLines(Path source, Path target) throws IOException {
    try (BufferedReader reader = Files.newBufferedReader(
                 source, StandardCharsets.UTF_8);
         BufferedWriter writer = Files.newBufferedWriter(
                 target, StandardCharsets.UTF_8)) {
        String line;
        while ((line = reader.readLine()) != null) {
            if (!line.isBlank()) {
                writer.write(line);
                writer.newLine();
            }
        }
    }
}
```

`readLine()` 返回的文本不含行结束符，到达文件末尾时返回 `null`；`newLine()` 写入当前平台的行结束符。因此这个例子保留非空白行的文本，不保证与源文件逐字节一致。

逐行处理避免一次加载整个文件，缓冲器也减少了频繁的小量底层读写。目标文件所在目录需要事先存在。

### 按字节块读写

需要逐块处理原始数据时，使用字节流。下面把内容写入另一个文件，每次最多读取一个缓冲区：

```java
import java.io.InputStream;
import java.io.OutputStream;

static void copyBytes(Path source, Path target) throws IOException {
    try (InputStream input = Files.newInputStream(source);
         OutputStream output = Files.newOutputStream(target)) {
        byte[] buffer = new byte[8192];
        int count;
        while ((count = input.read(buffer)) != -1) {
            output.write(buffer, 0, count);
        }
    }
}
```

`read()` 返回本次实际读取的字节数，可能小于缓冲区大小；`-1` 表示结束。写入时只使用 `[0, count)`，不能把缓冲区剩余的旧内容一起写出。这里不进行字符解码，因此也适用于二进制文件。

仅需要复制文件时，可直接使用后面的 `Files.copy()`；分块循环适合在传输过程中加入校验、转换等处理。

### 资源关闭与异常

上述方法使用 `try-with-resources`，正常完成或异常退出时都会关闭成功打开的资源。写入器关闭时也会刷新其缓冲内容。文件不存在、权限不足或读写失败等情况通过 `IOException` 及其子类向调用方报告。

资源关闭和异常传播的完整规则见 [异常处理](../language/exceptions.md#try-with-resources)。

## 目录遍历

`Files.list()` 返回目录下的直接子项，不递归进入子目录。可以结合 [Stream](./stream-processing.md) 筛选普通文件并排序：

```java
import java.util.List;
import java.util.stream.Stream;

static List<Path> listFiles(Path directory) throws IOException {
    try (Stream<Path> paths = Files.list(directory)) {
        return paths.filter(Files::isRegularFile)
                .sorted()
                .toList();
    }
}
```

需要递归遍历时使用 `Files.walk(directory)`，它包含起始路径及其下级路径。两者返回的流都持有需要关闭的资源，终止操作不会代替 `close()`，应像上面一样放进 `try-with-resources`。

如果只取普通文件，`Files::isRegularFile` 会过滤目录。文件系统的原始遍历顺序不固定，需要稳定顺序时再排序。

## 复制与移动文件

复制保留源文件，移动成功后源路径不再保留该文件。下面先备份文本，再把备份移入归档目录：

```java
import java.nio.file.StandardCopyOption;

Path source = Path.of("data", "message.txt");
Path backup = Path.of("data", "message.bak");
Files.copy(source, backup, StandardCopyOption.REPLACE_EXISTING);

Path archive = Path.of("archive");
Files.createDirectories(archive);
Files.move(backup, archive.resolve(backup.getFileName()),
        StandardCopyOption.REPLACE_EXISTING);
```

`resolve()` 将子路径接到目录路径后面。执行后，原文件仍在 `data/message.txt`，备份位于 `archive/message.bak`。

复制或移动到已存在的目标文件时，默认会失败；例子显式使用 `REPLACE_EXISTING` 允许替换。写入方式、目标路径和覆盖规则应在执行前确定。
