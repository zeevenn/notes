---
title: Agent Skills Overview
date: 2026-02-06
category: ai
---

## Overview

Agent Skills 是一种轻量、开放的格式，用于赋予 AI 智能体新的能力和专业知识。它们是**包含指令、脚本和资源的文件夹**，提供了规范化的知识和工作流，
智能体可以发现并使用它们来更准确、高效地完成任务。

从技术角度看，Skills 是 AI Agent 可以调用的**可复用功能单元**，类似于编程中的函数或插件。

通过 Skills，Agent 可以：

- 执行特定任务（如创建 Git commit、生成 PDF、分析代码）
- 访问外部工具和服务
- 扩展自身能力而无需修改核心代码

## What are skills?

一个标准的 Skill 通常包含以下文件：

```
my-skill/
├── SKILL.md          # Required: instructions + metadata (name and description)
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
└── assets/           # Optional: templates, resources
```

Skills 使用渐进式披露来高效管理上下文：

1. 发现阶段：启动时，Agent 仅加载每个可用 skill 的名称和描述——刚好足够判断该 skill 何时可能相关。
2. 激活阶段：当任务与某个 skill 的描述匹配时，Agent 会将完整的 `SKILL.md` 指令读入上下文。
3. 执行阶段：Agent 按照指令执行操作，根据需要加载引用的文件或运行捆绑的代码。

这种方式让智能体保持快速响应，同时能够按需获取更多上下文信息。

```markdown
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents.
---

# PDF Processing

## When to use this skill

Use this skill when the user needs to work with PDF files...

## How to extract text

1. Use pdfplumber for text extraction...

## How to fill forms

...
```

> [!NOTE]
> 详细规范见：[Agent skills specification](https://agentskills.io/specification)。
> Agent Skills 集成：[Agent Skills in the SDK](https://platform.claude.com/docs/en/agent-sdk/skills)。

## Skills vs Tools vs MCP

| 概念   | 定义                                   | 举例                         | 作用层级       |
| ------ | -------------------------------------- | ---------------------------- | -------------- |
| Tools  | Agent 的**基础能力**（内置）           | Bash、Read、Write、Grep      | 底层原子操作   |
| Skills | Agent 的**复合能力**（可扩展）         | /commit、/review-pr、/pdf    | 高层业务逻辑   |
| MCP    | Agent 与外部系统的**通信协议**（标准） | 访问 Google Calendar、Notion | 系统间互操作层 |

> [!NOTE]
> **Skill 的双重身份：**
>
> - 从实现角度：`Skill` 是一个特殊的 Tool，需要在 `allowed_tools` 中启用（[How Skills Work with the SDK](https://platform.claude.com/docs/en/agent-sdk/skills#how-skills-work-with-the-sdk)）。
> - 从功能角度：Skills 是基于 Tools 构建的高层能力，一个 skill 内部会调用多个 tools

**关系：**

```
Skills（业务逻辑）
  ↓ 调用
Tools（基础能力）
  ↓ 通过
MCP（通信协议）
  ↓ 访问
External Systems（外部系统）
```

**示例：**

```typescript
// Skill: /pdf（生成 PDF）
async function pdfSkill() {
  // 使用 Tool: Read
  const content = await tools.read('document.md')

  // 使用 Tool: Bash
  await tools.bash('pandoc document.md -o output.pdf')

  // 通过 MCP 上传到 Google Drive
  await mcp.googleDrive.upload('output.pdf')
}
```

## 总结

**Agent Skills 的本质：**

- 是 Agent 能力的**模块化封装**
- 提供**高层业务逻辑**，复用**底层 Tools**
- 通过 **MCP** 与外部系统集成

**关键特点：**

- ✅ 可复用
- ✅ 可扩展
- ✅ 可组合
- ✅ 易开发

**类比理解：**

```
Skills ≈ npm packages（应用层功能包）
Tools  ≈ Node.js API（底层能力）
MCP    ≈ HTTP/gRPC（通信协议）
```

通过合理设计和使用 Skills，可以让 Agent 更加强大、灵活和易于维护。
