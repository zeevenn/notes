---
title: Context Window
date: 2026-06-05
category:
  - AI
tag:
  - LLM 基础
  - Context Window
---

## 概念

Context window 是模型单次调用能处理的 token 总量上限（input + output）。它决定了模型一次能「看到」多少信息。

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

1M tokens ≈ 约 4-5 本 500 页的书，或约 75 万字中文。

## Context Window vs. 有效利用率

Context window 大不代表模型在窗口内所有位置都表现一致。已知的问题：

### Lost in the Middle

模型对 context 开头和结尾的信息关注度最高，中间部分容易被「遗忘」。对于需要在大量文本中找到关键信息的任务（如 needle-in-a-haystack），信息放在中间时召回率会下降。

**应对策略：**

- 把最重要的信息放在 context 的开头或结尾
- 使用分隔符和结构化格式让关键内容更显眼
- 对超长输入做预处理（摘要、筛选）再送入模型

### 长 context 的性能衰减

随着输入长度增加：

- 推理延迟线性增长（attention 计算量 = O(n²)，但实际实现有优化）
- 在某些任务上准确率可能下降
- 成本按 token 线性增长

## 长文本处理策略

当内容超过 context window 或影响效果时：

### 1. 分块处理 (Chunking)

将长文档切分为重叠的片段，分别处理后合并结果：

```
文档 → [chunk1] [chunk2] [chunk3] → 分别处理 → 合并
         ←overlap→
```

适用场景：摘要、信息提取、翻译。

### 2. Map-Reduce

先对每个片段独立处理（Map），再对中间结果汇总（Reduce）：

```
chunks → [summary1, summary2, summary3] → final_summary
```

适用场景：长文档摘要、多文档问答。

### 3. RAG（检索增强生成）

不把全部内容塞进 context，而是根据查询检索最相关的片段：

```
query → 检索 top-k 相关段落 → 拼入 context → 生成回答
```

适用场景：知识库问答、文档搜索。详见 [RAG 章节](../rag/)。

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

合理分配 context 预算：给 system prompt 和 few-shot 留出固定空间，剩余空间动态分配给检索内容和对话历史。
