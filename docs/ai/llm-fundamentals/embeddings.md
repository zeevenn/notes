---
title: Embeddings
date: 2026-06-09
category:
  - AI
tag:
  - LLM 基础
  - Embeddings
  - 向量
---

## 什么是 Embedding

Embedding 是将离散的对象（文本、图片、token）映射为连续的高维向量。在这个向量空间中，语义相似的内容距离更近。

```
"猫" → [0.12, -0.34, 0.78, ..., 0.56]  (1536维)
"狗" → [0.15, -0.31, 0.72, ..., 0.61]  ← 与"猫"距离近
"汽车" → [-0.45, 0.67, -0.12, ..., 0.23] ← 与"猫"距离远
```

## 两种 Embedding 的用途

### 1. Token Embedding（模型内部）

LLM 内部的第一步：将每个 token ID 映射为向量，作为 Transformer 的输入。这是模型训练的一部分，用户不直接接触。

```
token_id: 15234 → embedding_matrix[15234] → [0.02, -0.15, ...]
```

### 2. Text Embedding（用户使用）

通过 Embedding API 将一段文本编码为一个固定维度的向量，用于下游任务：

```python
from openai import OpenAI
client = OpenAI()

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="如何重置密码？"
)
vector = response.data[0].embedding  # 1536维向量
```

## 主流 Embedding 模型

| 模型                   | 提供方    | 维度     | 特点           |
| ---------------------- | --------- | -------- | -------------- |
| text-embedding-3-small | OpenAI    | 1536     | 性价比高       |
| text-embedding-3-large | OpenAI    | 3072     | 精度更高       |
| Voyage 3               | Voyage AI | 1024     | Anthropic 推荐 |
| BGE-M3                 | BAAI      | 1024     | 开源，多语言   |
| GTE-Qwen2              | 阿里      | 768-1792 | 开源，中文强   |

## 相似度计算

两个向量的相似度通常用余弦相似度衡量：

```
cosine_similarity(A, B) = (A · B) / (|A| × |B|)
```

- 值域 [-1, 1]，1 表示方向完全相同，0 表示正交，-1 表示相反
- 大多数 embedding 模型产出的向量已归一化，此时余弦相似度 = 点积

其他距离度量：

- **欧氏距离 (L2)**：向量空间中的直线距离
- **内积 (Inner Product)**：归一化向量时等同于余弦相似度

## 应用场景

### 语义搜索

```
用户查询 → embedding → 在向量库中找最近邻 → 返回相似文档
```

比关键词匹配更强大："如何重置密码" 可以匹配到 "忘记密码的找回方式"。

### RAG（检索增强生成）

将知识库文档切分并 embedding，存入向量数据库。用户提问时检索相关片段，送入 LLM 生成回答。详见 [RAG 章节](../rag/)。

### 聚类与分类

将文本 embedding 后，用 K-means 等算法聚类，或训练轻量分类器。

### 异常检测

计算新输入与已知样本的距离，距离过大则可能是异常/离群样本。

## Embedding 的局限

- **单向量瓶颈**：一段复杂文本被压缩为一个向量，可能丢失细节
- **长文本衰减**：文本越长，embedding 质量越可能下降
- **领域差异**：通用 embedding 在特定领域（医学、法律）可能效果不佳，需要微调
- **不可解释**：向量的每个维度没有明确的语义含义
