---
title: Sampling Parameters
date: 2026-06-05
category:
  - AI
tag:
  - LLM 基础
  - Temperature
  - Top-P
  - Top-K
---

LLM 生成文本时，每一步都会在词表上产生一个概率分布。Sampling parameters 决定如何从这个分布中选择下一个 token。

## Temperature

Temperature 调整概率分布的尖锐程度。

```
adjusted_logit = logit / temperature
```

| Temperature | 效果                                           | 适用场景             |
| ----------- | ---------------------------------------------- | -------------------- |
| 0           | 贪心解码，总是选概率最高的 token（确定性输出） | 分类、提取、代码生成 |
| 0.1 - 0.5   | 低随机性，输出稳定但有轻微变化                 | 翻译、摘要、问答     |
| 0.7 - 1.0   | 中等随机性                                     | 通用对话、写作       |
| 1.0 - 1.5   | 高随机性，更有创造力但可能不连贯               | 头脑风暴、创意写作   |

Temperature 越低，模型越倾向于选择最高概率 token；temperature 越高，低概率 token 被采样到的机会越大。

## Top-P (Nucleus Sampling)

只从累计概率达到 P 的最小 token 集合中采样。

```
按概率降序排列 tokens:
token_A: 0.40
token_B: 0.25
token_C: 0.15  ← 累计 0.80，top_p=0.8 截止
token_D: 0.10  ← 被排除
token_E: 0.05  ← 被排除
...
```

| Top-P | 效果                               |
| ----- | ---------------------------------- |
| 0.1   | 极保守，只考虑概率最高的少量 token |
| 0.5   | 较保守                             |
| 0.9   | 常用默认值，排除长尾低概率 token   |
| 1.0   | 不过滤，等于不使用 top-p           |

Temperature 改变分布形状，Top-P 在分布上截断候选集合。两者可以组合使用，但排查输出问题时通常先固定一个，只调整另一个。

## Top-K

只从概率最高的 K 个 token 中采样。

```
词表大小: 100,000
top_k = 50 → 只从概率最高的 50 个 token 中选
```

| Top-K   | 效果         |
| ------- | ------------ |
| 1       | 等于贪心解码 |
| 10-50   | 较保守       |
| 100-500 | 宽松         |

Top-K 是固定数量截断，不考虑分布形状。当模型非常确定时（例如一个 token 概率为 0.95），Top-K=50 仍会保留 50 个候选，而 Top-P=0.9 可能只保留 1 个。Top-P 更自适应，因此实践中更常用。

## Repetition Penalty

惩罚已经生成过的 token，降低重复出现的概率：

```
if token in generated_tokens:
    logit = logit / repetition_penalty  (若 logit > 0)
    logit = logit * repetition_penalty  (若 logit < 0)
```

| 参数                     | 说明                            |
| ------------------------ | ------------------------------- |
| repetition_penalty = 1.0 | 不惩罚                          |
| repetition_penalty > 1.0 | 抑制重复（常用 1.1 - 1.3）      |
| frequency_penalty        | 按 token 出现次数累加惩罚       |
| presence_penalty         | 只看 token 是否出现过，不看次数 |

OpenAI API 使用 `frequency_penalty` 和 `presence_penalty`（范围 -2.0 到 2.0）。
Anthropic Claude 不直接暴露 repetition penalty 参数，通过内部优化处理。

## 常用配置

| 场景          | temperature | top_p | 说明                     |
| ------------- | ----------- | ----- | ------------------------ |
| 代码生成      | 0           | 1.0   | 确定性输出，避免语法错误 |
| 数据提取/分类 | 0           | 1.0   | 需要一致性               |
| 对话/问答     | 0.7         | 0.9   | 平衡准确性和自然度       |
| 创意写作      | 1.0         | 0.95  | 鼓励多样性               |
| 头脑风暴      | 1.2         | 0.95  | 最大化创造性             |

## 采样流程全景

```
logits (原始输出)
    │
    ▼
Temperature scaling  →  调整分布尖锐度
    │
    ▼
Top-K filtering      →  只保留前 K 个
    │
    ▼
Top-P filtering      →  只保留累计概率达 P 的集合
    │
    ▼
Repetition penalty   →  惩罚已生成的 token
    │
    ▼
Softmax → 概率分布
    │
    ▼
采样 → 输出 token
```

不同框架的处理顺序可能略有差异，调参时应以具体服务或推理框架的文档为准。
