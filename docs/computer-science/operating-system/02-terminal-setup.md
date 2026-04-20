---
title: 美化 Windows 终端
date: 2024-11-07
icon: terminal
category:
  - 操作系统
tag:
  - Windows
  - terminal
  - oh-my-posh
---

在 Windows 上的开发体验，特别是在终端方面，相较于 macOS，常常让人觉得差了一点「味道」。macOS 上的 iTerm2 配合 oh-my-zsh，颜值高、功能强大，让开发者得以拥有流畅且美观的工作体验。而 Windows 默认的命令提示符（cmd）和 PowerShell，外观简单，功能也不够灵活。

幸运的是，随着 [Windows Terminal](https://github.com/microsoft/terminal) 的推出，我们终于可以在 Windows 上获得更现代的终端体验。Windows Terminal 拥有标签页支持、强大的配色和字体自定义功能，通过集成 [oh-my-posh](https://github.com/JanDeDobbeleer/oh-my-posh) 进行美化、安装支持丰富符号的字体、以及配置一些常用的开发工具，我们可以让 Windows 终端焕然一新，达到高颜值和高效兼具的效果。

![最终效果](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20250111181530.png)

接下来，让我们一步步将 Windows 终端打造成一个高效、好看且符合开发者习惯的环境，为平时的开发工作增添一份愉悦和舒适。

## 安装 Windows Terminal

Windows Terminal 是微软官方推出的现代终端工具，支持多标签页、GPU 加速、Unicode 和 Emoji 显示等特性，推荐直接在 [微软商店](https://apps.microsoft.com/detail/9n0dx20hk701?rtc=1&hl=zh-cn&gl=CN) 直接安装 Windows Terminal。

然后设置一下透明度，这里我选择的是 80%，并打开亚克力效果，这会让终端跟随底色增加透明模糊效果。

## 升级 PowerShell 7.x

Windows 10 或 Windows 11 默认的 PowerShell 版本较低，无法使用更多新特性，推荐升级到 PowerShell 7.x，PowerShell 7.x 是跨平台的，并且修复了很多 PowerShell 5.1 中的兼容性问题。

安装方式：

- 访问 [PowerShell GitHub Release 页面](https://github.com/PowerShell/PowerShell/releases) 下载适合你系统的版本。
- 或者，可以直接通过 Windows 包管理器 安装（需要 Windows 10 1809 或更高版本）：
  ```powershell
  winget install --id Microsoft.Powershell --source winget
  ```
- 如果你使用 Chocolatey 包管理器，也可以通过以下命令安装：
  ```powershell
  choco install powershell-core
  ```

安装完后，重新启动 Windows Terminal 以使用 PowerShell 7。

## 安装 oh-my-posh

[安装 oh-my-posh](https://ohmyposh.dev/docs/installation/windows) 可以使用如下命令：

```powershell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

这会安装 `oh-my-posh.exe` 和 oh-my-posh 的所有最新 [主题](https://ohmyposh.dev/docs/themes)。

> [!TIP]
>
> 为了重新加载 PATH，建议重新启动终端。如果 oh-my-posh 未被识别为命令，可以重新运行安装程序，或手动将其添加到 PATH。 例如：
>
> ```powershell
> $env:PATH += ";C:\Users\<username>\AppData\Local\Programs\oh-my-posh\bin"
> ```

为了在打开终端后自动加载 oh-my-posh，需要在 PowerShell 配置文件 `$PROFILE` 中添加以下内容：

```powershell
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\jandedobbeleer.omp.json" | Invoke-Expression
```

`--config` 参数指定主题配置文件路径，`$env:POSH_THEMES_PATH` 是 oh-my-posh 主题文件夹路径，可以通过 `Get-PoshThemes` 查看所有主题。

> [!TIP]
>
> `$PROFILE` 文件类似 `~/.zshrc` 或 `~/.bashrc`，以下命令会使用系统默认的文本编辑器打开：
>
> ```powershell
> notepad $PROFILE
> ```
>
> 编辑完成后，可以使用 `. $PROFILE` 重新加载配置。

### 设置字体

oh-my-posh 使用 [Nerd Fonts](https://www.nerdfonts.com/) 做为设计字体，官方推荐安装 [Meslo Nerd Font](https://www.nerdfonts.com/font-downloads)。这里我选择了 [BitstromWera Nerd Font](https://www.nerdfonts.com/font-downloads)。

可以在 [Nerd Fonts](https://www.nerdfonts.com/font-downloads) 页面下载和预览字体。也可以通过 oh-my-posh 提供的 CLI 安装：

```powershell
oh-my-posh font install
```

安装完成后，需要在 Windows Terminal 中设置字体，按 `CTRL + SHIFT + ,` 打开配置文件，在 `defaults` 属性下添加：

```json
{
  "profiles": {
    "defaults": {
      "font": {
        "face": "MesloLGM Nerd Font"
      }
    }
  }
}
```

如果使用了 VSCode，可以在 `settings.json` 中添加：

```json
"terminal.integrated.fontFamily": "Bitstream Vera Sans Mono Nerd Font"
```

## 环境配置

### Chocolatey

[Chocolatey](https://chocolatey.org/) 是一个 Windows 下的包管理器，可以方便地安装和管理软件。

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### vim

PowerShell 默认不支持 vim，需要安装 [vim](https://github.com/vim/vim) 或 [neovim](https://github.com/neovim/neovim)。

```powershell
choco install vim
```

安装完成后即可使用 `vim` 命令，再也不用使用 `notepad` 打开文件了。

### zoxide

[zoxide](https://github.com/ajeetdsouza/zoxide) 是一个跨平台的命令行工具，可以快速跳转到指定目录。

```powershell
choco install zoxide
```

安装完成后，配置 zoxide 到 PowerShell 中：

```powershell
notepad $PROFILE
```

在文件末尾添加：

```powershell
Invoke-Expression (& { (zoxide init powershell | Out-String) })
```

重新加载 PowerShell 配置文件：

```powershell
. $PROFILE
```

### git

使用 Chocolatey 安装 git：

```powershell
choco install git
```

安装完成后，配置 git 用户信息：

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### ssh

PowerShell 默认自带 ssh 客户端，可以直接使用。

生成 ssh key：

```powershell
ssh-keygen -t rsa -C "your_email@example.com"
```

将生成的 ssh key 添加到 GitHub，在 `Settings` -> `SSH and GPG keys` 页面添加。

然后使用 `ssh -T git@github.com` 测试连接。

如果出现以下报错，可以更改 ssh 客户端配置。

```powershell
ssh: connect to host github.com port 22: Connection refused
```

在 `C:\Users\<username>\.ssh\config` 文件（没有则创建）中添加以下内容：

```
Host github.com
  HostName ssh.github.com
  Port 443
```

这时再使用 `ssh -T git@github.com` 测试连接，应该就可以正常连接了。

```powershell
ssh -T git@github.com
```

### node

推荐使用 [fnm](../../frontend/engineering/basic/06-fnm-nvm.md) 安装 node。
