# Tokens

## 什么是 Token

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

实测工具：[OpenAI Tokenizer](https://platform.openai.com/tokenizer) — 支持切换 GPT-5.x/O1/O3、GPT-4、GPT-3 等不同 tokenizer

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

重要：不同模型的 tokenizer 不通用，同一段文本在不同模型中 token 数可能不同。

## Token 与计费

API 调用按 token 数计费，分为 input tokens 和 output tokens：

```
总费用 = input_tokens × input_price + output_tokens × output_price
```

Output 通常比 input 贵 3-5 倍，因为生成（逐 token 解码）比编码计算量大得多。

### 以 Claude 为例

| 模型            | Input        | Output     | Cache Write   | Cache Read   |
| --------------- | ------------ | ---------- | ------------- | ------------ |
| Claude Opus 4   | $15 / MTok   | $75 / MTok | $18.75 / MTok | $1.50 / MTok |
| Claude Sonnet 4 | $3 / MTok    | $15 / MTok | $3.75 / MTok  | $0.30 / MTok |
| Claude Haiku 4  | $0.80 / MTok | $4 / MTok  | $1 / MTok     | $0.08 / MTok |

> MTok = 1M tokens

### Prompt Caching

将重复使用的内容（system prompt、few-shot examples）标记为可缓存：

- **Cache Write**：首次写入缓存，比正常 input 贵 25%
- **Cache Read**：命中缓存时，只需正常 input 价格的 10%

```
第 1 次调用：input 部分按 cache write 计费（$3.75/MTok）
第 2+ 次调用：命中缓存，按 cache read 计费（$0.30/MTok）
```

如果同一段 prompt 反复使用（如 agent 的 system prompt 每轮都带着），第 2 次就已经回本。

### 降低 token 成本的方法

- **Prompt caching**：缓存重复的 system prompt，命中价格降为 10%
- **精简 prompt**：去除冗余说明、用结构化格式替代自然语言描述
- **控制 output 长度**：设置 `max_tokens`，prompt 中要求简洁回复
- **Batch API**：非实时场景使用批量接口，通常 50% 折扣

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
