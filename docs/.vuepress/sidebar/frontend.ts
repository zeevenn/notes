export default [
  {
    text: 'HTML',
    icon: 'html5',
    collapsible: true,
    prefix: '/frontend/html/',
    children: [
      '',
      '01-html-history',
      '02-quick-start',
      '03-doctype',
      '04-common-elements',
      '05-advanced-elements',
      '06-semantic-tags',
      '07-media-tags',
      '08-canvas-and-svg',
      '09-src-vs-href',
      '10-html5-features',
      '11-defer-vs-async',
      '12-form-validation',
      '13-seo-basics',
      '14-websocket',
      '15-web-storage',
      '16-web-worker'
    ]
  },
  {
    text: 'CSS',
    icon: 'css3',
    collapsible: true,
    prefix: '/frontend/css/',
    children: [
      '',
      '01-quick-start',
      '02-selectors',
      '03-box-model',
      '04-text-and-font',
      '05-cascade-and-inheritance',
      '06-background-and-border',
      '07-position',
      '08-float',
      '09-flexbox',
      '10-units',
      '11-centering',
      '12-grid',
      '13-bfc',
      '14-responsive-intro',
      '15-responsive-techniques',
      '16-responsive-implementation',
      '17-loading-spinner',
      '18-autofill-styling'
    ]
  },
  {
    text: 'JavaScript',
    icon: 'js',
    collapsible: true,
    prefix: '/frontend/javascript/',
    children: [
      '',
      '01-var-let-const',
      '02-data-types',
      '03-type-checking',
      '04-primitive-vs-reference',
      '05-execution-context',
      '06-type-conversion-methods',
      '07-basic-reference-types',
      '08-collection-types',
      '09-array-like-objects',
      '10-object-properties',
      '11-creating-objects',
      '12-inheritance',
      '13-class',
      '14-implement-new',
      '15-functions',
      '16-this-binding',
      '17-implement-call-apply-bind',
      '18-event-listeners',
      '19-object-equality',
      '20-ajax',
      '21-shallow-deep-copy',
      '22-event-loop'
    ]
  },
  {
    text: 'Browser',
    collapsible: true,
    icon: 'gugeliulanqi',
    prefix: '/frontend/browser/',
    children: [
      '',
      '01-rendering-pipeline',
      '02-v8-engine',
      '03-memory-management',
      '04-cross-origin',
      '05-url-to-page'
    ]
  },
  {
    text: 'React',
    collapsible: true,
    prefix: '/frontend/react/',
    icon: 'react',
    children: [
      '',
      '01-fundamentals',
      '02-use-state',
      '03-use-effect',
      '04-use-ref',
      '05-use-id',
      '06-use-reducer',
      '07-create-portal',
      '08-use-imperative-handle',
      '09-flush-sync',
      '10-use-sync-external-store',
      '11-suspense',
      '12-use-transition',
      '13-use-optimistic',
      '14-use-deferred-value',
      '15-use-memo-callback-memo'
    ]
  },
  {
    text: 'Vue',
    collapsible: true,
    prefix: '/frontend/vue/',
    icon: 'vue',
    children: [
      '',
      '01-parent-child-communication',
      '02-provide-inject',
      '03-vuex-internals',
      '04-slots',
      '05-dynamic-async-components',
      '06-v-model-on-components',
      '07-mixins',
      '08-composition-api',
      '09-composables',
      '10-custom-directives',
      '11-plugins'
    ]
  },
  {
    text: 'Next.js',
    collapsible: true,
    prefix: '/frontend/next/',
    icon: 'next-js',
    children: [
      {
        text: 'Pages Router',
        collapsible: true,
        prefix: 'pages-router/',
        icon: 'page-dir',
        children: ['01-pages-and-layouts']
      }
    ]
  },
  {
    text: 'Pixi',
    collapsible: true,
    prefix: '/frontend/pixi/',
    icon: 'pixi',
    children: ['', '01-quick-start', '02-architecture-overview', '03-render-loop', '04-scene-graph']
  },
  {
    text: 'Chakra UI',
    collapsible: true,
    prefix: '/frontend/chakra/',
    icon: 'chakra',
    children: ['', '01-getting-started', '02-style-props']
  },
  {
    text: 'Rendering',
    collapsible: true,
    icon: '7',
    prefix: '/frontend/rendering/',
    children: ['', '01-qwik', '02-react-server-components', '03-resumability-vs-hydration']
  },
  {
    text: 'Engineering',
    collapsible: true,
    icon: 'jiejiangongcheng',
    prefix: '/frontend/engineering/',
    children: [
      {
        text: 'Concepts',
        collapsible: true,
        icon: 'basic',
        prefix: 'concepts/',
        children: [
          '01-modularization',
          '02-package-managers',
          '03-toolchain-overview',
          '04-project-standards',
          '05-scaffolding-yeoman',
          '06-fnm-nvm',
          '07-fnm-global-modules'
        ]
      },
      {
        text: 'Webpack',
        collapsible: true,
        prefix: 'webpack/',
        icon: 'webpack',
        children: [
          '01-basics',
          '02-css-handling',
          '03-asset-handling',
          '04-plugins',
          '05-babel-integration',
          '06-vue-integration',
          '07-dev-server',
          '08-resolve-config',
          '09-env-splitting'
        ]
      },
      {
        text: 'Vite',
        collapsible: true,
        prefix: 'vite/',
        icon: 'vite',
        children: ['01-getting-started']
      },
      {
        text: 'Rspack',
        collapsible: true,
        prefix: 'rspack/',
        icon: 'r-mark',
        children: ['01-getting-started']
      }
    ]
  },
  {
    text: 'Snippets',
    collapsible: true,
    icon: 'practice',
    prefix: '/frontend/snippets/',
    children: [
      '01-dnd-kit',
      '02-canvas-annotation',
      '03-file-upload',
      '04-global-upload',
      '05-mobile-viewport-adaptation',
      '06-svg-signature-animation',
      '07-highcharts-client-export',
      '08-antd-textarea-multiline-placeholder',
      '09-auto-switch-node-version',
      '10-rest-client-localhost-debug',
      '11-whistle-mobile-debug',
      '12-monaco-editor-react',
      '13-ios-touch-prevention',
      '14-ios-image-compat',
      '15-videojs-component-guide',
      '16-wechat-video-preload'
    ]
  }
]
