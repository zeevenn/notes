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

## 向量数据库

向量数据库用于存储、索引和检索高维向量。典型查询是近似最近邻搜索（ANN）：给定一个查询向量，返回数据库中最相似的 K 个向量及其元数据。

```
查询向量 → 向量数据库 → Top-K 最相似的结果（含原始数据）
```

## 检索成本

逐一计算距离的暴力搜索复杂度是 O(n)。当数据量达到百万或亿级时，延迟和成本都会失控。向量数据库通过索引结构降低查询开销，代价是引入近似搜索和少量召回损失。

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

HNSW 是常见的图索引算法，会构建多层邻近图：

```
Layer 2:  A ──── D          (稀疏，大跨步跳转)
Layer 1:  A ── B ── D ── F  (中等密度)
Layer 0:  A─B─C─D─E─F─G─H  (最密，所有节点)
```

搜索时从稀疏的高层图开始，逐层收窄到更精细的邻近节点。

查询速度和召回率通常较好，也支持增量插入；主要代价是图结构会占用较多内存。

### IVF (Inverted File Index)

先将向量空间聚类，搜索时只查询最近的几个簇：

```
聚类 → 搜索时只扫描 nprobe 个最近的簇 → 在簇内精确搜索
```

IVF 的内存效率较好，但需要先训练聚类中心，召回率也会受聚类质量和 `nprobe` 参数影响。

### PQ (Product Quantization)

将高维向量压缩为低维编码，在压缩域上计算近似距离：

```
1536维向量 → 压缩为 64 字节编码 → 近似距离计算
```

PQ 常与 IVF 组合使用（IVF-PQ），用于降低内存占用，但会牺牲一部分距离精度。

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

在 RAG 系统中，向量数据库承担语义检索层的角色。详见 [RAG 章节](../rag/)。

## 选型考虑

| 考虑因素               | 选择建议                   |
| ---------------------- | -------------------------- |
| 快速原型               | ChromaDB（内存型，零配置） |
| 已有 PostgreSQL        | pgvector（无需新基础设施） |
| 生产环境、大规模       | Milvus / Qdrant / Pinecone |
| 不想运维               | Pinecone（全托管）         |
| 纯向量计算（嵌入应用） | FAISS（库，非独立服务）    |
