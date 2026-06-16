---
title: Inference（推理）
date: 2026-06-05
category:
  - AI
tag:
  - LLM 基础
  - 推理优化
  - KV Cache
---

## Inference

Inference（推理）是使用训练完成的模型生成输出的过程。它只执行前向计算，不更新模型权重。

```
训练: 学习能力（离线，耗时数月）
推理: 使用能力（在线，实时响应用户）
```

## 自回归生成

LLM 逐 token 生成输出，每一步将之前所有 token 作为输入，预测下一个 token：

```
Step 1: [prompt] → "The"
Step 2: [prompt, "The"] → " capital"
Step 3: [prompt, "The", " capital"] → " is"
Step 4: [prompt, "The", " capital", " is"] → " Paris"
Step 5: [prompt, ..., " Paris"] → <EOS>  (结束)
```

自回归生成带来几个直接影响：

- 输出越长，生成耗时越长
- 单个序列的 token 生成难以完全并行
- 服务端可以把已生成 token 流式返回

## 推理的两个阶段

### Prefill（预填充）

处理整个 input prompt，一次性计算所有 input token 的 attention。这个阶段可以并行化。

```
Input: 1000 tokens → 一次 forward pass → KV Cache 就绪
```

常用指标是 **TTFT (Time to First Token)**，即从发送请求到收到第一个 output token 的时间。

### Decode（解码）

逐个生成 output token，每步只计算新 token 与所有之前 token 的 attention。

常用指标是 **TPS (Tokens Per Second)**，即每秒生成的 token 数。

## KV Cache

KV Cache 会保存已处理 token 的 Key 和 Value，避免每生成一个新 token 时重复计算完整历史：

```
无 KV Cache: 每步计算量 O(n²)，n 为已生成长度
有 KV Cache: 每步只算新 token 的 Q 与已缓存 KV 的 attention，计算量 O(n)
```

代价是显存占用。长上下文、高并发和大 batch 都会放大 KV Cache 的压力。

## 推理优化技术

### 量化 (Quantization)

量化会把模型权重从 FP16/BF16 等高精度格式压缩到 INT8/INT4 等低精度格式：

| 精度 | 显存占用 (7B 模型) | 速度 | 质量损失 |
| ---- | ------------------ | ---- | -------- |
| FP16 | ~14 GB             | 基准 | 无       |
| INT8 | ~7 GB              | 更快 | 极小     |
| INT4 | ~3.5 GB            | 最快 | 轻微     |

常见格式和工具包括 GPTQ、AWQ、GGUF 和 llama.cpp。

### Speculative Decoding（推测解码）

用小模型快速生成候选 token 序列，再用大模型一次性验证：

```
小模型 (draft): 快速生成 5 个候选 token
大模型 (verify): 一次 forward pass 验证，接受前 3 个，从第 4 个重新采样
```

加速比取决于小模型的「猜对率」，通常 2-3x 加速。

### 批处理 (Batching)

批处理把多个请求合并执行，提高 GPU 利用率，但会影响排队延迟和调度策略：

- **Static batching**：等 batch 凑满再处理
- **Continuous batching**：动态插入新请求、移除已完成的请求

### 其他优化

| 技术                          | 原理                          | 效果                 |
| ----------------------------- | ----------------------------- | -------------------- |
| Flash Attention               | 优化 attention 的内存访问模式 | 2-4x 加速，减少显存  |
| Grouped Query Attention (GQA) | 多个 Q head 共享 KV head      | 减少 KV Cache 大小   |
| Tensor Parallelism            | 将模型切分到多卡              | 推理大模型的必要手段 |
| PagedAttention (vLLM)         | 用虚拟内存思想管理 KV Cache   | 提高 batch 服务吞吐  |

## 推理服务的关键指标

| 指标          | 含义                      | 影响因素                   |
| ------------- | ------------------------- | -------------------------- |
| TTFT          | 首 token 延迟             | input 长度、prefill 速度   |
| TPS           | 生成速度                  | 模型大小、硬件、batch size |
| Throughput    | 单位时间处理的总 token 数 | batching 策略、并发        |
| Latency (E2E) | 完整响应时间              | TTFT + output_length / TPS |

## 本地推理 vs. API 推理

| 维度     | 本地推理                 | API 推理         |
| -------- | ------------------------ | ---------------- |
| 模型规模 | 受限于本地硬件（7B-70B） | 可用最大模型     |
| 成本     | 一次性硬件投入           | 按 token 付费    |
| 隐私     | 数据不出本地             | 数据发送到第三方 |
| 延迟     | 取决于本地硬件           | 受网络影响       |
| 维护     | 自行管理                 | 提供方负责       |

常用本地或自托管推理工具包括 llama.cpp、Ollama、vLLM、TGI (Text Generation Inference)。
