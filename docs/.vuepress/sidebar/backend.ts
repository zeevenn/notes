export default [
  {
    text: 'Linux',
    collapsible: true,
    icon: 'linux',
    prefix: '/backend/linux/',
    children: [
      '',
      'set-the-ssh',
      'build-git-server',
      'configure-bt',
      'automated-deployment',
      'install-docker',
      'server-proxy'
    ]
  },
  {
    text: 'Database',
    collapsible: true,
    icon: 'database',
    prefix: '/backend/database/',
    children: [
      '',
      {
        text: 'Fundamentals',
        collapsible: true,
        icon: 'basic',
        prefix: 'fundamentals/',
        children: ['', 'hello-database', 'relation-model', 'db-design', 'advanced-db-model']
      },
      {
        text: 'MySQL',
        collapsible: true,
        icon: 'mysql',
        prefix: 'mysql/',
        children: ['', 'install-mysql']
      },
      {
        text: 'SQL',
        collapsible: true,
        icon: 'sql',
        prefix: 'sql/',
        children: ['', 'quick-start']
      }
    ]
  },
  {
    text: 'Node',
    collapsible: true,
    icon: 'nodejs',
    prefix: '/backend/node/',
    children: [
      '',
      {
        text: 'HTTP Framework',
        collapsible: true,
        icon: 'server',
        prefix: 'http-framework/',
        children: ['', 'minimal-http-framework', 'express-vs-koa-middleware']
      },
      {
        text: 'Express',
        collapsible: true,
        icon: 'express',
        prefix: 'express/',
        children: ['', 'overview-architecture', 'express.js']
      },
      {
        text: 'Prisma',
        collapsible: true,
        icon: 'prisma',
        prefix: 'prisma/',
        children: ['', 'quick-start']
      },
      {
        text: 'Modules',
        collapsible: true,
        icon: 'npm',
        prefix: 'modules/',
        children: ['', 'module-system']
      },
      {
        text: 'Module',
        collapsible: true,
        icon: 'npm',
        prefix: 'module/',
        children: ['', 'finalhandler']
      },
      'streams-and-backpressure',
      'turso-prisma-integration'
    ]
  },
  {
    text: 'Microservices',
    collapsible: true,
    icon: 'microservices',
    prefix: '/backend/microservices/',
    children: ['', 'fundamental-ideas', 'mini-microservice-app']
  },
  {
    text: 'Java',
    collapsible: true,
    icon: 'java',
    prefix: '/backend/java/',
    children: [
      '',
      'maven',
      {
        text: 'Language',
        collapsible: true,
        icon: 'code',
        prefix: 'language/',
        children: [
          '',
          'program-structure',
          'primitive-types',
          'variables-and-operators',
          'string-array',
          'control-flow',
          'methods',
          'classes-and-encapsulation',
          'reference-types',
          'object-contract',
          'static-and-final',
          'inheritance-and-polymorphism',
          'packages-and-imports',
          'composition',
          'abstract-and-interface',
          'enums-and-nested-classes',
          'exceptions',
          'generics',
          'lambda-and-method-references',
          'annotations',
          'records-sealed-patterns'
        ]
      },
      {
        text: 'Standard Library',
        collapsible: true,
        icon: 'library',
        prefix: 'standard-library/',
        children: [
          '',
          'collections-overview',
          'list',
          'set',
          'map',
          'queue-and-deque',
          'iteration-and-comparison',
          'immutable-collections'
        ]
      }
    ]
  },
  {
    text: 'Engineering',
    collapsible: true,
    icon: 'practice',
    prefix: '/backend/engineering/',
    children: [
      '',
      'layered-backend-boundaries',
      'unit-of-work',
      'testing',
      'ci-cd',
      'code-quality'
    ]
  }
]
