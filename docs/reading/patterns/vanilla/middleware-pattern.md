---
title: 中间件模式
date: 2024-09-18
icon: middleware
author: patterns
category:
  - reading
tag:
  - design pattern
  - vanilla
  - middleware-pattern
---

## 中间件模式

中间件模式是一种行为设计模式， 允许你将请求沿着处理者链进行发送。收到请求后，每个处理者均可对请求进行处理，或将其传递给链上的下个处理者。

::: info

Express 就使用了中间件模式处理请求。中间件模式是 Express 核心架构的一部分，它允许你在处理请求的过程中，通过一系列中间件函数来对请求和响应对象进行操作。中间件在请求-响应生命周期中充当「处理链」中的一个节点，既可以终止请求（发送响应），也可以将请求传递给下一个中间件。

:::

```js
function middleware(req, res, next) {
  // 执行某些逻辑
  next(); // 调用 next() 将请求传递给下一个中间件
}
```

![20240918173949](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240918173949.png)

## Express 中间件

Express 通过 `app.use()` 来定义中间件，并作用于整个应用程序的请求处理过程。例如：

```js
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('Request received at:', new Date().toISOString());
  next();  // 继续到下一个中间件
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```

## 简单的中间件实现

```js
export default class MiddlewareManager {
  private readonly middlewares: Middleware[];

  constructor() {
    this.middlewares = [];
  }

  use(func: Middleware) {
    this.middlewares.push(func);
  }

  run(req: CustomIncomingMessage, res: ServerResponse) {
    const runner = async (index: number) => {
      const middleware = this.middlewares[index];
      if (middleware) {
        await middleware(req, res, () => {
          return runner(index + 1);
        });
      }
    };

    runner(0);
  }
}
```