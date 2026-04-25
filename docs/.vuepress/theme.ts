import { hopeTheme } from 'vuepress-theme-hope'
import { Navbar } from './navbar.js'
import { Sidebar } from './sidebar.js'

export default hopeTheme(
  {
    hostname: 'https://zeevenn.github.io/notes',

    author: {
      name: 'njr',
      url: 'https://github.com/zeevenn',
      email: 'wzw15292257101@163.com'
    },

    darkmode: 'toggle',

    headerDepth: 3,

    favicon: '/favicon.ico',

    navbar: Navbar,
    sidebar: Sidebar,

    logo: 'avatar.jpeg',
    navbarLayout: {
      start: ['Brand'],
      center: ['Links'],
      end: ['Language', 'Repo', 'Outlook', 'Search']
    },

    iconAssets: '//at.alicdn.com/t/c/font_3926422_vp9y7mmyjy9.css',
    iconPrefix: 'iconfont icon-',

    repo: 'https://github.com/zeevenn/notes',
    docsBranch: 'master',
    docsDir: 'docs',

    pageInfo: [
      'Author',
      'Original',
      'Date',
      'Category',
      'Tag',
      'ReadingTime',
      'Word',
      'PageView'
    ],

    blog: {
      avatar: '/avatar.jpeg',
      roundAvatar: true,
      medias: {
        GitHub: 'https://github.com/dribble-njr',
        JueJin: [
          'https://juejin.cn/user/3553264960014669',
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#1E80FF"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.9933 10.3857H13.9945L16.1122 8.70171L13.9945 7.00237L13.9922 7L11.8781 8.69816L13.9922 10.3845L13.9933 10.3857ZM13.9945 15.6981L13.9956 15.6969L19.4587 11.387L17.9774 10.1972L13.9956 13.3387L13.9945 13.3399L13.9933 13.3411L10.0115 10.1996L8.53143 11.3893L13.9933 15.6993L13.9945 15.6981ZM13.992 18.6441L13.9944 18.6429L21.3084 12.8717L22.7897 14.0615L19.4621 16.6864L13.9944 20.9999L5.3424 14.1777L5.2002 14.0651L6.68149 12.8753L13.992 18.6441Z" fill="white"/></svg>'
        ],
        Email: 'mailto:wzw15292257101@163.com',
        Gmail: 'mailto:wzw15292257101@gmail.com'
      },
      description: '前端开发',
      intro: '/intro.html'
    },

    footer: 'Enquanto houver 1% de chance,teremo 99% fé.',

    displayFooter: true,

    copyright: 'MIT 协议',

    metaLocales: {
      editLink: '在 GitHub 上编辑此页'
    },

    encrypt: {
      admin: '0525',
      config: {
        '/demo/encrypt.html': ['1234'],
        '/zh/demo/encrypt.html': ['1234']
      }
    },

    plugins: {
      blog: {
        excerptLength: 0
      },

      comment: {
        // You should generate and use your own comment service
        provider: 'Giscus',
        repo: 'zeevenn/notes',
        repoId: 'R_kgDOGc6nbw',
        category: 'Announcements',
        categoryId: 'DIC_kwDOGc6nb84CcXd-',
        darkTheme: 'transparent_dark'
      },

      docsearch: {
        // 你的选项
        // appId, apiKey 和 indexName 是必填的
        appId: '087S25VL4O',
        apiKey: 'f2b6c414504143d2399831269d41e2ce',
        indexName: 'dribble-njrio'
      },

      // all features are enabled for demo, only preserve features you need here
      mdEnhance: {
        align: true,
        attrs: true,
        chart: true,
        codetabs: true,
        hint: true,
        demo: true,
        echarts: true,
        figure: true,
        flowchart: true,
        gfm: true,
        tasklist: true,
        imgLazyload: true,
        imgSize: true,
        include: true,
        katex: true,
        mark: true,
        mermaid: true,
        playground: {
          presets: ['ts', 'vue']
        },
        revealJs: {
          plugins: ['highlight', 'math', 'search', 'notes', 'zoom']
        },
        stylize: [
          {
            matcher: 'Recommended',
            replacer: ({ tag }) => {
              if (tag === 'em')
                return {
                  tag: 'Badge',
                  attrs: { type: 'tip' },
                  content: 'Recommended'
                }
            }
          }
        ],
        sub: true,
        sup: true,
        tabs: true,
        vPre: true,
        vuePlayground: true
      },

      feed: {
        atom: true,
        json: true,
        rss: true
      },

      pwa: {
        favicon: '/favicon.ico',
        cacheHTML: true,
        cachePic: true,
        appendBase: true,
        // apple: {
        //   icon: "/assets/icon/apple-icon-152.png",
        //   statusBarColor: "black",
        // },
        // msTile: {
        //   image: "/assets/icon/ms-icon-144.png",
        //   color: "#ffffff",
        // },
        // manifest: {
        //   icons: [
        //     {
        //       src: "/assets/icon/chrome-mask-512.png",
        //       sizes: "512x512",
        //       purpose: "maskable",
        //       type: "image/png",
        //     },
        //     {
        //       src: "/assets/icon/chrome-mask-192.png",
        //       sizes: "192x192",
        //       purpose: "maskable",
        //       type: "image/png",
        //     },
        //     {
        //       src: "/assets/icon/chrome-512.png",
        //       sizes: "512x512",
        //       type: "image/png",
        //     },
        //     {
        //       src: "/assets/icon/chrome-192.png",
        //       sizes: "192x192",
        //       type: "image/png",
        //     },
        //   ],
        //   shortcuts: [
        //     {
        //       name: "Demo",
        //       short_name: "Demo",
        //       url: "/demo/",
        //       icons: [
        //         {
        //           src: "/assets/icon/guide-maskable.png",
        //           sizes: "192x192",
        //           purpose: "maskable",
        //           type: "image/png",
        //         },
        //       ],
        //     },
        //   ],
        // },
        update: 'hint'
      }
    }
  },
  { custom: true }
)
