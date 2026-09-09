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
        text: 'Maven',
        collapsible: true,
        icon: 'Maven',
        link: 'maven/',
        prefix: 'maven/',
        children: [
          'lifecycle-and-plugins',
          'dependency-management',
          'pom-and-inheritance',
          'multi-module-builds',
          'repositories-and-settings',
          'troubleshooting',
          'ci-and-reproducible-builds'
        ]
      },
      {
        text: 'Language',
        collapsible: true,
        icon: 'code',
        link: 'language/',
        prefix: 'language/',
        children: [
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
        link: 'standard-library/',
        prefix: 'standard-library/',
        children: [
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
