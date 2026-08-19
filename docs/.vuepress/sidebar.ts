import {
  ai,
  algorithms,
  architecture,
  backend,
  computerScience,
  devops,
  frontend,
  programmingLanguages,
  project,
  reading,
  security,
  systemDesign
} from './sidebar/index'

import { sidebar } from 'vuepress-theme-hope'

const isProduction = process.env.NODE_ENV === 'production'

export const Sidebar = sidebar({
  '/ai/': ai,
  '/algorithms/': algorithms,
  '/architecture/': architecture,
  '/backend/': backend,
  '/computer-science/': computerScience,
  '/devops/': devops,
  '/frontend/': frontend,
  '/programming-languages/': programmingLanguages,
  '/projects/': project,
  '/reading/': reading,
  '/security/': security,
  '/system-design/': systemDesign,
  '/': ['']
})
