export default [
  {
    text: 'HTML',
    icon: 'html5',
    collapsible: true,
    prefix: '/frontend/html/',
    children: [
      '',
      'src-vs-href',
      'defer-async-module',
      'meta-tags',
      'img-srcset',
      'iframe',
      'canvas-vs-svg',
      'preload-prefetch-preconnect',
      'font-loading'
    ]
  },
  {
    text: 'CSS',
    icon: 'css3',
    collapsible: true,
    prefix: '/frontend/css/',
    children: [
      '',
      'selectors',
      'box-model',
      'text-and-font',
      'cascade-and-inheritance',
      'background-and-border',
      'position',
      'float',
      'flexbox',
      'units',
      'centering',
      'grid',
      'bfc',
      'responsive-intro',
      'responsive-techniques',
      'variables',
      'transitions',
      'transforms',
      'animations',
      'stacking-context',
      'modern-css',
      'will-change-and-compositing',
      'containment'
    ]
  },
  {
    text: 'JavaScript',
    icon: 'js',
    collapsible: true,
    prefix: '/frontend/javascript/',
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
      'event-listeners',
      'object-equality',
      'ajax',
      'shallow-deep-copy',
      'event-loop'
    ]
  },
  {
    text: 'Browser',
    collapsible: true,
    icon: 'gugeliulanqi',
    prefix: '/frontend/browser/',
    children: [
      '',
      'rendering-pipeline',
      'v8-engine',
      'memory-management',
      'cross-origin',
      'url-to-page',
      'web-storage',
      'web-worker',
      'service-worker'
    ]
  },
  {
    text: 'React',
    collapsible: true,
    prefix: '/frontend/react/',
    icon: 'react',
    children: [
      '',
      'fundamentals',
      'use-state',
      'use-effect',
      'use-ref',
      'use-id',
      'use-reducer',
      'create-portal',
      'use-imperative-handle',
      'flush-sync',
      'use-sync-external-store',
      'suspense',
      'use-transition',
      'use-optimistic',
      'use-deferred-value',
      'use-memo-callback-memo'
    ]
  },
  {
    text: 'Vue',
    collapsible: true,
    prefix: '/frontend/vue/',
    icon: 'vue',
    children: [
      '',
      'parent-child-communication',
      'provide-inject',
      'vuex-internals',
      'slots',
      'dynamic-async-components',
      'v-model-on-components',
      'mixins',
      'composition-api',
      'composables',
      'custom-directives',
      'plugins'
    ]
  },
  {
    text: 'Next.js',
    collapsible: true,
    prefix: '/frontend/next/',
    icon: 'next-js',
    children: [
      '',
      {
        text: 'Pages Router',
        collapsible: true,
        prefix: 'pages-router/',
        icon: 'page-dir',
        children: ['', 'pages-and-layouts']
      }
    ]
  },
  {
    text: 'Pixi',
    collapsible: true,
    prefix: '/frontend/pixi/',
    icon: 'pixi',
    children: ['', 'quick-start', 'architecture-overview', 'render-loop', 'scene-graph']
  },
  {
    text: 'Rendering',
    collapsible: true,
    icon: '7',
    prefix: '/frontend/rendering/',
    children: ['', 'qwik', 'react-server-components', 'resumability-vs-hydration']
  },
  {
    text: 'Engineering',
    collapsible: true,
    icon: 'jiejiangongcheng',
    prefix: '/frontend/engineering/',
    children: [
      {
        text: 'Basic',
        collapsible: true,
        icon: 'config',
        prefix: 'basic/',
        children: ['', 'tsconfig']
      },
      {
        text: 'Concepts',
        collapsible: true,
        icon: 'basic',
        prefix: 'concepts/',
        children: [
          '',
          'modularization',
          'package-managers',
          'toolchain-overview',
          'project-standards',
          'scaffolding-yeoman',
          'fnm-nvm',
          'fnm-global-modules',
          'env',
          'node-config-vs-dotenv'
        ]
      },
      {
        text: 'Webpack',
        collapsible: true,
        prefix: 'webpack/',
        icon: 'webpack',
        children: [
          '',
          'basics',
          'css-handling',
          'asset-handling',
          'plugins',
          'babel-integration',
          'vue-integration',
          'dev-server',
          'resolve-config',
          'env-splitting'
        ]
      },
      {
        text: 'Vite',
        collapsible: true,
        prefix: 'vite/',
        icon: 'vite',
        children: ['', 'getting-started']
      },
      {
        text: 'Rspack',
        collapsible: true,
        prefix: 'rspack/',
        icon: 'r-mark',
        children: ['', 'getting-started']
      }
    ]
  },
  {
    text: 'Snippets',
    collapsible: true,
    icon: 'practice',
    prefix: '/frontend/snippets/',
    children: [
      'dnd-kit',
      'canvas-annotation',
      'file-upload',
      'global-upload',
      'mobile-viewport-adaptation',
      'svg-signature-animation',
      'highcharts-client-export',
      'antd-textarea-multiline-placeholder',
      'auto-switch-node-version',
      'rest-client-localhost-debug',
      'whistle-mobile-debug',
      'monaco-editor-react',
      'ios-touch-prevention',
      'ios-image-compat',
      'videojs-component-guide',
      'wechat-video-preload'
    ]
  }
]
