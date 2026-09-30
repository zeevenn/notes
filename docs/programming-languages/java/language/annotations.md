---
title: 注解
date: 2026-08-05
category: java
---

注解（annotation）是在类、方法、字段等代码元素上附加的结构化信息，写作 `@名称`。这些描述代码的信息称为**元数据**，由编译器、工具或程序读取和处理。

例如，`@Override` 表达“这个方法应当重写父类或接口的方法”：

```java
public class User {
    @Override
    public String toString() {
        return "User";
    }
}
```

编译器会检查这个声明。如果把 `toString` 误写成 `toStirng`，就会编译失败。去掉注解后，这个拼错的方法只是一个新方法，编译器不再检查它是否重写了已有方法。

注解本身不执行检查或业务逻辑，具体行为由读取它的编译器、工具或程序实现。

## 给类设置显示名称

假设一个工具要输出服务的名称：类上配置了显示名称，就输出该名称；没有配置，就输出 Java 类名。可以定义一个 `@DisplayName` 注解，把显示名称写在对应的类上。

### 定义注解类型

在 `DisplayName.java` 中声明注解：

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface DisplayName {
    String value();
}
```

`@interface` 是声明注解类型的语法。`String value()` 声明一个名为 `value`、类型为 `String` 的**注解元素**，使用注解时需要为它赋值。它采用无参数方法的形式，读取注解时通过 `value()` 取得这个值。

> [!NOTE]
> 注解元素不必命名为 `value`。例如，声明为 `String name();` 时，使用 `@DisplayName(name = "用户服务")` 赋值，通过 `name()` 读取。`value` 的特殊之处是：只给它赋值、其他元素均有默认值时，可以把 `@DisplayName(value = "用户服务")` 简写为 `@DisplayName("用户服务")`；其他名称不支持这种简写。

`@Target` 和 `@Retention` 用于修饰注解类型，称为**元注解**，分别规定 `DisplayName` 的适用位置和保留时间：

- `@Target(ElementType.TYPE)`：允许标注在类、接口等类型声明上。
- `@Retention(RetentionPolicy.RUNTIME)`：把注解保留到运行时，让程序能够读取。

### 在类上填写信息

在 `UserService.java` 中标注显示名称：

```java
@DisplayName(value = "用户服务")
public class UserService {
}
```

`DisplayName` 是注解类型；`@DisplayName(value = "用户服务")` 是在 `UserService` 上使用该类型的一条注解，将 `value` 设为 `"用户服务"`。

### 读取信息并决定输出

Java 的**反射** API 可以在运行时检查类、方法、字段等信息，也能读取其中保留到运行时的注解。`UserService.class` 表示这个类的 `Class` 对象，用它可以查询类上的注解，无需创建 `UserService` 实例。

在 `AnnotationDemo.java` 中编写读取逻辑：

```java
public class AnnotationDemo {
    public static void main(String[] args) {
        Class<?> type = UserService.class;
        DisplayName annotation = type.getAnnotation(DisplayName.class);

        String name = annotation == null
                ? type.getSimpleName()
                : annotation.value();
        System.out.println(name);
    }
}
```

`Class<?>` 表示所描述的类可以是任意类型。`getAnnotation(DisplayName.class)` 按注解类型查询：找到时返回注解对象，没有找到时返回 `null`。`annotation.value()` 读到的是 `"用户服务"`，而 `getSimpleName()` 返回不含包名的类名。

将三个文件放在同一目录中，编译并运行：

```sh
javac -encoding UTF-8 DisplayName.java UserService.java AnnotationDemo.java
java AnnotationDemo
```

输出为：

```text
用户服务
```

删除 `UserService` 上的 `@DisplayName` 后重新编译运行，`getAnnotation()` 返回 `null`，程序输出类名 `UserService`。

## 注解元素与赋值

### 必填值与默认值

注解元素可以通过 `default` 指定默认值；没有默认值的元素必须在使用注解时赋值：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface DisplayName {
    String value();
    String language() default "zh-CN";
}
```

使用时，`value` 必填，`language` 可以省略：

```java
@DisplayName(value = "用户服务")
public class UserService {
}
```

此时，`value()` 返回 `"用户服务"`，`language()` 返回默认值 `"zh-CN"`。要覆盖默认值，可以写成 `@DisplayName(value = "User service", language = "en")`。

没有元素的注解称为标记注解，使用时通常省略括号，例如 `@Override`。

### 元素能使用的类型

元素类型限于基本类型、`String`、`Class`、枚举、注解，以及这些类型的一维数组。例如：

```java
public @interface ExportOptions {
    int limit() default 100;
    String[] columns() default {"id", "name"};
    Class<?> model();
}
```

使用时可以写 `@ExportOptions(model = User.class, columns = {"id", "name"})`。不能把普通对象、`List<String>` 或二维数组声明为元素类型，也不能用 `null` 赋值。基本类型和字符串的值必须是编译期常量，不能靠运行时方法调用计算，例如 `limit = loadLimit()` 不合法。

## 元注解

### `@Target`：允许标注的位置

`DisplayName` 使用了 `TYPE`，所以可以标注类，但不能标注方法。如果同一种注解也需要标注方法，可改为：

```java
@Target({ElementType.TYPE, ElementType.METHOD})
```

常见位置如下：

| `ElementType`     | 允许的位置                                           |
| ----------------- | ---------------------------------------------------- |
| `TYPE`            | 类型声明，如类、接口、枚举、record、注解类型         |
| `METHOD`          | 方法声明                                             |
| `FIELD`           | 字段声明                                             |
| `PARAMETER`       | 方法或构造方法的参数声明                             |
| `CONSTRUCTOR`     | 构造方法声明                                         |
| `ANNOTATION_TYPE` | 注解类型声明                                         |
| `TYPE_USE`        | 类型使用处，例如泛型实参中的 `List<@NonNull String>` |

`TYPE_USE` 中的 `@NonNull` 是类型注解写法的示意，需要由库或程序定义，并由相应工具解释；仅有这个标记不会让 Java 自动执行非空检查。

### `@Retention`：信息保留到哪个阶段

Java 源码先编译为 `.class` 文件，再由虚拟机加载运行。`@Retention` 决定注解信息沿着这个过程保留多久：

| 策略      | 保留范围                                     | 典型读取方               |
| --------- | -------------------------------------------- | ------------------------ |
| `SOURCE`  | 只保留在源码中，不写入 `.class` 文件         | 编译器、编译期注解处理器 |
| `CLASS`   | 写入 `.class` 文件，不通过运行时反射提供     | 分析 class 文件的工具    |
| `RUNTIME` | 写入 `.class` 文件，并可在运行时通过反射读取 | 运行中的程序或框架       |

不声明 `@Retention` 时，默认策略是 `CLASS`。如果从 `DisplayName` 定义中删去 `@Retention(RetentionPolicy.RUNTIME)`，重新编译后，`AnnotationDemo` 中的 `getAnnotation()` 会返回 `null`，即使源码里的注解仍然存在。

`RUNTIME` 注解也可以被编译期工具读取。

### 其他元注解

`@Documented` 表示使用该注解的信息应包含在生成的 API 文档中。

`@Inherited` 影响从类上查询注解的方式：若注解类型带有这个标记，且当前类没有该注解，`Class.getAnnotation()` 会继续沿父类查找。它不沿实现的接口查找，也不会让重写的方法自动得到父类方法上的注解。框架自行实现的查找逻辑可能有不同规则。

`@Repeatable` 允许同一种注解在同一位置出现多次。它需要指定一个容器注解，容器的 `value()` 类型为原注解类型的数组；读取重复项时使用 `getAnnotationsByType()`。普通的 `getAnnotation()` 不会自动展开容器。

## 常用内置注解

### `@Override`

让编译器检查方法是否重写了父类或接口的方法。方法是否构成重写由签名等语言规则决定，注解用于校验声明意图。

### `@Deprecated`

标记不建议继续使用的 API，调用方编译时可能收到弃用警告。通常配合 Javadoc 的 `@deprecated` 标签说明替代方案：

```java
/**
 * @deprecated 使用 {@link #findById(long)}。
 */
@Deprecated(since = "2.0", forRemoval = true)
public User find(long id) {
    return findById(id);
}
```

`since` 记录从哪个版本开始弃用，这里的 `2.0` 是该 API 所属库的版本；`forRemoval = true` 表示计划在未来版本移除，不会让当前方法立即失效。

### `@SuppressWarnings`

抑制指定类别的编译器警告，例如 `@SuppressWarnings("unchecked")` 抑制未经检查的类型转换等警告。它不会让类型转换更安全，也不会拦截运行时异常；应在已确认原因后放在所需的最小作用域。

### `@FunctionalInterface`

让编译器检查接口是否符合函数式接口的要求，即具有一个抽象方法契约：

```java
@FunctionalInterface
public interface Validator<T> {
    boolean test(T value);
}
```

符合要求的接口即使不写这个注解，也可以作为 Lambda 的目标类型。接口可以包含默认方法和静态方法；函数式接口的用法见 [Lambda 与方法引用](./lambda-and-method-references.md)。
