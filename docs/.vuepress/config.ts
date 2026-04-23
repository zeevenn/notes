import { getDirname, path } from '@vuepress/utils'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import orderedHeader from 'vuepress-plugin-ordered-header'
import theme from './theme.ts'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
  base: '/notes/',
  lang: 'zh-CN',
  description: 'Personal frontend knowledge base',
  theme,

  alias: {
    '@theme-hope/modules/navbar/components/NavbarBrand': path.resolve(__dirname, './components/NavLogo.vue')
  },

  plugins: [orderedHeader],

  markdown: {
    headers: {
      level: [2, 3, 4]
    }
  },

  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {}
  }),

  // Enable it with pwa
  shouldPrefetch: false
})
