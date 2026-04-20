---
title: Git 分支
date: 2024-02-07
icon: branch
category:
  - READING
tag:
  - git
  - branch
---

## 分支简介

Git 仓库中有五个对象：三个 _blob_ 对象（保存着文件快照）、一个 **树** 对象 （记录着目录结构和 blob 对象索引）以及一个 **提交** 对象（包含着指向前述树对象的指针和所有提交信息）。

做些修改后再次提交，那么这次产生的提交对象会包含一个指向上次提交对象（父对象）的指针。

![提交对象及其父对象](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/image-20231012172546292.png)

Git 的分支，其实本质上仅仅是指向提交对象的可变指针。 Git 的默认分支名字是 `master`。 在多次提交操作之后，你其实已经有一个指向最后那个提交对象的 `master` 分支。 `master` 分支会在每次提交时自动向前移动。

![分支及其提交历史](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/image-20231012172739646.png)

### 新建分支

Git 在新建分支时创建了一个可以移动的新的指针。 比如，创建一个 testing 分支， 你需要使用 `git branch` 命令：

```shell
$ git branch testing
```

这会在当前所在的提交对象上创建一个指针。

![两个指向相同提交历史的分支](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/two-branches.png)

Git 使用 Head 指针确定当前在哪一个分支上，指向当前所在的本地分支。在本例中，你仍然在 `master` 分支上。 因为 `git branch` 命令仅仅 **创建** 一个新分支，并不会自动切换到新分支中去。

![HEAD 指向当前所在的分支](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/head-to-master.png)

### 分支切换

::: tip

新版本使用 `git switch` 进行分支切换。

:::

要切换到一个已存在的分支，你需要使用 `git checkout` 命令。 我们现在切换到新创建的 `testing` 分支去：

```shell
$ git checkout testing
```

这样 `HEAD` 就指向 `testing` 分支了。

![HEAD 指向当前所在的分支。](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/head-to-testing.png)

现在不妨再提交一次：

```shell
$ vim test.rb
$ git commit -a -m 'made a change'
```

![HEAD 分支随着提交操作自动向前移动](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/advance-testing-20231016151948599.png)

如图所示，你的 `testing` 分支向前移动了，但是 `master` 分支却没有，它仍然指向运行 `git checkout` 时所指的对象。 这就有意思了，现在我们切换回 `master` 分支看看：

```shell
$ git checkout master
```

![检出时 HEAD 随之移动](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/checkout-master.png)

这条命令做了两件事。 一是使 HEAD 指回 `master` 分支，二是将工作目录恢复成 `master` 分支所指向的快照内容。 也就是说，你现在做修改的话，项目将始于一个较旧的版本。 本质上来讲，这就是忽略 `testing` 分支所做的修改，以便于向另一个方向进行开发。

::: tip 分支新建与切换

`git checkout -b branch_name` 可以快速创建新分支并切换到该分支上。

:::

::: tip 分支切换会改变你工作目录中的文件

在切换分支时，一定要注意你工作目录里的文件会被改变。 如果是切换到一个较旧的分支，你的工作目录会恢复到该分支最后一次提交时的样子。 如果 Git 不能干净利落地完成这个任务，它将禁止切换分支。

:::

我们不妨再稍微做些修改并提交：

```console
$ vim test.rb
$ git commit -a -m 'made other changes'
```

现在，这个项目的提交历史已经产生了分叉（参见 [项目分叉历史](https://git-scm.com/book/zh/v2/ch00/divergent_history)）。 因为刚才你创建了一个新分支，并切换过去进行了一些工作，随后又切换回 master 分支进行了另外一些工作。 上述两次改动针对的是不同分支：你可以在不同分支间不断地来回切换和工作，并在时机成熟时将它们合并起来。 而所有这些工作，你需要的命令只有 `branch`、`checkout` 和 `commit`。

![项目分叉历史。](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/advance-master.png)

::: tip

由于 Git 的分支实质上仅是包含所指对象校验和（长度为 40 的 SHA-1 值字符串）的文件，所以它的创建和销毁都异常高效。创建一个新分支就相当于往一个文件中写入 41 个字节（40 个字符和 1 个换行符），
如此的简单能不快吗？

:::

## 分支合并

让我们来看一个简单的分支新建与分支合并的例子，实际工作中你可能会用到类似的工作流。 你将经历如下步骤：

1. 开发某个网站。
2. 为实现某个新的用户需求，创建一个分支。
3. 在这个分支上开展工作。

正在此时，你突然接到一个电话说有个很严重的问题需要紧急修补。 你将按照如下方式来处理：

1. 切换到你的线上分支（production branch）。
2. 为这个紧急任务新建一个分支，并在其中修复它。
3. 在测试通过之后，切换回线上分支，然后合并这个修补分支，最后将改动推送到线上分支。
4. 切换回你最初工作的分支上，继续工作。

### 新建分支

首先，我们假设你正在你的项目上工作，并且在 `master` 分支上已经有了一些提交。

![一个简单的提交历史。](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/basic-branching-1.png)

现在，你已经决定要解决你的公司使用的问题追踪系统中的 #53 问题。 想要新建一个分支并同时切换到那个分支上，你可以运行一个带有 `-b` 参数的 `git checkout` 命令：

```console
$ git checkout -b iss53
Switched to a new branch "iss53"
```

它是下面两条命令的简写：

```console
$ git branch iss53
$ git checkout iss53
```

![创建一个新分支指针](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/basic-branching-2.png)

你继续在 #53 问题上工作，并且做了一些提交。 在此过程中，`iss53` 分支在不断的向前推进，因为你已经检出到该分支 （也就是说，你的 `HEAD` 指针指向了 `iss53` 分支）

```console
$ vim index.html
$ git commit -a -m 'added a new footer [issue 53]'
```

![`iss53` 分支随着工作的进展向前推进。](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/basic-branching-3.png)

现在你接到那个电话，有个紧急问题等待你来解决。有了 Git 的帮助，现在只需要切换回 `master` 分支。在切换分支之前，需要提交一个 `commit` **保持干净的工作区**。

现在，我们假设你已经把你的修改全部提交了，这时你可以切换回 `master` 分支了：

```console
$ git checkout master
Switched to branch 'master'
```

这个时候，你的工作目录和你在开始 #53 问题之前一模一样，现在你可以专心修复紧急问题了。建立一个 `hotfix` 分支，在该分支上工作直到问题解决：

```console
$ git checkout -b hotfix
Switched to a new branch 'hotfix'
$ vim index.html
$ git commit -a -m 'fixed the broken email address'
[hotfix 1fb7853] fixed the broken email address
 1 file changed, 2 insertions(+)
```

![基于 `master` 分支的紧急问题分支（hotfix branch）。](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/basic-branching-4.png)

你可以运行你的测试，确保你的修改是正确的，然后将 `hotfix` 分支合并回你的 `master` 分支来部署到线上。 你可以使用 `git merge` 命令来达到上述目的：

```console
$ git checkout master
$ git merge hotfix
Updating f42c576..3a0874c
Fast-forward
 index.html | 2 ++
 1 file changed, 2 insertions(+)
```

在合并的时候，你应该注意到了「快进（fast-forward）」这个词。

由于你想要合并的分支 `hotfix` 所指向的提交 `C4` 是你所在的提交 `C2` 的直接后继， 因此 Git 会直接将指针向前移动。换句话说，当你试图合并两个分支时， 如果顺着一个分支走下去能够到达另一个分支，那么 Git 在合并两者的时候， 只会简单的将指针向前推进（指针右移），因为这种情况下的合并操作没有需要解决的分歧——这就叫做「快进（fast-forward）」。

现在，最新的修改已经在 `master` 分支所指向的提交快照中，你可以着手发布该修复了。

![`master` 被快进到 `hotfix`。](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/basic-branching-5.png)

关于这个紧急问题的解决方案发布之后，你准备回到被打断之前时的工作中。然而，你应该先删除 `hotfix` 分支，因为你已经不再需要它了——`master` 分支已经指向了同一个位置。 你可以使用带 `-d` 选项的 `git branch` 命令来删除分支：

```console
$ git branch -d hotfix
Deleted branch hotfix (3a0874c).
```

现在你可以切换回你正在工作的分支继续你的工作，也就是针对 #53 问题的那个分支（iss53 分支）。

```console
$ git checkout iss53
Switched to branch "iss53"
$ vim index.html
$ git commit -a -m 'finished the new footer [issue 53]'
[iss53 ad82d7a] finished the new footer [issue 53]
1 file changed, 1 insertion(+)
```

![继续在 `iss53` 分支上的工作](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/basic-branching-6-20231016171324548.png)

### 分支合并

假设你已经修正了 #53 问题，并且打算将你的工作合并入 `master` 分支。 为此，你需要合并 `iss53` 分支到 `master` 分支，这和之前你合并 `hotfix` 分支所做的工作差不多。 你只需要检出到你想合并入的分支，然后运行 `git merge` 命令：

```console
$ git checkout master
Switched to branch 'master'
$ git merge iss53
Merge made by the 'recursive' strategy.
index.html |    1 +
1 file changed, 1 insertion(+)
```

这和你之前合并 `hotfix` 分支的时候看起来有一点不一样。 在这种情况下，你的开发历史从一个更早的地方开始分叉开来（diverged）。 因为，`master` 分支所在提交并不是 `iss53` 分支所在提交的直接祖先，Git 不得不做一些额外的工作。 出现这种情况的时候，Git 会使用两个分支的末端所指的快照（`C4` 和 `C5`）以及这两个分支的公共祖先（`C2`），做一个简单的三方合并。

![一次典型合并中所用到的三个快照](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/basic-merging-1.png)

和之前将分支指针向前推进所不同的是，Git 将此次三方合并的结果做了一个新的快照并且自动创建一个新的提交指向它。 这个被称作一次合并提交，它的特别之处在于他有不止一个父提交。

![一个合并提交](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/basic-merging-2.png)

### 解决冲突

如果你在两个不同的分支中，对同一个文件的同一个部分进行了不同的修改，Git 就没法干净的合并它们。 如果你对 #53 问题的修改和有关 `hotfix` 分支的修改都涉及到同一个文件的同一处，在合并它们的时候就会产生合并冲突：

```console
$ git merge iss53
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

此时 Git 做了合并，但是没有自动地创建一个新的合并提交。 Git 会暂停下来，等待你去解决合并产生的冲突。 你可以在合并冲突后的任意时刻使用 `git status` 命令来查看那些因包含合并冲突而处于未合并（unmerged）状态的文件：

```console
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)

    both modified:      index.html

no changes added to commit (use "git add" and/or "git commit -a")
```

任何因包含合并冲突而有待解决的文件，都会以未合并状态标识出来。 Git 会在有冲突的文件中加入标准的冲突解决标记，这样你可以打开这些包含冲突的文件然后手动解决冲突。 出现冲突的文件会包含一些特殊区段，看起来像下面这个样子：

```html
<<<<<<< HEAD:index.html
<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer">please contact us at support@github.com</div>
>>>>>>> iss53:index.html
```

这表示 `HEAD` 所指示的版本（也就是你的 `master` 分支所在的位置，因为你在运行 merge 命令的时候已经检出到了这个分支）在这个区段的上半部分（`=======` 的上半部分），而 `iss53` 分支所指示的版本在 `=======` 的下半部分。 为了解决冲突，你必须选择使用由 `=======` 分割的两部分中的一个，或者你也可以自行合并这些内容。 例如，你可以通过把这段内容换成下面的样子来解决冲突：

```html
<div id="footer">please contact us at email.support@github.com</div>
```

上述的冲突解决方案仅保留了其中一个分支的修改，并且 `<<<<<<<` , `=======` , 和 `>>>>>>>` 这些行被完全删除了。 在你解决了所有文件里的冲突之后，对每个文件使用 `git add` 命令来将其标记为冲突已解决。 一旦暂存这些原本有冲突的文件，Git 就会将它们标记为冲突已解决。

::: tip

VScode 提供了图形化工具用以解决冲突。

:::

等你退出合并工具之后，Git 会询问刚才的合并是否成功。 如果你回答是，Git 会暂存那些文件以表明冲突已解决： 你可以再次运行 `git status` 来确认所有的合并冲突都已被解决：

```console
$ git status
On branch master
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)

Changes to be committed:

    modified:   index.html
```

如果你对结果感到满意，并且确定之前有冲突的的文件都已经暂存了，这时你可以输入 `git commit` 来完成合并提交。 默认情况下提交信息看起来像下面这个样子：

```console
Merge branch 'iss53'

Conflicts:
    index.html
#
# It looks like you may be committing a merge.
# If this is not correct, please remove the file
#	.git/MERGE_HEAD
# and try again.


# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# On branch master
# All conflicts fixed but you are still merging.
#
# Changes to be committed:
#	modified:   index.html
#
```

如果你觉得上述的信息不够充分，不能完全体现分支合并的过程，你可以修改上述信息，添加一些细节给未来检视这个合并的读者一些帮助，告诉他们你是如何解决合并冲突的，以及理由是什么。

## 分支管理

`git branch` 命令不只是可以创建与删除分支。 如果不加任何参数运行它，会得到当前所有分支的一个列表：

```console
$ git branch
  iss53
* master
  testing
```

注意 `master` 分支前的 `*` 字符：它代表现在检出的那一个分支（也就是说，当前 `HEAD` 指针所指向的分支）。

如果需要查看每一个分支的最后一次提交，可以运行 `git branch -v` 命令：

```console
$ git branch -v
  iss53   93b412c fix javascript issue
* master  7a98805 Merge branch 'iss53'
  testing 782fd34 add scott to the author list in the readmes
```

`--merged` 与 `--no-merged` 这两个有用的选项可以过滤这个列表中已经合并或尚未合并到当前分支的分支。 如果要查看哪些分支已经合并到当前分支，可以运行 `git branch --merged`：

```console
$ git branch --merged
  iss53
* master
```

因为之前已经合并了 `iss53` 分支，所以现在看到它在列表中。 在这个列表中分支名字前没有 `*` 号的分支通常可以使用 `git branch -d` 删除掉；你已经将它们的工作整合到了另一个分支，所以并不会失去任何东西。

这里显示了其他分支。 因为它包含了还未合并的工作，尝试使用 `git branch -d` 命令删除它时会失败：

```console
$ git branch -d testing
error: The branch 'testing' is not fully merged.
If you are sure you want to delete it, run 'git branch -D testing'.
```

如果真的想要删除分支并丢掉那些工作，如同帮助信息里所指出的，可以使用 `-D` 选项强制删除它。

::: tip

上面描述的选项 `--merged` 和 `--no-merged` 会在没有给定提交或分支名作为参数时， 分别列出已合并或未合并到 **当前** 分支的分支。

你总是可以提供一个附加的参数来查看其它分支的合并状态而不必检出它们。 例如，尚未合并到 `master` 分支的有哪些？

```console
$ git checkout testing
$ git branch --no-merged master
topicA
featureB
```

:::

## 分支开发工作流

在整个项目开发周期的不同阶段，你可以同时拥有多个开发的分支；你可以定期地把某些主题分支合并入其他分支中。

只在 `master` 分支上保留完全稳定的代码——有可能仅仅是已经发布或即将发布的代码。 他们还有一些名为 `develop` 或者 `next` 的平行分支，被用来做后续开发或者测试稳定性——这些分支不必保持绝对稳定，但是一旦达到稳定状态，它们就可以被合并入 `master` 分支了。

![趋于稳定分支的工作流（“silo”）视图。](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/lr-branches-2.png)

## 远程分支

远程分支以 `<remote>/<branch>` 的形式命名。 例如，`origin/master` 分支。

假设你的网络里有一个在 `git.ourcompany.com` 的 Git 服务器。

如果你从这里克隆，Git 的 `clone` 命令会为你自动将该远程分支命名为 `origin`，拉取它的所有数据，创建一个指向它的 `master` 分支的指针，并且在本地将其命名为 `origin/master`。

Git 也会给你一个与 `origin` 的 `master` 分支在指向同一个地方的本地 `master` 分支。

![克隆之后的服务器与本地仓库](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240207145750.png)

如果你在本地的 `master` 分支做了一些工作，在同一段时间内有其他人推送提交到 `git.ourcompany.com` 并且更新了它的 `master` 分支，这就是说你们的提交历史已走向不同的方向。

![本地与远程的工作可以分叉](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240207145827.png)

如果要与给定的远程仓库同步数据，运行 `git fetch <remote>` 命令（在本例中为 `git fetch origin`）。

::: tip

通常可以省略 `<remote>`。

:::

这个命令查找 `origin` 是哪一个服务器（在本例中，它是 `git.ourcompany.com`），从中抓取本地没有的数据，并且更新本地数据库，移动 `origin/master` 指针到更新之后的位置。

![git fetch 更新你的远程跟踪分支](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240207145928.png)

为了演示有多个远程仓库与远程分支的情况，我们假定你有另一个内部 Git 服务器，仅服务于你的某个敏捷开发团队。这个服务器位于 `git.team1.ourcompany.com`。 你可以运行 `git remote add` 命令添加一个新的远程仓库引用到当前的项目。将这个远程仓库命名为 `teamone`，将其作为完整 URL 的缩写。

![添加另一个远程仓库](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240207150645.png)

现在，可以运行 `git fetch teamone` 来抓取远程仓库 `teamone` 有而本地没有的数据。 因为那台服务器上现有的数据是 `origin` 服务器上的一个子集， 所以 Git 并不会抓取数据而是会设置远程跟踪分支 `teamone/master` 指向 `teamone` 的 `master` 分支。

![远程跟踪分支 teamone/master](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240207150743.png)

### 推送

本地的分支并不会自动与远程仓库同步——你必须显式地推送想要分享的分支。

如果希望和别人一起在名为 `serverfix` 的分支上工作，你可以像推送第一个分支那样推送它。 运行 `git push <remote> <branch>`:

```console
$ git push origin serverfix
Counting objects: 24, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (15/15), done.
Writing objects: 100% (24/24), 1.91 KiB | 0 bytes/s, done.
Total 24 (delta 2), reused 0 (delta 0)
To https://github.com/schacon/simplegit

- [new branch] serverfix -> serverfix
```

你也可以运行 `git push origin serverfix:serverfix`， 它会「推送本地的 `serverfix` 分支，将其作为远程仓库的 `serverfix` 分支」。

可以通过这种格式来推送本地分支到一个命名不相同的远程分支。如果并不想让远程仓库上的分支叫做 `serverfix`，可以运行 `git push origin serverfix:awesomebranch` 来将本地的 `serverfix` 分支推送到远程仓库上的 `awesomebranch` 分支。

下一次其他协作者从服务器上抓取数据时，他们会在本地生成一个远程分支 `origin/serverfix`，指向服务器的 `serverfix` 分支的引用：

```console
$ git fetch origin
remote: Counting objects: 7, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 3 (delta 0)
Unpacking objects: 100% (3/3), done.
From https://github.com/schacon/simplegit
 * [new branch]      serverfix    -> origin/serverfix
```

要特别注意的一点是使用 `git fetch` 获取到新的远程跟踪分支时，本地不会有一个新的 `serverfix` 分支——只有一个不可以修改的 `origin/serverfix` 指针。

可以运行 `git merge origin/serverfix` 将这些工作合并到当前所在的分支。 如果想要在自己的 `serverfix` 分支上工作，可以将其建立在远程跟踪分支之上：

```console
$ git checkout -b serverfix origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```

这会给你一个用于工作的本地分支，并且起点位于 `origin/serverfix`。

::: tip

也可以使用 `git switch <branch>`，Git 会自动新建一个分支并跟踪拉取下来的远程分支。

:::

### 拉取

当 `git fetch` 命令从服务器上抓取本地没有的数据时，它并不会修改工作目录中的内容。 它只会获取数据然后让你自己合并。

然而，有一个命令叫作 `git pull` 在大多数情况下它的含义是一个 `git fetch` 紧接着一个 `git merge` 命令。

::: tip

由于 `git pull` 的魔法经常令人困惑所以通常单独显式地使用 `fetch` 与 `merge` 命令会更好一些。

:::

### 删除

假设你已经通过远程分支做完所有的工作了——也就是说你和你的协作者已经完成了一个特性， 并且将其合并到了远程仓库的 `master` 分支（或任何其他稳定代码分支）。 可以运行带有 `--delete` 选项的 `git push` 命令来删除一个远程分支。 如果想要从服务器上删除 `serverfix` 分支，运行下面的命令：

```console
$ git push origin --delete serverfix
To https://github.com/schacon/simplegit

- [deleted] serverfix
```

基本上这个命令做的只是从服务器上移除这个指针。 Git 服务器通常会保留数据一段时间直到垃圾回收运行，所以如果不小心删除掉了，通常是很容易恢复的。

## 变基

在 Git 中整合来自不同分支的修改主要有两种方法：`merge` 以及 `rebase`。

### 基本操作

当你的项目目前分叉到两个分支，又各自提交了更新。

![分叉的提交历史](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240207161737.png)

之前介绍过，整合分支最容易的方法是 `merge` 命令。 它会把两个分支的最新快照（`C3` 和 `C4`）以及二者最近的共同祖先（`C2`）进行三方合并，合并的结果是生成一个新的快照（并提交）。

![通过合并操作来整合分叉的历史](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240207161821.png)

其实，还有一种方法：你可以提取在 `C4` 中引入的补丁和修改，然后在 `C3` 的基础上应用一次。 在 Git 中，这种操作就叫做「变基（rebase）」。 你可以使用 `rebase` 命令将提交到某一分支上的所有修改都移至另一分支上，就好像 **重新播放** 一样。

在这个例子中，你可以检出 `experiment` 分支，然后将它变基到 `master` 分支上：

```shell
$ git checkout experiment
$ git rebase master
First, rewinding head to replay your work on top of it...
Applying: added staged command
```

它的原理是首先找到这两个分支（即当前分支 `experiment`、变基操作的目标基底分支 `master`） 的最近共同祖先 `C2`，然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件，然后将当前分支指向目标基底 `C3`, 最后以此将之前另存为临时文件的修改依序应用。

![将 C4 中的修改变基到 C3 上](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240207162127.png)

现在回到 master 分支，进行一次快进合并。

```shell
$ git checkout master
$ git merge experiment
```

![master 分支的快进合并](https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/20240207163046.png)

这两种整合方法的最终结果没有任何区别，但是变基使得提交历史更加整洁。你在查看一个经过变基的分支的历史记录时会发现，尽管实际的开发工作是并行的，但它们看上去就像是串行的一样，提交历史是一条直线没有分叉。

请注意，无论是通过变基，还是通过三方合并，整合的最终结果所指向的快照始终是一样的，只不过提交历史不同罢了。变基是将一系列提交按照原有次序依次应用到另一分支上，而合并是把最终结果合在一起。

### 变基的风险

呃，奇妙的变基也并非完美无缺，要用它得遵守一条准则：

**如果提交存在于你的仓库之外，而别人可能基于这些提交进行开发，那么不要执行变基。**

因为 `rebase` 会修改 `commit`，若你拉取的是 `rebase` 后的代码，则会遇到冲突。

若发生 `git pull` 拉取冲突，需要使用 `git pull --rebase` 解决。

### 变基 vs. 合并

有一种观点认为，仓库的提交历史即是 **记录实际发生过什么**。 它是针对历史的文档，本身就有价值，不能乱改。从这个角度看来，改变提交历史是一种亵渎，你使用 **谎言** 掩盖了实际发生过的事情。 如果由合并产生的提交历史是一团糟怎么办？ 既然事实就是如此，那么这些痕迹就应该被保留下来，让后人能够查阅。

另一种观点则正好相反，他们认为提交历史是 **项目过程中发生的事**。 没人会出版一本书的第一版草稿，软件维护手册也是需要反复修订才能方便使用。 持这一观点的人会使用 `rebase` 及 `filter-branch` 等工具来编写故事，怎么方便后来的读者就怎么写。

总的原则是，只对尚未推送或分享给别人的本地修改执行变基操作清理历史，从不对已推送至别处的提交执行变基操作，这样，你才能享受到两种方式带来的便利。
