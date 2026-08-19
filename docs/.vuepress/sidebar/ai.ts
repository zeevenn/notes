export default [
  {
    text: 'LLM 基础',
    collapsible: true,
    icon: 'basic',
    prefix: '/ai/llm-fundamentals/',
    children: [
      '',
      {
        text: '核心原理',
        collapsible: true,
        icon: 'basic',
        children: ['what-is-llm', 'tokens', 'embeddings', 'training', 'inference']
      },
      {
        text: '工程应用',
        collapsible: true,
        icon: 'practice',
        children: ['context', 'sampling-parameters', 'vector-databases', 'evaluation']
      }
    ]
  },
  {
    text: 'Prompt Engineering',
    collapsible: true,
    icon: 'practice',
    prefix: '/ai/prompt-engineering/',
    children: ['']
  },
  {
    text: 'RAG',
    collapsible: true,
    icon: 'search',
    prefix: '/ai/rag/',
    children: [
      '',
      'ingestion-and-chunking',
      'retrieval-and-reranking',
      'generation-and-citations',
      'rag-evaluation',
      'production-and-security',
      'advanced-rag-patterns'
    ]
  },
  {
    text: 'Agents',
    collapsible: true,
    icon: 'robot',
    prefix: '/ai/agents/',
    children: ['', 'function-calling', 'context-management', 'memory-system']
  },
  {
    text: 'MCP',
    collapsible: true,
    icon: 'plugin',
    prefix: '/ai/mcp/',
    children: ['', 'what-is-mcp', 'architecture']
  },
  {
    text: 'Skills',
    collapsible: true,
    icon: 'skill',
    prefix: '/ai/skills/',
    children: ['', 'agent-skills-overview']
  }
]
