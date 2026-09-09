export default [
  {
    text: 'Pro Git',
    icon: 'git',
    collapsible: true,
    link: '/reading/books/pro-git/',
    prefix: '/reading/books/pro-git/',
    children: [
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
    link: '/reading/books/pragmatic-programmer/',
    prefix: '/reading/books/pragmatic-programmer/',
    children: [
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
    link: '/reading/patterns/',
    prefix: '/reading/patterns/',
    children: [
      {
        text: 'Vanilla',
        collapsible: true,
        link: 'vanilla/',
        prefix: 'vanilla/',
        icon: 'js',
        children: [
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
    link: 'react/',
    prefix: 'react/',
    icon: 'react',
    children: ['provider-pattern']
  }
    ]
  }
]
