---
title: 实现脚手架 ————（一）项目初始化
date: 2022-05-23
category:
  - Node
tag:
  - CLI
---

实现一个 mini-vue-cli，首先需要用到命令行工具 commander.js

npm init -y

```bash
npm init -y
```

```diff
  mini-vue-cli
  |- node_modules
  |- package-lock.json
  |- package.json
+ |- index.html
+ |- /src
+   |- /js
+     |- format.js
+     |- math.js  
+   |- index.js
```