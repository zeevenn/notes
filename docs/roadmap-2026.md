# 六个月成长计划 · 2026

> 时间跨度：2026.04 – 2026.10
> 三线并行：博客迁移 · reReact Fiber · RN 音乐库
> 面试备战：Month 3 起叠加算法 + 系统设计

---

## 技术选型备忘

| 项目     | 技术栈                                             |
| -------- | -------------------------------------------------- |
| 知识博客 | Next.js App Router + MDX + Tailwind + shadcn/ui    |
| 关系图谱 | react-force-graph（基于 frontmatter `links` 字段） |
| 静态搜索 | Pagefind                                           |
| 标签系统 | frontmatter `tags: []` + 全局标签索引页            |
| 部署     | Vercel + GitHub Actions                            |

---

## 主动学习轮转表

> 每周固定 2–3 小时，独立于项目之外。按优先级排序，P0 最先，P3 靠后或视时间取舍。

| 周次 | 优先级 | 主题方向                                                 | 目标目录                                  |
| ---- | ------ | -------------------------------------------------------- | ----------------------------------------- |
| W1   | P0     | JavaScript：原型链、继承、闭包                           | `docs/frontend/javascript/`               |
| W2   | P0     | JavaScript：this 绑定、执行上下文、作用域                | `docs/frontend/javascript/`               |
| W3   | P0     | JavaScript：异步模型、Event Loop、Promise/async          | `docs/frontend/javascript/`               |
| W4   | P0     | JavaScript：深拷贝、类型系统、手写题汇总                 | `docs/frontend/javascript/`               |
| W5   | P0     | 浏览器：渲染流程（Parse/Style/Layout/Paint/Composite）   | `docs/frontend/browser/`                  |
| W6   | P0     | 浏览器：V8 引擎、内存管理、垃圾回收                      | `docs/frontend/browser/`                  |
| W7   | P0     | 计算机网络：HTTP/1.1、HTTP/2、HTTP/3、HTTPS              | `docs/computer-science/networking/`       |
| W8   | P0     | 计算机网络：TCP 握手挥手、可靠传输、拥塞控制             | `docs/computer-science/networking/`       |
| W9   | P0     | 系统设计基础：可扩展性、CAP、负载均衡                    | `docs/system-design/fundamentals/`        |
| W10  | P0     | 系统设计基础：缓存策略、数据库分片                       | `docs/system-design/fundamentals/`        |
| W11  | P1     | CSS：BFC、层叠上下文、position、z-index                  | `docs/frontend/css/`                      |
| W12  | P1     | CSS：Flex/Grid 深度、响应式、动画性能                    | `docs/frontend/css/`                      |
| W13  | P1     | TypeScript：泛型、条件类型、infer、Mapped Types          | `docs/frontend/typescript/`               |
| W14  | P1     | TypeScript：工具类型、声明文件、工程实践                 | `docs/frontend/typescript/`               |
| W15  | P1     | 数据库：SQL 基础、事务、ACID、隔离级别                   | `docs/backend/database/`                  |
| W16  | P1     | 数据库：索引原理（B+ 树）、EXPLAIN、慢查询优化           | `docs/backend/database/`                  |
| W17  | P1     | Redis：数据结构、持久化、缓存穿透/雪崩/击穿              | `docs/backend/redis/`                     |
| W18  | P1     | 认证鉴权：JWT、OAuth2 授权码流程、SSO                    | `docs/security/auth/`                     |
| W19  | P1     | 设计模式：创建型（单例、工厂、建造者）                   | `docs/architecture/design-patterns/`      |
| W20  | P1     | 设计模式：结构型 + 行为型（代理、观察者、策略）          | `docs/architecture/design-patterns/`      |
| W21  | P2     | 操作系统：进程/线程/协程、锁与死锁                       | `docs/computer-science/concurrency/`      |
| W22  | P2     | 操作系统：内存管理、IO 模型（阻塞/多路复用/异步）        | `docs/computer-science/operating-system/` |
| W23  | P2     | 消息队列：Kafka 核心概念 + API 设计（REST/GraphQL/gRPC） | `docs/backend/message-queue/`             |
| W24  | P2     | DevOps：Docker + CI/CD 实践                              | `docs/devops/`                            |
| W25  | P2     | 性能优化：前端指标（CWV）+ 后端性能 + 网络优化           | `docs/performance/`                       |
| W26  | P3     | 架构进阶：Clean Architecture、DDD、事件驱动              | `docs/architecture/`                      |

---

## Month 1 · 三线启动

> Apr 21 – May 31

### W1 · Apr 21–27

**博客迁移**

- [ ] 初始化 Next.js App Router 项目
- [ ] 配置 MDX（`@next/mdx` 或 `next-mdx-remote`）
- [ ] 验证一篇现有 md 文件能正常渲染

**reReact Fiber**

- [ ] 阅读 React Fiber 源码，梳理 FiberNode 字段
- [ ] 设计本地 FiberNode 数据结构草稿

**RN 音乐库**

- [ ] 调研 iOS AVFoundation 读取音频元数据 API

**知识沉淀**（项目）

- [ ] 笔记：`docs/frontend/framework/next/app-router/` — App Router 与 Pages Router 核心差异
- [ ] 笔记：`docs/frontend/react/` — Fiber 为什么取代 Stack Reconciler（调研结论）

**主动学习**（P0 · JavaScript）

- [ ] 笔记：`docs/frontend/javascript/` — 原型链与原型继承（**proto** / prototype）
- [ ] 笔记：`docs/frontend/javascript/` — 闭包：定义、应用场景、内存泄漏风险

---

### W2 · Apr 28–May 4

**博客迁移**

- [ ] 批量迁移现有 VuePress md 内容
- [ ] 配置动态路由 `app/docs/[...slug]/page.tsx`

**reReact Fiber**

- [ ] 实现 FiberNode 类 / 接口定义
- [ ] 实现 createFiber 工厂函数

**RN 音乐库**

- [ ] 完成 iOS 模块接口设计文档（与 Android 对齐）

**知识沉淀**（项目）

- [ ] 笔记：`docs/frontend/react/` — FiberNode 数据结构字段逐一解析
- [ ] 笔记：`docs/frontend/mobile/` — RN 原生模块接口设计规范（iOS vs Android 差异）

**主动学习**（P0 · JavaScript）

- [ ] 笔记：`docs/frontend/javascript/` — this 绑定规则（默认/隐式/显式/new）
- [ ] 笔记：`docs/frontend/javascript/` — 执行上下文、调用栈、变量提升、暂时性死区

---

### W3 · May 5–11

**博客迁移**

- [ ] frontmatter 解析（tags、title、date、links）
- [ ] 标签索引页 `/tags` 实现
- [ ] 单标签筛选页 `/tags/[tag]` 实现

**reReact Fiber**

- [ ] beginWork：处理 HostRoot
- [ ] beginWork：处理 HostComponent

**RN 音乐库**

- [ ] iOS AVFoundation 读取文件标题、艺术家、专辑
- [ ] 读取封面图片

**知识沉淀**（项目）

- [ ] 笔记：`docs/frontend/react/` — beginWork 流程与 reconciler 入口
- [ ] 笔记：`docs/frontend/mobile/` — AVFoundation 元数据读取 API 速查

**主动学习**（P0 · JavaScript）

- [ ] 笔记：`docs/frontend/javascript/` — 异步演进：回调 → Promise → async/await
- [ ] 笔记：`docs/frontend/javascript/` — Event Loop：宏任务/微任务执行顺序

---

### W4 · May 12–18

**博客迁移**

- [ ] 引入 shadcn/ui，搭建基础组件（Button、Badge、Card）
- [ ] 文章列表页样式
- [ ] 文章详情页样式（prose 排版）

**reReact Fiber**

- [ ] beginWork：处理 FunctionComponent
- [ ] 实现 reconcileChildFibers（diff 子节点）

**RN 音乐库**

- [ ] iOS 读取播放时长、采样率等技术元数据
- [ ] 错误处理与权限申请

**知识沉淀**（项目）

- [ ] 笔记：`docs/frontend/react/` — reconcileChildFibers diff 算法核心逻辑
- [ ] 笔记：`docs/frontend/typescript/` — 本周遇到的 TS 类型问题整理

**主动学习**（P0 · JavaScript）

- [ ] 笔记：`docs/frontend/javascript/` — 深拷贝 vs 浅拷贝实现方案汇总
- [ ] 笔记：`docs/frontend/javascript/` — 手写题汇总：new / call / apply / bind / instanceof

---

### W5 · May 19–25

**博客迁移**

- [ ] 首页设计（最近文章 + 热门标签）
- [ ] 深色模式支持
- [ ] 响应式布局基础

**reReact Fiber**

- [ ] 完成 completeWork（冒泡副作用）
- [ ] 构建 effectList 链表

**RN 音乐库**

- [ ] 完善 iOS 实现，对齐 Android 接口
- [ ] 本地模拟器联调测试

**知识沉淀**（项目）

- [ ] 笔记：`docs/frontend/react/` — completeWork 与副作用收集机制
- [ ] 笔记：`docs/frontend/css/` — 深色模式实现方案（CSS 变量 vs Tailwind dark:）

**主动学习**（P0 · 浏览器）

- [ ] 笔记：`docs/frontend/browser/` — 渲染流水线：Parse → Style → Layout → Paint → Composite
- [ ] 笔记：`docs/frontend/browser/` — 重排（reflow）vs 重绘（repaint）触发条件与优化

---

### W6 · May 26–Jun 1 · 整理周

- [ ] 回顾 W1–W5 主动学习笔记，补漏（浏览器：V8 引擎、内存管理、垃圾回收）
- [ ] 检查 `docs/frontend/react/` Fiber 系列笔记之间的 links 是否串联
- [ ] 调整 W7–W10 计划（根据实际进度）

---

## Month 2 · 深化 + 图谱

> Jun 2 – Jun 29

### W7 · Jun 2–8

**博客迁移**

- [ ] 解析所有 md 的 frontmatter links，生成图谱 JSON 数据
- [ ] 设计图谱数据结构 `{ nodes, edges }`

**reReact Fiber**

- [ ] commit 阶段：beforeMutation
- [ ] commit 阶段：mutation（插入/更新/删除 DOM）

**RN 音乐库**

- [ ] 设计 JS Bridge 统一接口（TypeScript 类型定义）

**知识沉淀**（项目）

- [ ] 笔记：`docs/frontend/react/` — commit 三阶段（beforeMutation/mutation/layout）
- [ ] 笔记：`docs/frontend/mobile/` — RN Bridge 统一接口设计思路

**主动学习**（P0 · 计算机网络）

- [ ] 笔记：`docs/computer-science/networking/` — HTTP/1.1、HTTP/2、HTTP/3 核心差异
- [ ] 笔记：`docs/computer-science/networking/` — HTTPS：TLS 握手流程、证书链、对称/非对称加密

---

### W8 · Jun 9–15

**博客迁移**

- [ ] 集成 react-force-graph，渲染关系图谱页 `/graph`
- [ ] 点击节点跳转对应文章

**reReact Fiber**

- [ ] commit 阶段：layout（useLayoutEffect 触发）
- [ ] 实现基础 useEffect 调度

**RN 音乐库**

- [ ] JS Bridge 层实现，Android + iOS 统一调用
- [ ] 真机联调（Android）

**知识沉淀**（项目）

- [ ] 笔记：`docs/frontend/react/` — useEffect vs useLayoutEffect 执行时机
- [ ] 笔记：`docs/frontend/performance/` — react-force-graph 大图谱性能优化方案

**主动学习**（P0 · 计算机网络）

- [ ] 笔记：`docs/computer-science/networking/` — TCP 三次握手 / 四次挥手详解
- [ ] 笔记：`docs/computer-science/networking/` — TCP 可靠传输：滑动窗口、拥塞控制、流量控制

---

### W9 · Jun 16–22

**博客迁移**

- [ ] 集成 Pagefind 静态搜索
- [ ] 搜索 UI 组件（⌘K 弹窗）

**reReact Fiber**

- [ ] useState Hook 实现
- [ ] 与原 Stack Reconciler 跑相同测试用例对比

**RN 音乐库**

- [ ] 真机联调（iOS）
- [ ] 批量读取文件夹下所有音乐文件

**知识沉淀**（项目）

- [ ] 笔记：`docs/frontend/react/` — useState 内部实现（hook 链表、dispatcher）
- [ ] 笔记：`docs/frontend/react/` — Stack vs Fiber：同测试用例性能数据对比

**主动学习**（P0 · 系统设计基础）

- [ ] 笔记：`docs/system-design/fundamentals/` — 可扩展性：垂直扩展 vs 水平扩展
- [ ] 笔记：`docs/system-design/fundamentals/` — CAP 定理、BASE 理论、一致性模型

---

### W10 · Jun 23–29 · 整理周

- [ ] 回顾 W7–W9 主动学习笔记，补漏（系统设计：负载均衡、缓存策略、数据库分片）
- [ ] 图谱页视觉优化（颜色分组、节点大小按入链数）
- [ ] 调整 W11–W14 计划（根据实际进度）

---

## Month 3 · 收尾 + 算法启动

> Jun 30 – Jul 27

### W11 · Jun 30–Jul 6

**博客上线**

- [ ] GitHub Actions 自动部署到 Vercel
- [ ] 配置自定义域名
- [ ] sitemap.xml + robots.txt

**reReact**

- [ ] 补全单元测试（覆盖 beginWork / completeWork / commit）
- [ ] 性能测试：与原 Stack Reconciler 对比渲染耗时

**RN 音乐库**

- [ ] 完善 README（安装、API 文档、示例代码）
- [ ] 准备发布到 npm

**知识沉淀**（项目）

- [ ] 笔记：`docs/devops/ci-cd/` — GitHub Actions 自动部署 Vercel 配置详解
- [ ] 笔记：`docs/frontend/performance/` — Lighthouse 跑分 + 博客性能指标基线

**主动学习**（P1 · CSS）

- [ ] 笔记：`docs/frontend/css/` — BFC：触发条件、应用场景（清除浮动/防 margin 塌陷）
- [ ] 笔记：`docs/frontend/css/` — 层叠上下文：触发条件、z-index 失效原因

---

### W12 · Jul 7–13

**博客收尾**

- [ ] SEO meta 标签完善（OG、Twitter Card）
- [ ] 博客评论系统（可选：Giscus）

**reReact 收尾**

- [ ] 完善 README（架构图、与官方 React 的对比说明）
- [ ] 发布到 GitHub，补 Star 引导

**RN 音乐库发布**

- [ ] 发布 npm 包 `react-native-music-reader`（或你的命名）
- [ ] 补充 iOS/Android 安装说明

**知识沉淀**（项目）

- [ ] 笔记：`docs/frontend/react/` — reReact 整体架构图与实现总结
- [ ] 笔记：`docs/frontend/mobile/` — RN 原生库发布流程（npm + Podspec）

**主动学习**（P1 · CSS）

- [ ] 笔记：`docs/frontend/css/` — Flex 深度：主轴/交叉轴、flex-grow/shrink/basis
- [ ] 笔记：`docs/frontend/css/` — Grid 深度：模板区域、隐式网格、auto-fill vs auto-fit

---

### W13 · Jul 14–20

**算法启动**（每天 1 题，LeetCode）

- [ ] 数组专题：Two Sum、Three Sum、Container With Most Water
- [ ] 字符串专题：Valid Anagram、Longest Substring Without Repeating
- [ ] 笔记：`docs/algorithms/problems/` — 数组/字符串模板

**知识沉淀**（算法）

- [ ] 笔记：`docs/algorithms/problems/` — 数组/字符串高频题模板
- [ ] 笔记：`docs/devops/ci-cd/` — GitHub Actions workflow 语法速查

**主动学习**（P1 · TypeScript）

- [ ] 笔记：`docs/frontend/typescript/type-system/` — 泛型：约束、多泛型、泛型工具函数
- [ ] 笔记：`docs/frontend/typescript/type-system/` — 条件类型、infer 关键字

---

### W14 · Jul 21–27 · 整理周

**算法**（每天 1 题）

- [ ] 链表专题：Reverse Linked List、Merge Two Sorted Lists、LRU Cache
- [ ] 笔记：`docs/algorithms/problems/` — 链表模板

**知识整理**

- [ ] 回顾 W11–W13 主动学习笔记，补漏（TypeScript：Mapped Types、工具类型、声明文件）
- [ ] 回顾 Month 3 所有笔记，串联 frontmatter links
- [ ] 调整 W15–W18 计划（根据实际进度）

---

## Month 4 · 系统设计 + 算法中期

> Jul 28 – Aug 24

### W15 · Jul 28–Aug 3

**算法**（每天 1 题）

- [ ] 二叉树：Inorder/Preorder/Postorder、Max Depth、Lowest Common Ancestor

**系统设计**

- [ ] 复习 `system-design/cases/001-design-url-shortener.md`
- [ ] 复习 `system-design/cases/002-design-rate-limiter.md`
- [ ] 笔记：`docs/backend/redis/` — 缓存穿透、雪崩、击穿解决方案

**主动学习**（P1 · 数据库）

- [ ] 笔记：`docs/backend/database/fundamentals/` — SQL 基础：JOIN 类型、子查询、窗口函数
- [ ] 笔记：`docs/backend/database/fundamentals/` — 事务：ACID、隔离级别、脏读/幻读/不可重复读

---

### W16 · Aug 4–10

**算法**（每天 1 题）

- [ ] 图：Number of Islands、Clone Graph、Course Schedule

**系统设计**

- [ ] 新增笔记：设计消息队列系统
- [ ] 笔记：`docs/backend/message-queue/` — Kafka 消费者组与 Offset 管理
- [ ] 复习 `system-design/fundamentals/` 可用性 vs 一致性

**主动学习**（P1 · 数据库）

- [ ] 笔记：`docs/backend/database/fundamentals/` — 索引原理：B+ 树结构、覆盖索引、最左前缀
- [ ] 笔记：`docs/backend/database/fundamentals/` — EXPLAIN 解读、慢查询优化思路

---

### W17 · Aug 11–17

**算法**（每天 1 题）

- [ ] 堆：Top K Elements、Merge K Sorted Lists、Find Median from Data Stream
- [ ] 单调栈：Daily Temperatures、Largest Rectangle in Histogram

**系统设计**

- [ ] 复习 `system-design/cases/004-design-cache-system.md`
- [ ] 复习 `system-design/cases/005-design-distributed-id.md`
- [ ] 笔记：`docs/system-design/fundamentals/` — 数据库分片策略

**主动学习**（P1 · Redis）

- [ ] 笔记：`docs/backend/redis/` — 5 种数据结构与典型使用场景
- [ ] 笔记：`docs/backend/redis/` — 持久化（RDB/AOF）、缓存穿透/雪崩/击穿解决方案

---

### W18 · Aug 18–24 · 整理周

**算法**

- [ ] 综合练习（每天 1 题，混合题型）
- [ ] 补充 `docs/algorithms/patterns/` 薄弱模式的总结

**知识回顾**

- [ ] 回顾 W15–W17 主动学习笔记，补漏（认证鉴权：JWT/OAuth2/SSO、设计模式创建型）
- [ ] 回顾 `docs/system-design/fundamentals/` 全部内容
- [ ] 调整 W19–W22 计划

---

## Month 5 · 算法冲刺 + 面试知识复习

> Aug 25 – Sep 21

### W19 · Aug 25–Aug 31

**算法**（每天 2 题）

- [ ] 动态规划入门：Climbing Stairs、Coin Change、House Robber
- [ ] 笔记：`docs/algorithms/patterns/01-dynamic-programming.md` 补充案例

**面试知识**

- [ ] 笔记：`docs/frontend/javascript/` — 原型链、继承、闭包深度复习
- [ ] 手写题：实现 `new`、`call`、`apply`、`bind`

**主动学习**（P1 · 设计模式）

- [ ] 笔记：`docs/architecture/design-patterns/` — 创建型：单例、工厂方法、抽象工厂、建造者
- [ ] 笔记：`docs/architecture/design-patterns/` — 结构型：代理、装饰器、适配器、外观

---

### W20 · Sep 1–7

**算法**（每天 2 题）

- [ ] DP 进阶：Longest Common Subsequence、Edit Distance、Word Break

**面试知识**

- [ ] 笔记：`docs/frontend/browser/` — 渲染流程（重排/重绘/合成）
- [ ] 笔记：`docs/frontend/javascript/` — Event Loop、微任务/宏任务

**主动学习**（P1 · 设计模式）

- [ ] 笔记：`docs/architecture/design-patterns/` — 行为型：观察者、策略、命令、迭代器
- [ ] 笔记：`docs/architecture/design-patterns/` — 前端常见模式：发布订阅 vs 观察者、职责链

---

### W21 · Sep 8–14

**算法**（每天 2 题）

- [ ] 回溯：Permutations、Subsets、N-Queens、Combination Sum

**面试知识**

- [ ] 笔记：`docs/computer-science/networking/` — HTTP/HTTPS 全面复习
- [ ] 笔记：`docs/frontend/browser/` — 跨域、CSP、Cookie/Session/Token

**主动学习**（P2 · 操作系统）

- [ ] 笔记：`docs/computer-science/concurrency/` — 进程 vs 线程 vs 协程
- [ ] 笔记：`docs/computer-science/concurrency/` — 锁：互斥锁、读写锁、死锁四个条件与预防

---

### W22 · Sep 15–21

**算法**（每天 2 题）

- [ ] 二分查找：Binary Search、Search in Rotated Array、Find Minimum in Rotated Array
- [ ] 补全 `docs/algorithms/patterns/` 所有模式总结（双指针/滑窗/BFS-DFS/回溯/贪心/分治）

**面试知识**

- [ ] 笔记：`docs/frontend/javascript/` — 异步编程（Promise/async-await 原理）
- [ ] 笔记：`docs/frontend/react/` — React 面试高频（Fiber、diff、调度、hooks 原理）

**主动学习**（P2 · 操作系统）

- [ ] 笔记：`docs/computer-science/operating-system/` — 内存管理：分页、虚拟内存、页面置换算法
- [ ] 笔记：`docs/computer-science/operating-system/` — IO 模型：阻塞/非阻塞/多路复用/异步 IO

---

## Month 6 · 查漏补缺 + 冲刺

> Sep 22 – Oct 19

### W23 · Sep 22–28

- [ ] 模拟算法面试 1 轮（45 分钟，2 题）
- [ ] 整理错题，补 `docs/algorithms/problems/` 高频手撕题
- [ ] 确认知识体系弱项，制定 W24–W26 补强清单

**主动学习**（P2 · 消息队列 + API 设计）

- [ ] 笔记：`docs/backend/message-queue/` — Kafka：Topic/Partition/Consumer Group/Offset
- [ ] 笔记：`docs/backend/api-design/` — RESTful 规范 + GraphQL vs gRPC 对比

---

### W24 · Sep 29–Oct 5

- [ ] 模拟系统设计面试 1 轮（45 分钟）
- [ ] 补强弱项：`docs/system-design/` 或 `docs/backend/`
- [ ] 博客知识图谱：补充各文章间 frontmatter links

**主动学习**（P2 · DevOps）

- [ ] 笔记：`docs/devops/docker/` — 镜像分层、Dockerfile 最佳实践、docker-compose
- [ ] 笔记：`docs/devops/ci-cd/` — GitHub Actions：触发条件、Job/Step、缓存优化

---

### W25 · Oct 6–12

- [ ] 模拟综合面试 1 轮（算法 + 系统设计 + 项目介绍）
- [ ] reReact / RN 音乐库项目介绍话术准备
- [ ] 补充空 README：每个目录至少有"是什么 / 核心概念 / 参考资料"

**主动学习**（P2 · 性能优化）

- [ ] 笔记：`docs/performance/frontend/` — Core Web Vitals（LCP/FID/CLS）优化手段
- [ ] 笔记：`docs/performance/backend/` — 数据库连接池、N+1 问题、慢查询优化

---

### W26 · Oct 13–19 · 收尾

**里程碑最终检查**

- [ ] 博客正常运行，关系图谱有实质连接
- [ ] reReact：完整 README + 测试 + GitHub 发布
- [ ] RN 音乐库：npm 包已发布，双端文档完善
- [ ] `docs/algorithms/problems/` 有 60+ 题解
- [ ] `docs/system-design/cases/` 有 7+ case 笔记
- [ ] 所有顶级目录 README 不为空

---

## 知识沉淀原则

**"做完就记"** — 功能完成后立刻写笔记，趁热打铁

**笔记最小结构**（先有再好）

```
# 主题名
## 是什么
## 核心概念
## 代码示例（可选）
## 参考资料
```

**每周日** — 30 分钟检查哪些目录有内容，哪些还是空的
