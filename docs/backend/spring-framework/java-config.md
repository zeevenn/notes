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

Java 配置把 Bean 的创建和组装规则集中放在配置类中。`@Configuration` 标记配置类，`@Bean` 标记工厂方法，容器调用方法并管理返回对象。

[组件扫描](./annotation-config-and-di.md)从类上的标记发现组件，`@Bean` 则通过方法显式声明对象，可以使用普通 Java 类，也适合注册无法直接修改源码的第三方组件。

## 配置类声明 Bean

使用 [IoC 与 DI](./ioc-container-and-beans.md#示例组件类)中的 Maven 依赖和 `com.example` 包下的普通 `UserDao`、`UserService`。它们始终通过构造器组装；配置类和入口放在 `src/main/java/com/example/config/` 中：

```java
// AppConfig.java
package com.example.config;

import com.example.UserDao;
import com.example.UserService;
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

默认情况下，Bean 名称取方法名，两个定义分别叫 `userDao` 和 `userService`。方法中的 `new` 描述创建规则；方法何时调用、返回对象如何管理，由容器根据 Bean 定义处理。

`userService(UserDao userDao)` 的参数声明了工厂方法需要的依赖。容器解析参数时取得匹配的 `UserDao` Bean，必要时先创建它，再调用工厂方法；方法把依赖传入服务的构造器。工厂方法参数无需额外标注 `@Autowired`。

## 读取配置类并创建容器

```java
// App.java
package com.example.config;

import com.example.UserService;
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

容器注册 `AppConfig`，解析其中的 `@Bean` 方法并初始化。在项目根目录运行：

```bash
mvn compile exec:java -Dexec.mainClass=com.example.config.App
```

程序输出 `Ada`。这个配置没有开启组件扫描，类上的组件标记不参与本次注册。

默认单例作用域下，工厂方法参数注入的是容器管理的共享实例。存在多个候选时，可以在参数上使用 `@Qualifier`，选择规则见[多个候选 Bean 的选择](./annotation-config-and-di.md#多个候选-bean-的选择)。

## `@Bean` 方法之间的调用

参数注入之外，也能在一个工厂方法中调用另一个工厂方法。将 `AppConfig` 中的 `userService` 方法替换为：

```java
@Bean
public UserService userService() {
    return new UserService(userDao());
}
```

默认的 `@Configuration` 会让容器创建配置类的增强实例，拦截可覆盖的实例 `@Bean` 方法调用。这里的 `userDao()` 会取得容器管理的 Bean；即使方法体中写了 `new`，在本例默认单例作用域下也会复用同一个对象。

在 `App` 的 `try` 块中添加以下代码，观察容器管理的配置实例：

```java
AppConfig config = context.getBean(AppConfig.class);
System.out.println(config.userDao() == context.getBean("userDao")); // true
```

### 关闭方法调用拦截

把配置类上的注解改为 `@Configuration(proxyBeanMethods = false)`，继续使用直接调用 `userDao()` 的版本。此时方法调用按普通 Java 语义执行，每次都会运行本例的 `new UserDao()`。

服务中的 `UserDao` 因而是这次直接调用创建的对象，容器不会因它来自一个带 `@Bean` 的方法就自动把它注册为独立 Bean。前面的身份比较输出 `false`。

恢复 `userService(UserDao userDao)` 的参数注入写法后，依赖仍由容器提供；这种写法在两种配置下都能取得受管理的 Bean。`proxyBeanMethods` 控制方法调用是否被拦截，不改变 Bean 的作用域。

拦截作用于容器管理的增强配置实例。手动 `new AppConfig()` 得到的是普通对象；`static` 的 `@Bean` 方法也不受这种拦截。默认开启拦截时，配置类和需要拦截的方法不能声明为 `final`，方法也不能是 `private`。

## 用配置类组织组件扫描

配置类可以同时承载扫描规则。保留[组件标记](./annotation-config-and-di.md#组件标记)中的 `com.example.scan` 组件，将 `AppConfig` 替换为：

```java
// AppConfig.java
package com.example.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
@ComponentScan("com.example.scan")
public class AppConfig {
    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }
}
```

仍通过 `new AnnotationConfigApplicationContext(AppConfig.class)` 创建容器。`@ComponentScan` 指定扫描范围，容器据此注册 `UserDao`、`UserService`；`@Bean` 则注册 JDK 提供的 `Clock`，无需修改它的源码。这个配置没有方法之间的调用，因此可以关闭拦截。

将 `App` 的服务导入改为 `com.example.scan.UserService`，查询仍输出 `Ada`。在 `try` 块中添加：

```java
System.out.println(context.getBean(java.time.Clock.class).getZone()); // Z
```

两种注册方式在同一个容器中协作。第三方连接池等组件也可以通过 `@Bean` 集中创建和配置。`@Configuration` 本身不会开启包扫描；同一个组件应有明确的注册来源，避免扫描和工厂方法重复注册。

`@Bean` 的初始化、销毁方法和 `@Scope` 的配置，见 [Bean 的作用域与生命周期](./bean-scopes-and-lifecycle.md#java-配置类)。
