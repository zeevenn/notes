export default [
  {
    text: 'JavaScript',
    collapsible: true,
    icon: 'js',
    link: '/programming-languages/javascript/',
    prefix: '/programming-languages/javascript/',
    children: [
      'var-let-const',
      'data-types',
      'type-checking',
      'primitive-vs-reference',
      'execution-context',
      'type-conversion-methods',
      'basic-reference-types',
      'collection-types',
      'array-like-objects',
      'object-properties',
      'prototype-chain',
      'creating-objects',
      'inheritance',
      'class',
      'implement-new',
      'functions',
      'this-binding',
      'implement-call-apply-bind',
      'object-equality',
      'shallow-deep-copy',
      'event-loop'
    ]
  },
  {
    text: 'Java',
    collapsible: true,
    icon: 'java',
    link: '/programming-languages/java/',
    prefix: '/programming-languages/java/',
    children: [
      {
        text: '语言基础',
        collapsible: true,
        icon: 'code',
        link: 'language/',
        prefix: 'language/',
        children: [
          {
            text: '基础语法',
            collapsible: true,
            children: [
              'program-structure',
              'variables',
              'primitive-types',
              'string',
              'operators-and-expressions',
              'control-flow',
              'arrays'
            ]
          },
          {
            text: '面向对象',
            collapsible: true,
            children: [
              'classes-and-objects',
              'reference-types',
              'methods',
              'constructors-and-this',
              'packages-and-imports',
              'encapsulation-and-access',
              'inheritance',
              'polymorphism',
              'object-contract',
              'static-and-final',
              'initialization',
              'abstract-and-interface',
              'composition'
            ]
          },
          {
            text: '类型声明与建模',
            collapsible: true,
            children: [
              'nested-classes',
              'enums',
              'records',
              'sealed-types'
            ]
          },
          {
            text: '语言机制',
            collapsible: true,
            children: [
              'exceptions',
              'thread-basics',
              'generics',
              'lambda-and-method-references',
              'pattern-matching',
              'reflection',
              'annotations',
              'proxies'
            ]
          }
        ]
      },
      {
        text: '标准库',
        collapsible: true,
        icon: 'library',
        link: 'standard-library/',
        prefix: 'standard-library/',
        children: [
          {
            text: '常用类',
            collapsible: true,
            children: ['wrapper-classes']
          },
          {
            text: '集合框架',
            collapsible: true,
            link: 'collections/',
            prefix: 'collections/',
            children: [
              'list',
              'set',
              'map',
              'queue-and-deque',
              'iteration-and-comparison',
              'stream-processing',
              'immutable-collections'
            ]
          },
          'file-io',
          {
            text: '实现原理',
            collapsible: true,
            children: ['string-internals']
          }
        ]
      }
    ]
  }
]
