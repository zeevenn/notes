export default [
  {
    text: 'HTML',
    icon: 'html5',
    collapsible: true,
    link: '/frontend/html/',
    prefix: '/frontend/html/',
    children: [
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
    link: '/frontend/css/',
    prefix: '/frontend/css/',
    children: [
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
    text: 'Browser',
    collapsible: true,
    icon: 'gugeliulanqi',
    link: '/frontend/browser/',
    prefix: '/frontend/browser/',
    children: [
      'url-to-page',
      'v8-engine',
      'memory-management',
      'cross-origin',
      'web-storage',
      'web-worker',
      'service-worker',
      'webassembly',
      'ajax',
      'event-listeners'
    ]
  },
  {
    text: 'React',
    collapsible: true,
    link: '/frontend/react/',
    prefix: '/frontend/react/',
    icon: 'react',
    children: [
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
    link: '/frontend/vue/',
    prefix: '/frontend/vue/',
    icon: 'vue',
    children: [
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
    link: '/frontend/next/',
    prefix: '/frontend/next/',
    icon: 'next-js',
    children: [
      {
        text: 'Pages Router',
        collapsible: true,
        link: 'pages-router/',
        prefix: 'pages-router/',
        icon: 'page-dir',
        children: ['pages-and-layouts']
      }
    ]
  },
  {
    text: 'Pixi',
    collapsible: true,
    link: '/frontend/pixi/',
    prefix: '/frontend/pixi/',
    icon: 'pixi',
    children: ['quick-start', 'architecture-overview', 'render-loop', 'scene-graph']
  },
  {
    text: 'Rendering',
    collapsible: true,
    icon: '7',
    link: '/frontend/rendering/',
    prefix: '/frontend/rendering/',
    children: ['qwik', 'react-server-components', 'resumability-vs-hydration']
  },
  {
    text: 'Engineering',
    collapsible: true,
    icon: 'jiejiangongcheng',
    link: '/frontend/engineering/',
    prefix: '/frontend/engineering/',
    children: [
      {
        text: 'Basic',
        collapsible: true,
        icon: 'config',
        link: 'basic/',
        prefix: 'basic/',
        children: ['tsconfig']
      },
      {
        text: 'Concepts',
        collapsible: true,
        icon: 'basic',
        link: 'concepts/',
        prefix: 'concepts/',
        children: [
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
        link: 'webpack/',
        prefix: 'webpack/',
        icon: 'webpack',
        children: [
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
        link: 'vite/',
        prefix: 'vite/',
        icon: 'vite',
        children: ['getting-started']
      },
      {
        text: 'Rspack',
        collapsible: true,
        link: 'rspack/',
        prefix: 'rspack/',
        icon: 'r-mark',
        children: ['getting-started']
      }
    ]
  },
  {
    text: 'Snippets',
    collapsible: true,
    icon: 'practice',
    link: '/frontend/snippets/',
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
  },
  {
    text: 'Mobile',
    collapsible: true,
    link: '/frontend/mobile/',
    prefix: '/frontend/mobile/',
    children: [
      {
        text: 'React Native 与 Expo',
        collapsible: true,
        link: 'expo/',
        prefix: 'expo/',
        children: []
      }
    ]
  }
]
