---
title: Training
date: 2026-06-05
category:
  - AI
tag:
  - LLM 基础
  - Pre-training
  - RLHF
  - Fine-tuning
---

## LLM 训练的三个阶段

现代对话模型通常不是一次训练完成，而是经历预训练、指令微调和偏好对齐等阶段。不同阶段解决的问题不同：预训练学习语言和知识分布，SFT 学习指令格式，对齐阶段让输出更符合人类偏好和安全要求。

```
Pre-training → Supervised Fine-tuning (SFT) → Alignment (RLHF/DPO)
   基座模型          指令跟随能力              安全对齐 & 偏好优化
```

## 阶段一：Pre-training（预训练）

### 目标

在海量文本上学习 next token prediction：

```
输入: "The cat sat on the"
标签: "mat"
损失: cross-entropy(predicted_distribution, "mat")
```

### 训练数据

| 来源                      | 规模            |
| ------------------------- | --------------- |
| 互联网网页 (Common Crawl) | 万亿 token 级别 |
| 书籍、论文                | 百亿 token      |
| 代码 (GitHub)             | 千亿 token      |
| 维基百科、百科            | 百亿 token      |

总训练数据通常在 1-15 万亿 token。

### 计算成本

训练一个前沿模型需要数千到数万张 GPU（H100/A100），训练数周到数月，成本数千万到上亿美元。

### 产出

Pre-training 完成后得到 base model（基座模型）。它已经具备续写能力和大量语言模式，但还不一定稳定遵循指令，也缺少面向对话产品的安全边界。

## 阶段二：Supervised Fine-tuning (SFT)

### 目标

SFT 使用人工整理的指令数据，让模型学习「指令 → 回答」的交互格式：

```json
{
  "messages": [
    { "role": "user", "content": "解释什么是递归" },
    { "role": "assistant", "content": "递归是函数调用自身的编程技术..." }
  ]
}
```

### 数据

SFT 数据通常是高质量指令-回答对，规模可以从数万到数十万条不等。这个阶段更依赖样本质量、覆盖面和格式一致性，而不是单纯堆数量。

### 效果

SFT 之后，模型通常会更擅长：

- 遵循指令
- 以对话形式回答
- 完成具体任务（摘要、翻译、代码等）

## 阶段三：Alignment（对齐）

Alignment 的目标是让模型输出更符合人类偏好、产品规范和安全边界。

### RLHF (Reinforcement Learning from Human Feedback)

```
1. 收集人类偏好：对同一输入的多个回答，人类标注哪个更好
2. 训练 Reward Model：学习预测人类偏好分数
3. PPO 强化学习：用 reward model 的分数作为奖励，优化生成策略
```

RLHF 的优势是可以表达难以写成规则的偏好，例如“有帮助但不啰嗦”。它的工程成本也更高，reward model 本身可能被模型利用或放大偏差。

### DPO (Direct Preference Optimization)

跳过 reward model，直接从偏好数据优化策略：

```
数据格式: (prompt, chosen_response, rejected_response)
损失函数: 直接增加 chosen 的概率、降低 rejected 的概率
```

DPO 省去了显式 reward model 和 PPO 训练流程，工程链路更短，也更容易稳定复现。

### Constitutional AI (CAI)

Anthropic 提出的方法，用 AI 自我批评来代替部分人类标注：

```
1. 模型生成回答
2. 模型根据一组「宪法原则」批评自己的回答
3. 模型修改回答
4. 用修改后的数据做 RLHF
```

## 训练后的能力获取方式对比

| 方式                  | 数据量     | 成本             | 适用场景           |
| --------------------- | ---------- | ---------------- | ------------------ |
| Pre-training          | 万亿 token | 极高             | 从零构建能力       |
| Fine-tuning           | 千-万条    | 中等             | 领域适配、格式学习 |
| Few-shot (in-context) | 几条示例   | 零（仅推理成本） | 快速适配新任务     |
| Prompt Engineering    | 无额外数据 | 零               | 引导已有能力       |

## 知识截止日期 (Knowledge Cutoff)

Pre-training 数据有时间边界。模型无法从参数中得知训练数据截止后的事件，例如：

- 模型训练数据截止到 2024 年 4 月 → 不知道 2024 年 5 月后的新闻
- 常见处理方式：通过 RAG 注入实时信息，或在应用层接入联网搜索、数据库和业务 API
