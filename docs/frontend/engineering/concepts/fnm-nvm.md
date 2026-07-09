---
title: fnm 和 nvm 对比
date: 2024-11-05
icon: vs
category:
  - 工程化
tag:
  - frontend
  - node
  - fnm
  - nvm
  - node package manager
---

在管理多个 Node.js 项目（每个项目都可能需要不同的 Node 版本）时，可靠的版本管理器可以简化您的工作流程。 两种流行的选择是 [fnm（Fast Node Manager）](https://github.com/Schniz/fnm) 和 [nvm（Node Version Manager）](https://github.com/nvm-sh/nvm)。本文从性能、功能、安装简便性、使用和兼容性等方面对 `fnm` 和 `nvm` 进行了比较，帮助你选择最适合自己开发需求的版本管理器。

## fnm 和 nvm 简介

`nvm`：作为最广泛使用的 Node.js 版本管理器，`nvm` 提供了可靠的 Node.js 版本管理。它用 Bash 编写，适用于类 UNIX 环境（如 macOS 和 Linux），也可以通过兼容的 shell（如 WSL）在 Windows 上使用。

`fnm`：`fnm` 是一种较新的、快速的替代方案，由 Rust 编写，以其速度闻名。`fnm` 支持多线程，因此在安装和切换 Node 版本时特别快。它还提供跨平台支持，包括 WSL、macOS 和 Windows。

## 安装

### `nvm`

要安装 `nvm`，在 UNIX 系统或 Windows 的 WSL 上运行以下命令：

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

或者使用 `wget`：

```shell
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

安装完成之后，在 `~/.bashrc` 或 `~/.zshrc` 中添加以下内容：

```shell
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

重启终端或运行 `source ~/.bashrc` 或 `source ~/.zshrc` 使配置生效，然后检查 `nvm` 是否安装成功：

```shell
nvm --version
```

### `fnm`

在 UNIX 系统上，可以运行脚本或使用 `homebrew` 安装 `fnm`：

```shell
# 运行脚本安装
curl -fsSL https://fnm.vercel.app/install | bash

# 或使用 homebrew 安装
brew install fnm
```

在 Windows 上，可以使用 PowerShell 安装 `fnm`：

```shell
winget install Schniz.fnm
```

安装完成后，需要设置环境变量。

#### `~/.bashrc`：

```shell
eval "$(fnm env --use-on-cd --shell bash)"
```

#### `~/.zshrc`：

```shell
eval "$(fnm env --use-on-cd --shell zsh)"
```

#### `PowerShell`：

```shell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

重启终端使配置生效，然后检查 `fnm` 是否安装成功：

```shell
fnm --version
```

## 使用

### `nvm`

#### 安装 Node.js 版本

```shell
nvm install <version>
```

#### 切换 Node.js 版本

```shell
nvm use <version>
```

#### 设置默认 Node.js 版本

```shell
nvm alias default <version>
```

#### 列出所有已安装的 Node.js 版本

```shell
nvm ls
```

#### 自动切换版本

`nvm` 默认没有支持根据 `.nvmrc` 文件自动切换版本，需要在 `~/.bashrc` 或 `~/.zshrc` 中添加以下内容：

```shell
# 自动使用 .nvmrc 文件中定义的 Node 版本
auto_nvm_use() {
  # 如果存在 .nvmrc 文件，则切换到该文件指定的版本
  if [ -f ".nvmrc" ]; then
    local nvmrc_version
    nvmrc_version=$(<.nvmrc)
    # 检查当前版本是否与 .nvmrc 中的版本不同
    if [ "$(nvm version)" != "v$nvmrc_version" ]; then
      nvm use "$nvmrc_version" || echo "NVM: Version $nvmrc_version specified in .nvmrc is not installed."
    fi
  fi
}

# 针对 Bash 的目录切换钩子
if [ -n "$BASH_VERSION" ]; then
  PROMPT_COMMAND="auto_nvm_use;$PROMPT_COMMAND"
fi

# 针对 Zsh 的目录切换钩子
if [ -n "$ZSH_VERSION" ]; then
  autoload -U add-zsh-hook
  add-zsh-hook chpwd auto_nvm_use
  auto_nvm_use  # 立即执行一次，适配启动后的初始目录
fi
```

同时，如果想要支持递归查找版本文件，也需要自己实现。

### `fnm`

#### 安装 Node.js 版本

```shell
fnm install <version>
```

#### 切换 Node.js 版本

```shell
fnm use <version>
```

#### 设置默认 Node.js 版本

```shell
fnm alias default <version>
```

#### 列出所有已安装的 Node.js 版本

```shell
fnm ls
```

#### 自动切换版本

`fnm` 默认支持根据 `.nvmrc`、`.node-version` 或 `packages.json#engines#node`（如果 `--resolve-engines` 启用）文件自动切换版本，只需要在 `~/.bashrc` 或 `~/.zshrc` 中添加以下内容，`--use-on-cd` 表示根据当前目录下的 `.nvmrc` 文件自动切换版本，`--version-file-strategy=recursive` 表示递归查找版本文件。

```shell
eval "$(fnm env --use-on-cd --version-file-strategy=recursive)"
```

::: tip

`fnm` 开箱即带许多功能。其中一些默认情况下不会激活，因为它们会改变 shell 的默认行为，还有一些只是功能标志，以避免破坏性更改，或者只是实验性的，直到我们认为值得引入它们为止。

所有这些功能都可以通过在初始化 shell 时为 `fnm env` 调用添加标志来配置。例如，如果你的 shell 设置为 `eval "$(fnm env)"`，那么你可以添加一个标志，将其更改为 `eval "$(fnm env --my-flag=value)"`。 

详细可以查看配置文档：[fnm 配置](https://github.com/Schniz/fnm/blob/master/docs/configuration.md) 实现更好的使用体验。

:::

### 命令对比

`fnm` 中的命令与 `nvm` 中的命令几乎完全相同，因此 `nvm` 用户可以根据需要更方便地切换到 `fnm`。

## 对比

### 性能比较

安装速度：由于采用 Rust 基础和多线程架构，`fnm` 的速度明显更快。 与 `nvm` 相比，安装时间通常更快。

内存使用：`fnm` 针对低内存使用率进行了优化，因此在高端和资源受限的系统上都很高效。

版本切换：在 `fnm` 中，版本切换是即时进行的。 相比之下，`nvm` 可能会出现轻微延迟，尤其是在切换大量使用的版本时。

### 跨平台兼容性

`nvm`：主要为类 UNIX 系统设计。在 Windows 上，可以通过 WSL 或第三方工具（如 nvm-windows）使用。

`fnm`：天然支持跨平台，包括 Windows、macOS 和 Linux，适合在不同操作系统上工作。

### 社区和支持

`nvm`：用户群体庞大，文档丰富，社区资源充足，解决问题更为容易。

`fnm`：虽然相对较新，但 `fnm` 的受欢迎度迅速上升，文档特别针对安装和使用做了详细的说明。

## 总结

`nvm` 和 `fnm` 都是管理 Node.js 版本的有效工具。虽然 `nvm` 是一个被广泛采用的选择，具有强大的社区支持，但 `fnm` 作为一种新兴的快速、轻量级替代方案，正在迅速崛起。对于需要跨平台兼容性和频繁版本切换的开发者来说，`fnm` 可能更适合，而偏好成熟工具和丰富文档支持的用户可以选择 `nvm`。
