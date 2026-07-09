---
title: Docker 安装 MySQL
date: 2024-01-14
icon: install
category:
  - database
tag:
  - mysql
  - centos
  - docker
---

使用 Docker 安装 MySQL。

## 安装

从 [docker-hub](https://hub.docker.com/_/mysql/) 镜像源中找到想要安装的版本号。

这里直接安装最新版本。

```bash
docker pull mysql
```

等待一段时间安装完成后，启动 MySQL 容器：

```bash
docker run -d --name mysql-container -e MYSQL_ROOT_PASSWORD=my-secret-pw -v /path/to/data:/var/lib/mysql -e TZ=Asia/Shanghai -p 3306:3306 mysql
```

这个命令的参数解释如下：

- `-d`: 后台运行容器。
- `--name mysql-container`: 给容器起一个名字。
- `-e MYSQL_ROOT_PASSWORD=my-secret-pw`: 设置 MySQL root 用户的密码。
- `-p 3306:3306`: 将容器的 MySQL 服务端口（默认为 3306）映射到主机的 3306 端口。
- `-v /path/to/data:/var/lib/mysql`: 将容器中的 MySQL 数据目录挂载到主机上的 `/path/to/data` 目录。
- `-e TZ=Asia/Shanghai`: 设置时区。

启动容器后进入 MySQL 容器的命令行界面：

```bash
docker exec -it mysql-container bash
```

输入密码即可进入 MySQL 命令行界面。

## 设置 MySQL

进入到命令行界面后，设置一些基本的配置。

:::warning

MySQL 命令以 `;` 表示一行结束。

:::

1. 登陆 MySQL

```bash
mysql -u root -p
```

2. 创建数据库

```bash
create database your_data_base_name;
```

3. 创建用户

```bash
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
```

4. 设置权限

```bash
GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_username'@'localhost';
```

5. 刷新权限

```bash
FLUSH PRIVILEGES;
```

::: warning

必要步骤，否则权限会不生效。

:::

做完基本的配置之后，就可以使用下面命令退出命令行界面：

```bash
exit;
```

## 服务器开放端口

参考 [添加安全组规则](../../linux/set-the-ssh.md#添加安全组规则)。

接下来就可以使用 Navicat 连接数据库了。
