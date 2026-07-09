---
title: 命令模式
date: 2024-02-04
icon: command
author: patterns
category:
  - reading
tag:
  - design pattern
  - vanilla
  - command-pattern
---

## 命令模式

通过命令模式，我们可以将执行特定任务的对象与调用方法的对象 _解耦_。

假设我们有一个在线食品配送平台。用户可以下单、跟踪和取消订单。

```js
class OrderManager() {
  constructor() {
    this.orders = []
  }

  placeOrder(order, id) {
    this.orders.push(id)
    return `You have successfully ordered ${order} (${id})`;
  }

  trackOrder(id) {
    return `Your order ${id} will arrive in 20 minutes.`
  }

  cancelOrder(id) {
    this.orders = this.orders.filter(order => order.id !== id)
    return `You have canceled your order ${id}`
  }
}
```

在 `OrderManager` 类中，我们可以直接访问 `placeOrder`、`trackOrder` 和 `cancelOrder` 方法。

```js
const manager = new OrderManager()

manager.placeOrder('Pad Thai', '1234')
manager.trackOrder('1234')
manager.cancelOrder('1234')
```

不过，直接在 `manager` 实例上调用方法也有缺点。我们可能会决定重新命名某些方法，或者方法的功能发生变化。

假设我们现在不调用 `placeOrder`，而是将其重命名为 `addOrder`！这意味着我们必须确保不在代码库的任何地方调用 `placeOrder` 方法，这在大型应用程序中可能会非常棘手。

相反，我们希望将这些方法与管理器对象分离，并为每个命令创建单独的命令函数！

让我们重构 `OrderManager` 类：它将不再有 `placeOrder`、`cancelOrder` 和 `trackOrder` 方法，而只有一个方法：`execute`。该方法将执行给定的任何命令。

每个命令都应能访问 `OrderManager` 的 `orders`，我们将把它作为第一个参数传递。

```js
class OrderManager {
  constructor() {
    this.orders = []
  }

  execute(command, ...args) {
    return command.execute(this.orders, ...args)
  }
}
```

我们需要为订单管理器创建三个命令：

- `PlaceOrderCommand`
- `CancelOrderCommand`
- `TrackOrderCommand`

```js
class Command {
  constructor(execute) {
    this.execute = execute
  }
}

function PlaceOrderCommand(order, id) {
  return new Command((orders) => {
    orders.push(id)
    return `You have successfully ordered ${order} (${id})`
  })
}

function CancelOrderCommand(id) {
  return new Command((orders) => {
    orders = orders.filter((order) => order.id !== id)
    return `You have canceled your order ${id}`
  })
}

function TrackOrderCommand(id) {
  return new Command(() => `Your order ${id} will arrive in 20 minutes.`)
}
```

完美！现在，这些方法不再直接与 `OrderManager` 实例耦合，而是成为独立的解耦函数，我们可以通过 `OrderManager` 上可用的执行方法来调用它们。

::: normal-demo

```html
<p>打开调试控制台查看输出</p>
```

```js
class OrderManager {
  constructor() {
    this.orders = []
  }

  execute(command, ...args) {
    return command.execute(this.orders, ...args)
  }
}

class Command {
  constructor(execute) {
    this.execute = execute
  }
}

function PlaceOrderCommand(order, id) {
  return new Command((orders) => {
    orders.push(id)
    console.log(`You have successfully ordered ${order} (${id})`)
  })
}

function CancelOrderCommand(id) {
  return new Command((orders) => {
    orders = orders.filter((order) => order.id !== id)
    console.log(`You have canceled your order ${id}`)
  })
}

function TrackOrderCommand(id) {
  return new Command(() =>
    console.log(`Your order ${id} will arrive in 20 minutes.`)
  )
}

const manager = new OrderManager()

manager.execute(new PlaceOrderCommand('Pad Thai', '1234'))
manager.execute(new TrackOrderCommand('1234'))
manager.execute(new CancelOrderCommand('1234'))
```

:::

## 优点

命令模式允许我们将方法与执行操作的对象解耦。如果您要处理的命令有一定的生命周期，或者命令需要排队并在特定时间执行，那么它能让您获得更多控制权。

## 缺点

命令模式的用例非常有限，而且往往会给应用程序增加不必要的模板。

## 参考

- [Command Design Pattern](https://sourcemaking.com/design_patterns/command) - SourceMaking
- [Command Pattern](https://refactoring.guru/design-patterns/command) - Refactoring Guru
- [Command Pattern](https://www.carloscaballero.io/design-patterns-command/) - Carlos Caballero
