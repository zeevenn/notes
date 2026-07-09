---
title: 中介者模式
date: 2024-09-18
icon: mediator
author: patterns
category:
  - reading
tag:
  - design pattern
  - vanilla
  - mediator-pattern
---

中介者模式使组件之间通过一个中心点（调解器）进行交互成为可能。它允许组件接收请求并将其发送出去，而不是彼此直接对话！在 JavaScript 中，中介者通常只是一个对象字面或函数。

你可以把这种模式比作空中交通管制员和飞行员之间的关系。飞行员与空中交通管制员之间的对话可能会导致混乱，而不是让飞行员直接对话。空中交通管制员确保所有飞机都能收到所需的信息，以便安全飞行，不撞击其他飞机。

虽然我们不希望在 JavaScript 中控制飞机，但我们经常需要处理对象之间的多向数据。如果组件数量较多，组件之间的通信可能会变得相当混乱。

![20240918170836](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240918170836.png)

与让每个对象直接与其他对象对话从而形成多对多的关系不同，对象的请求由调解器处理。调解器处理请求，并将其发送到需要的地方。

![20240918170920](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240918170920.png)

聊天室就是中间件模式的一个很好的用例！聊天室中的用户不会直接对话。聊天室只是用户之间的中介。

::: normal-demo 聊天室示例

```js
class Chatroom {
  constructor() {
    this.users = {} // 保存用户列表
  }

  // 注册用户到聊天室
  register(user) {
    this.users[user.name] = user
    user.chatroom = this // 为每个用户设置聊天室中介者
  }

  // 发送消息，userFrom 发送给 userTo
  send(message, userFrom, userTo) {
    if (userTo) {
      // 私聊消息
      userTo.receive(message, userFrom)
    } else {
      // 群聊消息
      Object.keys(this.users).forEach((key) => {
        if (this.users[key] !== userFrom) {
          this.users[key].receive(message, userFrom)
        }
      })
    }
  }
}

class User {
  constructor(name) {
    this.name = name
    this.chatroom = null // 用户所属的聊天室中介者
  }

  send(message, userTo) {
    this.chatroom.send(message, this, userTo)
  }

  receive(message, userFrom) {
    console.log(`${userFrom.name} to ${this.name}: ${message}`)
  }
}

// 示例
const chatroom = new Chatroom()
const user1 = new User('Alice')
const user2 = new User('Bob')
const user3 = new User('Charlie')

chatroom.register(user1)
chatroom.register(user2)
chatroom.register(user3)

user1.send('Hello, Bob!', user2)
user3.send('Hi everyone!')
```

:::

::: tip

组件的封装也使用了中介者模式，子组件抛出事件在父组件中集中处理。

:::
