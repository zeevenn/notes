---
title: 注解
date: 2026-08-05
category: java
---

注解（annotation）为程序元素附加结构化元数据。注解本身不会自动改变代码行为；编译器、构建工具、注解处理器或运行时框架读取它之后，才可能执行检查、生成代码或应用配置。

```java
@Deprecated
public void oldMethod() {
}
```

## 常用内置注解

### `@Override`

标记方法重写父类或接口的方法。编译器会检查签名，避免因拼写或参数错误意外创建新方法。

```java
@Override
public String toString() {
    return "User[name=" + name + "]";
}
```

### `@Deprecated`

标记不建议继续使用的 API。通常配合 Javadoc 的 `@deprecated` 说明替代方案和迁移原因。

```java
/**
 * @deprecated 使用 {@link #findById(long)}。
 */
@Deprecated(since = "2.0", forRemoval = true)
public User find(long id) {
    return findById(id);
}
```

### `@SuppressWarnings`

抑制指定的编译器警告：

```java
@SuppressWarnings("unchecked")
```

它应放在能够解释并验证安全性的最小作用域，不应用于隐藏尚未理解的泛型或废弃 API 问题。

### `@FunctionalInterface`

要求接口保持只有一个抽象方法，使其可以作为 Lambda 的目标类型。

```java
@FunctionalInterface
public interface Validator<T> {
    boolean test(T value);
}
```

## 定义注解类型

```java
public @interface Retry {
    int maxAttempts() default 3;
    long delayMillis() default 0;
}
```

使用时为元素赋值：

```java
@Retry(maxAttempts = 5, delayMillis = 1000)
public void sendMessage() {
}
```

注解元素类型受到限制，可以使用基本类型、`String`、`Class`、枚举、注解以及这些类型的一维数组。元素不能使用普通对象或 `null` 作为值。

只有一个名为 `value` 的元素时，使用方可以省略元素名：

```java
public @interface Role {
    String value();
}

@Role("admin")
public void deleteUser() {
}
```

## 元注解

元注解用于描述另一个注解的适用位置和生命周期。

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Retry {
    int maxAttempts() default 3;
}
```

### `@Target`

限定注解可以出现的位置，例如：

- `TYPE`：类、接口、枚举或注解类型；
- `METHOD`：方法；
- `FIELD`：字段；
- `PARAMETER`：参数；
- `CONSTRUCTOR`：构造方法；
- `TYPE_USE`：任何使用类型的位置。

可以同时允许多个位置：

```java
@Target({ElementType.TYPE, ElementType.METHOD})
```

### `@Retention`

决定注解保留到哪个阶段：

| 策略 | 保留范围 | 常见用途 |
| --- | --- | --- |
| `SOURCE` | 仅源码 | 编译器检查、代码生成提示 |
| `CLASS` | 写入 class 文件，运行时不保证可读 | 字节码工具 |
| `RUNTIME` | 运行时可通过反射读取 | 运行时框架配置 |

不要因为“可能会用到”就一律选择 `RUNTIME`。只有运行时确实需要反射读取时才保留到运行期。

### `@Inherited`

它只影响类上的注解通过父类继承，不适用于接口、方法或字段，也不表示框架一定采用相同的查找规则。

### `@Repeatable`

允许同一种注解在同一位置出现多次，需要指定一个容器注解。只有确实需要多项独立配置时才使用，数组元素有时更简单。

## 运行时读取注解

保留策略为 `RUNTIME` 的注解可以通过反射读取：

```java
Method method = MessageService.class.getMethod("sendMessage");
Retry retry = method.getAnnotation(Retry.class);

if (retry != null) {
    System.out.println(retry.maxAttempts());
}
```

读取元数据不等于自动实现重试。仍然需要代理、拦截器或显式调用逻辑根据注解执行行为。

## 注解处理器与运行时反射

两种常见消费方式有不同边界：

- 编译期注解处理器：编译时验证或生成源码，问题可以较早暴露；
- 运行时反射：启动或调用时扫描注解，配置灵活，但错误可能推迟到运行时。

注解适合表达声明式元数据，不适合隐藏关键业务流程。读者仍应能找到是谁读取注解、何时执行以及失败如何处理。

## 相关内容

- [方法](./methods.md)
- [抽象类与接口](./abstract-and-interface.md)
- [泛型](./generics.md)
- [Object 的通用契约](./object-contract.md)

## 参考资料

- [Dev.java：Annotations](https://dev.java/learn/annotations/)
- [Java Language Specification 17：Annotation Interfaces](https://docs.oracle.com/javase/specs/jls/se17/html/jls-9.html#jls-9.6)
- [Java SE 17 API：java.lang.annotation](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/package-summary.html)
