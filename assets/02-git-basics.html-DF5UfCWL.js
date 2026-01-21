import{_ as c,c as o,e as a,a as s,d as e,b as i,w as p,r as t,o as r}from"./app-CLpx1oFg.js";const u={},v={href:"https://git-scm.com/book/zh/v2/ch00/_data_recovery",target:"_blank",rel:"noopener noreferrer"},m={class:"hint-container warning"};function b(g,n){const l=t("ExternalLinkIcon"),d=t("RouteLink");return r(),o("div",null,[n[14]||(n[14]=a(`<h2 id="初始化-git-仓库" tabindex="-1"><a class="header-anchor" href="#初始化-git-仓库"><span>初始化 Git 仓库</span></a></h2><p>有两种方式：</p><ol><li><code>git clone</code></li><li><code>git init</code></li></ol><h2 id="记录更新" tabindex="-1"><a class="header-anchor" href="#记录更新"><span>记录更新</span></a></h2><p>工作目录下的每一个文件都不外乎两种状态：<strong>已跟踪</strong> 或 <strong>未跟踪</strong>。</p><p>已跟踪的文件是指那些被纳入了版本控制的文件，在上一次快照中有它们的记录，在工作一段时间后， 它们的状态可能是未修改，已修改或已放入暂存区。简而言之，已跟踪的文件就是 Git 已经知道的文件。</p><p>工作目录中除已跟踪文件外的其它所有文件都属于未跟踪文件，它们既不存在于上次快照的记录中，也没有被放入暂存区。</p><p>编辑过某些文件之后，由于自上次提交后你对它们做了修改，Git 将它们标记为已修改文件。 在工作时，你可以选择性地将这些修改过的文件放入暂存区，然后提交所有已暂存的修改，如此反复。</p><figure><img src="https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/lifecycle.png" alt="Git 下文件生命周期图。" tabindex="0" loading="lazy"><figcaption>Git 下文件生命周期图。</figcaption></figure><h3 id="检查状态" tabindex="-1"><a class="header-anchor" href="#检查状态"><span>检查状态</span></a></h3><p>使用 <code>git status</code> 查看文件处于什么状态。如果在克隆仓库后立即使用此命令，会看到类似这样的输出：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master
Your branch is up-to-date with <span class="token string">&#39;origin/master&#39;</span><span class="token builtin class-name">.</span>
nothing to commit, working directory clean
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的信息表明：</p><ul><li>现在的工作目录相当干净。换句话说，所有已跟踪文件在上次提交后都未被更改过。</li><li>此外，当前目录下没有出现任何处于未跟踪状态的新文件，否则 Git 会在这里列出来。</li><li>最后，该命令还显示了当前所在分支，并告诉你这个分支同远程服务器上对应的分支没有偏离。 现在，分支名是 <code>master</code>（默认的分支名）。</li></ul><h3 id="跟踪新文件" tabindex="-1"><a class="header-anchor" href="#跟踪新文件"><span>跟踪新文件</span></a></h3><p>如果新增一个文件，意味着此为 <code>Untracked files</code>，Git 在之前的快照（提交）中没有这些文件。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master
Your branch is up-to-date with <span class="token string">&#39;origin/master&#39;</span><span class="token builtin class-name">.</span>
Untracked files:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to include <span class="token keyword">in</span> what will be committed<span class="token punctuation">)</span>

    README

nothing added to commit but untracked files present <span class="token punctuation">(</span>use <span class="token string">&quot;git add&quot;</span> to track<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用 <code>git add README</code> 跟踪文件，并检查状态：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">add</span> README
$ <span class="token function">git</span> status
Your branch is up-to-date with <span class="token string">&#39;origin/master&#39;</span><span class="token builtin class-name">.</span>
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore --staged &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>

    new file:   README
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只要在 <code>Changes to be committed</code> 这行下面的，就说明是已暂存状态。 如果此时提交，那么该文件在你运行 <code>git add</code> 时的版本将被留存在后续的历史记录中。</p><h3 id="暂存已修改的文件" tabindex="-1"><a class="header-anchor" href="#暂存已修改的文件"><span>暂存已修改的文件</span></a></h3><p>如果修改一个文件，运行 <code>git status</code>，会看到以下内容：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master
Your branch is up-to-date with <span class="token string">&#39;origin/master&#39;</span><span class="token builtin class-name">.</span>
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git reset HEAD &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>

    new file:   README

Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git checkout -- &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>

    modified:   CONTRIBUTING.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>文件 <code>CONTRIBUTING.md</code> 出现在 <code>Changes not staged for commit</code> 这行下面，说明已跟踪文件的内容发生了变化，但还没有放到暂存区。 要暂存这次更新，需要运行 <code>git add</code> 命令。 这是个多功能命令：</p><ol><li>开始跟踪新文件；</li><li>把已跟踪的文件放到暂存区；</li><li>合并时把有冲突的文件标记为已解决状态等。</li></ol><p>将这个命令理解为「精确地将内容添加到下一次提交中」而不是「将一个文件添加到项目中」要更加合适。</p><p>现在让我们运行 <code>git add</code> 将 <code>CONTRIBUTING.md</code> 放到暂存区，然后再看看 <code>git status</code> 的输出：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">add</span> CONTRIBUTING.md
$ <span class="token function">git</span> status
On branch master
Your branch is up-to-date with <span class="token string">&#39;origin/master&#39;</span><span class="token builtin class-name">.</span>
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git reset HEAD &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>

    new file:   README
    modified:   CONTRIBUTING.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果再次修改 <code>CONTRIBUTING.md</code> 文件，检查状态：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master
Your branch is up-to-date with <span class="token string">&#39;origin/master&#39;</span><span class="token builtin class-name">.</span>
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git reset HEAD &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>

    new file:   README
    modified:   CONTRIBUTING.md

Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git checkout -- &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>

    modified:   CONTRIBUTING.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在 <code>CONTRIBUTING.md</code> 文件同时出现在暂存区和非暂存区。Git 只不过暂存了你运行 <code>git add</code> 命令时的版本。 如果你现在提交，<code>CONTRIBUTING.md</code> 的版本是你最后一次运行 <code>git add</code> 命令时的那个版本，而不是你运行 <code>git commit</code> 时，在工作目录中的当前版本。 所以，运行了 <code>git add</code> 之后又作了修订的文件，需要重新运行 <code>git add</code> 把最新版本重新暂存起来：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">add</span> CONTRIBUTING.md
$ <span class="token function">git</span> status
On branch master
Your branch is up-to-date with <span class="token string">&#39;origin/master&#39;</span><span class="token builtin class-name">.</span>
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git reset HEAD &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>

    new file:   README
    modified:   CONTRIBUTING.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="状态简览" tabindex="-1"><a class="header-anchor" href="#状态简览"><span>状态简览</span></a></h3><p>使用 <code>git status -s</code> 得到更加简洁的输出：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status <span class="token parameter variable">-s</span>
 M README
MM Rakefile
A  lib/git.rb
M  lib/simplegit.rb
?? LICENSE.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出中有两栏，左栏指明了暂存区的状态，右栏指明了工作区的状态。</p><p>新添加的未跟踪文件前面有 <code>??</code> 标记，新添加到暂存区中的文件前面有 <code>A</code> 标记，修改过的文件前面有 <code>M</code> 标记。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>上面的状态报告显示：</p><p><code>README</code> 文件在工作区已修改但尚未暂存，而 <code>lib/simplegit.rb</code> 文件已修改且已暂存。</p><p><code>Rakefile</code> 文件已修改，暂存后又作了修改，因此该文件的修改中既有已暂存的部分，又有未暂存的部分。</p></div><h3 id="忽略文件" tabindex="-1"><a class="header-anchor" href="#忽略文件"><span>忽略文件</span></a></h3><p>创建一个名为 <code>.gitignore</code> 的文件，列出要忽略的文件的模式。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>*.<span class="token punctuation">[</span>oa<span class="token punctuation">]</span>
*~
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>文件 <code>.gitignore</code> 的格式规范如下：</p><ul><li>所有空行或者以 <code>#</code> 开头的行都会被 Git 忽略。</li><li>可以使用标准的 glob 模式匹配，它会递归地应用在整个工作区中。</li><li>匹配模式可以以（<code>/</code>）开头防止递归。</li><li>匹配模式可以以（<code>/</code>）结尾指定目录。</li><li>要忽略指定模式以外的文件或目录，可以在模式前加上叹号（<code>!</code>）取反。</li></ul><h3 id="查看修改" tabindex="-1"><a class="header-anchor" href="#查看修改"><span>查看修改</span></a></h3><p><code>git diff</code> 能通过文件补丁的格式更加具体地显示哪些行发生了改变。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>可以通过 IDE 查看工作树的变更。</p></div><h3 id="提交更新" tabindex="-1"><a class="header-anchor" href="#提交更新"><span>提交更新</span></a></h3><p>每次准备提交前，先用 <code>git status</code> 看下，你所需要的文件是不是都已暂存起来了， 然后再运行提交命令 <code>git commit</code>：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> commit
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这样会启动你选择的文本编辑器来输入提交说明。</p><p>也可以直接在 <code>commit</code> 命令后添加 <code>-m</code> 选项，将提交信息与命令放在同一行，如下所示：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;Story 182: Fix benchmarks for speed&quot;</span>
<span class="token punctuation">[</span>master 463dc4f<span class="token punctuation">]</span> Story <span class="token number">182</span>: Fix benchmarks <span class="token keyword">for</span> speed
 <span class="token number">2</span> files changed, <span class="token number">2</span> insertions<span class="token punctuation">(</span>+<span class="token punctuation">)</span>
 create mode <span class="token number">100644</span> README
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提交后它会告诉你，当前是在哪个分支（<code>master</code>）提交的，本次提交的完整 SHA-1 校验和是什么（<code>463dc4f</code>），以及在本次提交中，有多少文件修订过，多少行添加和删改过。</p><blockquote><p>提交时记录的是放在暂存区域的快照。 任何还未暂存文件的仍然保持已修改状态，可以在下次提交时纳入版本管理。 每一次运行提交操作，都是对你项目作一次快照，以后可以回到这个状态，或者进行比较。</p></blockquote><h3 id="跳过使用暂存区域" tabindex="-1"><a class="header-anchor" href="#跳过使用暂存区域"><span>跳过使用暂存区域</span></a></h3><p>只要在提交的时候，给 <code>git commit</code> 加上 <code>-a</code> 选项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 <code>git add</code> 步骤：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master
Your branch is up-to-date with <span class="token string">&#39;origin/master&#39;</span><span class="token builtin class-name">.</span>
Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git checkout -- &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>

    modified:   CONTRIBUTING.md

no changes added to commit <span class="token punctuation">(</span>use <span class="token string">&quot;git add&quot;</span> and/or <span class="token string">&quot;git commit -a&quot;</span><span class="token punctuation">)</span>
$ <span class="token function">git</span> commit <span class="token parameter variable">-a</span> <span class="token parameter variable">-m</span> <span class="token string">&#39;added new benchmarks&#39;</span>
<span class="token punctuation">[</span>master 83e38c7<span class="token punctuation">]</span> added new benchmarks
 <span class="token number">1</span> <span class="token function">file</span> changed, <span class="token number">5</span> insertions<span class="token punctuation">(</span>+<span class="token punctuation">)</span>, <span class="token number">0</span> deletions<span class="token punctuation">(</span>-<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="移除文件" tabindex="-1"><a class="header-anchor" href="#移除文件"><span>移除文件</span></a></h3><p>可以用 <code>git rm</code> 命令从暂存区域移除文件，它同时会从工作目录删除指定的文件。</p><p>另外一种情况是，你想让文件保留在磁盘，但是并不想让 Git 继续跟踪。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>当你忘记添加 <code>.gitignore</code> 文件，不小心把一个很大的日志文件或一堆 <code>.a</code> 这样的编译生成文件添加到暂存区时，这一做法尤其有用。</p></div><p>为达到这一目的，使用 <code>--cached</code> 选项：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">rm</span> <span class="token parameter variable">--cached</span> node_modules
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="移动文件" tabindex="-1"><a class="header-anchor" href="#移动文件"><span>移动文件</span></a></h3><p>如果在 Git 中重命名了某个文件，仓库中存储的元数据并不会体现出这是一次改名操作。</p><p>要在 Git 中对文件改名，可以这么做：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">mv</span> file_from file_to
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>例如：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">mv</span> README.md README
$ <span class="token function">git</span> status
On branch master
Your branch is up-to-date with <span class="token string">&#39;origin/master&#39;</span><span class="token builtin class-name">.</span>
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git reset HEAD &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>

    renamed:    README.md -<span class="token operator">&gt;</span> README
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实，运行 <code>git mv</code> 就相当于运行了下面三条命令：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">mv</span> README.md README
$ <span class="token function">git</span> <span class="token function">rm</span> README.md
$ <span class="token function">git</span> <span class="token function">add</span> README
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="查看提交历史" tabindex="-1"><a class="header-anchor" href="#查看提交历史"><span>查看提交历史</span></a></h2><p>使用 <code>git log</code> 命令可以查看项目的提交历史。</p><p>不传入任何参数的默认情况下，<code>git log</code> 会按时间先后顺序列出所有的提交，最近的更新排在最上面。 这个命令会列出每个提交的 SHA-1 校验和、作者的名字和电子邮件地址、提交时间以及提交说明。</p><p><code>git log</code> 有许多选项可以帮助你搜寻你所要找的提交。</p><table><thead><tr><th style="text-align:left;">选项</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><code>-p</code></td><td style="text-align:left;">按补丁格式显示每个提交引入的差异。</td></tr><tr><td style="text-align:left;"><code>--stat</code></td><td style="text-align:left;">显示每次提交的文件修改统计信息。</td></tr><tr><td style="text-align:left;"><code>--shortstat</code></td><td style="text-align:left;">只显示 --stat 中最后的行数修改添加移除统计。</td></tr><tr><td style="text-align:left;"><code>--name-only</code></td><td style="text-align:left;">仅在提交信息后显示已修改的文件清单。</td></tr><tr><td style="text-align:left;"><code>--name-status</code></td><td style="text-align:left;">显示新增、修改、删除的文件清单。</td></tr><tr><td style="text-align:left;"><code>--abbrev-commit</code></td><td style="text-align:left;">仅显示 SHA-1 校验和所有 40 个字符中的前几个字符。</td></tr><tr><td style="text-align:left;"><code>--relative-date</code></td><td style="text-align:left;">使用较短的相对时间而不是完整格式显示日期（比如“2 weeks ago”）。</td></tr><tr><td style="text-align:left;"><code>--graph</code></td><td style="text-align:left;">在日志旁以 ASCII 图形显示分支与合并历史。</td></tr><tr><td style="text-align:left;"><code>--pretty</code></td><td style="text-align:left;">使用其他格式显示历史提交信息。可用的选项包括 oneline、short、full、fuller 和 format（用来定义自己的格式）。</td></tr><tr><td style="text-align:left;"><code>--oneline</code></td><td style="text-align:left;"><code>--pretty=oneline --abbrev-commit</code> 合用的简写。</td></tr></tbody></table><div class="hint-container tip"><p class="hint-container-title">提示</p><p><code>--graph</code> 可以使用 <code>git graph</code> 插件代替，其余最常用的就是 <code>--oneline</code></p></div><h2 id="撤销操作" tabindex="-1"><a class="header-anchor" href="#撤销操作"><span>撤销操作</span></a></h2><p>有时候我们提交完了才发现漏掉了几个文件没有添加，或者提交信息写错了。 此时，可以运行带有 <code>--amend</code> 选项的提交命令来重新提交：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> commit <span class="token parameter variable">--amend</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这个命令会将暂存区中的文件提交。 如果自上次提交以来你还未做任何修改（例如，在上次提交后马上执行了此命令）， 那么快照会保持不变，而你所修改的只是提交信息。</p><p>例如，你提交后发现忘记了暂存某些需要的修改，可以像下面这样操作：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&#39;initial commit&#39;</span>
$ <span class="token function">git</span> <span class="token function">add</span> forgotten_file
$ <span class="token function">git</span> commit <span class="token parameter variable">--amend</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终你只会有一个提交——第二次提交将代替第一次提交的结果。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><p>当你在修补最后的提交时，与其说是修复旧提交，倒不如说是完全用一个 <strong>新的提交</strong> 替换旧的提交。</p><p>修补提交最明显的价值是可以稍微改进你最后的提交，而不会让「啊，忘了添加一个文件」或者 「小修补，修正笔误」这种提交信息弄乱你的仓库历史。</p></div><h3 id="取消暂存的文件" tabindex="-1"><a class="header-anchor" href="#取消暂存的文件"><span>取消暂存的文件</span></a></h3><p>已经修改了两个文件并且想要将它们作为两次独立的修改提交， 但是却意外地输入 <code>git add *</code> 暂存了它们两个。如何只取消暂存两个中的一个呢？ <code>git status</code> 命令提示了你：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">add</span> *
$ <span class="token function">git</span> status
On branch master
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git reset HEAD &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>

    renamed:    README.md -<span class="token operator">&gt;</span> README
    modified:   CONTRIBUTING.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提示使用 <code>git reset HEAD &lt;file&gt;…</code> 来取消暂存。 所以，我们可以这样来取消暂存 <code>CONTRIBUTING.md</code> 文件：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> reset HEAD CONTRIBUTING.md
Unstaged changes after reset:
M	CONTRIBUTING.md
$ <span class="token function">git</span> status
On branch master
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git reset HEAD &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>

    renamed:    README.md -<span class="token operator">&gt;</span> README

Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git checkout -- &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>

    modified:   CONTRIBUTING.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="撤销对文件的修改" tabindex="-1"><a class="header-anchor" href="#撤销对文件的修改"><span>撤销对文件的修改</span></a></h3><p>如果你并不想保留对 <code>CONTRIBUTING.md</code> 文件的修改怎么办？ 你该如何方便地撤消修改——将它还原成上次提交时的样子（或者刚克隆完的样子，或者刚把它放入工作目录时的样子）？ 幸运的是，<code>git status</code> 也告诉了你应该如何做。 在最后一个例子中，未暂存区域是这样：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git checkout -- &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>

    modified:   CONTRIBUTING.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它非常清楚地告诉了你如何撤消之前所做的修改。 让我们来按照提示执行：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> checkout -- CONTRIBUTING.md
$ <span class="token function">git</span> status
On branch master
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git reset HEAD &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>

    renamed:    README.md -<span class="token operator">&gt;</span> README
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到那些修改已经被撤消了。</p><blockquote><p>请务必记得 <code>git checkout — &lt;file&gt;</code> 是一个危险的命令。 你对那个文件在本地的任何修改都会消失——Git 会用最近提交的版本覆盖掉它。 除非你确实清楚不想要对那个文件的本地修改了，否则请不要使用这个命令。</p></blockquote>`,97)),s("blockquote",null,[s("p",null,[n[1]||(n[1]=e("记住，在 Git 中任何 ",-1)),n[2]||(n[2]=s("strong",null,"已提交",-1)),n[3]||(n[3]=e(" 的东西几乎总是可以恢复的。 甚至那些被删除的分支中的提交或使用 ",-1)),n[4]||(n[4]=s("code",null,"--amend",-1)),n[5]||(n[5]=e(" 选项覆盖的提交也可以恢复 （阅读 ",-1)),s("a",v,[n[0]||(n[0]=e("数据恢复",-1)),i(l)]),n[6]||(n[6]=e(" 了解数据恢复）。 然而，任何你未提交的东西丢失后很可能再也找不到了。",-1))])]),n[15]||(n[15]=a(`<h2 id="远程仓库的使用" tabindex="-1"><a class="header-anchor" href="#远程仓库的使用"><span>远程仓库的使用</span></a></h2><p><code>git remote</code> 可以查看已经配置的远程服务器。如果你已经克隆了自己的仓库，那么至少应该能看到 <code>origin</code> ——这是 Git 给你克隆的仓库服务器的默认名字：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> clone https://github.com/schacon/ticgit
Cloning into <span class="token string">&#39;ticgit&#39;</span><span class="token punctuation">..</span>.
remote: Reusing existing pack: <span class="token number">1857</span>, done.
remote: Total <span class="token number">1857</span> <span class="token punctuation">(</span>delta <span class="token number">0</span><span class="token punctuation">)</span>, reused <span class="token number">0</span> <span class="token punctuation">(</span>delta <span class="token number">0</span><span class="token punctuation">)</span>
Receiving objects: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">1857</span>/1857<span class="token punctuation">)</span>, <span class="token number">374.35</span> KiB <span class="token operator">|</span> <span class="token number">268.00</span> KiB/s, done.
Resolving deltas: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">772</span>/772<span class="token punctuation">)</span>, done.
Checking connectivity<span class="token punctuation">..</span>. done.
$ <span class="token builtin class-name">cd</span> ticgit
$ <span class="token function">git</span> remote
origin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你也可以指定选项 <code>-v</code>，会显示需要读写远程仓库使用的 Git 保存的简写与其对应的 URL。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> remote <span class="token parameter variable">-v</span>
origin	https://github.com/schacon/ticgit <span class="token punctuation">(</span>fetch<span class="token punctuation">)</span>
origin	https://github.com/schacon/ticgit <span class="token punctuation">(</span>push<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行 <code>git remote add &lt;shortname&gt; &lt;url&gt;</code> 添加一个新的远程 Git 仓库，同时指定一个方便使用的简写：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> remote
origin
$ <span class="token function">git</span> remote <span class="token function">add</span> pb https://github.com/paulboone/ticgit
$ <span class="token function">git</span> remote <span class="token parameter variable">-v</span>
origin	https://github.com/schacon/ticgit <span class="token punctuation">(</span>fetch<span class="token punctuation">)</span>
origin	https://github.com/schacon/ticgit <span class="token punctuation">(</span>push<span class="token punctuation">)</span>
pb	https://github.com/paulboone/ticgit <span class="token punctuation">(</span>fetch<span class="token punctuation">)</span>
pb	https://github.com/paulboone/ticgit <span class="token punctuation">(</span>push<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>git fetch</code> 和 <code>git push</code> 可以拉取和推送到远程仓库。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> fetch <span class="token operator">&lt;</span>remote<span class="token operator">&gt;</span>
$ <span class="token function">git</span> push <span class="token operator">&lt;</span>remote<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>branch<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><code>git fetch</code> 命令会访问远程仓库，从中拉取所有你还没有的数据。 执行完成后，你将会拥有那个远程仓库中所有分支的引用，可以随时合并或查看。</p>`,10)),s("div",m,[n[12]||(n[12]=s("p",{class:"hint-container-title"},"注意",-1)),n[13]||(n[13]=s("p",null,[e("必须注意 "),s("code",null,"git fetch"),e(" 命令只会将数据下载到你的本地仓库——它并不会自动合并或修改你当前的工作。 当准备好时你必须手动将其合并入你的工作。")],-1)),s("p",null,[n[8]||(n[8]=e("如果你的当前分支设置了跟踪 ",-1)),i(d,{to:"/reading/pro-git/03-git-branch.html#%E8%BF%9C%E7%A8%8B%E5%88%86%E6%94%AF"},{default:p(()=>[...n[7]||(n[7]=[e("远程分支",-1)])]),_:1}),n[9]||(n[9]=e("，那么可以用 ",-1)),n[10]||(n[10]=s("code",null,"git pull",-1)),n[11]||(n[11]=e(" 命令来自动抓取后合并该远程分支到当前分支。",-1))])]),n[16]||(n[16]=a(`<p>可以使用 <code>git remote rename</code> 对远程仓库重命名。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> remote <span class="token function">rename</span> pb paul
$ <span class="token function">git</span> remote
origin
paul
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以使用 <code>git remote remove</code> 或 <code>git remote rm</code> 移除对远程仓库的追踪：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> remote remove paul
$ <span class="token function">git</span> remote
origin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="打标签" tabindex="-1"><a class="header-anchor" href="#打标签"><span>打标签</span></a></h2><p>Git 可以给仓库历史中的某一个提交打上标签，以示重要。 比较有代表性的是人们会使用这个功能来标记发布结点（ <code>v1.0</code> 、 <code>v2.0</code> 等等）。</p><h3 id="列出标签" tabindex="-1"><a class="header-anchor" href="#列出标签"><span>列出标签</span></a></h3><p><code>git tag</code> 可以列出所有标签（可带上可选的 <code>-l</code> 选项 <code>--list</code>）：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag
v1.0
v2.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以按照特定的模式查找标签，如果只对 <code>1.8.5</code> 系列感兴趣，可以运行：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag <span class="token parameter variable">-l</span> <span class="token string">&quot;v1.8.5*&quot;</span>
v1.8.5
v1.8.5-rc0
v1.8.5-rc1
v1.8.5-rc2
v1.8.5-rc3
v1.8.5.1
v1.8.5.2
v1.8.5.3
v1.8.5.4
v1.8.5.5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建标签" tabindex="-1"><a class="header-anchor" href="#创建标签"><span>创建标签</span></a></h3><p>Git 支持两种标签：轻量标签（lightweight）与附注标签（annotated）。</p><p>轻量标签很像一个不会改变的分支——它只是某个特定提交的引用。</p><p><strong>附注标签</strong>：在 Git 中创建附注标签十分简单。 最简单的方式是当你在运行 <code>tag</code> 命令时指定 <code>-a</code> 选项：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag <span class="token parameter variable">-a</span> v1.4 <span class="token parameter variable">-m</span> <span class="token string">&quot;my version 1.4&quot;</span>
$ <span class="token function">git</span> tag
v0.1
v1.3
v1.4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>-m</code> 选项指定了一条将会存储在标签中的信息。 如果没有为附注标签指定一条信息，Git 会启动编辑器要求你输入信息。</p><p>通过使用 <code>git show</code> 命令可以看到标签信息和与之对应的提交信息：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> show v1.4
tag v1.4
Tagger: Ben Straub <span class="token operator">&lt;</span>ben@straub.cc<span class="token operator">&gt;</span>
Date:   Sat May <span class="token number">3</span> <span class="token number">20</span>:19:12 <span class="token number">2014</span> <span class="token parameter variable">-0700</span>

my version <span class="token number">1.4</span>

commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <span class="token operator">&lt;</span>schacon@gee-mail.com<span class="token operator">&gt;</span>
Date:   Mon Mar <span class="token number">17</span> <span class="token number">21</span>:52:11 <span class="token number">2008</span> <span class="token parameter variable">-0700</span>

    changed the version number
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出显示了打标签者的信息、打标签的日期时间、附注信息，然后显示具体的提交信息。</p><p><strong>轻量标签</strong>：创建轻量标签，不需要使用 <code>-a</code>、<code>-s</code> 或 <code>-m</code> 选项，只需要提供标签名字。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag v1.4-lw
$ <span class="token function">git</span> tag
v0.1
v1.3
v1.4
v1.4-lw
v1.5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时，如果在标签上运行 <code>git show</code>，你不会看到额外的标签信息。 命令只会显示出提交信息：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> show v1.4-lw
commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <span class="token operator">&lt;</span>schacon@gee-mail.com<span class="token operator">&gt;</span>
Date:   Mon Mar <span class="token number">17</span> <span class="token number">21</span>:52:11 <span class="token number">2008</span> <span class="token parameter variable">-0700</span>

    changed the version number
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="后期打标签" tabindex="-1"><a class="header-anchor" href="#后期打标签"><span>后期打标签</span></a></h3><p>你也可以对过去的提交打标签。 假设提交历史是这样的：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> log <span class="token parameter variable">--pretty</span><span class="token operator">=</span>oneline
15027957951b64cf874c3557a0f3547bd83b3ff6 Merge branch <span class="token string">&#39;experiment&#39;</span>
a6b4c97498bd301d84096da251c98a07c7723e65 beginning <span class="token function">write</span> support
0d52aaab4479697da7686c15f77a3d64d9165190 one <span class="token function">more</span> thing
6d52a271eda8725415634dd79daabbc4d9b6008e Merge branch <span class="token string">&#39;experiment&#39;</span>
0b7434d86859cc7b8c3d5e1dddfed66ff742fcbc added a commit <span class="token keyword">function</span>
4682c3261057305bdd616e23b64b0857d832627b added a todo <span class="token function">file</span>
166ae0c4d3f420721acbb115cc33848dfcc2121a started <span class="token function">write</span> support
9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，假设在 v1.2 时你忘记给项目打标签，也就是在 「updated rakefile」 提交。 你可以在之后补上标签。 要在那个提交上打标签，你需要在命令的末尾指定提交的校验和（或部分校验和）：</p><div class="language-console line-numbers-mode" data-ext="console" data-title="console"><pre class="language-console"><code>$ git tag -a v1.2 9fceb02
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>可以看到你已经在那次提交上打上标签了：</p><div class="language-console line-numbers-mode" data-ext="console" data-title="console"><pre class="language-console"><code>$ git tag
v0.1
v1.2
v1.3
v1.4
v1.4-lw
v1.5

$ git show v1.2
tag v1.2
Tagger: Scott Chacon &lt;schacon@gee-mail.com&gt;
Date:   Mon Feb 9 15:32:16 2009 -0800

version 1.2
commit 9fceb02d0ae598e95dc970b74767f19372d61af8
Author: Magnus Chacon &lt;mchacon@gee-mail.com&gt;
Date:   Sun Apr 27 20:43:35 2008 -0700

    updated rakefile
...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="共享标签" tabindex="-1"><a class="header-anchor" href="#共享标签"><span>共享标签</span></a></h3><p>默认情况下，<code>git push</code> 命令并不会传送标签到远程仓库服务器上。 在创建完标签后你必须显式地推送标签到共享服务器上。 这个过程就像共享远程分支一样——你可以运行 <code>git push origin &lt;tagname&gt;</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> push origin v1.5
Counting objects: <span class="token number">14</span>, done.
Delta compression using up to <span class="token number">8</span> threads.
Compressing objects: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">12</span>/12<span class="token punctuation">)</span>, done.
Writing objects: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">14</span>/14<span class="token punctuation">)</span>, <span class="token number">2.05</span> KiB <span class="token operator">|</span> <span class="token number">0</span> bytes/s, done.
Total <span class="token number">14</span> <span class="token punctuation">(</span>delta <span class="token number">3</span><span class="token punctuation">)</span>, reused <span class="token number">0</span> <span class="token punctuation">(</span>delta <span class="token number">0</span><span class="token punctuation">)</span>
To git@github.com:schacon/simplegit.git
 * <span class="token punctuation">[</span>new tag<span class="token punctuation">]</span>         v1.5 -<span class="token operator">&gt;</span> v1.5
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果想要一次性推送很多标签，也可以使用带有 <code>--tags</code> 选项的 <code>git push</code> 命令。 这将会把所有不在远程仓库服务器上的标签全部传送到那里。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> push origin <span class="token parameter variable">--tags</span>
Counting objects: <span class="token number">1</span>, done.
Writing objects: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">1</span>/1<span class="token punctuation">)</span>, <span class="token number">160</span> bytes <span class="token operator">|</span> <span class="token number">0</span> bytes/s, done.
Total <span class="token number">1</span> <span class="token punctuation">(</span>delta <span class="token number">0</span><span class="token punctuation">)</span>, reused <span class="token number">0</span> <span class="token punctuation">(</span>delta <span class="token number">0</span><span class="token punctuation">)</span>
To git@github.com:schacon/simplegit.git
 * <span class="token punctuation">[</span>new tag<span class="token punctuation">]</span>         v1.4 -<span class="token operator">&gt;</span> v1.4
 * <span class="token punctuation">[</span>new tag<span class="token punctuation">]</span>         v1.4-lw -<span class="token operator">&gt;</span> v1.4-lw
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>使用 <code>git push &lt;remote&gt; --tags</code> 推送标签并不会区分轻量标签和附注标签， 没有简单的选项能够让你只选择推送一种标签。</p></blockquote><h3 id="删除标签" tabindex="-1"><a class="header-anchor" href="#删除标签"><span>删除标签</span></a></h3><p>要删除掉你本地仓库上的标签，可以使用命令 <code>git tag -d &lt;tagname&gt;</code>。 例如，可以使用以下命令删除一个轻量标签：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag <span class="token parameter variable">-d</span> v1.4-lw
Deleted tag <span class="token string">&#39;v1.4-lw&#39;</span> <span class="token punctuation">(</span>was e7d5add<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>删除远程标签的方式是：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> push origin <span class="token parameter variable">--delete</span> <span class="token operator">&lt;</span>tagname<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="检出标签" tabindex="-1"><a class="header-anchor" href="#检出标签"><span>检出标签</span></a></h3><p>如果你想查看某个标签所指向的文件版本，可以使用 <code>git checkout</code> 命令， 虽然这会使你的仓库处于“分离头指针（detached HEAD）”的状态——这个状态有些不好的副作用。</p><p>在「分离头指针」状态下，如果你做了某些更改然后提交它们，标签不会发生变化， 但你的新提交将不属于任何分支，并且将无法访问，除非通过确切的提交哈希才能访问。 因此，如果你需要进行更改，比如你要修复旧版本中的错误，那么通常需要创建一个新分支：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> checkout <span class="token parameter variable">-b</span> version2 v2.0.0
Switched to a new branch <span class="token string">&#39;version2&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>如果在这之后又进行了一次提交，<code>version2</code> 分支就会因为这个改动向前移动， 此时它就会和 <code>v2.0.0</code> 标签稍微有些不同，这时就要当心了。</p><h2 id="git-别名" tabindex="-1"><a class="header-anchor" href="#git-别名"><span>Git 别名</span></a></h2><p>推荐使用 <code>oh-my-zsh</code>，其中内置了 <code>git</code> 插件，包含别名和一些其他内容。</p>`,49))])}const k=c(u,[["render",b],["__file","02-git-basics.html.vue"]]),f=JSON.parse('{"path":"/reading/pro-git/02-git-basics.html","title":"Git 基础","lang":"zh-CN","frontmatter":{"title":"Git 基础","date":"2023-09-28T00:00:00.000Z","icon":"STARTUP","category":["READING"],"tag":["git"],"description":"初始化 Git 仓库 有两种方式： git clone git init 记录更新 工作目录下的每一个文件都不外乎两种状态：已跟踪 或 未跟踪。 已跟踪的文件是指那些被纳入了版本控制的文件，在上一次快照中有它们的记录，在工作一段时间后， 它们的状态可能是未修改，已修改或已放入暂存区。简而言之，已跟踪的文件就是 Git 已经知道的文件。 工作目录中除已跟...","head":[["meta",{"property":"og:url","content":"https://dribble-njr.github.io/blog/blog/reading/pro-git/02-git-basics.html"}],["meta",{"property":"og:title","content":"Git 基础"}],["meta",{"property":"og:description","content":"初始化 Git 仓库 有两种方式： git clone git init 记录更新 工作目录下的每一个文件都不外乎两种状态：已跟踪 或 未跟踪。 已跟踪的文件是指那些被纳入了版本控制的文件，在上一次快照中有它们的记录，在工作一段时间后， 它们的状态可能是未修改，已修改或已放入暂存区。简而言之，已跟踪的文件就是 Git 已经知道的文件。 工作目录中除已跟..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/lifecycle.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-11-06T15:43:46.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"Git 基础"}],["meta",{"property":"article:author","content":"njr"}],["meta",{"property":"article:tag","content":"git"}],["meta",{"property":"article:published_time","content":"2023-09-28T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-11-06T15:43:46.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Git 基础\\",\\"image\\":[\\"https://raw.githubusercontent.com/dribble-njr/typora-njr/master/img/lifecycle.png\\"],\\"datePublished\\":\\"2023-09-28T00:00:00.000Z\\",\\"dateModified\\":\\"2024-11-06T15:43:46.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"njr\\",\\"url\\":\\"https://github.com/dribble-njr/blog\\",\\"email\\":\\"wzw15292257101@163.com\\"}]}"]]},"headers":[{"level":2,"title":"1 初始化 Git 仓库","slug":"初始化-git-仓库","link":"#初始化-git-仓库","children":[]},{"level":2,"title":"2 记录更新","slug":"记录更新","link":"#记录更新","children":[{"level":3,"title":"2.1 检查状态","slug":"检查状态","link":"#检查状态","children":[]},{"level":3,"title":"2.2 跟踪新文件","slug":"跟踪新文件","link":"#跟踪新文件","children":[]},{"level":3,"title":"2.3 暂存已修改的文件","slug":"暂存已修改的文件","link":"#暂存已修改的文件","children":[]},{"level":3,"title":"2.4 状态简览","slug":"状态简览","link":"#状态简览","children":[]},{"level":3,"title":"2.5 忽略文件","slug":"忽略文件","link":"#忽略文件","children":[]},{"level":3,"title":"2.6 查看修改","slug":"查看修改","link":"#查看修改","children":[]},{"level":3,"title":"2.7 提交更新","slug":"提交更新","link":"#提交更新","children":[]},{"level":3,"title":"2.8 跳过使用暂存区域","slug":"跳过使用暂存区域","link":"#跳过使用暂存区域","children":[]},{"level":3,"title":"2.9 移除文件","slug":"移除文件","link":"#移除文件","children":[]},{"level":3,"title":"2.10 移动文件","slug":"移动文件","link":"#移动文件","children":[]}]},{"level":2,"title":"3 查看提交历史","slug":"查看提交历史","link":"#查看提交历史","children":[]},{"level":2,"title":"4 撤销操作","slug":"撤销操作","link":"#撤销操作","children":[{"level":3,"title":"4.1 取消暂存的文件","slug":"取消暂存的文件","link":"#取消暂存的文件","children":[]},{"level":3,"title":"4.2 撤销对文件的修改","slug":"撤销对文件的修改","link":"#撤销对文件的修改","children":[]}]},{"level":2,"title":"5 远程仓库的使用","slug":"远程仓库的使用","link":"#远程仓库的使用","children":[]},{"level":2,"title":"6 打标签","slug":"打标签","link":"#打标签","children":[{"level":3,"title":"6.1 列出标签","slug":"列出标签","link":"#列出标签","children":[]},{"level":3,"title":"6.2 创建标签","slug":"创建标签","link":"#创建标签","children":[]},{"level":3,"title":"6.3 后期打标签","slug":"后期打标签","link":"#后期打标签","children":[]},{"level":3,"title":"6.4 共享标签","slug":"共享标签","link":"#共享标签","children":[]},{"level":3,"title":"6.5 删除标签","slug":"删除标签","link":"#删除标签","children":[]},{"level":3,"title":"6.6 检出标签","slug":"检出标签","link":"#检出标签","children":[]}]},{"level":2,"title":"7 Git 别名","slug":"git-别名","link":"#git-别名","children":[]}],"git":{"createdTime":1695872569000,"updatedTime":1730907826000,"contributors":[{"name":"dribble-njr","email":"wzw15292257101@163.com","commits":2},{"name":"wangziwenbj01","email":"wangziwenbj01@kanyun.com","commits":1}]},"readingTime":{"minutes":17.19,"words":5156},"filePathRelative":"reading/pro-git/02-git-basics.md","localizedDate":"2023年9月28日","excerpt":"","autoDesc":true}');export{k as comp,f as data};
