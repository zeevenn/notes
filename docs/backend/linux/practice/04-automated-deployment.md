---
title: 自动部署 Vuepress 到服务器
date: 2021-05-12
icon: vuepress
category:
  - linux
tag:
  - 项目部署
  - vuepress
---

::: tip

服务器：centos 7.9

本地电脑：Windows 10

:::

## 服务器端

### 配置 nginx

登录宝塔面板，可以参考 [配置宝塔面板](03-configure-bt.md)。点击左侧网站 -> 添加站点。

![step1-add-site](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/step1-add-site.png)

新增之后，点击设置 -> 配置文件。这三项按自己的情况配置，在后面 [git hooks](./04-automated-deployment.md#配置-hooks) 中会将 dist 文件推送到 `root` 配置项设置的文件夹下。

![step2-nginx-conf](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/step2-nginx-conf.png)

先测试下 nginx 有没有配置成功，本地打包文件：

```bash
yarn build
```

然后将生成的 `dist` 文件里的内容复制到刚才设置的项目根目录下。

接着输入 `http://xxx.xxx.xxx.xxx:端口号`，就能访问成功了。

::: tip

地址得用 http 协议，因为我们还没有配置 ssl 证书。

:::

### 配置 git 仓库

在 [搭建 git 私服](./02-build-git-server.md) 中已经搭建好了 git 私服，因此只需要初始化 `vuepress.git` 仓库即可。

```bash
cd /home/git
mkdir vuepress.git
cd vuepress.git
git init --bare vuepress.git
```

### 配置 hooks

先切换到 root 用户（`ctrl + d`），在 home 文件夹下创建一个临时存放 dist 文件夹的地方。

::: tip

我这里选择存放到 home 文件夹下，但是 git 用户是没有权限的，因此切换到 root 用户，也可以存放到其他文件夹。

:::

```bash
cd /home
mkdir tmp
cd tmp
mkdir vuepress
```

接着将文件的所有权换成 git：

```bash
sudo chown git:git -R vuepress
```

然后，有一个关键的地方，要将 `/www/wwwroot` 的所有权换成 git：

```bash
sudo chown git:git /www/wwwroot
```

做好这些准备之后，就可以开始配置 `hooks` 了。

```bash
cd /home/git/vuepress.git/hooks
# 通过 copy 新建 post-update 文件
cp post-update.sample post-update
vim post-update
```

接着将下面代码复制进去：

```bash
echo "auto deploy start ==================================="
unset GIT_DIR

# 项目文件夹
PUBLIC_WWW=/www/wwwroot/vuepress
# git 仓库文件夹
GIT_REPO=/home/git/vuepress.git
# 临时文件夹
TMP_GIT_CLONE=/home/tmp/vuepress

# 移除临时文件夹
rm -rf ${TMP_GIT_CLONE}
# 克隆 git 仓库到临时文件夹
git clone $GIT_REPO $TMP_GIT_CLONE
# 移除项目文件夹
# 宝塔为了安全，为自动在项目文件夹下新增 .user.ini 文件
# 需要先关闭这个文件的功能才能删除项目文件夹
cd ${PUBLIC_WWW}
chattr -i .user.ini
rm -rf ${PUBLIC_WWW}
# 将临时文件夹复制到项目文件夹
cp -rf ${TMP_GIT_CLONE} ${PUBLIC_WWW}

echo "auto deploy end ===================================="
```

现在服务器端的准备工作已经完成了，接下来看看本地电脑的配置。

## 本地电脑

在本地项目根目录下新建 `deploy.sh` 脚本文件，内容如下：

```bash
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 初始化 git 仓库，并提交修改
git init
git add -A
git commit -m 'deploy'

# 发布到 git 私服， -f 强制覆盖
git remote add origin git@119.23.65.118:/home/git/vuepress.git
git push -f git@119.23.65.118:/home/git/vuepress.git master

cd -
```

::: tip

了解更多 git 命令，可以查询[官方文档](https://git-scm.com/docs)。

:::

## 测试

vscode 终端中输入 `sh depoly.sh`，报错：

```bash
sh : 无法将“sh”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。
请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
```

了解到 windows 上可以使用 git bash 执行 shell 脚本，但我可不想每次执行的时候都打开 git bash，当然得找如何在 vscode 中执行 shell 脚本的办法。

1. 首先得在 vscode 中安装 code runner，之前一直用它来调试力扣上的题，已经安装过了。
2. 安装 git bash，这个不用说，安装 git 的时候就已经有了
3. 配置 bash 环境，找到 bash.exe 的安装目录，将它的位置添加到系统的环境变量中。
4. 配置 code runner：文件 -> 首选项 -> 设置 -> 搜索 code runner
5. 打开终端，输入 `bash` 切换到 bash 环境，点击右上角的三角形即可运行。

![step3-code-runner](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/step3-code-runner.png)

现在随便更新点内容，并执行 `deploy.sh` 脚本：

![step4-complete](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/step4-complete.png)

再次访问 `http://xxx.xxx.xxx.xxx:端口号` 发现已经更新了。

## 参考链接

- [只需三步， 部署 Vuepress 并实现本地一行命令更新部署到服务器](http://chanwingwah.info/article/604eb2273c8ec67668f6fd41)
- [使用 git hooks(post-receive)实现简单的远程自动部署](https://www.imqianduan.com/git-svn/335.html)
- [将 Hexo 部署到阿里云轻量服务器（保姆级教程）](https://hjxlog.com/posts/20191130a1.html#7-%E9%85%8D%E7%BD%AENginx)
- [VSCode: Windows 下配置 VSCode 运行 shell](https://www.cnblogs.com/yongdaimi/p/15247771.html)
