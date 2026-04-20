---
title: 云服务器设置代理
date: 2024-12-04
icon: clash
category:
  - linux
tag:
  - clash
  - proxy
---

在许多开发和部署场景中，使用代理服务器能够帮助我们绕过网络限制，提升安全性，或者加速访问。在本篇文章中，我们将讨论如何在云服务器上设置代理，主要包括通过隧道技术与使用 Clash for Linux 两种方式。

## 使用 SSH 隧道设置代理

SSH 隧道是一种通过安全通道将本地端口转发到远程服务器的方法。使用 SSH 隧道可以通过云服务器作为中介，绕过局域网或区域性网络的限制，访问外部服务。下面是如何设置 SSH 隧道代理。

一般云服务器都支持 SSH 隧道，如果是基于 Ubuntu 的系统，可以通过以下命令来确认：

```bash
sudo systemctl status ssh
```

如果看到 `active (running)` 字样，说明 SSH 服务正在运行。

如果没有安装，可以使用以下命令安装：

```bash
sudo apt update
sudo apt install openssh-server
```

在本地电脑上，使用 SSH 连接到云服务器：

```bash
ssh -R 7890:127.0.0.1:7890 root@<your-server-ip>
```

然后在云服务器上，设置环境变量，编辑 `~/.bashrc`（或 `~/.zshrc`，取决于你使用的 shell） 文件：

```bash
$ vi ~/.bashrc
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
```

这样，云服务器上的所有请求，都会经过本地的 7890 端口。

> [!NOTE]
> 该方式优点在于简单，在一些简单的场景下可以满足需求。
>
> 缺点在于依赖 SSH 隧道，如果使用 GitHub Action 触发 CI，由于没有 SSH 隧道，所以会导致无法使用代理。
>
> 除非你能保证本地电脑一直处于连接状态，否则不建议使用该方式。

## 使用 Clash for Linux 设置代理

[Clash for Linux](https://github.com/Elegycloud/clash-for-linux-backup) 是一款功能强大的代理工具，支持多种协议，包括 HTTP、SOCKS5 等。通过 Clash for Linux，我们可以方便地在本地电脑上设置代理，并将其同步到云服务器上。

```bash
git clone https://github.com/Elegycloud/clash-for-linux-backup.git
```

进入到项目目录，编辑 `.env` 文件，修改变量 `CLASH_URL` 的值。

```bash
cd clash-for-linux-backup
vi .env
```

> [!TIP]
> `CLASH_SECRET` 变量会用于登陆 dashboard。

启动代理：

```bash
$ sudo bash start.sh
正在检测订阅地址...
Clash订阅地址可访问！                                      [  OK  ]

正在下载Clash配置文件...
配置文件config.yaml下载成功！                              [  OK  ]

正在启动Clash服务...
服务启动成功！                                             [  OK  ]

Clash Dashboard 访问地址：http://<ip>:9090/ui
Secret：xxxxxxxxxxxxx

请执行以下命令加载环境变量: source /etc/profile.d/clash.sh

请执行以下命令开启系统代理: proxy_on

若要临时关闭系统代理，请执行: proxy_off
```

加载环境变量并启动服务：

```bash
source /etc/profile.d/clash.sh
proxy_on
```

检查服务端口：

```bash
$ sudo netstat -tuln | grep 7890
$ netstat -tln | grep -E '9090|789.'
tcp6       0      0 :::7892                 :::*                    LISTEN
tcp6       0      0 :::7890                 :::*                    LISTEN
tcp6       0      0 :::7891                 :::*                    LISTEN
tcp6       0      0 :::9090                 :::*                    LISTEN
```

检查环境变量：

```bash
$ env | grep -E 'http_proxy|https_proxy'
http_proxy=http://127.0.0.1:7890
https_proxy=http://127.0.0.1:7890
```

这样，云服务器上的代理即设置完成。若要查看 dashboard，可以使用 VS Code 插件 [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) 连接到云服务器，设置端口转发，然后在浏览器中访问 `http://127.0.0.1:9090/ui`。

![端口转发](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20241204164400.png)

> [!WARNING]
> 配置完成后，dashboard 会在关闭连接后停止，所以可以进行持久化。

编辑 `~/.bashrc` 文件，添加以下内容：

```bash
$ vi ~/.bashrc
bash /path/to/clash-for-linux-backup/start.sh
source /etc/profile.d/clash.sh
proxy_on
```

这样，每次连接到云服务器后，都会自动启动代理。
