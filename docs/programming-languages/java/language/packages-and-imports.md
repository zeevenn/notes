---
title: 包与导入
date: 2026-08-05
category: java
---

包为类型提供命名空间。例如 `BigDecimal` 位于 `java.math` 包，完整名称为 `java.math.BigDecimal`：

```java
java.math.BigDecimal amount = new java.math.BigDecimal("10.50");
```

重复书写完整名称会降低可读性，`import` 允许在当前文件中使用简单名称：

```java
import java.math.BigDecimal;

BigDecimal amount = new BigDecimal("10.50");
```

包（package）为类型提供命名空间，并参与访问控制。不同包可以声明同名类型，例如 `java.util.Date` 和 `java.sql.Date`，代码通过全限定名区分它们。

```java
package com.example.billing;

public class Invoice {
}
```

`com.example.billing.Invoice` 是这个类的全限定名。包名使用小写字母，通常以组织控制的反向域名开头。

## 包声明与目录布局

包声明必须位于普通编译单元的开头，在 `import` 和类型声明之前：

```java
package com.example.billing;

import java.math.BigDecimal;

public class Invoice {
    private BigDecimal total;
}
```

常见源码布局让目录结构与包名对应：

```text
src/
└── com/
    └── example/
        └── billing/
            └── Invoice.java
```

包不是普通文件夹的别名。包是 Java 语言中的命名和访问边界；目录对应关系由编译器、构建工具和类加载环境共同约定。Maven 项目通常把主代码放在 `src/main/java/` 下，包路径从该目录之后开始。

## 导入类型

`import` 允许在当前文件中使用类型的简单名称：

```java
import java.time.LocalDate;

LocalDate today = LocalDate.now();
```

没有导入时可以使用全限定名：

```java
java.time.LocalDate today = java.time.LocalDate.now();
```

通配导入只导入指定包中的类型，不递归导入子包：

```java
import java.util.*;
```

这不会导入 `java.util.concurrent` 中的类型。显式导入通常更容易看出依赖来源。

`java.lang` 中的公开类型会被普通源码隐式导入，例如 `String`、`Object`、`System` 和 `Math`，因此不需要单独写 `import java.lang.String;`。

当两个类型简单名称冲突时，至少一个需要使用全限定名：

```java
import java.util.Date;

Date createdAt;
java.sql.Date billingDate;
```

## 静态导入

静态导入允许省略静态成员所属的类型名：

```java
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;

double circumference(double radius) {
    return 2 * PI * radius;
}

double distance(double x, double y) {
    return sqrt(x * x + y * y);
}
```

静态导入适合来源明确且频繁使用的常量或测试断言。大量静态导入可能让读者难以判断方法来源。

## 包与访问边界

同包代码与跨包代码拥有不同的访问条件。`import` 只影响名称书写方式，不会绕过访问权限；子包也不会因名称前缀相同而获得父包的包访问权限。

成员和类型的权限矩阵、跨包 `protected` 规则统一见[封装与访问控制](./encapsulation-and-access.md)。

## 未命名包

省略 `package` 声明的普通类型属于未命名包。它适合临时示例，但不适合可维护项目：

- 未命名包中的类型不能被具名包正常导入；
- 名称容易冲突；
- 目录和依赖边界不清楚；
- 构建工具和测试布局通常假设使用具名包。

## 编译包中的类

下面的源码位于 `src/com/example/App.java`：

```java
package com.example;

public class App {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

从项目根目录编译并运行：

```bash
javac -d out src/com/example/App.java
java -cp out com.example.App
```

`-d out` 让编译器按包结构输出 `.class` 文件；`-cp out` 把 `out` 加入类路径。启动时使用全限定类名，而不是文件路径。

## 类路径与模块路径

类路径（classpath）是一组供编译器和运行时查找类及资源的位置。它可以包含目录和 JAR 文件。常见错误包括：

- 编译时存在依赖，运行时类路径缺失，产生 `ClassNotFoundException`；
- 编译和运行使用了不同版本的依赖，产生 `NoSuchMethodError`；
- 包声明与源码/输出布局不一致；
- 把 JAR 文件所在目录加入类路径，却没有加入 JAR 文件本身。

Java 9 引入模块系统和模块路径（module path）。模块通过 `module-info.java` 声明依赖、导出包和服务。包与模块是不同层次的组织单位，包导出和模块依赖属于模块系统的规则。

## 参考资料

- [Dev.java：Packages](https://dev.java/learn/packages/)
- [Java Language Specification 17：Packages and Modules](https://docs.oracle.com/javase/specs/jls/se17/html/jls-7.html)
