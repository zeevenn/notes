---
title: A Mini Microservice Application
date: 2026-01-21
category:
  - microservice
---

## Q&A

**Q1: Wait, so you're saying we nened to create a new service every time we need to join some data?!**

A1: Absolutely not! In reality, might not even have posts and comments in separate services in the first place.

**Q2: Who cares that each service is independent**

A2: Independent services + the reliability that brings is one of the core reasons of using microservices in the first place.

**Q3: This is so over the top complicated for little benefit**

A3: Seems that way now! Adding in some features starts to get really easy when we use this architecture.

**Q4: This system won't correctly in the following scenarios...**

A4: There are some very special things we need to consider with this design. I've got solutions for most (maybe?) of the concerns you may have.

## Event Bus

非常多不同的实现，比如：RabbitMQ、Kafka、NATS、Redis Pub/Sub 等等。

- 接收事件、分发事件
- 许多微妙的特性使得 async communication 变得更容易或更难
