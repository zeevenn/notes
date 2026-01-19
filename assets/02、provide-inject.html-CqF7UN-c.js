import{_ as s,c as a,e,o as t}from"./app-CfNM9LIc.js";const p="/blog/assets/provide-inject-Cbaq6ueG.png",i={};function l(c,n){return t(),a("div",null,[...n[0]||(n[0]=[e('<p>通常，当需要从父组件向子组件传递数据时，我们使用 <code>props</code>。但是有一些深度嵌套的组件，而深层的子组件只需要父组件的部分内容。在这种情况下，如果仍然将 <code>prop</code> 沿着组件链逐级传递下去，可能会很麻烦。</p><p>对于这种情况，我们可以使用一对 <code>provide</code> 和 <code>inject</code>。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：父组件有一个 <code>provide</code> 选项来提供数据，子组件有一个 <code>inject</code> 选项来开始使用这些数据。</p><figure><img src="'+p+`" alt="provide" tabindex="0" loading="lazy"><figcaption>provide</figcaption></figure><h2 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用"><span>基本使用</span></a></h2><p>如果有一个这样的目录结构：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>App
└─ Home
   └─ HomeContent
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果需要在 App 中向 <code>HomeContent</code> 传值，我们要将 <code>prop</code> 逐级传递下去：<code>App</code> -&gt; <code>Home</code> -&gt; <code>HomeContent</code>。但是通过 <code>provide/inject</code> 的方式，我们可以直接执行以下操作：</p><div class="language-vue line-numbers-mode" data-ext="vue" data-title="vue"><pre class="language-vue"><code><span class="token comment">&lt;!-- App.vue --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>home</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>home</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> Home <span class="token keyword">from</span> <span class="token string">&quot;./Home.vue&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">components</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    Home
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">provide</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;wang&quot;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">age</span><span class="token operator">:</span> <span class="token number">18</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-vue line-numbers-mode" data-ext="vue" data-title="vue"><pre class="language-vue"><code><span class="token comment">&lt;!-- Home --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>home-content</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>home-content</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> HomeContent <span class="token keyword">from</span> <span class="token string">&#39;./HomeContent.vue&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">components</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    HomeContent
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-vue line-numbers-mode" data-ext="vue" data-title="vue"><pre class="language-vue"><code><span class="token comment">&lt;!-- HomeContent --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token comment">&lt;!-- HomeContent: wang - 18 --&gt;</span>
    HomeContent: {{name}} - {{age}}
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">inject</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;name&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;age&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="provide-组件实例-property" tabindex="-1"><a class="header-anchor" href="#provide-组件实例-property"><span>provide 组件实例 property</span></a></h2><p>如果现在修改 <code>App</code>，让它 provide 一些组件的实例 property，这会不起作用：</p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> &lt;!-- App.vue --&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;template&gt;
</span><span class="token prefix unchanged"> </span><span class="token line">   &lt;home&gt;&lt;/home&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;/template&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;script&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> import Home from &quot;./Home.vue&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> export default {
</span><span class="token prefix unchanged"> </span><span class="token line">   components: {
</span><span class="token prefix unchanged"> </span><span class="token line">     Home
</span><span class="token prefix unchanged"> </span><span class="token line">   },
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">   data() {
</span><span class="token prefix inserted">+</span><span class="token line">     return {
</span><span class="token prefix inserted">+</span><span class="token line">       content: [&quot;abc&quot;, &quot;cab&quot;, &quot;bac&quot;]
</span><span class="token prefix inserted">+</span><span class="token line">     }
</span><span class="token prefix inserted">+</span><span class="token line">   },
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   provide: {
</span><span class="token prefix unchanged"> </span><span class="token line">     name: &quot;wang&quot;,
</span><span class="token prefix unchanged"> </span><span class="token line">     age: 18,
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">     length: this.content.length // 这将导致错误：\`Cannot read property &#39;length&#39; of undefined\`
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   }
</span><span class="token prefix unchanged"> </span><span class="token line"> };
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;/script&gt;
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>要访问组件实例 property，必须将 <code>provide</code> 转换为返回对象的函数：</p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> &lt;!-- App.vue --&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;template&gt;
</span><span class="token prefix unchanged"> </span><span class="token line">   &lt;home&gt;&lt;/home&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;/template&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;script&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> import Home from &quot;./Home.vue&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> 
</span><span class="token prefix unchanged"> </span><span class="token line"> export default {
</span><span class="token prefix unchanged"> </span><span class="token line">   components: {
</span><span class="token prefix unchanged"> </span><span class="token line">     Home
</span><span class="token prefix unchanged"> </span><span class="token line">   },
</span><span class="token prefix unchanged"> </span><span class="token line">   data() {
</span><span class="token prefix unchanged"> </span><span class="token line">     return {
</span><span class="token prefix unchanged"> </span><span class="token line">       content: [&quot;abc&quot;, &quot;cab&quot;, &quot;bac&quot;]
</span><span class="token prefix unchanged"> </span><span class="token line">     }
</span><span class="token prefix unchanged"> </span><span class="token line">   },
</span></span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line">   provide: {
</span><span class="token prefix deleted">-</span><span class="token line">     name: &quot;wang&quot;,
</span><span class="token prefix deleted">-</span><span class="token line">     age: 18,
</span><span class="token prefix deleted">-</span><span class="token line">     length: this.content.length // 这将导致错误：\`Cannot read property &#39;length&#39; of undefined\`
</span><span class="token prefix deleted">-</span><span class="token line">   }
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">   provide() {
</span><span class="token prefix inserted">+</span><span class="token line">     return {
</span><span class="token prefix inserted">+</span><span class="token line">       name: &quot;wang&quot;,
</span><span class="token prefix inserted">+</span><span class="token line">       age: 18,
</span><span class="token prefix inserted">+</span><span class="token line">       length: this.content.length
</span><span class="token prefix inserted">+</span><span class="token line">     }
</span><span class="token prefix inserted">+</span><span class="token line">   }
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> };
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;/script&gt;
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="响应式" tabindex="-1"><a class="header-anchor" href="#响应式"><span>响应式</span></a></h2><p>虽然上面的修改能够正确注入 <code>HomeContent</code>，但是如果更改了 <code>content</code> 的内容，这个变化并不会反映在 inject 的 <code>length</code> property 中。<strong>因为默认情况下，<code>provide/inject</code> 的绑定不是响应式的</strong>。</p><p>如果想要将它变成响应式，可以分配一个组合式 API <code>computed</code> property：</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> computed <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span><span class="token punctuation">;</span>

<span class="token function">provide</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">length</span><span class="token operator">:</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>content<span class="token punctuation">.</span>length<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为 <code>computed</code> 返回的是一个 ref 对象，因此在子组件中需要用 <code>length.value</code> 进行调用：</p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> &lt;!-- HomeContent --&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;template&gt;
</span><span class="token prefix unchanged"> </span><span class="token line">   &lt;div&gt;
</span><span class="token prefix unchanged"> </span><span class="token line">     &lt;!-- HomeContent: wang - 18 --&gt;
</span></span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line">     HomeContent: {{name}} - {{age}} - {{ length }}
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">     HomeContent: {{name}} - {{age}} - {{ length.value }}
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   &lt;/div&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;/template&gt;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> &lt;script&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> export default {
</span><span class="token prefix unchanged"> </span><span class="token line">   inject: [&quot;name&quot;, &quot;age&quot;, &quot;length&quot;],
</span><span class="token prefix unchanged"> </span><span class="token line"> }
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;/script&gt;
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>经过上述处理，任何对 <code>content.length</code> 的改变都会被正确地反映在注入 <code>length</code> 的组件中。</p>`,22)])])}const d=s(i,[["render",l],["__file","02、provide-inject.html.vue"]]),r=JSON.parse('{"path":"/frontend/framework/vue/02%E3%80%81provide-inject.html","title":"provide 和 inject","lang":"zh-CN","frontmatter":{"title":"provide 和 inject","date":"2022-05-24T00:00:00.000Z","category":["Vue"],"tag":["组件通信","深入组件"],"description":"通常，当需要从父组件向子组件传递数据时，我们使用 props。但是有一些深度嵌套的组件，而深层的子组件只需要父组件的部分内容。在这种情况下，如果仍然将 prop 沿着组件链逐级传递下去，可能会很麻烦。 对于这种情况，我们可以使用一对 provide 和 inject。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：...","head":[["meta",{"property":"og:url","content":"https://dribble-njr.github.io/blog/blog/frontend/framework/vue/02%E3%80%81provide-inject.html"}],["meta",{"property":"og:title","content":"provide 和 inject"}],["meta",{"property":"og:description","content":"通常，当需要从父组件向子组件传递数据时，我们使用 props。但是有一些深度嵌套的组件，而深层的子组件只需要父组件的部分内容。在这种情况下，如果仍然将 prop 沿着组件链逐级传递下去，可能会很麻烦。 对于这种情况，我们可以使用一对 provide 和 inject。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-11-06T15:43:46.000Z"}],["meta",{"property":"article:author","content":"njr"}],["meta",{"property":"article:tag","content":"组件通信"}],["meta",{"property":"article:tag","content":"深入组件"}],["meta",{"property":"article:published_time","content":"2022-05-24T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-11-06T15:43:46.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"provide 和 inject\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-05-24T00:00:00.000Z\\",\\"dateModified\\":\\"2024-11-06T15:43:46.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"njr\\",\\"url\\":\\"https://github.com/dribble-njr/blog\\",\\"email\\":\\"wzw15292257101@163.com\\"}]}"]]},"headers":[{"level":2,"title":"1 基本使用","slug":"基本使用","link":"#基本使用","children":[]},{"level":2,"title":"2 provide 组件实例 property","slug":"provide-组件实例-property","link":"#provide-组件实例-property","children":[]},{"level":2,"title":"3 响应式","slug":"响应式","link":"#响应式","children":[]}],"git":{"createdTime":1677733227000,"updatedTime":1730907826000,"contributors":[{"name":"dribble-njr","email":"wzw15292257101@163.com","commits":2},{"name":"Stephen-wzw","email":"wzw15292257101@163.com","commits":1}]},"readingTime":{"minutes":2.11,"words":634},"filePathRelative":"frontend/framework/vue/02、provide-inject.md","localizedDate":"2022年5月24日","excerpt":"","autoDesc":true}');export{d as comp,r as data};
