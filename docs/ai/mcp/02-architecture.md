---
title: MCP Architecture
date: 2026-01-19
category: mcp
---

## 一、MCP 包含的项目

### 1. MCP Specification

**协议规范本身**。
定义了：

- 客户端和服务端如何通信
- 上下文（context）如何描述、传输、更新
- 必须遵守的接口、数据结构、行为约束

可以理解为「RFC / 标准文档」。

---

### 2. MCP SDKs

**各语言的官方/半官方 SDK 实现**。
作用是：

- 把规范落地成可直接使用的代码
- 降低实现 MCP 客户端/服务端的成本

例如（假设）：

- TypeScript SDK
- Python SDK
- Rust SDK

本质：**规范的工程化实现**。

---

### 3. MCP Development Tools

**开发和调试 MCP 的工具链**，比如：

- MCP Inspector（用于查看、调试 context 交换）
- 本地调试工具
- 验证协议是否符合规范的工具

用途类似：

- HTTP 的 Postman
- GraphQL 的 Playground

---

### 4. MCP Reference Server Implementations

**参考服务端实现**。
特点：

- 不是“唯一正确”的实现
- 主要用于学习、对照、验证理解是否正确

相当于：

- 示例项目
- Best Practice 的最小实现

---

## 二、MCP 不做什么（非常关键）

> **MCP focuses solely on the protocol for context exchange**

MCP **只关心「上下文如何交换」**，不关心：

- ❌ 用的是 GPT、Claude 还是本地 LLM
- ❌ Prompt 怎么写
- ❌ 多轮对话怎么组织
- ❌ Agent 如何决策
- ❌ RAG / Memory / Tool calling 的策略

也就是说：

> **MCP ≈ HTTP**
>
> 它定义“怎么传”，而不是“传了之后你怎么用”。

---

## 三、一句话总结

- MCP 是 **“上下文交换层协议”**
- 提供：
  - 规范（Specification）
  - SDK
  - 开发工具
  - 参考实现

- 不干涉：
  - LLM 选型
  - AI 应用架构
  - 业务逻辑与智能策略

如果你愿意，我可以下一步直接用 **前端 / Node / 全栈视角**，类比：

- MCP vs HTTP / GraphQL
- MCP 在 Agent / IDE / AI 工具链里的位置
