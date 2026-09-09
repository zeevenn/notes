export default [
  {
    text: 'Database',
    collapsible: true,
    icon: 'database',
    link: '/backend/database/',
    prefix: '/backend/database/',
    children: [
      {
        text: 'Fundamentals',
        collapsible: true,
        icon: 'basic',
        link: 'fundamentals/',
        prefix: 'fundamentals/',
        children: ['hello-database', 'relation-model', 'db-design', 'advanced-db-model']
      },
      {
        text: 'MySQL',
        collapsible: true,
        icon: 'mysql',
        link: 'mysql/',
        prefix: 'mysql/',
        children: ['install-mysql']
      },
      {
        text: 'SQL',
        collapsible: true,
        icon: 'sql',
        link: 'sql/',
        prefix: 'sql/',
        children: ['quick-start']
      }
    ]
  },
  {
    text: 'Node.js',
    collapsible: true,
    icon: 'nodejs',
    link: '/backend/node/',
    prefix: '/backend/node/',
    children: [
      {
        text: 'HTTP Framework',
        collapsible: true,
        icon: 'server',
        link: 'http-framework/',
        prefix: 'http-framework/',
        children: ['minimal-http-framework', 'express-vs-koa-middleware']
      },
      {
        text: 'Express',
        collapsible: true,
        icon: 'express',
        link: 'express/',
        prefix: 'express/',
        children: ['overview-architecture', 'express.js']
      },
      {
        text: 'Prisma',
        collapsible: true,
        icon: 'prisma',
        link: 'prisma/',
        prefix: 'prisma/',
        children: ['quick-start']
      },
      {
        text: 'Modules',
        collapsible: true,
        icon: 'npm',
        link: 'modules/',
        prefix: 'modules/',
        children: ['module-system', 'finalhandler']
      },
      'streams-and-backpressure',
      'turso-prisma-integration'
    ]
  },
  {
    text: 'Engineering',
    collapsible: true,
    icon: 'practice',
    link: '/backend/engineering/',
    prefix: '/backend/engineering/',
    children: ['layered-backend-boundaries', 'unit-of-work', 'testing', 'ci-cd', 'code-quality']
  }
]
