export default [
  {
    text: 'JavaScript',
    collapsible: true,
    icon: 'js',
    prefix: '/programming-languages/javascript/',
    children: [
      '',
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
    prefix: '/programming-languages/java/',
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
  }
]
