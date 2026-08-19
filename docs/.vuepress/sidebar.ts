import {
  ai,
  algorithms,
  architecture,
  backend,
  changelog,
  cloud,
  computerScience,
  devops,
  frontend,
  performance,
  programmingLanguages,
  project,
  reading,
  security,
  systemDesign,
  tools
} from './sidebar/index'

import { sidebar } from 'vuepress-theme-hope'

const isProduction = process.env.NODE_ENV === 'production'

export const Sidebar = sidebar({
  '/ai/': ai,
  '/algorithms/': algorithms,
  '/architecture/': architecture,
  '/backend/': backend,
  '/changelog/': changelog,
  '/cloud/': cloud,
  '/computer-science/': computerScience,
  '/devops/': devops,
  '/frontend/': frontend,
  '/performance/': performance,
  '/programming-languages/': programmingLanguages,
  '/projects/': project,
  '/reading/': reading,
  '/security/': security,
  '/system-design/': systemDesign,
  '/tools/': tools,
  '/': ['']
})
