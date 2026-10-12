---
title: 注解配置
date: 2026-10-09
icon: server
category:
  - 后端
  - Spring Framework
tag:
  - Spring Framework
  - IoC
  - DI
  - 注解
---

组件扫描通过类上的标记发现组件，将它们注册到容器；自动注入根据组件声明的依赖选择 Bean，完成组装。这两项工作分别决定“管理哪些对象”和“把哪些对象交给组件”。

以下示例使用 [IoC 与 DI](./ioc-container-and-beans.md#示例组件类)中的 Maven 依赖，沿用用户查询逻辑。扫描示例放在 `com.example.scan` 包中，与 XML 示例的普通组件类区分开。

## 组件标记

`@Component` 是通用组件标记。`@Repository`、`@Service`、`@Controller` 分别表达数据访问、业务逻辑、请求处理组件的角色，它们都能被默认的组件扫描识别。

在 `src/main/java/com/example/scan/` 下创建两个组件类：

```java
// UserDao.java
package com.example.scan;

import org.springframework.stereotype.Repository;

@Repository
public class UserDao {
    public String findName() {
        return "Ada";
    }
}
```

```java
// UserService.java
package com.example.scan;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public String findName() {
        return userDao.findName();
    }
}
```

类上的标记用于发现组件，构造器用于声明依赖。`UserService` 只有一个构造器，容器使用它，并按参数类型提供 `UserDao` Bean，无需额外标注 `@Autowired`。

## 扫描组件并创建容器

在同一个包中创建应用入口：

```java
// App.java
package com.example.scan;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class App {
    public static void main(String[] args) {
        try (var context = new AnnotationConfigApplicationContext("com.example.scan")) {
            UserService service = context.getBean("userService", UserService.class);
            System.out.println(service.findName());
        }
    }
}
```

这个构造器扫描 `com.example.scan` 及其子包，注册组件的 Bean 定义并初始化容器。默认命名规则下，本例的 Bean 名称是 `userDao` 和 `userService`；也可以通过 `@Service("指定名称")` 显式命名。

在项目根目录运行：

```bash
mvn compile exec:java -Dexec.mainClass=com.example.scan.App
```

程序输出 `Ada`。容器从扫描结果获得创建规则，再通过 `UserService` 的构造器组装依赖。

仅添加组件注解，还需要扫描或显式注册，容器才能管理它。扫描范围遗漏 `UserDao` 时，服务因缺少依赖而创建失败。扫描规则也可以交给 [Java 配置类](./java-config.md#用配置类组织组件扫描)组织。

## 多个候选 Bean 的选择

依赖类型有多个实现时，容器还需要确定注入哪一个。用一个独立示例展示这种选择：`UserLookup` 是查询接口，两个实现分别返回不同姓名，服务依赖接口。

在 `src/main/java/com/example/candidates/` 下创建以下类，容器只扫描这个包：

```java
// UserLookup.java
package com.example.candidates;

public interface UserLookup {
    String findName();
}
```

```java
// MainUserLookup.java
package com.example.candidates;

import org.springframework.stereotype.Repository;

@Repository("mainUserLookup")
public class MainUserLookup implements UserLookup {
    @Override
    public String findName() {
        return "Ada";
    }
}
```

```java
// BackupUserLookup.java
package com.example.candidates;

import org.springframework.stereotype.Repository;

@Repository("backupUserLookup")
public class BackupUserLookup implements UserLookup {
    @Override
    public String findName() {
        return "Grace";
    }
}
```

```java
// UserQueryService.java
package com.example.candidates;

import org.springframework.stereotype.Service;

@Service
public class UserQueryService {
    private final UserLookup lookup;

    public UserQueryService(UserLookup lookup) {
        this.lookup = lookup;
    }

    public String findName() {
        return lookup.findName();
    }
}
```

```java
// App.java
package com.example.candidates;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class App {
    public static void main(String[] args) {
        try (var context = new AnnotationConfigApplicationContext("com.example.candidates")) {
            UserQueryService service = context.getBean(UserQueryService.class);
            System.out.println(service.findName());
        }
    }
}
```

运行 `mvn compile exec:java -Dexec.mainClass=com.example.candidates.App`，容器初始化失败：`lookup` 参数匹配到两个 Bean，没有优先标记、限定条件或同名匹配，无法唯一选择。错误中的依赖解析原因是 `NoUniqueBeanDefinitionException`。

### 用 `@Primary` 指定优先候选

在 `MainUserLookup` 中导入 `org.springframework.context.annotation.Primary`，并在类上添加 `@Primary`。再次运行，程序输出 `Ada`。

`@Primary` 在单个对象的依赖注入中标记优先候选，可以放在组件类或 `@Bean` 方法上。本例另外一个实现仍在容器中，只是该注入点优先获得 `MainUserLookup`。

### 用 `@Qualifier` 限定注入点

保留 `MainUserLookup` 上的 `@Primary`，在 `UserQueryService` 中导入 `org.springframework.beans.factory.annotation.Qualifier`，将构造器改为：

```java
public UserQueryService(@Qualifier("backupUserLookup") UserLookup lookup) {
    this.lookup = lookup;
}
```

再次运行，程序输出 `Grace`。这个注入点只接受符合限定条件的候选，`MainUserLookup` 被排除，它的 `@Primary` 不会覆盖限定条件。

`@Qualifier` 在类型匹配结果中筛选候选，Bean 名称可以用作限定值，也可以在组件和注入点上声明相同的业务限定标记。如果限定后仍有多个候选，`@Primary` 仍可参与选择；最终无法确定一个对象时，注入失败。

没有限定或优先标记时，注入点名称也可能匹配 Bean 名称。构造器参数名匹配需要编译时保留参数名（`-parameters`）；前面的参数叫 `lookup`，与两个 Bean 的名称都不同。

## `@Autowired` 与注入位置

主示例使用单构造器注入。`@Autowired` 可以显式标记需要自动注入的构造器、方法或字段，本身不负责把类注册成 Bean。

Setter 注入在创建对象后调用设置方法。以下独立组件与 `com.example.scan` 中的主示例一起扫描：

```java
// SetterUserService.java
package com.example.scan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SetterUserService {
    private UserDao userDao;

    @Autowired
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public String findName() {
        return userDao.findName();
    }
}
```

在扫描示例 `App` 的 `try` 块中添加：

```java
SetterUserService setterService = context.getBean(SetterUserService.class);
System.out.println(setterService.findName()); // Ada
```

容器通过无参构造器创建它，再调用带有 `@Autowired` 的 Setter。方法依赖默认是必需的，找不到匹配的 Bean 时会导致创建失败。

字段注入是在字段上标注 `@Autowired`，由容器直接设置字段。构造器注入把必需依赖列在创建入口，支持 `final` 字段，也便于在普通 Java 代码中直接组装对象。Setter 注入适合允许后续设置依赖的类；字段注入则不提供普通调用者可直接使用的依赖传入入口。

## `@Resource` 按名称注入

`@Resource` 来自 Jakarta Annotations，Spring 支持在字段或单参数 Setter 上使用它注入 Bean。它不能标注构造器或构造器参数，也不负责注册组件。

在现有 Maven 项目的 `<dependencies>` 中添加注解 API：

```xml
<dependency>
  <groupId>jakarta.annotation</groupId>
  <artifactId>jakarta.annotation-api</artifactId>
  <version>3.0.0</version>
</dependency>
```

在 `com.example.scan` 包中新增组件，按名称取得前面注册的 `userDao`：

```java
// ResourceUserService.java
package com.example.scan;

import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class ResourceUserService {
    @Resource(name = "userDao")
    private UserDao dao;

    public String findName() {
        return dao.findName();
    }
}
```

在扫描示例 `App` 的 `try` 块中添加：

```java
ResourceUserService resourceService = context.getBean(ResourceUserService.class);
System.out.println(resourceService.findName()); // Ada
```

这里字段叫 `dao`，`name = "userDao"` 显式指定 Bean 名称。容器注入的对象必须与字段类型兼容；指定的名称不存在时，注入失败，不会再按类型查找其他 Bean。

### 默认名称与类型回退

省略 `name` 时，Spring 从字段名或 Setter 对应的属性名推导名称。例如，将前面的字段改为以下形式，并把 `findName()` 中的引用改为 `userDao`：

```java
@Resource
private UserDao userDao;
```

它先查找名为 `userDao` 的 Bean。默认配置下，只有推导出的名称不存在时，才回退到按类型解析；此时需要能够确定一个候选，`@Primary` 也可以参与选择。如果存在同名 Bean 但类型不兼容，注入失败。

Setter 上的默认名称来自属性名，例如 `setUserDao(...)` 对应 `userDao`。沿用显式名称示例中的 `dao` 字段，移除字段上的注解后，也可以通过 Setter 指定名称：

```java
@Resource(name = "userDao")
public void setDao(UserDao dao) {
    this.dao = dao;
}
```

`@Autowired` 以类型匹配候选，`@Qualifier` 在候选中进一步筛选；`@Resource(name = "...")` 表达按名称取得特定 Bean 的要求。构造器注入使用单构造器规则或 `@Autowired`，需要限定候选时在参数上添加 `@Qualifier`。
