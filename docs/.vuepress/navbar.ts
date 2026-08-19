import { navbar } from 'vuepress-theme-hope'

const isProduction = process.env.NODE_ENV === 'production'

export const Navbar = navbar([
  { text: 'Home', link: '/', icon: 'home' },
  { text: 'Languages', link: '/programming-languages/', icon: 'code' },
  { text: 'Frontend', link: '/frontend/', icon: 'Web' },
  { text: 'Backend', link: '/backend/', icon: 'server' },
  {
    text: 'Foundations',
    icon: 'computer',
    children: [
      { text: 'Computer Science', link: '/computer-science/', icon: 'computer' },
      { text: 'Algorithms', link: '/algorithms/', icon: 'suanfa' },
      { text: 'System Design', link: '/system-design/', icon: 'network' },
      { text: 'Architecture', link: '/architecture/', icon: 'structure' }
    ]
  },
  {
    text: 'Engineering',
    icon: 'practice',
    children: [
      { text: 'DevOps', link: '/devops/', icon: 'server' },
      { text: 'Cloud', link: '/cloud/', icon: 'cloud' },
      { text: 'Security', link: '/security/', icon: 'lock' },
      { text: 'Performance', link: '/performance/', icon: 'speed' },
      { text: 'Tools', link: '/tools/', icon: 'tool' }
    ]
  },
  { text: 'AI', link: '/ai/', icon: 'ai' },
  { text: 'Projects', link: '/projects/', icon: 'project' },
  { text: 'Reading', link: '/reading/', icon: 'biji' },
  { text: 'Changelog', link: '/changelog/', icon: 'news' },
  { text: 'TimeLine', link: '/timeline/', icon: 'timeline' }
])
