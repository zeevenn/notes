import { navbar } from 'vuepress-theme-hope'

const isProduction = process.env.NODE_ENV === 'production'

export const Navbar = navbar([
  { text: 'Home', link: '/', icon: 'home' },
  { text: 'Frontend', link: '/frontend/', icon: 'Web' },
  { text: 'Algorithms', link: '/algorithms/', icon: 'suanfa' },
  { text: 'System Design', link: '/system-design/', icon: 'network' },
  { text: 'Computer Science', link: '/computer-science/', icon: 'computer' },
  { text: 'Backend', link: '/backend/', icon: 'server' },
  { text: 'Projects', link: '/projects/', icon: 'project' },
  { text: 'Reading', link: '/reading/', icon: 'biji' },
  { text: 'Changelog', link: '/changelog/', icon: 'news' },
  { text: 'TimeLine', link: '/timeline/', icon: 'timeline' }
])
