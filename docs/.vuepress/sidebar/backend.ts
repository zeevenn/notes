export default [
  {
    text: 'Linux',
    collapsible: true,
    icon: 'linux',
    prefix: '/backend/linux/',
    children: [
      '01-set-the-ssh',
      '02-build-git-server',
      '03-configure-bt',
      '04-automated-deployment',
      '05-install-docker',
      '06-server-proxy'
    ]
  },
  {
    text: 'Database',
    collapsible: true,
    icon: 'database',
    prefix: '/backend/database/',
    children: [
      {
        text: 'Fundamentals',
        collapsible: true,
        icon: 'basic',
        prefix: 'fundamentals/',
        children: ['01-hello-database', '02-relation-model', '03-db-design', '04-advanced-db-model']
      },
      {
        text: 'MySQL',
        collapsible: true,
        icon: 'mysql',
        prefix: 'mysql/',
        children: ['01-install-mysql']
      },
      {
        text: 'SQL',
        collapsible: true,
        icon: 'sql',
        prefix: 'sql/',
        children: ['01-quick-start']
      }
    ]
  },
  {
    text: 'Node',
    collapsible: true,
    icon: 'nodejs',
    prefix: '/backend/node/',
    children: [
      {
        text: 'Express',
        collapsible: true,
        icon: 'express',
        prefix: 'express/',
        children: ['01-overview-architecture', '02-express.js']
      },
      {
        text: 'Prisma',
        collapsible: true,
        icon: 'prisma',
        prefix: 'prisma/',
        children: ['', '01-quick-start']
      },
      {
        text: 'Modules',
        collapsible: true,
        icon: 'npm',
        prefix: 'modules/',
        children: ['01-module-system']
      },
      {
        text: 'Module',
        collapsible: true,
        icon: 'npm',
        prefix: 'module/',
        children: ['01-finalhandler']
      },
      '01-turso-prisma-integration'
    ]
  },
  {
    text: 'Microservices',
    collapsible: true,
    icon: 'microservices',
    prefix: '/backend/microservices/',
    children: ['01-fundamental-ideas', '02-mini-microservice-app']
  },
  {
    text: 'Java',
    collapsible: true,
    icon: 'java',
    prefix: '/backend/java/',
    children: ['01-maven']
  },
  {
    text: 'Engineering',
    collapsible: true,
    icon: 'practice',
    prefix: '/backend/engineering/',
    children: ['', '01-testing', '02-ci-cd', '03-code-quality']
  }
]
