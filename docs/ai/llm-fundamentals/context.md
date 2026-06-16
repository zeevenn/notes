---
title: Context Window
date: 2026-06-05
category:
  - AI
tag:
  - LLM 基础
  - Context Window
---

## Context Window

Context window 是模型单次调用可处理的 token 总量上限，包含 input 和 output。它限定了模型在一次请求中可访问的信息范围，但不等同于长期记忆。

## 主流模型的 Context Window

| 模型              | Context Window | Max Output  |
| ----------------- | -------------- | ----------- |
| Claude Sonnet 4.6 | 1M tokens      | 64K tokens  |
| Claude Opus 4.8   | 1M tokens      | 128K tokens |
| GPT-5.x           | 1M tokens      | 128K tokens |
| GPT-4o            | 128K tokens    | 16K tokens  |
| Gemini 2.5 Pro    | 1M tokens      | 64K tokens  |
| LLaMA 4 Maverick  | 1M tokens      | -           |
| LLaMA 4 Scout     | 10M tokens     | -           |

1M tokens 可以容纳很长的文档集合，但容量不代表模型能稳定利用窗口内的每一处信息。

## Context Window vs. 有效利用率

更大的 context window 提供了更大的输入空间，也带来更高的成本、更长的延迟，以及位置敏感性问题。

### Lost in the Middle

模型通常更容易利用 context 开头和结尾的信息，中间位置的细节更容易被忽略。对于 needle-in-a-haystack 一类任务，关键信息放在中间时，召回率可能下降。

常见处理方式：

- 把最重要的信息放在 context 的开头或结尾
- 使用分隔符和结构化格式让关键内容更显眼
- 对超长输入做预处理（摘要、筛选）再送入模型

### 长 context 的性能衰减

输入越长，推理阶段通常越贵：

- 推理延迟随输入长度增加
- 长输入可能稀释模型对关键内容的注意力
- 成本按 token 线性增长

## 长文本处理策略

长文本不应该总是直接塞进 prompt。常见处理方式包括分块、摘要、检索和滑动窗口。

### 1. 分块处理 (Chunking)

将长文档切分为重叠的片段，分别处理后合并结果：

```
文档 → [chunk1] [chunk2] [chunk3] → 分别处理 → 合并
         ←overlap→
```

适合摘要、信息提取、翻译等可以拆分处理的任务。

### 2. Map-Reduce

先对每个片段独立处理（Map），再对中间结果汇总（Reduce）：

```
chunks → [summary1, summary2, summary3] → final_summary
```

适合长文档摘要、多文档问答等需要先局部处理、再全局合并的任务。

### 3. RAG（检索增强生成）

不把全部内容塞进 context，而是根据查询检索最相关的片段：

```
query → 检索 top-k 相关段落 → 拼入 context → 生成回答
```

适合知识库问答、文档搜索等查询驱动的场景。详见 [RAG 章节](../rag/)。

### 4. 滑动窗口 + 摘要

对话场景中，保留最近的消息，对更早的历史做摘要压缩：

```
[系统摘要: 之前讨论了X和Y] + [最近10轮对话] + [新消息]
```

## Context 的组成

一次 API 调用的 context 通常包含：

```
┌─────────────────────────┐
│ System Prompt           │ ← 角色设定、指令、规则
├─────────────────────────┤
│ Few-shot Examples       │ ← 示例（可选）
├─────────────────────────┤
│ Retrieved Context       │ ← RAG 检索到的内容（可选）
├─────────────────────────┤
│ Conversation History    │ ← 多轮对话历史
├─────────────────────────┤
│ Current User Message    │ ← 当前输入
└─────────────────────────┘
```

工程上需要显式分配 context 预算：system prompt 和 few-shot 通常占固定空间，检索内容和对话历史按任务动态裁剪。
