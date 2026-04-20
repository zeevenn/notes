---
title: 自动点亮 GitHub 热点图
date: 2024-02-10
icon: play
category:
  - Project
tag:
  - github auto commit
  - github
  - commit
---

灵感来源：某天在 GitHub 上看到一个用户的热点图，发现他每天都有提交记录，非常帅！

于是先搜搜有没有自动提交的工具，但是找到的结果有些需要在本地运行；有些则没有检查当天是否有提交记录，如果有提交当然不希望有一个虚拟的提交。

于是就有了这个项目，使用 GitHub Actions 自动提交代码，保持 GitHub 热点图常绿。

项目地址：[github-auto-commit](https://github.com/dribble-njr/github-auto-commit)。

## 功能特点

- **自动提交与推送**: 如果所有代码仓库今天没有任何提交，工作流程将自动提交一个虚拟的提交，并将其推送到代码仓库。
- **支持配置**: 可以根据自己的需求进行配置，包括调整定时任务时间、更改 Git 设置信息以及自定义提交信息等。

## 使用方法

1. **Fork 本仓库**: 首先，将本仓库 Fork 到你自己的 GitHub 账号下。
2. **生成个人访问令牌（PAT）**: 在 GitHub 设置中生成一个具有 `repo` 权限范围的个人访问令牌。
3. **设置仓库 Secrets**: 在仓库的设置中，添加一个名为 `TOKEN` 的 Secrets，将在步骤 2 中生成的 PAT 值作为其值。

## 配置

可以根据自己的需求对工作流程进行以下配置：

1. **调整定时任务时间**: 可以在工作流程文件中修改 `schedule` 部分的 cron 表达式，以更改工作流程的触发时间。
2. **更改 Git 设置信息**: 在工作流程文件中的 `Set up Git` 步骤中，更改 Git 的用户邮箱和用户名。
3. **自定义提交信息**: 在工作流程文件的最后一步中，根据需要修改 `date_today`、`time_start`、`time_end`、`repo` 和 `commit_message` 等变量，以调整自动提交的内容和提交信息。

## 实现

整体工作原理是使用 GitHub Actions 实现定时触发任务。

使用 GitHub 提供的 API 来获取用户所有的代码仓库，并获取取每个仓库的提交信息。

如果在所有仓库中都没有找到今天的提交记录，工作流程会自动创建一个虚拟的提交并推送到代码仓库中。

完整代码如下：

```yml
name: Auto Commit

on:
  schedule:
    - cron: '50 15 * * *' # run at 23:50 in China time
  workflow_dispatch:

jobs:
  check_commits:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout this repository
        uses: actions/checkout@v2

      - name: Set up Git
        run: |
          # You should set your email and name here.

          git config --global user.email "wzw15292257101@163.com"
          git config --global user.name "dribble-njr"

      - name: Get all repositories
        id: get-repos
        run: |
          echo "Fetching all repositories..."
          response=$(curl -s -w "\n%{http_code}" -H "Authorization: token ${{ secrets.TOKEN }}" "https://api.github.com/user/repos?type=all")
          http_code=$(echo "$response" | tail -n1)
          response_body=$(echo "$response" | sed '$d')

          echo "[HTTP status code]: $http_code"

          contained_repos=$(echo "$response_body" | jq -r '.[] | .full_name')
          echo "Contained repositories: $contained_repos"

          echo "::set-output name=repos::$(echo "$contained_repos" | tr '\n' ',')" # output repos

      - name: Read repositories list and check commits
        run: |
          # Set custom timezone and other config by yourself.

          date_today=$(TZ='Asia/Shanghai' date -I) # Date part
          time_start="${date_today}T00:00:00"
          time_end="${date_today}T23:55:00"
          repo="https://github.com/dribble-njr/github-auto-commit.git"
          commit_message="Auto commit on $(TZ='Asia/Shanghai' date '+%Y-%m-%d %H:%M:%S')"

          commits_exist=false
          echo "Checking commits between $time_start and $time_end"

          IFS=', ' read -r -a repos <<< "${{ steps.get-repos.outputs.repos }}"
          for repo in "${repos[@]}"; do
            echo "Checking commits for $repo"
            commit_today=$(curl -H "Authorization: token ${{ secrets.TOKEN }}" -s "https://api.github.com/repos/$repo/commits?since=$time_start&until=$time_end")
            if echo "$commit_today" | jq -e '.[]' > /dev/null; then
                echo "Commits today in $repo:"
                echo "$commit_today"
                commits_exist=true
                break
            fi
          done

          if [[ "$commits_exist" == "false" ]]; then
            echo "No commits found today across all repositories. Creating a dummy commit..."
            git clone $repo
            cd github-auto-commit
            echo "$date_today No commits found today, auto commited." >> dummy.txt
            git add dummy.txt
            git commit -m "$commit_message"
            git push https://${{ secrets.TOKEN }}@github.com/${{ github.repository }}.git
          else
            echo "Commits found today."
          fi
```
