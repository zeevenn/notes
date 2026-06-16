---
title: Vector Databases
date: 2026-06-05
category:
  - AI
tag:
  - LLM 基础
  - 向量数据库
  - RAG
---

## 什么是向量数据库

向量数据库是专门用于存储、索引和检索高维向量的数据库。核心操作是**近似最近邻搜索 (ANN)**：给定一个查询向量，快速找到数据库中最相似的 K 个向量。

```
查询向量 → 向量数据库 → Top-K 最相似的结果（含原始数据）
```

## 为什么需要专门的向量数据库

暴力搜索（逐一计算距离）的复杂度是 O(n)，当数据量达到百万/亿级时不可接受。向量数据库通过索引结构将搜索复杂度降到 O(log n) 或亚线性，代价是少量精度损失（近似搜索）。

## 主流向量数据库

| 数据库   | 类型            | 特点                      |
| -------- | --------------- | ------------------------- |
| Pinecone | 全托管 SaaS     | 零运维，按使用付费        |
| Weaviate | 开源 + 云       | 支持混合搜索，GraphQL API |
| Milvus   | 开源            | 高性能，支持万亿级向量    |
| Qdrant   | 开源 + 云       | Rust 实现，性能好         |
| ChromaDB | 开源            | 轻量，适合原型开发        |
| pgvector | PostgreSQL 扩展 | 无需额外基础设施          |
| FAISS    | 库（非数据库）  | Meta 开源，纯向量索引     |

## 索引算法

### HNSW (Hierarchical Navigable Small World)

当前最主流的索引算法，构建多层图结构：

```
Layer 2:  A ──── D          (稀疏，大跨步跳转)
Layer 1:  A ── B ── D ── F  (中等密度)
Layer 0:  A─B─C─D─E─F─G─H  (最密，所有节点)
```

搜索时从顶层开始，逐层细化到最近邻。

- 优点：查询快、召回率高、支持增量插入
- 缺点：内存占用大（需要存图结构）

### IVF (Inverted File Index)

先将向量空间聚类，搜索时只查询最近的几个簇：

```
聚类 → 搜索时只扫描 nprobe 个最近的簇 → 在簇内精确搜索
```

- 优点：内存效率高
- 缺点：需要训练（建索引慢），召回率受聚类质量影响

### PQ (Product Quantization)

将高维向量压缩为低维编码，在压缩域上计算近似距离：

```
1536维向量 → 压缩为 64 字节编码 → 近似距离计算
```

通常与 IVF 组合使用（IVF-PQ），大幅减少内存占用。

## 核心操作

### 插入

```python
collection.insert(
    ids=["doc_1"],
    embeddings=[[0.12, -0.34, ...]],
    metadata={"source": "wiki", "topic": "physics"},
    documents=["原始文本内容"]
)
```

### 查询

```python
results = collection.query(
    query_embeddings=[[0.15, -0.31, ...]],
    n_results=5,
    where={"topic": "physics"}  # 元数据过滤
)
```

### 混合搜索

结合向量相似度和关键词匹配（BM25），兼顾语义相关和精确匹配：

```
最终分数 = α × 向量相似度 + (1-α) × BM25 分数
```

## 在 RAG 中的角色

```
文档 → 切分 → Embedding → 存入向量数据库
                                    ↓
用户提问 → Embedding → 在向量库中检索 → Top-K 片段 → 送入 LLM
```

向量数据库是 RAG 系统的核心存储层。详见 [RAG 章节](../rag/)。

## 选型考虑

| 考虑因素               | 选择建议                   |
| ---------------------- | -------------------------- |
| 快速原型               | ChromaDB（内存型，零配置） |
| 已有 PostgreSQL        | pgvector（无需新基础设施） |
| 生产环境、大规模       | Milvus / Qdrant / Pinecone |
| 不想运维               | Pinecone（全托管）         |
| 纯向量计算（嵌入应用） | FAISS（库，非独立服务）    |
