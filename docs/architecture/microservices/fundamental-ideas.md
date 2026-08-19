---
title: Fundamental Ideas Around Microservices
date: 2026-01-15
category:
  - microservice
---

## What is Microservices?

- 将不同服务拆分为独立的微服务，每个微服务专注于特定的业务功能。
- 单个服务拥有完整的中间件、路由和数据库支持。
- 每个服务拥有自己的数据库，确保松耦合和独立的数据管理。

## Why database per service?

- 每个服务需要独立于其他服务，避免单点故障
- 数据库结构可能随时变化
- 不同服务可能有不同的数据访问模式和需求（SQL、NoSQL等）

## Data management between services

### Sync communication

服务之间的同步通信通常通过 HTTP/REST 或 gRPC 实现。调用方发出请求后，必须等待被调用服务返回结果，流程才继续。

```
Service A  →  Service B
   |            |
   |----req---->|
   |<---resp----|
   |
继续执行
```

Pros:

- 简单直观：请求-响应模型易于理解和实现。
- 实时性强：适用于查询类请求、强一致性场景、需要即时反馈的场景。

Cons:

- 强耦合：若一个服务不可用，可能导致整个请求失败。
- 延迟放大：整个请求响应时间取决于依赖服务的最慢响应时间。

### Async communication

服务之间通过事件驱动（EventBus）的方式进行异步通信，通常使用消息队列（如 RabbitMQ、Kafka）实现。调用方把事情「交出去」后，不等待结果，立刻返回；后续处理通过消息或事件完成。

```
Service A  →  MQ  →  Service B
   |
   |（立即返回）
   |
继续执行
```

#### 用户下单场景

```
1. Order Service：创建订单（sync）
2. 发消息：OrderCreated（async）
3. Inventory / Coupon / Notification 各自消费

- 只关心：订单创建成功了吗？
- 不关心：库存具体什么时候扣，短信什么时候发
```

#### 查询视图场景

服务职责：

- A：User Service（用户注册，事实源）
- B：Product Service（商品事实源）
- C：Order Service（订单事实源）
- D：UserOrderQuery Service（查询视图）

关键点：

- A / B / C 只负责写自己的事实
- D 不产生事实，只维护查询视图

Async 方案的真实工作流

- 写路径（Command）

  ```
  User 注册 → A 写库 → UserCreated
  下单 → C 写库 → OrderCreated
  ```

- 事件流

  ```
  UserCreated  ─┐
  OrderCreated ─┼> Event Bus → D
  ProductUpdated┘
  ```

- D 服务内部
  - 订阅事件
  - 冗余存储必要字段
  - 更新自己的 read DB

- 读路径（Query）

  ```
  Client → D → 本地 DB → 返回
  ```

#### Pros & Cons

Pros:

- 松耦合：服务之间通过消息传递，降低依赖关系。
- 高可用性：即使某个服务不可用，消息可以在队列中等待处理。
- 弹性伸缩：可以根据消息量动态调整消费者数量。

Cons:

- 复杂性增加：需要处理消息的持久化、重复消费等问题。
- 数据冗余：需要在多个服务中维护冗余数据，增加存储和同步复杂度。
- 最终一致性：数据一致性可能会有延迟，适用于对实时性要求不高的场景。
