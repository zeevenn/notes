import { ai, algorithms, backend, computerScience, frontend, project, reading, security, systemDesign } from './sidebar/index'

import { sidebar } from 'vuepress-theme-hope'

const isProduction = process.env.NODE_ENV === 'production'

export const Sidebar = sidebar({
  '/ai/': ai,
  '/algorithms/': algorithms,
  '/backend/': backend,
  '/computer-science/': computerScience,
  '/frontend/': frontend,
  '/projects/': project,
  '/reading/': reading,
  '/security/': security,
  '/system-design/': systemDesign,
  '/': ['']
})
