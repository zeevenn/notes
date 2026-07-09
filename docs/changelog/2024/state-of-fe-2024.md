---
title: 2024 前端生态报告
date: 2024-12-29
icon: 2024
category: news
---

最近，tsh.io 发布了一份关于 2024 年 [前端生态的报告](https://tsh.io/state-of-frontend/)，其中包含了一些有趣的数据和趋势。

## 框架

### 前端框架

![过去一年使用的框架](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241230124159.png)

1. React 和 Vue.js 在使用率和喜爱度上表现出色，仍是市场的主流选择。
2. Svelte 和 HTMX 展现出很高的学习兴趣，可能在未来成为更加流行的选择。
3. Angular 系列 虽然仍有稳定的用户基础，但学习兴趣较低。
4. 新兴框架（如 Qwik、Lit）显示了潜在的增长空间，但需要更多的推广和生态完善。
5. 边缘化框架（如 Ember、Phoenix）用户基础薄弱，未来可能逐渐退出主流市场。

### 渲染框架

![过去一年使用的渲染框架](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241230124811.png)

1. Next.js 依然是前端开发的首选工具，拥有极高的用户满意度和市场接受度。
2. Astro 和 SvelteKit 的学习意向很高，特别是 SvelteKit，未来可能成为新兴热点。
3. Nuxt 在 Vue.js 生态中表现稳定，但在整体市场上学习意向稍逊于 SvelteKit 和 Astro。
4. Remix 虽然用户群较小，但学习意向表明其潜在发展前景广阔。
5. Gatsby 的热度和满意度明显下降，可能难以保持市场竞争力。
6. Docusaurus 的关注度较低，但在特定领域（文档生成）仍有一席之地。

## 库

### 验证库

![过去一年使用的验证库](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241230125532.png)

1. Zod 是当前最受欢迎的工具，使用率高，评价好，并且对未来用户有较大吸引力。
2. 传统工具如 Joi 和 Yup 依然有一定的用户基础，但 Yup 在学习意向上表现更强。
3. 新兴工具如 Valibot 开始受到关注，但目前影响力有限。
4. 特定生态的工具如 Ajv 和 class-validator 主要用于特殊场景，使用范围较小。

### 日期管理库

![过去一年使用的日期管理库](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231172109.png)

总结

1. 最受欢迎：date-fns 是当前的主流选择，其功能全面且模块化设计深受开发者喜爱。
2. Moment 的余热：尽管官方不再推荐，但 Moment 依然有广泛的用户基础，但其负面评价也较多。
3. 轻量替代品：Day.js 提供了类似 Moment 的 API，同时更加轻量，逐渐受到开发者青睐。
4. 新兴工具：Luxon 功能强大，学习意愿高，但目前尚未被广泛采用。
5. 关注度较低的工具：Date.js 和 Luxon 在无意见比例上排名靠前，说明它们的市场影响力较低。

建议：

1. 如果项目需要模块化和高性能，可以选择 date-fns。
2. 如果倾向于轻量级解决方案，Day.js 是不错的选择。
3. 对于需要处理复杂国际化或时区功能的场景，可以考虑学习 Luxon。

### 状态管理库

![过去一年使用的状态管理库](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231172832.png)

1. 流行趋势：React Context API 是目前最受欢迎的简单状态管理工具，Redux Toolkit 和 Zustand 是复杂场景中更现代化的选择。
2. 工具定位：
   - Redux 和 Redux Toolkit 适合复杂场景，但 Toolkit 更适合现代开发。
   - React Context API 和 Zustand 是轻量场景的热门选择。
   - Vue 社区用户倾向于 Pinia。
3. 新兴工具：Zustand 和 Jotai 等轻量级库越来越受到关注，但 Jotai 目前的社区影响力较弱。

### 工具库

![过去一年使用的其他工具库](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231173312.png)

1. 流行工具：Lodash 是最受欢迎的工具库，功能丰富且应用场景广泛。
2. 过时工具：jQuery 和 Underscore 的使用率下降，更多用户转向现代工具。
3. 新兴工具：Immer 和 Ramda 的用户群体较小，但对特定需求的开发者可能有吸引力。
4. 特定领域工具：RxJS 在响应式编程中有较高认可度，但学习曲线限制了它的普及。

## 数据请求库

![过去一年使用的数据请求库](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231174531.png)

1. 主流工具：Axios 和 Native Fetch 是最受欢迎的工具，分别占据了 73.6% 和 72.4% 的「Used and liked」。
2. 新兴趋势：tRPC 和 TanStack Query 逐渐受到关注，尤其是 tRPC 的未来学习兴趣高达 29.8%。
3. 小众工具：ky 和 ApolloClient 虽然功能强大，但在用户中的使用率较低。
4. 有潜力的工具：SWR 和 TanStack Query 在 React 生态中有较大潜力。

## 托管平台

![过去一年使用的托管平台](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231174959.png)

Vercel, AWS and… Netlify 是目前最受欢迎的云托管平台。也有很大一部分人使用自己的服务器。

## CI（持续集成）

![是否使用 CI 工具](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231175544.png)

![过去一年使用的 CI 工具](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231175156.png)

对于独立开发者来说，使用 GitHub Actions 是最佳选择。

若想要独立的 CI/CD 平台，可以选择使用 Jenkins 或者 GitLab CI 提供的自托管替代方案。

## 微前端

![是否使用微前端](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231175653.png)

采用率从 2022 年报告使用微前端的受访者中 75.4% 显著下降至 2024 年的 23.6%。这一急剧下降表明行业在前端架构方面的转变。

许多人意识到微前端不仅需要技术知识，还需要组织和文化的变革，而他们并未做好准备。另一个关键因素是对服务器端渲染（SSR）和静态网站生成（SSG）架构的投资不断增加，这些架构包含类似的概念。

![过去一年使用的微前端解决方案](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231175714.png)

1. 主流工具：Webpack 5 Module Federation 和 Single SPA 是微前端领域的两大主流解决方案，分别占据了 51.8% 和 35.5% 的比例。
2. 次主流工具：Open Components、SystemJS 和 Bit 在特定场景下有一定用户基础，但市场占比明显低于前两者。
3. 小众工具：Qiankun、Luigi 和 Piral 等工具的使用比例较低，但在特定社区和应用场景中仍有价值。
4. 创新空间："Other" 类别显示了开发者在微前端领域的多样化尝试，可能包括定制解决方案或尚未普及的新工具。

## 包管理器

![过去一年使用的包管理器](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231180850.png)

## JavaScript 运行时

![过去一年使用的 JavaScript 运行时](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231181012.png)

Node: 稳定、生态丰富、社区活跃。

然而，其他 JavaScript 运行时，如 Bun（10%）和 Deno（2.6%），开始开辟自己的市场。

Bun 作为领先替代品的地位值得注意。它专注于其惊人的速度和几乎完全的 Node.js 兼容性，尽管还未达到 100%。Bun 还引入了内置包管理器、原生 TypeScript 和 JSX 支持以及独特的 API。

Deno 由 Ryan Dahl（Node.js 的原始开发者）创建，走上了与 Bun 类似的道路。尽管其最初通过 URL 导入依赖项的方法可能减缓了采用速度，但 Deno 推出其包注册表 JSR（npm 的替代品）标志着战略转变。随着 Deno2 的到来，观察它如何发展以及社区的反应将会很有趣。

## TypeScript

![过去一年使用的类型工具](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231182827.png)

![2024 与 2022 年相比更多人使用 TypeScript](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231182909.png)

## 浏览器技术

![过去一年使用的浏览器技术](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231183301.png)

## PWA（渐进式 Web 应用）

![是否使用 PWA](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231183531.png)

![PWA 的未来](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231183453.png)

## 设计系统

![最喜欢的设计系统排名](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231183550.png)

![过去一年使用的设计交接工具](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231183659.png)

## Style 工具

![过去一年使用的 Style 工具](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231183814.png)

## 测试

![团队中谁负责测试](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231183955.png)

![软件测试类型](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184037.png)

![过去一年使用的测试工具](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184104.png)

## 代码管理

![最喜欢的代码编辑器](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184146.png)

![最喜欢的浏览器代码编辑器](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184208.png)

![版本控制](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184301.png)

## 低代码/无代码

![low-code 平台](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184344.png)

![no-code 平台](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184409.png)

## 构建工具

![过去一年使用的构建工具](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184501.png)

![lint 工具](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184537.png)

![网页构建工具](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184607.png)

## 操作系统

![操作系统](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184634.png)

## AI 工具

![AI 工具](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184727.png)

## 未来趋势

![未来趋势](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241231184836.png)
