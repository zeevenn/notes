export default [
  {
    text: 'Pro Git',
    icon: 'git',
    collapsible: true,
    prefix: '/reading/books/pro-git/',
    children: [
      '',
      'getting-started',
      'git-basics',
      'branching',
      'git-server',
      'rewriting-history'
    ]
  },
  {
    text: 'The Pragmatic Programmer',
    icon: 'meditation',
    collapsible: true,
    prefix: '/reading/books/pragmatic-programmer/',
    children: [
      '',
      'a-pragmatic-philosophy',
      'a-pragmatic-approach',
      'basic-tool',
      'pragmatic-paranoid',
      'work-around',
      'concurrent',
      'when-coding',
      'before-start-project',
      'pragmatic-project'
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
          'command-pattern',
          'factory-pattern',
          'flyweight-pattern',
          'mediator-pattern',
          'middleware-pattern',
          'mixin-pattern',
          'module-pattern',
          'observer-pattern',
          'prototype-pattern',
          'singleton-pattern'
        ]
      },
      {
        text: 'React',
    collapsible: true,
    prefix: 'react/',
    icon: 'react',
    children: ['', 'provider-pattern']
  }
    ]
  }
]
