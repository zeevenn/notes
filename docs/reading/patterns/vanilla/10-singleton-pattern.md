---
title: 单例模式
date: 2024-10-28
icon: singleton
author: patterns
category:
  - reading
tag:
  - design pattern
  - vanilla
  - singleton-pattern
---

单例是指只需实例化一次就可以全局访问的类。单例可以在整个应用程序中共享，这使得单例非常适合管理应用程序中的全局状态。

比如一个邮件应用，可以使用单例模式来共享一个 `EmailClient` 对象。

```ts
class EmailClient {
  private transporter: Transporter
  private static instance: Mailer

  // 使用 nodemailer 配置，发送邮件
  private constructor() {
    const smtpConfig: SMTPTransport.Options = {
      host: config.NODEMAILER_HOST,
      port: 465,
      secure: true,
      auth: {
        user: config.NODEMAILER_AUTH_USER,
        pass: config.NODEMAILER_AUTH_PASS
      },
      socketTimeout: 30000,
      connectionTimeout: 30000,
      logger: true,
      debug: true
    }

    this.transporter = createTransport(smtpConfig)
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Mailer()
    }
    return this.instance
  }
}
```

这里构造函数为 `private`，因此无法在外部创建 `EmailClient` 对象，但可以通过 `getInstance` 方法获取单例对象。

如果使用 js 创建对象，由于 js 无 `private` 修饰符，可以在 `constructor` 中使用 [`new.target`](../../../frontend/basic/javascript/013-class.md#抽象基类) 判断是否为 `EmailClient` 类，如果是则抛出错误。

```js
class EmailClient {
  constructor() {
    if (new.target === EmailClient) {
      throw new Error('Cannot instantiate EmailClient directly')
    }
  }
}
```

这样，一个 `EmailClient` 对象只能通过 `getInstance` 方法获取，而且只会在初始化时创建一次，不会大量地创建多个 `EmailClient` 对象，防止大量连接邮件服务造成性能问题。
