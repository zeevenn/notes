---
title: Context Engineering for Agents
date: 2026-05-23
---

> 原文：<https://rlancemartin.github.io/2025/06/23/context_engineering/>
>
> 作者：[Lance Martin](https://x.com/RLanceMartin) | 2025-06-23

---

## TL;DR

Agent 需要上下文来执行任务。上下文工程，就是在 Agent 每一步执行中精准填充上下文窗口的艺术与科学。这篇文章梳理了当今主流 Agent 共同采用的几类上下文工程策略。

![context_eng_overview](https://rlancemartin.github.io/assets/context_eng_overview.png)

## 上下文工程

正如 Andrej Karpathy 所说，LLM 就像一种 [新型操作系统](https://www.youtube.com/watch?si=-aKY-x57ILAmWTdw&t=620&v=LCEmiRjPEtQ&feature=youtu.be)。LLM 相当于 CPU，而其 [上下文窗口](https://docs.anthropic.com/en/docs/build-with-claude/context-windows) 相当于 RAM，充当模型的工作记忆。和 RAM 一样，LLM 的上下文窗口 [容量有限](https://lilianweng.github.io/posts/2023-06-23-agent/)，能装下的信息就那么多。操作系统决定哪些内容放入 RAM，「上下文工程」扮演的正是同样的角色。[Karpathy 如此总结](https://x.com/karpathy/status/1937902205765607626)：

> 上下文工程是将恰当的信息填入上下文窗口以进行下一步操作的精妙艺术与科学。

在构建 LLM 应用时，我们需要管理哪些类型的上下文？上下文工程是一个涵盖多种上下文类型的 [总称](https://x.com/dexhorthy/status/1933283008863482067)：

- **Instructions（指令）** – 提示词、记忆、少样本示例、工具描述等
- **Knowledge（知识）** – 事实、记忆等
- **Tools（工具）** – 工具调用的反馈

![context_types](https://rlancemartin.github.io/assets/context_types.png)

## Agent 的上下文工程

今年，随着 LLM 在[推理](https://platform.openai.com/docs/guides/reasoning?api-mode=responses)和[工具调用](https://www.anthropic.com/engineering/building-effective-agents)方面能力的提升，人们对 [Agent](https://www.anthropic.com/engineering/building-effective-agents) 的兴趣急剧增长。Agent 交替执行 LLM 调用和工具调用，通常用于[长时间运行的任务](https://blog.langchain.com/introducing-ambient-agents/)。

![agent_flow](https://rlancemartin.github.io/assets/agent_flow.png)

然而，长时间运行的任务和不断累积的工具调用反馈意味着 Agent 往往会消耗大量 token。这会导致诸多问题：可能[超出上下文窗口的大小](https://cognition.ai/blog/kevin-32b)、成本/延迟急剧增加、或者降低 Agent 性能。[Drew Breunig 详细列举了](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html)较长上下文导致性能问题的几种具体方式：

- **[Context Poisoning](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html#context-poisoning)（上下文投毒）**: 模型之前产生的幻觉留在了上下文里，后续推理把错误当事实，越走越偏
- **[Context Distraction](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html#context-distraction)（上下文干扰）**: 上下文塞了太多信息，把模型训练时学到的知识「压」下去了，模型被带偏去跟随上下文而非自身判断
- **[Context Confusion](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html#context-confusion)（上下文混淆）**: 上下文中存在与任务无关但看似相关的信息，模型被这些噪音干扰，给出偏离主题的回复
- **[Context Clash](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html#context-clash)（上下文冲突）**: 上下文的不同部分互相矛盾（如旧指令与新指令冲突），模型不知道该信哪个，输出不确定

鉴于此，[Cognition](https://cognition.ai/blog/dont-build-multi-agents) 强调了上下文工程的重要性：

> 「上下文工程」……实际上是构建 AI Agent 的工程师的首要工作。

[Anthropic](https://www.anthropic.com/engineering/built-multi-agent-research-system) 也明确指出：

> Agent 通常会进行跨越数百轮的对话，需要精心的上下文管理策略。

那么，人们今天如何应对这一挑战？我将方法归为 4 大类——**写入、选择、压缩和隔离**——并在下面给出每类的示例。

![context_eng_overview](https://rlancemartin.github.io/assets/context_eng_overview.png)

## 写入上下文

_写入上下文是指将信息保存在上下文窗口之外，以帮助 Agent 执行任务。_

### Scratchpads | 草稿本

当人类解决任务时，我们会做笔记并记住信息以备将来相关任务使用。Agent 也在获得这些能力！通过「[草稿本](https://www.anthropic.com/engineering/claude-think-tool)」做笔记是一种在 Agent 执行任务时持久化信息的方法。核心思想是将信息保存在上下文窗口之外，以便 Agent 可以使用。Anthropic 的多 Agent 研究系统展示了一个清晰的例子：

> LeadResearcher 首先思考方法并将计划保存到 Memory 中以持久化上下文，因为如果上下文窗口超过 200,000 个 token 就会被截断，保留计划非常重要。

草稿本可以通过几种不同方式实现。它们可以是一个简单[写入文件](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)的工具调用，也可以是会话期间持久存在的运行时[状态对象](https://langchain-ai.github.io/langgraph/concepts/low_level/#state)中的一个字段。无论哪种情况，草稿本都让 Agent 能够保存有用信息以帮助完成任务。

### Memories | 记忆

草稿本帮助 Agent 在给定会话中解决任务，但有时 Agent 需要跨多个会话记忆信息。[Reflexion](https://arxiv.org/abs/2303.11366) 的做法是让 Agent 每轮结束后进行反思，并在后续重用这些自我生成的记忆。[Generative Agents](https://ar5iv.labs.arxiv.org/html/2304.03442) 则定期从历史反馈中合成记忆。

这些概念已进入 [ChatGPT](https://help.openai.com/en/articles/8590148-memory-faq)、[Cursor](https://forum.cursor.com/t/0-51-memories-feature/98509) 和 [Windsurf](https://docs.windsurf.com/windsurf/cascade/memories) 等流行产品中，它们都有基于用户与 Agent 交互自动生成长期记忆的机制。

![llm_write_memory](https://rlancemartin.github.io/assets/llm_write_memory.png)

## 选择上下文

### Memories | 记忆

如果 Agent 有保存记忆的能力，它们也需要能够选择与当前任务相关的记忆。这有几方面的用处。Agent 可能选择少样本示例（[情景记忆](https://langchain-ai.github.io/langgraph/concepts/memory/#memory-types)）作为期望行为的范例，选择指令（[程序性记忆](https://langchain-ai.github.io/langgraph/concepts/memory/#memory-types)）来引导行为，或选择事实（[语义记忆](https://langchain-ai.github.io/langgraph/concepts/memory/#memory-types)）来提供任务相关的上下文。

一个挑战是确保选择到相关的记忆。一些流行的 Agent 简单地使用一组固定文件始终拉入上下文。例如，许多 Code Agent 使用文件来保存指令（「程序性」记忆），某些情况下还保存示例（「情景」记忆）。Claude Code 使用 `CLAUDE.md`。[Cursor](https://docs.cursor.com/context/rules) 和 [Windsurf](https://windsurf.com/editor/directory) 使用 rules 文件。

但如果 Agent 存储了更大的事实和/或关系集合（例如语义记忆），选择就更难了。[ChatGPT](https://help.openai.com/en/articles/8590148-memory-faq) 就是典型——它会存储大量用户专属记忆，并从中按需选取。

常见的做法是用嵌入向量或[知识](https://arxiv.org/html/2501.13956v1#:~:text=In%20Zep%2C%20memory%20is%20powered,subgraph%2C%20and%20a%20community%20subgraph)[图谱](https://neo4j.com/blog/developer/graphiti-knowledge-graph-memory/#:~:text=changes%20since%20updates%20can%20trigger,and%20holistic%20memory%20for%20agentic)为记忆建索引，辅助选择。然而，记忆选择仍然具有挑战性。在 AIEngineer World's Fair 上，[Simon Willison 分享了](https://simonwillison.net/2025/Jun/6/six-months-in-llms/)一个记忆选择翻车的例子：ChatGPT 从记忆中获取了他的位置信息，意外注入到请求的图像中。这种意外召回会让用户觉得上下文窗口「不再属于自己」！

![memory_types](https://rlancemartin.github.io/assets/memory_types.png)

### Tools | 工具

Agent 使用工具，但如果提供过多工具可能会过载。这通常是因为工具描述可能重叠，导致模型在选择使用哪个工具时产生混淆。一种方法是对工具描述[应用 RAG](https://arxiv.org/abs/2410.14594)（检索增强生成），基于语义相似性获取与任务最相关的工具。一些[最新论文](https://arxiv.org/abs/2505.03275)表明，这将工具选择准确率提高了 3 倍。

### Knowledge | 知识

[RAG](https://github.com/langchain-ai/rag-from-scratch) 是一个内容丰富的主题，也可以是上下文工程的[核心挑战](https://x.com/_mohansolo/status/1899630246862966837)。Code Agent 是大规模生产环境中 RAG 的最佳示例之一。Windsurf 的 Varun 很好地总结了一些挑战：

> 索引代码 ≠ 上下文检索……[我们在做索引和嵌入搜索……[用] AST 解析代码并按语义边界切分……随着代码库增长，嵌入搜索的召回越来越不靠谱……我们必须组合多种技术——grep/文件搜索、基于知识图谱的检索，以及……按相关性对[上下文]做重排序。

## 压缩上下文

_压缩上下文是指仅保留执行任务所需的 token。_

![context_curation](https://rlancemartin.github.io/assets/context_curation.png)

### Context Summarization | 上下文摘要

Agent 交互可以跨越数百轮，并使用消耗大量 token 的工具调用。摘要是管理这些挑战的常见方式之一。如果你使用过 Claude Code，就见过这一功能。Claude Code 在超过上下文窗口 95% 后运行「[auto-compact](https://docs.anthropic.com/en/docs/claude-code/costs)」，对用户与 Agent 交互的完整轨迹进行摘要。这种跨 Agent 轨迹的压缩可以使用[递归](https://arxiv.org/pdf/2308.15022#:~:text=the%20retrieved%20utterances%20capture%20the,based%203)或[层级](https://alignment.anthropic.com/2025/summarization-for-monitoring/#:~:text=We%20addressed%20these%20issues%20by,of%20our%20computer%20use%20capability)摘要等各种策略。

在 Agent 设计的某些节点[添加摘要](https://github.com/langchain-ai/open_deep_research/blob/e5a5160a398a3699857d00d8569cb7fd0ac48a4f/src/open_deep_research/utils.py#L1407)也很有用。例如，可以用来后处理某些工具调用（如消耗大量 token 的搜索工具）。再比如，[Cognition](https://cognition.ai/blog/dont-build-multi-agents#a-theory-of-building-long-running-agents) 提到在 Agent 之间的边界进行摘要以减少知识交接时的 token。如果需要捕获特定事件或决策，摘要可能是一个挑战。Cognition 为此使用了微调模型，这凸显了这一步可能需要的工作量。

### Context Trimming | 上下文裁剪

摘要通常使用 LLM 来提炼最相关的上下文片段，而裁剪则可以过滤或如 Drew Breunig 所说的「[修剪](https://www.dbreunig.com/2025/06/26/how-to-fix-your-context.html)」上下文。这可以使用硬编码的启发式规则，如从消息列表中[移除较旧的消息](https://python.langchain.com/docs/how_to/trim_messages/)。Drew 还提到了 [Provence](https://arxiv.org/abs/2501.16214)，一个为问答训练的上下文修剪器。

## 隔离上下文

_隔离上下文是指将上下文拆分以帮助 Agent 执行任务。_

### Multi-agent | 多 Agent

隔离上下文最流行的方式之一是将其拆分到多个子 Agent 中。[OpenAI Swarm](https://github.com/openai/swarm) 库的一个动机是「[关注点分离](https://openai.github.io/openai-agents-python/ref/agent/)」，让一组 Agent 处理子任务。每个 Agent 有特定的工具集、指令和自己的上下文窗口。

Anthropic 的[多 Agent 研究系统](https://www.anthropic.com/engineering/built-multi-agent-research-system)证明了这一点：多个上下文隔离的 Agent 表现优于单 Agent 方案，主要因为每个子 Agent 的上下文窗口可以专注于更狭窄的子任务。正如博客所述：

> [子 Agent] 以各自独立的上下文窗口并行运行，同时探索问题的不同方面。

当然，多 Agent 的挑战包括 token 使用量（例如 Anthropic 报告的比聊天多 15 倍的 token）、需要精心的提示工程来规划子 Agent 工作、以及子 Agent 之间的协调。

![multi_agent](https://rlancemartin.github.io/assets/multi_agent.png)

### 环境中的上下文隔离

[HuggingFace 的深度研究 Agent](https://huggingface.co/blog/open-deep-research#:~:text=From%20building%20,it%20can%20still%20use%20it) 展示了另一个有趣的上下文隔离示例。大多数 Agent 使用[工具调用 API](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview)，返回 JSON 对象（工具参数）传给工具（如搜索 API）以获取工具反馈（如搜索结果）。HuggingFace 使用 [CodeAgent](https://huggingface.co/papers/2402.01030)，输出包含所需工具调用的代码，代码随后在[沙箱](https://e2b.dev/)中运行。工具调用的选定上下文（如返回值）然后传回 LLM。

这使得上下文可以在环境中与 LLM 隔离。Hugging Face 指出，对于特别吃 token 的对象，这是很好的隔离手段：

> [Code Agent 允许]更好地处理状态……需要存储图像/音频/其他内容供以后使用？没问题，只需将其作为变量赋值到你的状态中，[以后就可以使用](https://deepwiki.com/search/i-am-wondering-if-state-that-i_0e153539-282a-437c-b2b0-d2d68e51b873)。

![isolation](https://rlancemartin.github.io/assets/isolation.png)

### State | 状态

值得指出的是，Agent 的运行时[状态对象](https://langchain-ai.github.io/langgraph/concepts/low_level/#state)也是隔离上下文的好方法。它可以起到与沙箱相同的作用。状态对象可以用一个 [schema](https://langchain-ai.github.io/langgraph/concepts/low_level/#schema)（例如 [Pydantic](https://docs.pydantic.dev/latest/concepts/models/) 模型）来设计，其中有可以写入上下文的字段。schema 的一个字段（如 `messages`）可以在 Agent 的每一轮暴露给 LLM，但 schema 可以将信息隔离在其他字段中以便更有选择性地使用。

## 结论

Agent 上下文工程的模式仍在发展中，但我们可以将常见方法归为 4 大类——**写入、选择、压缩和隔离**：

- _写入上下文是指将信息保存在上下文窗口之外，以帮助 Agent 执行任务。_
- _选择上下文是指将信息拉入上下文窗口，以帮助 Agent 执行任务。_
- _压缩上下文是指仅保留执行任务所需的 token。_
- _隔离上下文是指将上下文拆分以帮助 Agent 执行任务。_

理解和运用这些模式是当今构建高效 Agent 的核心部分。
