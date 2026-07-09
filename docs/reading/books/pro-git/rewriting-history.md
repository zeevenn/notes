---
title: 修改提交
date: 2024-07-10
icon: edit
category:
  - READING
tag:
  - git
  - github
---

## 修改提交信息

在 Git 中，修改提交是通过 `git commit --amend` 命令来完成的。

```bash
git commit --amend
```

此时就能出现一个交互式的修改提交窗口，可以修改提交信息，添加文件，或者删除文件。

## 修改作者信息

由于某次提交时不小心将 `git user` 改成了其他账户，在后续 `commit` 时提交了错误的用户信息，需要手动修改：`git rebase -i <commit-hash>`。

意为从当前 `commit` 后的所有提交。将 `pick` 改为 `edit`，并使用 `git commit --amend --author="Author Name <email>"` 修改用户。

满意后使用 `git rebase --continue` 关闭本次修改。
