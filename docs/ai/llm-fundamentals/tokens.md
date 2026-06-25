---
title: Tokens
date: 2026-06-05
category:
  - AI
tag:
  - LLM 基础
  - Tokenization
  - 计费
---

## Token

Token 是 LLM 处理文本的最小单位。模型不直接理解文字，而是将输入文本切分为 token 序列，每个 token 映射到一个整数 ID，再通过 embedding 转换为向量进行计算。

一个 token 不等于一个字符，也不等于一个单词：

| 语言 | 示例                | GPT-4 (cl100k) | GPT-4o/5.x/O1/O3 (o200k) |
| ---- | ------------------- | -------------- | ------------------------ |
| 英文 | "Hello, world!"     | 4              | 4                        |
| 英文 | "tokenization"      | 3              | 1                        |
| 中文 | "你好世界"          | 4              | 2                        |
| 代码 | `console.log("hi")` | 6              | 5                        |

同样的文本在不同 tokenizer 下切分结果差异很大。新一代 tokenizer（如 o200k_base）词表更大，能把常见词和短语合并为单个 token。

粗略估算：英文约 1 token ≈ 4 字符 ≈ 0.75 个单词（因模型而异）。

可以用 [OpenAI Tokenizer](https://platform.openai.com/tokenizer) 观察不同 tokenizer 的切分结果。

## Tokenization 算法

### BPE (Byte Pair Encoding)

主流 LLM（GPT、Claude、LLaMA）使用的分词算法：

1. 从单字符（或字节）开始作为初始词表
2. 统计训练语料中相邻 token 对的出现频率
3. 将频率最高的 token 对合并为新 token，加入词表
4. 重复步骤 2-3，直到词表达到目标大小

```
原始: l o w e r
合并1: lo w e r    (l+o 频率最高)
合并2: low e r    (lo+w)
合并3: lower      (low+er)
```

### 不同模型的 Tokenizer

| 模型    | Tokenizer          | 词表大小 | 查证来源                                                                   |
| ------- | ------------------ | -------- | -------------------------------------------------------------------------- |
| GPT-4   | cl100k_base        | ~100K    | [tiktoken](https://github.com/openai/tiktoken)                             |
| GPT-4o  | o200k_base         | ~200K    | [tiktoken](https://github.com/openai/tiktoken)                             |
| Claude  | 自有 BPE           | 未公开   | Anthropic 未公开 tokenizer                                                 |
| LLaMA 3 | tiktoken-based BPE | 128K     | [Model Card](https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md) |

不同模型的 tokenizer 不通用，同一段文本在不同模型中 token 数可能不同。

## Token 与计费

API 调用按 token 数计费，分为 input tokens 和 output tokens：

```
总费用 = input_tokens × input_price + output_tokens × output_price
```

Output 通常比 input 贵 3-5 倍，因为生成（逐 token 解码）比编码计算量大得多。

### 价格示例

价格会随模型、区域、Batch API、cache、长上下文和工具调用变化。记录价格时应同时说明成本构成，并以官方 pricing 或 models 页面为准。

以下价格按 2026-06-25 官方文档记录，单位是每 1M tokens：

| 提供方 | 模型              | Input | Cached / Cache Read | Cache Write          | Output |
| ------ | ----------------- | ----- | ------------------- | -------------------- | ------ |
| OpenAI | GPT-5.5           | $5    | $0.50               | -                    | $30    |
| OpenAI | GPT-5             | $1.25 | $0.125              | -                    | $10    |
| OpenAI | GPT-5 mini        | $0.25 | $0.025              | -                    | $2     |
| Claude | Claude Opus 4.8   | $5    | $0.50               | $6.25 / $10          | $25    |
| Claude | Claude Sonnet 4.6 | $3    | $0.30               | $3.75 / $6           | $15    |
| Claude | Claude Haiku 4.5  | $1    | $0.10               | $1.25 / $2           | $5     |

Claude 的 cache write 分为 5 分钟和 1 小时两档，因此表中写成两个价格。OpenAI 的 cached input 是命中缓存后的 input 价格。

官方入口：

- [OpenAI Models](https://developers.openai.com/api/docs/models)
- [Claude Pricing](https://docs.anthropic.com/en/docs/about-claude/pricing)

### Prompt Caching

将重复使用的内容（system prompt、few-shot examples）标记为可缓存：

- **Cache Write**：首次写入缓存，通常比正常 input 贵
- **Cache Read / Cached Input**：命中缓存时，通常只按正常 input 价格的一小部分计费

```
以 Claude Sonnet 4.6 为例：

第 1 次调用：5m cache write 为 $3.75/MTok，1h cache write 为 $6/MTok
第 2+ 次调用：命中缓存，cache read 为 $0.30/MTok
```

如果同一段 prompt 会被反复使用，例如 agent 每轮都携带相同 system prompt，prompt caching 通常很快就能抵消首次写入成本。

### 降低 token 成本的方法

- **Prompt caching**：缓存重复的 system prompt，命中后按 cached input / cache read 价格计费
- **精简 prompt**：去除冗余说明、用结构化格式替代自然语言描述
- **控制 output 长度**：设置 `max_tokens`，prompt 中要求简洁回复
- **Batch API**：非实时场景使用批量接口，按供应商批处理折扣计费

## Token 限制

每个模型有两个关键限制：

| 限制              | 说明                           |
| ----------------- | ------------------------------ |
| Context window    | input + output 的 token 总上限 |
| Max output tokens | 单次回复的 output 上限         |

```
context_window >= input_tokens + output_tokens
```

如果 input 占满了 context window，留给 output 的空间就不够，可能导致回复被截断。

## 实用工具

- [OpenAI Tokenizer](https://platform.openai.com/tokenizer) — 在线可视化 token 切分
- `tiktoken` (Python) — OpenAI 的 tokenizer 库，可离线计数
- Anthropic API response 中的 `usage` 字段 — 返回实际 token 消耗

```python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4")
tokens = enc.encode("Hello, world!")
print(len(tokens))  # 4
```
