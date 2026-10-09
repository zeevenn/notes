---
title: Java 配置类
date: 2026-10-09
icon: server
category:
  - 后端
  - Spring Framework
tag:
  - Spring Framework
  - IoC
  - DI
  - Java 配置
---

Java 配置把对象的创建和组装规则集中放在配置类中。`@Configuration` 标记配置类，`@Bean` 标记工厂方法，方法返回的对象交给容器管理。

这与[组件注解和扫描](./annotation-config-and-di.md)的区别是 Bean 的声明位置：组件扫描从类上的标记发现对象，配置类通过方法显式提供对象。`@Bean` 可以使用普通 Java 类，也适合注册无法直接修改源码的第三方组件。

## 配置类声明 Bean

沿用 [IoC 与 DI](./ioc-container-and-beans.md#示例组件类)中未添加组件注解、通过构造器注入的 `UserDao`、`UserService`，以及 Spring Framework 7.0.9 的 Maven 依赖。在 `com.example` 包中新增：

```java
// AppConfig.java
package com.example;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public UserDao userDao() {
        return new UserDao();
    }

    @Bean
    public UserService userService(UserDao userDao) {
        return new UserService(userDao);
    }
}
```

默认情况下，Bean 名称取方法名，这两个定义分别叫 `userDao` 和 `userService`。方法中的 `new` 描述创建规则；方法何时调用、返回对象如何管理，由容器根据 Bean 定义处理。

## 读取配置类并创建容器

```java
// App.java
package com.example;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class App {
    public static void main(String[] args) {
        try (var context = new AnnotationConfigApplicationContext(AppConfig.class)) {
            UserService service = context.getBean("userService", UserService.class);
            System.out.println(service.findName());
        }
    }
}
```

容器读取 `AppConfig` 中的 `@Bean` 方法，注册对应的 Bean 定义并初始化。在项目根目录运行：

```bash
mvn compile exec:java -Dexec.mainClass=com.example.App
```

程序输出 `Ada`。这次容器没有读取 XML 文件，也没有开启组件扫描。

## 工厂方法参数注入

`userService(UserDao userDao)` 的参数声明了工厂方法需要的依赖。容器调用方法时，按参数类型提供已有的 `UserDao` Bean，方法再把它传入服务的构造器，无需在参数上额外标注 `@Autowired`。

默认单例作用域下，注入的是容器管理的共享实例。这里通过方法参数表达依赖，不需要在 `userService()` 中再次创建 `UserDao`。存在多个候选 Bean 时，也可以在参数上使用 `@Qualifier`，选择规则见[注解篇](./annotation-config-and-di.md#多个候选-bean-的选择)。

## 用配置类组织组件扫描

配置类可以同时承载扫描规则。切换到[注解篇](./annotation-config-and-di.md#组件标记)中添加了 `@Repository`、`@Service` 的组件，将 `AppConfig` 替换为：

```java
// AppConfig.java
package com.example;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("com.example")
public class AppConfig {
}
```

仍通过 `new AnnotationConfigApplicationContext(AppConfig.class)` 创建容器。`@Configuration` 标记配置入口，`@ComponentScan` 指定扫描范围，组件注解标记要管理的类。配置类本身不会自动开启包扫描。

组合使用时，可以扫描业务组件，同时通过 `@Bean` 方法注册连接池等第三方组件。同一个组件应有明确的注册来源，避免扫描和工厂方法重复注册。
