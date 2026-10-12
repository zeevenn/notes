---
title: XML 配置
date: 2026-10-10
icon: server
category:
  - 后端
  - Spring Framework
tag:
  - Spring Framework
  - IoC
  - DI
  - XML
---

XML 配置把 Bean 的创建规则和依赖关系写在组件类之外。容器读取 `<bean>` 元素，调用指定的构造器或工厂方法，再根据参数和属性配置组装对象。

以下示例使用 [IoC 与 DI](./ioc-container-and-beans.md#示例组件类)中的 Maven 依赖，以及 `com.example` 包下通过构造器接收依赖的 `UserDao`、`UserService`。

## 声明 Bean 并运行查询

在 `src/main/resources/beans.xml` 中声明两个 Bean：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           https://www.springframework.org/schema/beans/spring-beans.xsd">

  <bean id="userDao" class="com.example.UserDao"/>

  <bean id="userService" class="com.example.UserService">
    <constructor-arg ref="userDao"/>
  </bean>
</beans>
```

`id` 是 Bean 的名称，`class` 是组件类的全限定名。`<constructor-arg ref="userDao"/>` 引用另一个 Bean，容器据此调用 `UserService(UserDao)`。构造器有参数时，不需要额外提供无参构造器。

`ClassPathXmlApplicationContext` 从类路径读取配置。Maven 将 `src/main/resources/beans.xml` 复制到运行时类路径，因此使用 `"beans.xml"`：

```java
// App.java
package com.example;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class App {
    public static void main(String[] args) {
        try (var context = new ClassPathXmlApplicationContext("beans.xml")) {
            UserService service = context.getBean("userService", UserService.class);
            System.out.println(service.findName());
        }
    }
}
```

在项目根目录运行：

```bash
mvn compile exec:java -Dexec.mainClass=com.example.App
```

输出 `Ada`。默认的非延迟单例在容器初始化时创建，容器先取得 `UserDao`，再把它传给 `UserService`。

后面的配置片段都放在同一个 `<beans>` 根元素中。使用不同创建方式时，替换原来的 `userService` 定义。

## 构造器参数与普通值

`ref` 提供容器中的对象，`value` 提供字符串形式的配置值，容器按目标参数类型进行转换。例如，查询选项通过构造器接收一个数量限制：

```java
// QueryOptions.java
package com.example;

public class QueryOptions {
    private final int limit;

    public QueryOptions(int limit) {
        this.limit = limit;
    }

    public int getLimit() {
        return limit;
    }
}
```

新增 Bean 定义：

```xml
<bean id="queryOptions" class="com.example.QueryOptions">
  <constructor-arg value="10"/>
</bean>
```

在前面 `App` 的 `try` 块中获取它：

```java
QueryOptions options = context.getBean("queryOptions", QueryOptions.class);
System.out.println(options.getLimit()); // 10
```

本例只有一个构造器、一个 `int` 参数，容器把 `"10"` 转换为整数；无法转换的值会导致 Bean 创建失败。`value="userDao"` 则是字符串值，不会取得名为 `userDao` 的 Bean。

多参数构造器可以使用从 `0` 开始的 `index` 指定位置，或用 `type` 辅助区分重载。使用 `name` 按参数名配置时，通常需要编译器的 `-parameters` 选项保存参数名。

## Setter 属性配置

Setter 注入在对象创建后调用设置方法。用单独的类对照这个过程，主示例的 `UserService` 保持构造器注入：

```java
// SetterUserService.java
package com.example;

public class SetterUserService {
    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public String findName() {
        return userDao.findName();
    }
}
```

在 `beans.xml` 中新增：

```xml
<bean id="setterUserService" class="com.example.SetterUserService">
  <property name="userDao" ref="userDao"/>
</bean>
```

`name="userDao"` 对应 `setUserDao(...)`，`ref="userDao"` 指定传入的 Bean。容器通过无参构造器创建服务，再调用 Setter。在 `App` 的 `try` 块中执行：

```java
SetterUserService setterService = context.getBean("setterUserService", SetterUserService.class);
System.out.println(setterService.findName()); // Ada
```

省略 `<property>` 时，字段保持 `null`，调用 `findName()` 会失败。Setter 注入不会自动把业务所需的依赖变成可选项。

普通属性值同样用 `<property name="属性名" value="值"/>` 设置，目标类需要提供相应的 Setter。构造器注入在创建时提供必需依赖，并支持 `final` 字段；Setter 配置适合可选依赖或只暴露设置方法的第三方组件。

## 通过工厂方法创建 Bean

已有组件通过工厂方法创建对象时，可以让容器调用该方法，将返回对象作为 Bean 管理。以下两个示例继续使用构造器注入版本的 `UserService`。

### 静态工厂方法

新增静态工厂类：

```java
// StaticUserServiceFactory.java
package com.example;

public class StaticUserServiceFactory {
    public static UserService create(UserDao userDao) {
        return new UserService(userDao);
    }
}
```

保留 `userDao` 定义，将 `userService` 定义替换为：

```xml
<bean id="userService"
      class="com.example.StaticUserServiceFactory"
      factory-method="create">
  <constructor-arg ref="userDao"/>
</bean>
```

这里的 `class` 指定包含静态方法的工厂类，`factory-method` 指定方法名。容器调用 `StaticUserServiceFactory.create(userDao)`，无需把静态工厂类另行注册为 Bean。

`<constructor-arg>` 在工厂配置中提供方法参数。名为 `userService` 的 Bean 是返回的 `UserService` 对象，沿用前面的 `App` 和运行命令，输出仍为 `Ada`。

### 实例工厂方法

实例工厂需要先把工厂对象注册为 Bean：

```java
// InstanceUserServiceFactory.java
package com.example;

public class InstanceUserServiceFactory {
    public UserService create(UserDao userDao) {
        return new UserService(userDao);
    }
}
```

保留 `userDao` 定义，将 `userService` 定义替换为：

```xml
<bean id="userServiceFactory"
      class="com.example.InstanceUserServiceFactory"/>

<bean id="userService"
      factory-bean="userServiceFactory"
      factory-method="create">
  <constructor-arg ref="userDao"/>
</bean>
```

`factory-bean` 引用工厂 Bean 的名称，`factory-method` 指定实例方法。容器先取得工厂 Bean，再调用它的 `create(userDao)`，把返回对象作为 `userService` 管理；这个定义不填写 `class`。运行查询，输出仍为 `Ada`。

| 创建方式 | XML 中的创建规则 | 对应调用 |
| --- | --- | --- |
| 构造器 | `class` 指定组件类 | `new UserService(userDao)` |
| 静态工厂 | `class` 指定工厂类，`factory-method` 指定静态方法 | `StaticUserServiceFactory.create(userDao)` |
| 实例工厂 | `factory-bean` 引用工厂 Bean，`factory-method` 指定实例方法 | `userServiceFactory.create(userDao)` |

以上工厂方法每次执行都会创建对象，默认单例作用域下容器会复用取得的 Bean。`static` 表示方法属于类，不决定 Bean 的作用域；实例复用和销毁回调的边界见 [Bean 的作用域与生命周期](./bean-scopes-and-lifecycle.md)。
