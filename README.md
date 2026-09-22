# Notes

VuePress knowledge base. Content lives under `docs/`; each section README is the ordering and navigation hub for that folder.

## 本地全文搜索

运行 `pnpm run build` 构建站点并生成 Pagefind 中文全文索引，再运行 `pnpm run preview`，打开 `http://127.0.0.1:4173/notes/`。导航栏搜索按钮或 `Ctrl/⌘ + K` 可打开搜索，`Esc` 关闭。

索引包含文章标题、正文和代码，排除导航、评论及空白页面；配置见 `pagefind.yml`。`pnpm run dev` 不生成或提供搜索索引，验证搜索效果需使用构建预览。修改笔记后重新构建，索引才会更新。 多个关键词用空格分隔，结果必须在标题或正文中包含每个完整关键词；图片地址等元数据不参与匹配。构建后可运行 `pnpm run test:search` 验证检索回归用例。

## 目录

- [知识库首页](./docs/)
- [前端](./docs/frontend/)
- [后端](./docs/backend/)
- [AI](./docs/ai/)
- [算法](./docs/algorithms/)
- [计算机科学](./docs/computer-science/)
- [系统设计](./docs/system-design/)
- [架构设计](./docs/architecture/)
- [云服务](./docs/cloud/)
- [DevOps](./docs/devops/)
- [安全](./docs/security/)
- [性能优化](./docs/performance/)
- [项目](./docs/projects/)
- [阅读](./docs/reading/)
- [工具](./docs/tools/)
