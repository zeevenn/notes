---
title: 自动切换 node 版本
date: 2024-07-18
icon: auto
category:
  - practice
tag:
  - zsh
  - node
  - efficiency
---

## 环境准备

1. 安装 `nvm`
   ```shell
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
   ```
2. 安装 `oh-my-zsh`：
   ```shell
   sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
   ```

## 配置 `.zshrc`

在 `.zshrc` 下新增以下内容：`vi ~/.zshrc`

```shell
# Load nvm and set up automatic version switching
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# Enable oh-my-zsh plugins
plugins=(git z nvm zsh-syntax-highlighting zsh-autosuggestions)

# Load oh-my-zsh
source $ZSH/oh-my-zsh.sh

# oh-my-zsh nvm plugin settings
zstyle ':omz:plugins:nvm' lazy yes
zstyle ':omz:plugins:nvm' autoload yes
zstyle ':omz:plugins:nvm' silent-autoload yes

# Load nvm automatically when changing directories
autoload -U add-zsh-hook
load-nvmrc() {
  if [[ -f .nvmrc && -r .nvmrc ]]; then
    nvm use
  elif [[ $(nvm version) != $(nvm version default) ]]; then
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

保存 `.zshrc` 文件后，重启终端或重新加载配置：`source ~/.zshrc`。

::: tip

`oh-my-zsh` 中的 `nvm` 提供了一些快捷命令和自动补全功能，使得使用 nvm (Node Version Manager) 更加便捷。

:::

## 添加 `.nvmrc`

项目根目录下创建 `.nvmrc` 文件，内容为 `v20.10.0`。

![auto-change-node](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240718145716.png)
