---
title: Promise 经典题
date: 2026-09-07
icon: code
category:
  - JavaScript
tag:
  - Promise
  - 手写代码
  - 异步编程
---

这些题目检查的不是 API 记忆，而是三个核心约束：Promise 状态只能敲定一次，`then()` 必须返回新 Promise，异步依赖必须通过返回值连入同一条链。基础语义见 [Promise](./promise.md)，调度细节见[事件循环](./event-loop.md)。

## 判断输出顺序

```js
console.log('start')

setTimeout(() => console.log('timeout'), 0)

Promise.resolve()
  .then(() => {
    console.log('then 1')
    queueMicrotask(() => console.log('microtask'))
  })
  .then(() => console.log('then 2'))

console.log('end')
```

浏览器中的输出为：

```text
start
end
then 1
microtask
then 2
timeout
```

同步代码先执行。第一个 `then` reaction 先进入微任务队列；它执行时依次追加 `microtask` 和下一环 `then 2`，因此二者按入队顺序执行。计时器回调属于后续 task。

## 实现 `sleep()`

```js
function sleep(ms, { signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(
        signal.reason ?? new DOMException('Aborted', 'AbortError')
      )
      return
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)

    function onAbort() {
      clearTimeout(timer)
      reject(
        signal.reason ?? new DOMException('Aborted', 'AbortError')
      )
    }

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}
```

实现的关键不只是把 `setTimeout()` 包成 Promise，还要在完成后移除监听器，在取消后清除计时器，避免遗留资源。

```js
await sleep(10)
console.log('等待结束')

// 10 毫秒后输出：
// 等待结束
```

## 实现 `promisify()`

下面实现只处理 Node.js 常见的 error-first callback（错误优先回调）形式：回调第一个参数是错误，第二个参数是成功值。

```js
function promisify(fn, thisArg) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn.call(thisArg, ...args, (error, value) => {
        if (error) {
          reject(error)
          return
        }
        resolve(value)
      })
    })
}
```

```js
function addByCallback(a, b, callback) {
  setTimeout(() => callback(null, a + b), 10)
}

const add = promisify(addByCallback)
console.log(await add(2, 3))

// 输出：
// 5
```

真实 API 可能回调多个成功值、依赖动态 `this`、允许多次回调或根本不遵守错误优先约定。生产代码应优先使用平台提供的 Promise 版本或 Node.js 的 `util.promisify()`。

## 手写 `Promise.all()`

需要同时满足四点：接收任意可迭代对象、普通值也能参与、结果保持输入顺序、任一拒绝时快速失败。

```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable)
    const results = new Array(items.length)

    if (items.length === 0) {
      resolve(results)
      return
    }

    let fulfilledCount = 0

    items.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value
          fulfilledCount += 1

          if (fulfilledCount === items.length) {
            resolve(results)
          }
        },
        reject
      )
    })
  })
}
```

```js
const values = await promiseAll([
  Promise.resolve('A'),
  new Promise((resolve) => setTimeout(resolve, 10, 'B')),
  'C'
])

console.log(values)

// 输出：
// ['A', 'B', 'C']
```

`fulfilledCount` 不能替代为 `results.length`，因为结果数组初始化后长度已经确定；也不能用完成顺序 `push()`，否则会破坏输入顺序。

其他组合方法可以沿用同一个思路：

```js
function promiseAllSettled(iterable) {
  return promiseAll(
    Array.from(iterable, (item) =>
      Promise.resolve(item).then(
        (value) => ({ status: 'fulfilled', value }),
        (reason) => ({ status: 'rejected', reason })
      )
    )
  )
}

function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    for (const item of iterable) {
      Promise.resolve(item).then(resolve, reject)
    }
  })
}

function promiseAny(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable)
    const errors = new Array(items.length)

    if (items.length === 0) {
      reject(new AggregateError([], 'All promises were rejected'))
      return
    }

    let rejectedCount = 0

    items.forEach((item, index) => {
      Promise.resolve(item).then(resolve, (error) => {
        errors[index] = error
        rejectedCount += 1

        if (rejectedCount === items.length) {
          reject(new AggregateError(errors, 'All promises were rejected'))
        }
      })
    })
  })
}
```

```js
const settled = await promiseAllSettled([
  Promise.resolve('A'),
  Promise.reject(new Error('B 失败'))
])

console.log(settled[0])
console.log(settled[1].status, settled[1].reason.message)
console.log(await promiseRace([Promise.resolve('最先结束')]))
console.log(await promiseAny([Promise.reject('失败'), Promise.resolve('成功')]))

// 输出：
// { status: 'fulfilled', value: 'A' }
// rejected B 失败
// 最先结束
// 成功
```

这些是面试题级实现，没有完整保留 Promise 子类构造器等原生 API 细节。

## 手写并发控制器

问题：给定一组返回 Promise 的任务函数，最多同时运行 `limit` 个；返回结果保持输入顺序，任一任务失败时让总 Promise 拒绝。

输入必须是函数数组而不是已经创建的 Promise 数组。Promise 代表的操作通常在创建时就已启动，调度器只有延迟调用任务函数，才能控制开始时机。

```js
async function runWithConcurrency(taskFactories, limit) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('limit must be a positive integer')
  }

  const tasks = Array.from(taskFactories)
  const results = new Array(tasks.length)
  let nextIndex = 0

  async function worker() {
    while (true) {
      const index = nextIndex
      nextIndex += 1

      if (index >= tasks.length) return

      const task = tasks[index]
      if (typeof task !== 'function') {
        throw new TypeError(`task at index ${index} is not a function`)
      }

      results[index] = await task()
    }
  }

  const workerCount = Math.min(limit, tasks.length)
  await Promise.all(Array.from({ length: workerCount }, () => worker()))
  return results
}
```

验证并发上限和结果顺序：

```js
let active = 0
let maxActive = 0

const createTask = (id, ms) => async () => {
  active += 1
  maxActive = Math.max(maxActive, active)
  await new Promise((resolve) => setTimeout(resolve, ms))
  active -= 1
  return id
}

const results = await runWithConcurrency(
  [createTask('A', 30), createTask('B', 10), createTask('C', 20)],
  2
)

console.log(results) // ['A', 'B', 'C']
console.log(maxActive) // 2
```

这个版本采用快速失败语义：一个 worker 失败后，总 Promise 会拒绝，但其他已经启动的任务仍会继续运行，其他 worker 也可能领取后续任务。若要求失败后停止派发，需要加入共享停止标记；若还要求终止已启动任务，则任务本身必须支持 `AbortSignal`。

### 并发执行，按入队顺序消费

上一题虽然让结果数组保持输入顺序，但要等所有 worker 结束后才把整个数组返回。另一类需求是：worker 可以并发执行，每个结果准备好后尽早消费，但消费顺序必须与入队顺序一致。

下面是只处理成功路径的最小动态队列。错误 fallback、并发上限、容量背压与可关闭队列的逐步实现见[异步任务并发与有序消费](./ordered-concurrent-processing.md)。

```ts
interface Task {
  id: number
  duration: number
}

class OrderedAsyncQueue<Input, Output> {
  private tail: Promise<void> = Promise.resolve()
  private nextIndex = 0

  constructor(
    private readonly worker: (input: Input) => Promise<Output>,
    private readonly consume: (
      output: Output,
      index: number
    ) => Promise<void>
  ) {}

  enqueue(input: Input): void {
    const index = this.nextIndex++

    // worker 在 enqueue 时立即启动，不等待前一个任务。
    const resultPromise = this.worker(input)
    const previousTail = this.tail

    // consume 等待前一个 consume 完成，再读取自己的结果。
    this.tail = (async () => {
      await previousTail
      const result = await resultPromise
      await this.consume(result, index)
    })()
  }

  drain(): Promise<void> {
    return this.tail
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const consumed: number[] = []

  const queue = new OrderedAsyncQueue<Task, number>(
    async (task) => {
      console.log(`任务${task.id}开始`)
      await sleep(task.duration)
      console.log(`任务${task.id}完成`)
      return task.id
    },
    async (result) => {
      consumed.push(result)
      console.log(`消费任务${result}`)
    }
  )

  queue.enqueue({ id: 1, duration: 500 })
  queue.enqueue({ id: 2, duration: 1500 })
  queue.enqueue({ id: 3, duration: 700 })

  await queue.drain()
  console.log(consumed)
}

void main()

// 输出：
// 任务1开始
// 任务2开始
// 任务3开始
// 任务1完成
// 消费任务1
// 任务3完成
// 任务2完成
// 消费任务2
// 消费任务3
// [1, 2, 3]
```

任务 3 比任务 2 更早完成，但不能越过任务 2 消费。`tail` 始终表示“当前最后一次消费完成”的 Promise，每次入队都把新的消费步骤接到旧 `tail` 后面；`resultPromise` 则独立运行，所以任务执行没有被串行化。

这个实现控制的是**消费顺序**，没有限制 worker 并发数。连续入队 1000 个任务会立即启动 1000 次 `worker()`。如果还需要并发上限，应先通过上一节的调度器限制 worker 的启动，再把完成结果交给按序消费链。

还要明确三个失败边界：

- 某个 worker 或 `consume()` 失败后，`tail` 会 rejected，后续消费都会因为等待这个 `tail` 而跳过；这是“失败后停止消费”语义。
- 后面的 `resultPromise` 可能在轮到它之前就 rejected。若需要长期运行的队列，应在创建结果 Promise 时立即把成功和失败转换成结果对象，避免延迟挂载拒绝处理函数。
- `drain()` 返回调用当时的 `tail`。在调用 `drain()` 之后新入队的任务，不包含在已经取得的那个 Promise 中。

因此，这道题应先问清楚四件事：是否限制 worker 并发数、失败后是否继续消费、是否需要取消已启动任务，以及 `drain()` 是否只等待调用时已有的任务。

### 收集每个任务的结果

如果单项失败不应终止整个批次，可以让 worker 捕获错误并返回与 `Promise.allSettled()` 相同形状的结果：

```js
async function runAllSettledWithConcurrency(taskFactories, limit) {
  const wrapped = Array.from(taskFactories, (task) => async () => {
    try {
      return { status: 'fulfilled', value: await task() }
    } catch (reason) {
      return { status: 'rejected', reason }
    }
  })

  return runWithConcurrency(wrapped, limit)
}
```

```js
const results = await runAllSettledWithConcurrency(
  [
    () => Promise.resolve('A'),
    () => Promise.reject(new Error('B 失败'))
  ],
  1
)

console.log(results[0])
console.log(results[1].status, results[1].reason.message)

// 输出：
// { status: 'fulfilled', value: 'A' }
// rejected B 失败
```

## 实现重试

重试同样要求接收任务函数。传入一个已经 rejected 的 Promise 只会反复观察同一个结果，并不会重新执行操作。

```js
async function retry(task, options = {}) {
  const {
    retries = 3,
    delay = 0,
    shouldRetry = () => true
  } = options

  let lastError

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task(attempt)
    } catch (error) {
      lastError = error

      if (attempt === retries || !shouldRetry(error, attempt)) {
        throw error
      }

      const waitMs = typeof delay === 'function' ? delay(attempt) : delay
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    }
  }

  throw lastError
}
```

```js
let runCount = 0

const value = await retry(
  () => {
    runCount += 1
    console.log(`第 ${runCount} 次执行`)

    if (runCount < 3) {
      return Promise.reject(new Error('暂时失败'))
    }
    return Promise.resolve('成功')
  },
  { retries: 2, delay: 10 }
)

console.log(value)

// 输出：
// 第 1 次执行
// 第 2 次执行
// 第 3 次执行
// 成功
```

指数退避可以通过 `delay: (attempt) => 100 * 2 ** attempt` 表示。实际网络请求还应区分可重试错误与永久错误，并考虑随机抖动、服务端 `Retry-After`、幂等性和取消信号。

## 实现可取消的超时

单纯返回 `Promise.race()` 不能停止原任务。下面让任务工厂接收 `AbortSignal`，超时时中止底层操作，并清理计时器：

```js
async function withTimeout(task, ms) {
  const controller = new AbortController()
  let timer

  try {
    return await Promise.race([
      task(controller.signal),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          const error = new Error(`Timed out after ${ms}ms`)
          error.name = 'TimeoutError'
          controller.abort(error)
          reject(error)
        }, ms)
      })
    ])
  } finally {
    clearTimeout(timer)
  }
}

const response = await withTimeout(
  (signal) => fetch('/api/report', { signal }),
  3000
)
```

假设 `/api/report` 在 3 秒内返回，`response` 就是它的响应；超时则可以得到：

```js
try {
  await withTimeout(
    () => new Promise((resolve) => setTimeout(resolve, 1000)),
    10
  )
} catch (error) {
  console.log(error.name)
  console.log(error.message)
}

// 输出：
// TimeoutError
// Timed out after 10ms
```

任务如果忽略 `signal`，调用方仍只能停止等待，无法强制取消底层工作。

## 手写 Promise

下面的 `MyPromise` 实现用于理解状态机、处理函数队列、thenable 解析和链式调用。它覆盖 `then()`、`catch()`、`finally()` 以及常见静态方法，但不替代原生 Promise，也不实现子类、species、宿主拒绝跟踪等全部 ECMAScript 细节。

### Promise 解析过程

`resolvePromise(promise, value)` 决定 `promise` 如何接纳 `value`：

1. 如果二者是同一个对象，以 `TypeError` 拒绝，防止循环。
2. 如果 `value` 是对象或函数，读取一次它的 `then`。
3. 如果 `then` 是函数，以 `value` 为 `this` 调用它，并递归解析成功值。
4. thenable 可能同时回调、重复回调或在回调后抛错，因此用 `called` 保证只有第一次有效。
5. 其他值直接兑现。

```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const enqueueMicrotask =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : (callback) => Promise.resolve().then(callback)

function resolvePromise(promise, value) {
  if (promise === value) {
    promise._reject(new TypeError('Chaining cycle detected'))
    return
  }

  if (value === null ||
      (typeof value !== 'object' && typeof value !== 'function')) {
    promise._fulfill(value)
    return
  }

  let then
  try {
    then = value.then
  } catch (error) {
    promise._reject(error)
    return
  }

  if (typeof then !== 'function') {
    promise._fulfill(value)
    return
  }

  let called = false

  try {
    then.call(
      value,
      (nextValue) => {
        if (called) return
        called = true
        resolvePromise(promise, nextValue)
      },
      (reason) => {
        if (called) return
        called = true
        promise._reject(reason)
      }
    )
  } catch (error) {
    if (!called) {
      called = true
      promise._reject(error)
    }
  }
}
```

### 状态机与链

```js
class MyPromise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function')
    }

    this._state = PENDING
    this._value = undefined
    this._handlers = []
    this._locked = false

    const resolve = (value) => {
      if (this._state !== PENDING || this._locked) return
      this._locked = true

      if (value === this) {
        this._reject(new TypeError('Cannot resolve promise with itself'))
        return
      }

      resolvePromise(this, value)
    }

    const reject = (reason) => {
      if (this._state !== PENDING || this._locked) return
      this._locked = true
      this._reject(reason)
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  _fulfill(value) {
    if (this._state !== PENDING) return
    this._state = FULFILLED
    this._value = value
    this._flush()
  }

  _reject(reason) {
    if (this._state !== PENDING) return
    this._state = REJECTED
    this._value = reason
    this._flush()
  }

  _flush() {
    if (this._state !== FULFILLED && this._state !== REJECTED) return

    enqueueMicrotask(() => {
      const handlers = this._handlers
      this._handlers = []
      handlers.forEach((handler) => this._run(handler))
    })
  }

  _run({ onFulfilled, onRejected, nextPromise }) {
    const callback =
      this._state === FULFILLED ? onFulfilled : onRejected

    if (typeof callback !== 'function') {
      if (this._state === FULFILLED) {
        nextPromise._fulfill(this._value)
      } else {
        nextPromise._reject(this._value)
      }
      return
    }

    try {
      resolvePromise(nextPromise, callback(this._value))
    } catch (error) {
      nextPromise._reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    let nextPromise

    nextPromise = new MyPromise(() => {})
    this._handlers.push({ onFulfilled, onRejected, nextPromise })

    if (this._state === FULFILLED || this._state === REJECTED) {
      this._flush()
    }

    return nextPromise
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    const callback =
      typeof onFinally === 'function' ? onFinally : () => undefined

    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason
        })
    )
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value
    return new MyPromise((resolve) => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason))
  }

  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      const items = Array.from(iterable)
      const results = new Array(items.length)

      if (items.length === 0) {
        resolve(results)
        return
      }

      let fulfilledCount = 0

      items.forEach((item, index) => {
        MyPromise.resolve(item).then((value) => {
          results[index] = value
          fulfilledCount += 1
          if (fulfilledCount === items.length) resolve(results)
        }, reject)
      })
    })
  }

  static allSettled(iterable) {
    return MyPromise.all(
      Array.from(iterable, (item) =>
        MyPromise.resolve(item).then(
          (value) => ({ status: FULFILLED, value }),
          (reason) => ({ status: REJECTED, reason })
        )
      )
    )
  }

  static race(iterable) {
    return new MyPromise((resolve, reject) => {
      for (const item of iterable) {
        MyPromise.resolve(item).then(resolve, reject)
      }
    })
  }

  static any(iterable) {
    return new MyPromise((resolve, reject) => {
      const items = Array.from(iterable)
      const errors = new Array(items.length)

      if (items.length === 0) {
        reject(new AggregateError([], 'All promises were rejected'))
        return
      }

      let rejectedCount = 0

      items.forEach((item, index) => {
        MyPromise.resolve(item).then(resolve, (error) => {
          errors[index] = error
          rejectedCount += 1
          if (rejectedCount === items.length) {
            reject(new AggregateError(errors, 'All promises were rejected'))
          }
        })
      })
    })
  }
}
```

### 验证关键行为

```js
const delayed = new MyPromise((resolve) => {
  setTimeout(() => resolve(2), 10)
})

delayed
  .then((value) => value * 3)
  .then((value) => MyPromise.resolve(value + 1))
  .then(console.log) // 7

MyPromise.all([
  MyPromise.resolve('A'),
  new MyPromise((resolve) => setTimeout(resolve, 5, 'B')),
  'C'
]).then(console.log) // ['A', 'B', 'C']

const source = MyPromise.resolve()
let cycle
cycle = source.then(() => cycle)
cycle.catch((error) => console.log(error instanceof TypeError)) // true
```

该实现用 `queueMicrotask()` 模拟宿主对 Promise reaction job 的调度，但原生 Promise 的 job、realm（领域）、子类构造、拒绝跟踪和调试集成由引擎完成。教学实现不应进入生产环境。

## 检查清单

实现或评审 Promise 题时，逐项确认：

- executor 是否同步执行，处理函数是否异步执行；
- 状态是否只能从 pending 确定一次；
- `then()` 是否每次返回新的 Promise；
- 普通返回值、异常、Promise 和 thenable 是否分别处理；
- 是否防止链式循环和 thenable 重复回调；
- 错误是否沿没有拒绝处理函数的链继续传播；
- 组合结果是否保持输入顺序，并处理空输入；
- 并发控制的输入是否为延迟执行的任务函数；
- 超时或快速失败后，底层任务是否仍在运行；
- 事件监听器、计时器和网络请求是否得到清理。

## 参考

- [ECMA-262: Promise Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-objects)
- [Promises/A+](https://promisesaplus.com/)
- [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
