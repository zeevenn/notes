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
    children: ['', 'context-engineering-for-agents']
  },
  {
    text: 'RAG',
    collapsible: true,
    icon: 'search',
    prefix: '/ai/rag/',
    children: ['']
  },
  {
    text: 'Agents',
    collapsible: true,
    icon: 'robot',
    prefix: '/ai/agents/',
    children: ['']
  },
  {
    text: 'MCP',
    collapsible: true,
    icon: 'plugin',
    prefix: '/ai/mcp/',
    children: ['01-what-is-mcp', '02-architecture']
  },
  {
    text: 'Fine-tuning',
    collapsible: true,
    icon: 'model',
    prefix: '/ai/fine-tuning/',
    children: ['']
  },
  {
    text: 'Skills',
    collapsible: true,
    icon: 'skill',
    prefix: '/ai/skills/',
    children: ['01-agent-skills-overview']
  }
]
