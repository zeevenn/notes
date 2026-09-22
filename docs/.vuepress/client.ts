import { defineClientConfig } from 'vuepress/client'
import PagefindSearch from './components/PagefindSearch.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('SearchBox', PagefindSearch)
  }
})
