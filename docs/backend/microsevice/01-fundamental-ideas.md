---
title: Fundamental Ideas Around Microservices
date: 2026-01-15
category:
  - microservice
---

## What is Microservices?

将不同服务拆分为独立的微服务，每个微服务专注于特定的业务功能。

单个服务拥有完整的中间件、路由和数据库支持。

每个服务拥有自己的数据库，确保松耦合和独立的数据管理。

## Why database per service?

- 每个服务需要独立于其他服务，避免单点故障
- 数据库结构可能随时变化
- 不同服务可能有不同的数据访问模式和需求（SQL、NoSQL等）

## Data management between services
