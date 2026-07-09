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
          'string-array',
          'control-flow',
          'classes-and-encapsulation',
          'static-and-final',
          'inheritance-and-polymorphism',
          'composition',
          'abstract-and-interface'
        ]
      }
    ]
  },
  {
    text: 'Engineering',
    collapsible: true,
    icon: 'practice',
    prefix: '/backend/engineering/',
    children: ['', 'testing', 'ci-cd', 'code-quality']
  }
]
