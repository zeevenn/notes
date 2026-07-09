---
title: centos 安装 docker
date: 2024-01-12
icon: docker
category:
  - linux
tag:
  - docker
  - centos
---

::: tip

需要保证 centos 版本：

- centos 7
- centos 8
- centos 9

:::

## 卸载旧版本

::: warning

必须先完成这一步，否则会出现不可预见的错误。

:::

运行下列命令：

```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

出现成功提示后即可。

## 使用 rpm repository 安装

### 设置镜像

安装 `yum-utils` 软件包（提供 `yum-config-manager` 实用工具）并设置软件源。

```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

### 安装 docker engin

1. 安装最新版：

:::tabs

@tab 安装最新版

运行下列命令安装最新版：

```bash
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

如果提示接受 GPG 密钥，请验证指纹是否与 `060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35` 匹配，如果匹配，请接受。

这条命令会安装 Docker，但不会启动 Docker。它还创建了一个 `docker` 组，但默认情况下并不向该组添加任何用户。

@tab 安装指定版本

要安装特定版本，首先要列出版本库中的可用版本：

```bash
yum list docker-ce --showduplicates | sort -r

docker-ce.x86_64    3:24.0.0-1.el8    docker-ce-stable
docker-ce.x86_64    3:23.0.6-1.el8    docker-ce-stable
<...>
```

安装一个特定版本时，要使用其完全限定的软件包名称，即软件包名称（docker-ce）加上版本字符串（第 2 列），中间用连字符（-）隔开。例如，`docker-ce-3:24.0.0-1.el8`。

将 `<VERSION_STRING>` 替换为所需的版本，然后运行以下命令进行安装：

```bash
$ sudo yum install docker-ce-VERSION_STRING docker-ce-cli-VERSION_STRING containerd.io docker-buildx-plugin docker-compose-plugin
```

这条命令会安装 Docker，但不会启动 Docker。它还会创建一个 `docker` 组，但默认情况下不会向该组添加任何用户。

:::

2. 启动 docker

```bash
sudo systemctl start docker
```

3. 运行 `hello-world` 映像，验证 Docker Engine 安装是否成功。

```shell
sudo docker run hello-world
```

这条命令会下载一个测试镜像，并在一个容器中运行。当容器运行时，它会打印一条确认信息并退出。

::: tip

可以不去执行，只要安装过程不报错就表明成功。

:::
