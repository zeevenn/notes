---
title: 搭建 git 私服
date: 2021-05-12
icon: git1
category:
  - linux
tag:
  - 项目部署
  - git
---

::: tip

**git 私服作用：**

- 自己电脑和公司（或者实验室）电脑随时同步资料
- GitHub、Gitee 私有仓库都是限流的，文件一旦多了，或者有图片文件，`git pull` 的时候半天拉不下来
- 保存一些隐私文件

:::

## 开始搭建

- 服务器：centos7.9
- 本地电脑: Windows10

如果服务器没装 git 可以使用以下命令安装：

```bash
yum install git
```

## 创建 git 用户

创建一个 Git 的 Linux 账户，这个账户只做 Git 私服的操作，之后就要设置 Linux Git 账户的密码，但由于我之前已经 [设置了 ssh 登录](./01-set-the-ssh.md)，因此不用设置密码。

```bash
adduser git
```

**后面所有的操作都在 git 用户下进行：**

```bash
[root@instance-5fcyjde7 ~]su - git
```

看一下自己所在的目录，是不是在 git 目录下面：

```bash
[git@instance-5fcyjde7 ~]$ pwd
/home/git
```

## 服务器端密钥管理

创建 `.ssh` 目录，如果 `.ssh` 已经存在了，可以忽略这一项。方便每次操作 Git 仓库的时候不用再去输入密码。

```bash
cd ~/
mkdir .ssh
```

进入 `.ssh` 文件下，创建一个 `authorized_keys` 文件，并给 `authorized_keys` 文件设置权限。这个文件用来存放客户端的公钥。

```bash
cd ~/.ssh
touch authorized_keys
chmod 700 /home/git/.ssh
chmod 600 /home/git/.ssh/authorized_keys
```

接下来要把客户端的公钥放在 Git 服务器上，我们再回到客户端，创建一个公钥。

在我们自己的电脑上，有公钥和私钥。两个文件分别是：`id_rsa` 和 `id_rsa.pub`。

如果是 Windows 系统公钥私钥的目录在 `C:\Users\用户名.ssh` 下。

如果是 Mac 或者 Linux， 公钥和私钥的目录这里 `cd ~/.ssh/`， 如果发现自己的电脑上没有公钥私钥，那就自己创建一个。

创建密钥的命令：

```bash
ssh-keygen -t rsa
```

创建密钥的过程中，一路点击回车就可以了，不需要填任何东西。把刚刚生成的 `id_rsa.pub`，拷贝到 Git 服务器的 `/home/git/.ssh/` 目录。

在 Git 服务器上，将公钥添加到 `authorized_keys` 文件中：

```bash
cd /home/git/.ssh/
cat id_rsa.pub >> authorized_keys
```

在客户直接登录 Git 服务器，验证是否配置成功：

```bash
ssh git@git 服务器 ip
# 例如：
ssh git@127.0.0.1
```

如果可以免密登录，那就说明服务器端密钥配置成功了。

在这里我还出现了一个错误：

```bash
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the RSA key sent by the remote host is
51:82:00:1c:7e:6f:ac:ac:de:f1:53:08:1c:7d:55:68.
Please contact your system administrator.
Add correct host key in /Users/isaacalves/.ssh/known_hosts to get rid of this message.
Offending RSA key in /Users/isaacalves/.ssh/known_hosts:12
RSA host key for 104.131.16.158 has changed and you have requested strict checking.
Host key verification failed.
```

出现这个错误的原因是因为我更新了 `ssh key`，使用以下命令删除无效的 key 即可：

```bash
ssh-keygen -R "服务器 ip"
```

## 服务器端部署 Git 仓库

接下来在服务器上部署 git 仓库。

登录到 Git 服务器端，切换为 Git 账户。如果是 root 账户切换成 Git 账户：

```bash
su - git
```

如果是其他账户切换为 Git 账户：

```bash
sudo su - git
```

进入 git 目录下：

```bash
cd ~/git
```

创建一个文件夹名为 `world.git`，`.git` 后缀表明这是一个 git 仓库而不是别的什么文件。

```bash
[git@localhost git]# mkdir world.git
[git@localhost git]# cd word.git
```

初始化 word 仓库：

```bash
git init --bare
```

如果想创建多个仓库，就在 **git** 用户下的 `~/git` 目录创建多个文件夹并**初始化**就可以了。

现在服务端的 Git 仓库就部署完了，接下来就能像平时使用 github 一样使用这个 Git 私服了。

## 客户端连接远程仓库

在自己的电脑上创建一个文件夹也叫做 `world`。

:::tip

其实这里命名是随意的，但是我们为了和 Git 服务端的仓库名称保持同步。这样更直观我们操作的是哪一个仓库。

:::

```bash
mkdir world
cd world
```

进入 `world` 文件，并初始化操作：

```bash
cd world
git init
```

在 `world` 目录上创建一个测试文件，并且将其添加到 Git 私服中：

```bash
touch test
git add test
git commit -m "test git server"
```

将本地仓库和远端仓库同步：

```bash
git remote add origin git@服务器 ip:world.git
git push -u origin master
```

此时这个 `test` 测试文件就已经提交到我们的 Git 远端私服上了。

## 参考链接

- [手把手来搭建 Git 私服！](https://mp.weixin.qq.com/s/8m5zK29sX0D9NM_YB8KDNQ)
- [WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED](https://www.digitalocean.com/community/questions/warning-remote-host-identification-has-changed)
