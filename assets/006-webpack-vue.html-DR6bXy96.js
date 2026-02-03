import{_ as i,c as p,a as s,d as e,b as l,e as c,r as t,o}from"./app-DC9of9ti.js";const d={},r={href:"https://github.com/Stephen-wzw/webpack-demo",target:"_blank",rel:"noopener noreferrer"};function u(k,n){const a=t("ExternalLinkIcon");return o(),p("div",null,[s("blockquote",null,[s("p",null,[n[1]||(n[1]=e("项目地址：",-1)),s("a",r,[n[0]||(n[0]=e("https://github.com/Stephen-wzw/webpack-demo",-1)),l(a)])])]),n[2]||(n[2]=c(`<p>平时我们可以通过 Vue-cli 快速搭建 Vue 开发环境，但是要知道 Vue-cli 也是基于 webpack 构建的，那么如何使用 webpack 搭建 Vue 开发环境呢？</p><p>前面已经了解了 webpack 如何对 js、css、图片、字体等其他资源进行打包处理，而想要搭建 Vue 开发环境，主要就是对 <code>.vue</code> 文件进行处理。</p><h2 id="准备" tabindex="-1"><a class="header-anchor" href="#准备"><span>准备</span></a></h2><p>现在 Vue@3.x 已经发布了，因此需要安装 <code>vue@next</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> vue@next
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在 <code>src</code> 文件夹下新增 <code>vue</code> 文件夹，新建 <code>App.vue</code> 文件，同时在 <code>index.js</code> 中导入：</p><p><strong>project</strong></p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> webpack-demo
</span><span class="token prefix unchanged"> </span><span class="token line"> |- node_modules
</span><span class="token prefix unchanged"> </span><span class="token line"> |- package-lock.json
</span><span class="token prefix unchanged"> </span><span class="token line"> |- package.json
</span><span class="token prefix unchanged"> </span><span class="token line"> |- postcss.config.js
</span><span class="token prefix unchanged"> </span><span class="token line"> |- babel.config.js
</span><span class="token prefix unchanged"> </span><span class="token line"> |- webpack.config.js
</span><span class="token prefix unchanged"> </span><span class="token line"> |- /public
</span><span class="token prefix unchanged"> </span><span class="token line">   |- favicon.ico
</span><span class="token prefix unchanged"> </span><span class="token line">   |- index.html
</span><span class="token prefix unchanged"> </span><span class="token line"> |- /src
</span><span class="token prefix unchanged"> </span><span class="token line">   |- /css
</span><span class="token prefix unchanged"> </span><span class="token line">     |- style.css
</span><span class="token prefix unchanged"> </span><span class="token line">     |- title.less
</span><span class="token prefix unchanged"> </span><span class="token line">   |- /font
</span><span class="token prefix unchanged"> </span><span class="token line">     |- iconfont.css
</span><span class="token prefix unchanged"> </span><span class="token line">     |- iconfont.eot
</span><span class="token prefix unchanged"> </span><span class="token line">     |- iconfont.ttf
</span><span class="token prefix unchanged"> </span><span class="token line">     |- iconfont.woff
</span><span class="token prefix unchanged"> </span><span class="token line">     |- iconfont.woff2
</span><span class="token prefix unchanged"> </span><span class="token line">   |- /img
</span><span class="token prefix unchanged"> </span><span class="token line">     |- avatar.png
</span><span class="token prefix unchanged"> </span><span class="token line">     |- wallpaper.png
</span><span class="token prefix unchanged"> </span><span class="token line">   |- /js
</span><span class="token prefix unchanged"> </span><span class="token line">     |- format.js
</span><span class="token prefix unchanged"> </span><span class="token line">     |- math.js
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">   |- /vue
</span><span class="token prefix inserted">+</span><span class="token line">     |- App.vue
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   |- index.js
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>App.vue</strong></p><div class="language-vue line-numbers-mode" data-ext="vue" data-title="vue"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h2</span><span class="token punctuation">&gt;</span></span>我是Vue渲染出来的<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h2</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h2</span><span class="token punctuation">&gt;</span></span>{{title}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h2</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;Hello Vue&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span><span class="token punctuation">&gt;</span></span><span class="token style"><span class="token language-css">

</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>index.js</strong></p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> import { createApp } from &quot;vue&quot;;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">
</span><span class="token prefix unchanged"> </span><span class="token line"> import { sum } from &quot;./js/math.js&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> const { priceFormat } = require(&quot;./js/format&quot;);
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> import App from &quot;./vue/App.vue&quot;;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> import &quot;./css/style.css&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> import &quot;./css/title.less&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> import &quot;./font/iconfont.css&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> // 导入图片
</span><span class="token prefix unchanged"> </span><span class="token line"> import avatar from &quot;./img/avatar.png&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> console.log(sum(10, 20));
</span><span class="token prefix unchanged"> </span><span class="token line"> console.log(priceFormat());
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> const div = document.createElement(&quot;div&quot;);
</span><span class="token prefix unchanged"> </span><span class="token line"> div.className = &quot;title&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> div.innerHTML = &quot;webpack-css&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> // 方式一：设置 img 元素的 src
</span><span class="token prefix unchanged"> </span><span class="token line"> const imgEl = document.createElement(&quot;img&quot;);
</span><span class="token prefix unchanged"> </span><span class="token line"> imgEl.src = avatar;
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> // 方式二：设置背景图片
</span><span class="token prefix unchanged"> </span><span class="token line"> const bgEl = document.createElement(&quot;div&quot;);
</span><span class="token prefix unchanged"> </span><span class="token line"> bgEl.className = &quot;image-bg&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> // i元素
</span><span class="token prefix unchanged"> </span><span class="token line"> const iEl = document.createElement(&#39;i&#39;);
</span><span class="token prefix unchanged"> </span><span class="token line"> iEl.className = &quot;iconfont icon-ashbin&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> document.body.appendChild(div);
</span><span class="token prefix unchanged"> </span><span class="token line"> document.body.appendChild(imgEl);
</span><span class="token prefix unchanged"> </span><span class="token line"> document.body.appendChild(bgEl);
</span><span class="token prefix unchanged"> </span><span class="token line"> document.body.appendChild(iEl);
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> // babel
</span><span class="token prefix unchanged"> </span><span class="token line"> const messages = [1, 2, 3];
</span><span class="token prefix unchanged"> </span><span class="token line"> messages.map((n) =&gt; n + 1);
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> // vue
</span><span class="token prefix inserted">+</span><span class="token line"> const app = createApp(App);
</span><span class="token prefix inserted">+</span><span class="token line"> app.mount(&quot;#app&quot;);
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置-webpack" tabindex="-1"><a class="header-anchor" href="#配置-webpack"><span>配置 webpack</span></a></h2><p>默认情况下 <code>vue-loader</code> 是对 Vue@2.x 准备的，而我们是 Vue@3.x，因此需要安装 <code>vue-loader@next</code>，而 <code>vue-loader</code> 又依赖于 <code>@vue/compiler-sfc</code> 的，因此也需要安装。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> vue-loader@next @vue/compiler-sfc <span class="token parameter variable">-D</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>修改 <code>webpack.config.js</code> 配置：</p><p><strong>webpack.config.js</strong></p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> //...
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> const { VueLoaderPlugin } = require(&quot;vue-loader/dist/index&quot;);
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> //...
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> module.exports = {
</span><span class="token prefix unchanged"> </span><span class="token line">   module: {
</span><span class="token prefix unchanged"> </span><span class="token line">     rules: [
</span><span class="token prefix unchanged"> </span><span class="token line">       ...
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">       {
</span><span class="token prefix inserted">+</span><span class="token line">         test: /\\.vue$/,
</span><span class="token prefix inserted">+</span><span class="token line">         loader: &quot;vue-loader&quot;
</span><span class="token prefix inserted">+</span><span class="token line">       }
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">       //...
</span><span class="token prefix unchanged"> </span><span class="token line">     ]
</span><span class="token prefix unchanged"> </span><span class="token line">   }
</span><span class="token prefix unchanged"> </span><span class="token line">   plugins: [
</span><span class="token prefix unchanged"> </span><span class="token line">     ...
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">     new VueLoaderPlugin()
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">     ...
</span><span class="token prefix unchanged"> </span><span class="token line">   ]
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行 <code>npm run build</code>，打开浏览器可以看到渲染正常。但是浏览器控制台出现了一个警告：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>runtime-core.esm-bundler.js:4432 Feature flags __VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__ are not explicitly defined. You are running the esm-bundler build of Vue, <span class="token function">which</span> expects these compile-time feature flags to be globally injected via the bundler config <span class="token keyword">in</span> order to get better tree-shaking <span class="token keyword">in</span> the production bundle.

For <span class="token function">more</span> details, see https://link.vuejs.org/feature-flags.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是因为从 3.0.0-rc.3 开始，Vue 希望我们手动设置全局标识，这样做的好处是可以对最终的打包代码进行 tree-shaking 优化。</p><p>全局标识有两个：</p><ul><li>__VUE_OPTIONS_API__（是否支持 Options API，默认为 <code>true</code>）</li><li>__VUE_PROD_DEVTOOLS__（是否在生产环境中支持 devtools，默认为 <code>false</code>）</li></ul><p>为了在 webpack 中配置全局标识，可以使用 <code>DefinePlugin</code>。</p><p><strong>webpack.config.js</strong></p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> module.exports = {
</span><span class="token prefix unchanged"> </span><span class="token line">   plugins: [
</span><span class="token prefix unchanged"> </span><span class="token line">     ...
</span><span class="token prefix unchanged"> </span><span class="token line">     new DefinePlugin({
</span><span class="token prefix unchanged"> </span><span class="token line">       BASE_URL: &quot;&#39;./&#39;&quot;,
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">       __VUE_OPTIONS_API__: true,
</span><span class="token prefix inserted">+</span><span class="token line">       __VUE_PROD_DEVTOOLS__: false
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">     }),
</span><span class="token prefix unchanged"> </span><span class="token line">     ...
</span><span class="token prefix unchanged"> </span><span class="token line">   ]
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时重新打包后，浏览器控制台的警告就会消除了。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>在这个案例中对 .vue 单文件进行了解析：安装 <code>vue-loader</code> 和 <code>@vue/compiler-sfc</code>，同时配置 <code>VueLoaderPlugin</code>，在重新打包后浏览器控制台会报一个全局标识的警告，通过配置 <code>DefinePlugin</code> 手动配置全局标识消除全局标识警告。</p>`,29))])}const m=i(d,[["render",u],["__file","006-webpack-vue.html.vue"]]),g=JSON.parse('{"path":"/frontend/engineering/build-tool/webpack/006-webpack-vue.html","title":"webpack-vue","lang":"zh-CN","frontmatter":{"title":"webpack-vue","date":"2022-05-16T00:00:00.000Z","category":["工程化"],"tag":["项目打包","webpack"],"description":" 项目地址：https://github.com/Stephen-wzw/webpack-demo 平时我们可以通过 Vue-cli 快速搭建 Vue 开发环境，但是要知道 Vue-cli 也是基于 webpack 构建的，那么如何使用 webpack 搭建 Vue 开发环境呢？ 前面已经了解了 webpack 如何对 js、css、图片、字体等其他资...","head":[["meta",{"property":"og:url","content":"https://dribble-njr.github.io/blog/blog/frontend/engineering/build-tool/webpack/006-webpack-vue.html"}],["meta",{"property":"og:title","content":"webpack-vue"}],["meta",{"property":"og:description","content":" 项目地址：https://github.com/Stephen-wzw/webpack-demo 平时我们可以通过 Vue-cli 快速搭建 Vue 开发环境，但是要知道 Vue-cli 也是基于 webpack 构建的，那么如何使用 webpack 搭建 Vue 开发环境呢？ 前面已经了解了 webpack 如何对 js、css、图片、字体等其他资..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-11-06T15:43:46.000Z"}],["meta",{"property":"article:author","content":"njr"}],["meta",{"property":"article:tag","content":"项目打包"}],["meta",{"property":"article:tag","content":"webpack"}],["meta",{"property":"article:published_time","content":"2022-05-16T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-11-06T15:43:46.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"webpack-vue\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-05-16T00:00:00.000Z\\",\\"dateModified\\":\\"2024-11-06T15:43:46.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"njr\\",\\"url\\":\\"https://github.com/dribble-njr/blog\\",\\"email\\":\\"wzw15292257101@163.com\\"}]}"]]},"headers":[{"level":2,"title":"1 准备","slug":"准备","link":"#准备","children":[]},{"level":2,"title":"2 配置 webpack","slug":"配置-webpack","link":"#配置-webpack","children":[]},{"level":2,"title":"3 总结","slug":"总结","link":"#总结","children":[]}],"git":{"createdTime":1704616104000,"updatedTime":1730907826000,"contributors":[{"name":"dribble-njr","email":"wzw15292257101@163.com","commits":2}]},"readingTime":{"minutes":2.45,"words":734},"filePathRelative":"frontend/engineering/build-tool/webpack/006-webpack-vue.md","localizedDate":"2022年5月16日","excerpt":"","autoDesc":true}');export{m as comp,g as data};
