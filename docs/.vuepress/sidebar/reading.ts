export default [
  {
    text: 'Pro Git',
    icon: 'git',
    collapsible: true,
    prefix: '/reading/books/pro-git/',
    children: [
      '',
      '01-getting-started',
      '02-git-basics',
      '03-branching',
      '04-git-server',
      '05-rewriting-history'
    ]
  },
  {
    text: 'The Pragmatic Programmer',
    icon: 'meditation',
    collapsible: true,
    prefix: '/reading/books/pragmatic-programmer/',
    children: [
      '',
      '01-a-pragmatic-philosophy',
      '02-a-pragmatic-approach',
      '03-basic-tool',
      '04-pragmatic-paranoid',
      '05-work-around',
      '06-concurrent',
      '07-when-coding',
      '08-before-start-project',
      '09-pragmatic-project'
    ]
  },
  {
    text: 'Patterns',
    icon: 'shejimoshi',
    collapsible: true,
    prefix: '/reading/patterns/',
    children: [
      {
        text: 'Vanilla',
        collapsible: true,
        prefix: 'vanilla/',
        icon: 'js',
        children: [
          '',
          '01-command-pattern',
          '02-factory-pattern',
          '03-flyweight-pattern',
          '04-mediator-pattern',
          '05-middleware-pattern',
          '06-mixin-pattern',
          '07-module-pattern',
          '08-observer-pattern',
          '09-prototype-pattern',
          '10-singleton-pattern'
        ]
      },
      {
        text: 'React',
        collapsible: true,
        prefix: 'react/',
        icon: 'react',
        children: ['01-provider-pattern']
      }
    ]
  }
]
