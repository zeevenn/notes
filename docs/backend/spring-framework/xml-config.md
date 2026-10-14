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

### 按构造器参数名称匹配

`name` 指定构造器参数名称。例如，前面的 `QueryOptions(int limit)` 可以写成：

```xml
<constructor-arg name="limit" value="10"/>
```

按名称匹配需要让 Spring 能读取构造器参数名。Maven Compiler Plugin 可以通过以下属性开启 `-parameters`：

```xml
<properties>
  <maven.compiler.parameters>true</maven.compiler.parameters>
</properties>
```

### 按构造器参数位置匹配

`index` 从 `0` 开始，不依赖编译时是否保留参数名。前面的配置也可以写成：

```xml
<bean id="queryOptions" class="com.example.QueryOptions">
  <constructor-arg index="0" value="10"/>
</bean>
```

多个同类型参数容易混淆时，位置可以明确区分它们。例如，假设类提供 `PageOptions(int offset, int limit)` 构造器：

```xml
<bean id="pageOptions" class="com.example.PageOptions">
  <constructor-arg index="0" value="20"/>
  <constructor-arg index="1" value="10"/>
</bean>
```

对应调用 `new PageOptions(20, 10)`。参数位置由 `index` 决定，交换这两个 XML 元素的书写顺序不会交换实参。

### 按构造器参数类型匹配

`type` 指定目标参数类型，可辅助区分构造器重载：

```xml
<bean id="queryOptions" class="com.example.QueryOptions">
  <constructor-arg type="int" value="10"/>
</bean>
```

基本类型使用 `int`、`boolean` 等名称，引用类型使用 `java.lang.String` 等全限定名。假设类同时提供 `QueryOptions(int limit)` 和 `QueryOptions(String expression)`，`type="int"` 明确选择前者。

多个参数的类型相同时，仅靠 `type` 无法区分它们的位置，应使用 `index` 或可读取的参数名。`index` 和 `type` 也可以组合，例如 `<constructor-arg index="0" type="int" value="10"/>`。

### 用嵌套元素传值或引用

`value`、`ref` 属性也有嵌套元素形式。下面分别等价于前面的 `value="10"` 和 `ref="userDao"`：

```xml
<bean id="queryOptions" class="com.example.QueryOptions">
  <constructor-arg>
    <value>10</value>
  </constructor-arg>
</bean>

<bean id="userService" class="com.example.UserService">
  <constructor-arg>
    <ref bean="userDao"/>
  </constructor-arg>
</bean>
```

`<property>` 同样支持 `<value>` 和 `<ref>` 子元素。一个参数或属性只能指定一个值来源，不能同时写 `value`、`ref` 或嵌套值。

如果依赖只在当前位置使用，可以把 Bean 定义直接嵌入参数：

```xml
<bean id="userService" class="com.example.UserService">
  <constructor-arg>
    <bean class="com.example.UserDao"/>
  </constructor-arg>
</bean>
```

这里的内部 Bean 无需命名，也不能作为顶层 Bean 单独通过 `getBean()` 获取。需要在多处共享同一个依赖时，使用独立的 Bean 定义和 `ref`。

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

`name="userDao"` 对应 `setUserDao(...)`，匹配 JavaBean 属性名，不依赖 `-parameters`；`ref="userDao"` 指定传入的 Bean。容器通过无参构造器创建服务，再调用 Setter。在 `App` 的 `try` 块中执行：

```java
SetterUserService setterService = context.getBean("setterUserService", SetterUserService.class);
System.out.println(setterService.findName()); // Ada
```

省略 `<property>` 时，字段保持 `null`，调用 `findName()` 会失败。Setter 注入不会自动把业务所需的依赖变成可选项。

普通属性值同样用 `<property name="属性名" value="值"/>` 设置，目标类需要提供相应的 Setter。构造器注入在创建时提供必需依赖，并支持 `final` 字段；Setter 配置适合可选依赖或只暴露设置方法的第三方组件。

## 外部属性注入

数据库连接参数可以放在 properties 文件中，XML 通过 `${属性名}` 引用。下面使用独立的 `com.example.database` 示例包，DAO 保存配置并固定返回 `Ada`，不执行数据库连接。

```java
// UserDao.java
package com.example.database;

public class UserDao {
    private final String url;
    private final String username;
    private final String password;
    private final int connectionTimeoutSeconds;

    public UserDao(String url, String username, String password, int connectionTimeoutSeconds) {
        this.url = url;
        this.username = username;
        this.password = password;
        this.connectionTimeoutSeconds = connectionTimeoutSeconds;
    }

    public String getUrl() {
        return url;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public int getConnectionTimeoutSeconds() {
        return connectionTimeoutSeconds;
    }

    public String findName() {
        return "Ada";
    }
}
```

在 `src/main/resources/database.properties` 中配置：

```properties
database.url=jdbc:mysql://localhost:3306/sample_db
database.username=demo_user
database.password=demo_password
database.connection-timeout-seconds=20
```

`database.xml` 放在同一资源目录，使用 `context:property-placeholder` 指定属性文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           https://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/context
           https://www.springframework.org/schema/context/spring-context.xsd">

  <!-- 这里指定传入属性文件 -->
  <context:property-placeholder location="classpath:database.properties"/>

  <bean id="userDao" class="com.example.database.UserDao">
    <constructor-arg name="url" value="${database.url}"/>
    <constructor-arg name="username" value="${database.username}"/>
    <constructor-arg name="password" value="${database.password}"/>
    <constructor-arg name="connectionTimeoutSeconds"
                     value="${database.connection-timeout-seconds}"/>
  </bean>
</beans>
```

启用前面的参数名编译配置后，加载 `database.xml`，即可验证属性读取和类型转换：

```java
// App.java
package com.example.database;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class App {
    public static void main(String[] args) {
        try (var context = new ClassPathXmlApplicationContext("database.xml")) {
            UserDao dao = context.getBean("userDao", UserDao.class);
            System.out.println(dao.getUrl()); // jdbc:mysql://localhost:3306/sample_db
            System.out.println(dao.getConnectionTimeoutSeconds()); // 20
            System.out.println(dao.findName()); // Ada
        }
    }
}
```

容器先加载属性并解析 Bean 定义中的占位符，创建 DAO 时再把字符串 `"20"` 转换为 `int`。属性名 `database.connection-timeout-seconds` 与构造器参数名 `connectionTimeoutSeconds` 没有自动对应关系，由 XML 明确连接两者。

缺失属性且未指定默认值时，默认会因无法解析占位符而初始化失败。使用 `${database.connection-timeout-seconds:20}` 可以在属性不存在时提供默认值；读取到的内容不是有效整数时，仍会在转换阶段失败。

普通 Spring Framework 需要显式配置属性文件加载；仅把文件命名为 `application.properties` 或写出 `${...}` 不会自动读取。YAML 可以通过 `YamlPropertiesFactoryBean` 转换为 `Properties`，再交给占位符处理器，并需额外引入 SnakeYAML。

## 用 import 组合配置文件

`database.xml` 集中声明 DAO 和数据库属性，其他配置文件可以通过 `<import>` 复用。以下服务与外部属性示例使用同一个包：

```java
// UserService.java
package com.example.database;

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

同一资源目录下的 `constructor.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           https://www.springframework.org/schema/beans/spring-beans.xsd">

  <import resource="database.xml"/>

  <bean id="userService" class="com.example.database.UserService">
    <constructor-arg name="userDao" ref="userDao"/>
  </bean>
</beans>
```

`new ClassPathXmlApplicationContext("constructor.xml")` 会在同一个容器中读取两个文件，注册 `userDao` 和 `userService`；服务查询仍返回 `Ada`。`<import>` 不会为被引入的文件单独创建容器，`resource="database.xml"` 相对于当前 XML 文件的位置解析。

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

| 创建方式 | XML 中的创建规则                                            | 对应调用                                   |
| -------- | ----------------------------------------------------------- | ------------------------------------------ |
| 构造器   | `class` 指定组件类                                          | `new UserService(userDao)`                 |
| 静态工厂 | `class` 指定工厂类，`factory-method` 指定静态方法           | `StaticUserServiceFactory.create(userDao)` |
| 实例工厂 | `factory-bean` 引用工厂 Bean，`factory-method` 指定实例方法 | `userServiceFactory.create(userDao)`       |

以上工厂方法每次执行都会创建对象，默认单例作用域下容器会复用取得的 Bean。`static` 表示方法属于类，不决定 Bean 的作用域；实例复用和销毁回调的边界见 [Bean 的作用域与生命周期](./bean-scopes-and-lifecycle.md)。

XML 的 `factory-bean` 属性指定调用哪个普通 Bean 的实例方法，不要求工厂类实现 Spring 的 `FactoryBean` 接口。`FactoryBean<T>` 是另一个机制：容器通过 `getObject()` 获取产物；按名称获取时默认返回产物，名称前加 `&` 才返回工厂本身。
