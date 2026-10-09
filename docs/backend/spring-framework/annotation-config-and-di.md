---
title: 注解配置与依赖注入
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

注解配置把组件的声明放在类上，通过组件扫描注册 Bean，再由容器提供组件需要的依赖。[IoC 与 DI](./ioc-container-and-beans.md)介绍容器、Bean 和依赖注入的关系；这里沿用同一套查询逻辑以及 Spring Framework 7.0.9 的 Maven 依赖。

## 组件标记

`@Component` 是通用组件标记。`@Repository`、`@Service`、`@Controller` 分别表达数据访问、业务逻辑、请求处理组件的角色，它们都能被默认的组件扫描识别。

代码放在 `src/main/java/com/example/` 下，用下面两个类替换前一篇中的组件：

```java
// UserDao.java
package com.example;

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
package com.example;

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

组件扫描在指定包中查找组件类，注册 Bean 定义，再创建对象和组装依赖。仅给类加注解，还需要扫描或显式注册，容器才能管理它。

```java
// App.java
package com.example;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class App {
    public static void main(String[] args) {
        try (var context = new AnnotationConfigApplicationContext("com.example")) {
            UserService service = context.getBean("userService", UserService.class);
            System.out.println(service.findName());
        }
    }
}
```

这个构造器接收包名，扫描 `com.example` 及其子包并初始化容器。默认命名规则下，本例的 Bean 名称是 `userDao` 和 `userService`；也可以通过 `@Service("指定名称")` 显式命名。

在项目根目录运行：

```bash
mvn compile exec:java -Dexec.mainClass=com.example.App
```

程序输出 `Ada`。容器从扫描结果获得 Bean 定义，没有读取 `beans.xml`。扫描范围遗漏依赖组件时，容器无法完成服务的依赖注入。

## `@Autowired` 与注入位置

`@Autowired` 标记需要自动注入的构造器、方法或字段，本身不负责把类注册成 Bean。前例保留单构造器注入；若使用 Setter 注入，可以将 `UserService` 替换为：

```java
// UserService.java
package com.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
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

容器通过无参构造器创建服务，再调用带有 `@Autowired` 的 Setter。该方法的依赖默认是必需的，找不到匹配的 Bean 时会导致创建失败。Setter 注入本身不表示依赖是可选的。

字段注入是在字段上标注 `@Autowired`，由容器直接设置字段。构造器注入把依赖集中列在创建入口，支持 `final` 字段，也便于在普通 Java 代码中直接组装对象。Setter 注入适合允许后续设置依赖的类；字段注入的对象则需要其他手段才能在容器之外补齐依赖。

## 多个候选 Bean 的选择

自动注入以依赖类型查找候选对象。如果同一类型有多个候选 Bean，需要明确选择规则。`@Primary` 标记默认优先的候选，`@Qualifier` 在具体注入位置进一步限定候选。

例如，若两个 `UserDao` Bean 分别叫 `userDao` 和 `backupUserDao`，可在构造器参数上使用 Bean 名称作为限定值。导入 `org.springframework.beans.factory.annotation.Qualifier`，将构造器改为：

```java
public UserService(@Qualifier("userDao") UserDao userDao) {
    this.userDao = userDao;
}
```

这个改动针对前面的构造器注入版本。`@Qualifier` 选择注入位置所需的候选；`@Primary` 可以放在组件类或 `@Bean` 方法上，提供没有进一步限定时的默认选择。候选仍无法唯一确定时，依赖注入会失败。

扫描规则也可以交给配置类组织，见 [Java 配置类](./java-config.md#用配置类组织组件扫描)。
