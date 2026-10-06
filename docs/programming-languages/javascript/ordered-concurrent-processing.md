---
title: 异步任务并发与有序消费
date: 2026-09-09
icon: code
category:
  - JavaScript
tag:
  - Promise
  - 并发控制
  - 异步队列
---

有些处理流程允许任务并发执行，但要求结果严格按照提交顺序消费。例如：并发下载多个分片，按编号写入文件；并发解析消息，按原始 Offset 提交状态；并发生成页面数据，按页面顺序写入输出流。

这里需要区分三种顺序：

- **提交顺序**：任务进入处理器的顺序。
- **完成顺序**：异步 worker 实际结束的顺序，可以不同。
- **消费顺序**：调用 `consume()` 的顺序，必须与提交顺序相同。

下面从固定任务数组开始，逐步增加错误隔离、并发上限和动态队列能力。

## 固定批次的最小实现

任务数量已经确定时，可以先启动所有任务，再按 Promise 数组的顺序逐个等待：

```ts
type AsyncTask<Output> = () => Promise<Output>

async function run<Output>(
  tasks: readonly AsyncTask<Output>[],
  consume: (output: Output, index: number) => Promise<void>
): Promise<void> {
  // map() 按数组顺序保存 Promise，但所有 task 都会立即启动。
  const promises = tasks.map((task) => task())

  // await 按数组顺序读取结果，因此消费顺序不会变化。
  for (let index = 0; index < promises.length; index += 1) {
    const result = await promises[index]
    await consume(result, index)
  }
}
```

验证任务可以乱序完成，但仍按提交顺序消费：

```ts
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createTask(id: number, duration: number): AsyncTask<number> {
  return async () => {
    console.log(`任务${id}开始`)
    await sleep(duration)
    console.log(`任务${id}完成`)
    return id
  }
}

const consumed: number[] = []

await run(
  [createTask(1, 100), createTask(2, 300), createTask(3, 150)],
  async (result) => {
    consumed.push(result)
    console.log(`消费任务${result}`)
  }
)

console.log(consumed)

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

这里要强调 `task()` 中的调用操作：调用任务函数才会启动异步操作。Promise 数组保存的是提交顺序，不是完成顺序。

这个版本短小，而且对于少量、固定、保证成功的任务完全可用。不过它隐含了几个条件：

- 所有任务会同时启动，没有并发上限。
- 一个任务 rejected 后，循环立即退出，后续结果不再消费。
- 后面的任务可能先 rejected，但程序尚未执行到对应的 `await`，宿主可能先报告未处理拒绝。
- `consume()` 失败同样会终止整个批次。
- 任务必须预先放在固定数组中，不支持持续入队。

## 为每个任务立即接住错误

不能因为一个任务失败而中断整个批次时，关键不是简单在 `for` 循环外包一层 `try...catch`。外层捕获虽然能拿到错误，但循环仍然已经退出。

更稳的办法是让每个任务一启动就转换为永远 fulfilled 的结果对象：

```ts
type TaskOutcome<Output> =
  | { status: 'fulfilled'; value: Output }
  | { status: 'rejected'; reason: unknown }

function startSafely<Output>(
  task: () => Promise<Output>
): Promise<TaskOutcome<Output>> {
  return Promise.resolve()
    .then(task)
    .then(
      (value) => ({ status: 'fulfilled', value }),
      (reason) => ({ status: 'rejected', reason })
    )
}
```

`Promise.resolve().then(task)` 还能把任务函数同步抛出的异常转换成 rejected Promise。紧接着的第二个 `then()` 同时注册成功和失败处理，因此不会等到轮到该任务消费时才处理拒绝。

## 加入 fallback，并隔离消费错误

失败任务可以跳过，也可以生成一个替代结果继续参与消费。用唯一的 `SKIP` 符号表示跳过，避免把 `undefined` 同时当作正常结果和控制信号。

```ts
const SKIP = Symbol('skip')

type AsyncTask<Output> = () => Promise<Output>

type TaskOutcome<Output> =
  | { status: 'fulfilled'; value: Output }
  | { status: 'rejected'; reason: unknown }

type ItemReport =
  | { status: 'consumed'; index: number; recovered: boolean }
  | { status: 'skipped'; index: number; reason: unknown }
  | { status: 'fallback-failed'; index: number; reason: unknown }
  | { status: 'consume-failed'; index: number; reason: unknown }

function startSafely<Output>(
  task: AsyncTask<Output>
): Promise<TaskOutcome<Output>> {
  return Promise.resolve()
    .then(task)
    .then(
      (value) => ({ status: 'fulfilled', value }),
      (reason) => ({ status: 'rejected', reason })
    )
}

async function runWithFallback<Output>(
  tasks: readonly AsyncTask<Output>[],
  consume: (output: Output, index: number) => Promise<void>,
  fallback: (
    reason: unknown,
    index: number
  ) => Output | typeof SKIP | Promise<Output | typeof SKIP>
): Promise<ItemReport[]> {
  // 所有任务立即启动，并立即挂载拒绝处理函数。
  const outcomes = tasks.map(startSafely)
  const reports: ItemReport[] = []

  for (let index = 0; index < outcomes.length; index += 1) {
    const outcome = await outcomes[index]
    let output: Output
    let recovered = false

    if (outcome.status === 'fulfilled') {
      output = outcome.value
    } else {
      try {
        const replacement = await fallback(outcome.reason, index)

        if (replacement === SKIP) {
          reports.push({
            status: 'skipped',
            index,
            reason: outcome.reason
          })
          continue
        }

        output = replacement
        recovered = true
      } catch (reason) {
        reports.push({ status: 'fallback-failed', index, reason })
        continue
      }
    }

    try {
      await consume(output, index)
      reports.push({ status: 'consumed', index, recovered })
    } catch (reason) {
      reports.push({ status: 'consume-failed', index, reason })
    }
  }

  return reports
}
```

单个 worker、fallback 或消费函数失败，都只会形成对应任务的报告，不会使后续任务停止消费：

```ts
const consumed: number[] = []

const reports = await runWithFallback(
  [
    () => Promise.resolve(1),
    () => Promise.reject(new Error('任务2失败')),
    () => Promise.resolve(3)
  ],
  async (output) => {
    consumed.push(output)
    console.log(`消费${output}`)
  },
  async (reason, index) => {
    console.log(`任务${index + 1}使用 fallback`)
    return 0
  }
)

console.log(consumed)
console.log(reports.map((report) => report.status))

// 输出：
// 消费1
// 任务2使用 fallback
// 消费0
// 消费3
// [1, 0, 3]
// ['consumed', 'consumed', 'consumed']
```

这里的 fallback 是业务策略，不是固定答案：

- 图片加载失败可以返回占位图。
- 非关键统计数据失败可以返回 `SKIP`。
- 订单写入失败通常不应伪造成功值，而应记录失败并进入重试或死信流程。

## 限制 worker 并发数

任务数量变大后，立即启动全部任务可能耗尽连接池、文件描述符、内存或远端配额。下一版使用固定数量的 worker loop，每个 loop 完成一个任务后再领取下一个。

消费仍需按索引等待，因此先为每个索引创建一个结果槽位：

```ts
interface Deferred<Value> {
  promise: Promise<Value>
  resolve: (value: Value) => void
}

function createDeferred<Value>(): Deferred<Value> {
  let resolve!: (value: Value) => void
  const promise = new Promise<Value>((done) => {
    resolve = done
  })

  return { promise, resolve }
}

async function runBoundedOrdered<Output>(
  tasks: readonly (() => Promise<Output>)[],
  concurrency: number,
  consume: (output: Output, index: number) => Promise<void>,
  fallback: (
    reason: unknown,
    index: number
  ) => Output | typeof SKIP | Promise<Output | typeof SKIP>
): Promise<ItemReport[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new RangeError('concurrency must be a positive integer')
  }

  const slots = tasks.map(() => createDeferred<TaskOutcome<Output>>())
  const reports: ItemReport[] = []
  let nextTaskIndex = 0

  async function workerLoop(): Promise<void> {
    while (true) {
      const index = nextTaskIndex
      nextTaskIndex += 1

      if (index >= tasks.length) return

      const outcome = await startSafely(tasks[index])
      slots[index].resolve(outcome)
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => workerLoop()
  )

  for (let index = 0; index < slots.length; index += 1) {
    const outcome = await slots[index].promise
    let output: Output
    let recovered = false

    if (outcome.status === 'fulfilled') {
      output = outcome.value
    } else {
      try {
        const replacement = await fallback(outcome.reason, index)
        if (replacement === SKIP) {
          reports.push({ status: 'skipped', index, reason: outcome.reason })
          continue
        }
        output = replacement
        recovered = true
      } catch (reason) {
        reports.push({ status: 'fallback-failed', index, reason })
        continue
      }
    }

    try {
      await consume(output, index)
      reports.push({ status: 'consumed', index, recovered })
    } catch (reason) {
      reports.push({ status: 'consume-failed', index, reason })
    }
  }

  await Promise.all(workers)
  return reports
}
```

验证并发上限和消费顺序：

```ts
let active = 0
let maxActive = 0
const consumed: number[] = []

const createTask = (id: number, ms: number) => async () => {
  active += 1
  maxActive = Math.max(maxActive, active)
  await new Promise((resolve) => setTimeout(resolve, ms))
  active -= 1
  return id
}

await runBoundedOrdered(
  [createTask(1, 100), createTask(2, 300), createTask(3, 50)],
  2,
  async (result) => {
    consumed.push(result)
  },
  () => SKIP
)

console.log(maxActive)
console.log(consumed)

// 输出：
// 2
// [1, 2, 3]
```

这个版本适合有限批次，但 `slots` 数量与任务数相同。如果第一个任务很慢，后续任务可能已经全部完成并保存在槽位中，形成 head-of-line blocking（队首阻塞）。固定批次通常可以接受；持续输入的队列还需要容量限制，对生产者施加背压。

## 动态队列：并发上限、容量背压和错误隔离

工程中的任务可能持续到达。下面的队列增加这些约束：

- `maxConcurrency` 限制正在执行的 worker 数量。
- `maxPending` 限制已经接收但尚未消费的任务数量。
- `enqueue()` 在容量已满时等待，形成背压。
- worker、fallback 或 `consume()` 的单项错误会写入报告，不会毒化后续消费链。
- `close()` 停止接收新任务，并等待此前提交的任务全部消费。

### 信号量

信号量用于限制同时占用某种资源的任务数。`acquire()` 返回释放函数，调用方必须在 `finally` 中释放：

```ts
class Semaphore {
  private active = 0
  private readonly waiters: Array<() => void> = []

  constructor(private readonly limit: number) {
    if (!Number.isInteger(limit) || limit < 1) {
      throw new RangeError('limit must be a positive integer')
    }
  }

  async acquire(): Promise<() => void> {
    if (this.active < this.limit) {
      this.active += 1
    } else {
      await new Promise<void>((resolve) => this.waiters.push(resolve))
    }

    let released = false

    return () => {
      if (released) return
      released = true

      const next = this.waiters.shift()
      if (next) {
        // 直接把当前名额交给队首等待者，active 数量不变。
        next()
      } else {
        this.active -= 1
      }
    }
  }
}
```

### 完整队列

`enqueue()` 返回的是“任务已被队列接收”的 Promise 和该任务最终的 `done` Promise。它不会等待任务完成，因此生产者在队列未满时仍可快速提交；队列满后，`await enqueue()` 会等待容量释放。

```ts
const SKIP = Symbol('skip')

type Awaitable<Value> = Value | PromiseLike<Value>

type TaskOutcome<Output> =
  | { status: 'fulfilled'; value: Output }
  | { status: 'rejected'; reason: unknown }

type ItemReport =
  | { status: 'consumed'; index: number; recovered: boolean }
  | { status: 'skipped'; index: number; reason: unknown }
  | { status: 'fallback-failed'; index: number; reason: unknown }
  | { status: 'consume-failed'; index: number; reason: unknown }
  | { status: 'internal-failed'; index: number; reason: unknown }

interface OrderedQueueOptions<Input, Output> {
  maxConcurrency: number
  maxPending: number
  worker: (input: Input, index: number) => Promise<Output>
  consume: (output: Output, index: number) => Promise<void>
  fallback?: (
    reason: unknown,
    input: Input,
    index: number
  ) => Awaitable<Output | typeof SKIP>
}

interface EnqueuedItem {
  index: number
  done: Promise<ItemReport>
}

class OrderedTaskQueue<Input, Output> {
  private readonly workerSlots: Semaphore
  private readonly capacitySlots: Semaphore
  private readonly reports: ItemReport[] = []

  // tail 永远 fulfilled，单项错误只存在于 ItemReport 中。
  private tail: Promise<void> = Promise.resolve()
  private nextIndex = 0
  private accepting = true
  private pendingAdmissions = 0
  private readonly admissionWaiters: Array<() => void> = []
  private closePromise?: Promise<readonly ItemReport[]>

  constructor(private readonly options: OrderedQueueOptions<Input, Output>) {
    const { maxConcurrency, maxPending } = options

    if (!Number.isInteger(maxConcurrency) || maxConcurrency < 1) {
      throw new RangeError('maxConcurrency must be a positive integer')
    }
    if (!Number.isInteger(maxPending) || maxPending < maxConcurrency) {
      throw new RangeError(
        'maxPending must be an integer greater than or equal to maxConcurrency'
      )
    }

    this.workerSlots = new Semaphore(maxConcurrency)
    this.capacitySlots = new Semaphore(maxPending)
  }

  enqueue(input: Input): Promise<EnqueuedItem> {
    if (!this.accepting) {
      return Promise.reject(new Error('queue is closed'))
    }

    // 在第一次 await 之前同步计数，close() 不会漏掉本次提交。
    this.pendingAdmissions += 1

    return this.admit(input).finally(() => {
      this.pendingAdmissions -= 1

      if (this.pendingAdmissions === 0) {
        const waiters = this.admissionWaiters.splice(0)
        waiters.forEach((resolve) => resolve())
      }
    })
  }

  private async admit(input: Input): Promise<EnqueuedItem> {
    // 容量从接收任务开始占用，直到该任务消费结束才释放。
    const releaseCapacity = await this.capacitySlots.acquire()
    const index = this.nextIndex++

    // 立即注册成功和失败处理，outcomePromise 本身不会 rejected。
    const outcomePromise = this.runWorker(input, index).then<
      TaskOutcome<Output>,
      TaskOutcome<Output>
    >(
      (value) => ({ status: 'fulfilled', value }),
      (reason) => ({ status: 'rejected', reason })
    )

    const previousTail = this.tail

    const done = this.processInOrder(
      previousTail,
      outcomePromise,
      input,
      index
    ).catch<ItemReport>((reason) => ({
      status: 'internal-failed',
      index,
      reason
    }))

    const trackedDone = done.then((report) => {
      this.reports[index] = report
      releaseCapacity()
      return report
    })

    // trackedDone 已把单项错误转换成报告，因此不会毒化 tail。
    this.tail = trackedDone.then(() => undefined)

    return { index, done: trackedDone }
  }

  private async runWorker(input: Input, index: number): Promise<Output> {
    const releaseWorker = await this.workerSlots.acquire()

    try {
      return await this.options.worker(input, index)
    } finally {
      releaseWorker()
    }
  }

  private async processInOrder(
    previousTail: Promise<void>,
    outcomePromise: Promise<TaskOutcome<Output>>,
    input: Input,
    index: number
  ): Promise<ItemReport> {
    await previousTail

    const outcome = await outcomePromise
    let output: Output
    let recovered = false

    if (outcome.status === 'fulfilled') {
      output = outcome.value
    } else {
      if (!this.options.fallback) {
        return { status: 'skipped', index, reason: outcome.reason }
      }

      try {
        const replacement = await this.options.fallback(
          outcome.reason,
          input,
          index
        )

        if (replacement === SKIP) {
          return { status: 'skipped', index, reason: outcome.reason }
        }

        output = replacement
        recovered = true
      } catch (reason) {
        return { status: 'fallback-failed', index, reason }
      }
    }

    try {
      await this.options.consume(output, index)
      return { status: 'consumed', index, recovered }
    } catch (reason) {
      return { status: 'consume-failed', index, reason }
    }
  }

  close(): Promise<readonly ItemReport[]> {
    if (this.closePromise) return this.closePromise

    this.accepting = false
    this.closePromise = (async () => {
      // 等待已经调用、但仍在等待容量的 enqueue() 完成接收。
      if (this.pendingAdmissions > 0) {
        await new Promise<void>((resolve) => {
          this.admissionWaiters.push(resolve)
        })
      }

      // 此时 tail 已包含 close() 之前提交的所有消费步骤。
      await this.tail
      return this.reports.slice()
    })()

    return this.closePromise
  }
}
```

### 使用与结果

下面最多同时执行两个 worker，最多保留三个尚未消费的任务。任务 2 失败后使用 `0` 作为 fallback，任务 3 即使更早完成也必须等任务 2 的 fallback 消费结束。

```ts
interface Task {
  id: number
  duration: number
  fail?: boolean
}

const consumed: number[] = []
let active = 0
let maxActive = 0

const queue = new OrderedTaskQueue<Task, number>({
  maxConcurrency: 2,
  maxPending: 3,
  worker: async (task) => {
    active += 1
    maxActive = Math.max(maxActive, active)
    console.log(`任务${task.id}开始`)

    try {
      await new Promise((resolve) => setTimeout(resolve, task.duration))
      if (task.fail) throw new Error(`任务${task.id}失败`)
      console.log(`任务${task.id}完成`)
      return task.id
    } finally {
      active -= 1
    }
  },
  fallback: async (reason, task) => {
    console.log(`${(reason as Error).message}，使用 fallback`)
    return 0
  },
  consume: async (output) => {
    consumed.push(output)
    console.log(`消费${output}`)
  }
})

const inputs: Task[] = [
  { id: 1, duration: 100 },
  { id: 2, duration: 300, fail: true },
  { id: 3, duration: 50 },
  { id: 4, duration: 50 }
]

// 顺序 await 的只是“被队列接收”，不是等待任务完成。
for (const input of inputs) {
  await queue.enqueue(input)
}

const reports = await queue.close()

console.log(maxActive)
console.log(consumed)
console.log(reports.map((report) => report.status))

// 输出中的任务完成顺序可能随计时略有变化；以下结果稳定：
// maxActive: 2
// consumed: [1, 0, 3, 4]
// reports: ['consumed', 'consumed', 'consumed', 'consumed']
```

## 版本对比

| 版本 | worker 并发 | 错误隔离 | 按序消费 | 动态入队 | 背压 |
| --- | --- | --- | --- | --- | --- |
| 固定批次最小版 | 无上限 | 否 | 是 | 否 | 否 |
| fallback 版 | 无上限 | 是 | 是 | 否 | 否 |
| 固定批次限流版 | 有上限 | 是 | 是 | 否 | 否 |
| 动态队列版 | 有上限 | 是 | 是 | 是 | 是 |

“最完善”取决于业务约束。上面的动态队列解决了内存、顺序和单项失败传播问题，但生产系统通常还要明确：

- worker 是否需要超时、重试、指数退避和幂等键；
- 进程退出时是等待、取消还是持久化尚未完成的任务；
- `consume()` 失败后是重试、跳过还是暂停队列；
- 是否用 `AbortSignal` 取消正在运行和等待中的任务；
- 是否需要持久化任务，保证进程崩溃后恢复；
- 是否记录等待时间、执行时间、消费时间、队列深度和失败率；
- 是否允许一个长期任务造成队首阻塞，还是可以按分区分别保证顺序。

一旦需要跨进程持久化、崩溃恢复、多消费者协调或至少一次投递，内存中的 Promise 队列就不再足够，应使用消息队列、任务系统或数据库队列表。

## 相关笔记

- [Promise](./promise.md)
- [Promise 经典题](./promise-classic-problems.md)
- [事件循环](./event-loop.md)
