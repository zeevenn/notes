---
title: 观察者模式
date: 2024-09-20
icon: observer
author: patterns
category:
  - reading
tag:
  - design pattern
  - vanilla
  - observer-pattern
---

观察者模式（Observer Pattern）是一种行为设计模式，用于创建一种对象之间的「一对多」关系，使得当一个对象的状态发生变化时，所有依赖于它的对象都能得到通知并自动更新。这个模式非常适合用来实现事件系统或数据绑定功能。

![观察者模式](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240920125941.png)

## 函数版本

函数式观察者模式的主要组成部分：

- `observers`：在发生特定事件时会收到通知的观察者数组
- `subscribe()`：向观察者列表添加观察者的方法
- `unsubscribe()`：从观察者列表移除观察者的方法
- `notify()`：在发生特定事件时通知所有观察者的方法

```js
class Observable {
  constructor() {
    this.observers = []
  }

  subscribe(func) {
    this.observers.push(func)
  }

  unsubscribe(func) {
    this.observers = this.observers.filter((observer) => observer !== func)
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data))
  }
}
```

让我们用这个可观察对象构建一些东西。 我们有一个非常基本的应用程序，它只由两个组件组成：一个按钮和一个开关。

```jsx
import { ToastContainer, toast } from 'react-toastify'

function logger(data) {
  console.log(`${Date.now()} ${data}`)
}

function toastify(data) {
  toast(data)
}

export default function App() {
  return (
    <div className="App">
      <Button>Click me!</Button>
      <FormControlLabel control={<Switch />} />
      <ToastContainer />
    </div>
  )
}
```

我们希望跟踪用户与应用程序的交互。每当用户点击按钮或拨动开关时，我们都要记录这一事件并加上时间戳。除了记录，我们还想创建一个 toast 通知，在事件发生时显示！

```jsx
import { ToastContainer, toast } from 'react-toastify'

function logger(data) {
  console.log(`${Date.now()} ${data}`)
}

function toastify(data) {
  toast(data)
}

observable.subscribe(logger)
observable.subscribe(toastify)

export default function App() {
  function handleClick() {
    observable.notify('User clicked button!')
  }

  function handleToggle() {
    observable.notify('User toggled switch!')
  }

  return (
    <div className="App">
      <Button>Click me!</Button>
      <FormControlLabel control={<Switch />} />
      <ToastContainer />
    </div>
  )
}
```

整个流程：`handleClick` 和 `handleToggle` 用数据调用了观察者的 `notify` 方法，然后观察者通知了订阅者：本例中是 `logger` 和 `toastify` 函数。

虽然我们可以在很多方面使用观察者模式，但它在处理异步、基于事件的数据时非常有用。也许你想让某些组件在某些数据下载完成时收到通知，或者当用户向留言板发送新消息时，所有其他成员都应收到通知。

::: tip

使用观察者模式是执行关注点分离和单一响应原则的好方法。观察者对象与可观察对象并不紧密耦合，而且可以随时（解除）耦合。可观察对象负责监控事件，而观察者只需处理接收到的数据。

:::

## 传统版本

上述版本中，使用了一个函数式的观察者设计。在这个实现中，观察者被设计为函数 `func`，通过调用 `subscribe` 方法，观察者可以订阅主题；`notify` 方法会遍历所有订阅的函数并调用它们来通知观察者。

在传统的观察者模式中，观察者通常是一个对象，且必须实现一个统一的接口或方法（如 `update()`）。而在上述例子中，观察者就是普通的函数，这样简化了设计，不需要创建专门的观察者类。

- 主题（Subject）：也称为被观察者。主题对象持有对观察者对象的引用，并在自身状态变化时通知所有注册的观察者。
- 观察者（Observer）：观察者对象在被通知时更新自己或执行相关动作。
- 具体主题（Concrete Subject）：实现主题接口，维护观察者列表，并在状态变化时通知所有观察者。
- 具体观察者（Concrete Observer）：实现观察者接口，定义响应主题状态变化的具体操作。

```ts
// 主题（可观察者）类
class Subject {
  private observers: Observer[] = []

  // 添加观察者
  addObserver(observer: Observer) {
    this.observers.push(observer)
  }

  // 移除观察者
  removeObserver(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer)
  }

  // 通知所有观察者
  notifyObservers(data: any) {
    this.observers.forEach((observer) => observer.update(data))
  }
}

// 观察者抽象类
abstract class Observer {
  // 定义一个抽象方法，子类必须实现
  abstract update(data: any): void
}

class ConcreteObserver extends Observer {
  update(data: any): void {
    console.log('Observer received data:', data)
  }
}

// 使用观察者模式
const subject = new Subject()

const observer1 = new ConcreteObserver()
const observer2 = new ConcreteObserver()

subject.addObserver(observer1)
subject.addObserver(observer2)

subject.notifyObservers('Hello Observers!')
// 输出:
// Received data: Hello Observers!
// Received data: Hello Observers!
```

::: tip

在 React 等组件化框架中，使用函数式的简易观察者模式通常更方便、更直观。特别是结合 React 的钩子（如 `useState` 和 `useEffect`），可以非常轻松地实现类似观察者模式的效果，而不必依赖复杂的类继承结构。

:::

## 扩展

在观察者模式的经典定义中：

- 参与者：观察者（Observer）和被观察者（Subject）。
- 结构：在观察者模式中，观察者直接订阅主题（被观察者），主题有状态变化时，主动通知所有的观察者。观察者通过注册到主题中，接收事件通知。
- 特点：
  - 观察者和主题是紧耦合的：主题知道谁订阅了自己，通知时直接调用观察者的方法。
  - 观察者知道主题的存在，彼此之间有依赖。
  - 通常用于单一事件源，比如 UI 事件监听。

但在之前的例子中，都是主动调用了 `notifyObservers`，这看起来更像是直接的事件触发，而不是主题状态的变化引起的自动通知。

观察者模式结构如下：

![模式结构](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240920124553.png)

下面来看一个具体的例子：

- 观察者（`LoggingListener` 和 `EmailAlertsListener`）直接订阅主题（`Editor`）。
- 当 `Editor` 状态发生变化时，它主动通知所有订阅了该事件的观察者。
- 观察者通过 `EventManager` 进行管理，但它们仍然直接与 `Editor` 交互。
- `EventManager` 仅仅是辅助类，用于简化管理订阅和通知的逻辑。
- 观察者可以只关心主题的某个事件类型（`open` 和 `save`）的状态变化。

![将对象中发生的事件通知给其他对象](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240920124501.png)

::: normal-demo demo

```html
<p>打开控制台查看输出</p>
```

```js
// 模拟抽象基类（EventListener 作为观察者的接口）
class EventListener {
  update(data) {
    throw new Error('This method should be overridden!')
  }
}

// EventManager 类充当 Subject，负责管理观察者并通知它们
class EventManager {
  constructor() {
    // 存储事件类型及其对应的观察者列表
    this.listeners = {}
  }

  // 订阅事件
  subscribe(eventType, listener) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = []
    }
    this.listeners[eventType].push(listener)
  }

  // 取消订阅事件
  unsubscribe(eventType, listener) {
    this.listeners[eventType] = this.listeners[eventType].filter(
      (subscribedListener) => subscribedListener !== listener
    )
  }

  // 通知所有订阅的观察者
  notify(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach((listener) => listener.update(data))
    }
  }
}

// Editor 类是提供了业务逻辑实现，并拥有 Subject 被观察者的能力，它通过 EventManager 通知观察者
class Editor {
  constructor() {
    this.events = new EventManager()
    this.file = null
  }

  // 业务逻辑：打开文件时通知观察者
  openFile(path) {
    this.file = { name: path }
    console.log(`File opened: ${this.file.name}`)
    this.events.notify('open', this.file.name)
  }

  // 业务逻辑：保存文件时通知观察者
  saveFile() {
    if (this.file) {
      console.log(`File saved: ${this.file.name}`)
      this.events.notify('save', this.file.name)
    }
  }
}

// 具体观察者：LoggingListener 实现了 update 方法，记录日志
class LoggingListener extends EventListener {
  constructor(logFilePath, message) {
    super()
    this.logFilePath = logFilePath
    this.message = message
  }

  update(filename) {
    console.log(`[LOG] ${this.message.replace('%s', filename)} to ${this.logFilePath}`)
    // 实际情况下，这里应该是写入文件
  }
}

// 具体观察者：EmailAlertsListener 实现了 update 方法，发送邮件
class EmailAlertsListener extends EventListener {
  constructor(email, message) {
    super()
    this.email = email
    this.message = message
  }

  update(filename) {
    console.log(`[EMAIL] Sending to ${this.email}: ${this.message.replace('%s', filename)}`)
    // 实际情况下，这里应该是发送邮件
  }
}

// 应用程序配置发布者和订阅者
const editor = new Editor()

const logger = new LoggingListener('/path/to/log.txt', '有人打开了文件：%s')
editor.events.subscribe('open', logger)

const emailAlerts = new EmailAlertsListener('admin@example.com', '有人保存了文件：%s')
editor.events.subscribe('save', emailAlerts)

// 模拟操作
editor.openFile('test.txt')
editor.saveFile()
```

:::
