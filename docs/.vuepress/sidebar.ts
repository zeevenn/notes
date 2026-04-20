import { algorithms, backend, computerScience, frontend, project, reading, systemDesign } from './sidebar/index'

import { sidebar } from 'vuepress-theme-hope'

const isProduction = process.env.NODE_ENV === 'production'

export const Sidebar = sidebar({
  '/algorithms/': algorithms,
  '/backend/': backend,
  '/computer-science/': computerScience,
  '/frontend/': frontend,
  '/projects/': project,
  '/reading/': reading,
  '/system-design/': systemDesign,
  '/': ['']
})
