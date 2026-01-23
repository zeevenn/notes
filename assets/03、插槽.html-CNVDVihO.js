import{_ as s,c as a,e as t,o as e}from"./app-CQvbks3D.js";const l="/blog/assets/scope-Be0yduhI.png",i="/blog/assets/scoped-slot-DMsDl_Oz.png",p={};function o(c,n){return e(),a("div",null,[...n[0]||(n[0]=[t(`<p>在开发中，我们经常封装一个个可复用的组件，可以通过 <code>props</code> 给组件传递一些数据，让组件来进行展示。但是为了让这个组件具备更强的通用性，不能将组件中的内容限制为固定的 <code>div</code>、<code>span</code> 等这些元素。比如有时我们想要组件展示按钮，有时想要组件显示图片。这时就需要用到插槽。</p><h2 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用"><span>基本使用</span></a></h2><p>为了使组件的内容更加自定义，Vue 提供了 <code>&lt;slot&gt;</code> 插槽。</p><div class="language-html line-numbers-mode" data-ext="html" data-title="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>navigation-link</span> <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>/profile<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
  Your Profile
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>navigation-link</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-html line-numbers-mode" data-ext="html" data-title="html"><pre class="language-html"><code><span class="token comment">&lt;!-- avigation-link 组件内 --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span>
  <span class="token attr-name"><span class="token namespace">v-bind:</span>href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>url<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>nav-link<span class="token punctuation">&quot;</span></span>
<span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>slot</span><span class="token punctuation">&gt;</span></span>default content<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>slot</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>组件内的内容（在这里是 <code>Your Profile</code>）会自动替换插槽，而如果组件内没有提供任何内容，则会显示<code>&lt;slot&gt;</code> 内的默认内容。</p><h2 id="具名插槽" tabindex="-1"><a class="header-anchor" href="#具名插槽"><span>具名插槽</span></a></h2><p>具名插槽可以指定内容应该插入的位置。</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;div class=&quot;container&quot;&gt;
  &lt;header&gt;
    &lt;!-- 我们希望把页头放这里 --&gt;
  &lt;/header&gt;
  &lt;main&gt;
    &lt;!-- 我们希望把主要内容放这里 --&gt;
  &lt;/main&gt;
  &lt;footer&gt;
    &lt;!-- 我们希望把页脚放这里 --&gt;
  &lt;/footer&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于这样的情况，<code>&lt;slot&gt;</code> 元素有一个特殊的 attribute：<code>name</code>。这个 attribute 可以用来定义额外的插槽：</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;div class=&quot;container&quot;&gt;
  &lt;header&gt;
    &lt;slot name=&quot;header&quot;&gt;&lt;/slot&gt;
  &lt;/header&gt;
  &lt;main&gt;
    &lt;slot&gt;&lt;/slot&gt;
  &lt;/main&gt;
  &lt;footer&gt;
    &lt;slot name=&quot;footer&quot;&gt;&lt;/slot&gt;
  &lt;/footer&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一个不带 <code>name</code> 的 <code>&lt;slot&gt;</code> 出口会带有隐含的名字“default”。</p><p>在向具名插槽提供内容的时候，应该在一个 <code>&lt;template&gt;</code> 元素上使用 <code>v-slot</code> 指令，并以 <code>v-slot</code> 的参数的形式提供其名称：</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;base-layout&gt;
  &lt;template v-slot:header&gt;
    &lt;h1&gt;Here might be a page title&lt;/h1&gt;
  &lt;/template&gt;

  &lt;p&gt;A paragraph for the main content.&lt;/p&gt;
  &lt;p&gt;And another one.&lt;/p&gt;

  &lt;template v-slot:footer&gt;
    &lt;p&gt;Here&#39;s some contact info&lt;/p&gt;
  &lt;/template&gt;
&lt;/base-layout&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在 <code>&lt;template&gt;</code> 元素中的所有内容都将会被传入相应的插槽。任何没有被包裹在带有 <code>v-slot</code> 的 <code>&lt;template&gt;</code> 中的内容都会被视为默认插槽的内容。</p><p>然而，如果你希望更明确一些，仍然可以在一个 <code>&lt;template&gt;</code> 中包裹默认插槽的内容：</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;base-layout&gt;
  &lt;template v-slot:header&gt;
    &lt;h1&gt;Here might be a page title&lt;/h1&gt;
  &lt;/template&gt;

  &lt;template v-slot:default&gt;
    &lt;p&gt;A paragraph for the main content.&lt;/p&gt;
    &lt;p&gt;And another one.&lt;/p&gt;
  &lt;/template&gt;

  &lt;template v-slot:footer&gt;
    &lt;p&gt;Here&#39;s some contact info&lt;/p&gt;
  &lt;/template&gt;
&lt;/base-layout&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>v-slot</code> 也有缩写，即把参数之前的所有内容 (<code>v-slot:</code>) 替换为字符 <code>#</code>。例如 <code>v-slot:header</code> 可以被重写为 <code>#header</code>：</p><div class="language-html line-numbers-mode" data-ext="html" data-title="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>base-layout</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">#header</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span>Here might be a page title<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>A paragraph for the main content.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>And another one.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">#footer</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>Here&#39;s some contact info<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>base-layout</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>任何一种写法都会渲染出：</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;div class=&quot;container&quot;&gt;
  &lt;header&gt;
    &lt;h1&gt;Here might be a page title&lt;/h1&gt;
  &lt;/header&gt;
  &lt;main&gt;
    &lt;p&gt;A paragraph for the main content.&lt;/p&gt;
    &lt;p&gt;And another one.&lt;/p&gt;
  &lt;/main&gt;
  &lt;footer&gt;
    &lt;p&gt;Here&#39;s some contact info&lt;/p&gt;
  &lt;/footer&gt;
&lt;/div&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：<strong><code>v-slot</code> 只能添加在 <code>&lt;template&gt;</code> 上</strong>，除了<a href="#%E7%8B%AC%E5%8D%A0%E9%BB%98%E8%AE%A4%E6%8F%92%E6%A7%BD">独占默认插槽</a>。</p><h2 id="编译作用域" tabindex="-1"><a class="header-anchor" href="#编译作用域"><span>编译作用域</span></a></h2><p>当你想在一个插槽中使用数据时，例如：</p><div class="language-html line-numbers-mode" data-ext="html" data-title="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>todo-button</span><span class="token punctuation">&gt;</span></span>
  {{ item }}
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>todo-button</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该插槽可以访问与模板其余部分相同的实例 property (即相同的“作用域”)。</p><figure><img src="`+l+`" alt="编译作用域" tabindex="0" loading="lazy"><figcaption>编译作用域</figcaption></figure><p>插槽<strong>不能</strong>访问 <code>&lt;todo-button&gt;</code> 的作用域。例如 <code>url</code> 是访问不到的：</p><p><strong>TodoButton.vue</strong></p><div class="language-vue line-numbers-mode" data-ext="vue" data-title="vue"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>slot</span><span class="token punctuation">&gt;</span></span>Default<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>slot</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">&quot;TodoButton&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Parent Component</strong></p><div class="language-html line-numbers-mode" data-ext="html" data-title="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>todo-button</span><span class="token punctuation">&gt;</span></span>
  {{ title }}
  <span class="token comment">&lt;!--
  \`title\` 将会是 undefined，因为这个内容
  而不是在 &lt;todo-button&gt; 中定义的。
  --&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>todo-button</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。</p></blockquote><h2 id="作用域插槽" tabindex="-1"><a class="header-anchor" href="#作用域插槽"><span>作用域插槽</span></a></h2><p>有时让插槽内容能够访问子组件中才有的数据是很有用的。当一个组件被用来渲染一个数组时，我们希望能够自定义每个 <code>item</code> 的渲染方式。</p><p>比如有一个 <code>TodoList</code> 组件：</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code>app<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&#39;todo-list&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">items</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;Feed a cat&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;Buy milk&#39;</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;ul&gt;
      &lt;li v-for=&quot;(item, index) in items&quot;&gt;
        {{ item }}
      &lt;/li&gt;
    &lt;/ul&gt;
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可能会想把 <code>{{ item }}</code> 替换为 <code>&lt;slot&gt;</code>，以便在父组件上对其自定义。</p><div class="language-html line-numbers-mode" data-ext="html" data-title="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>todo-list</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>green<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>{{ item }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>todo-list</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但这是行不通的，因为由于编译作用域，只有在 <code>&lt;todo-list&gt;</code> 内部才能访问到 <code>item</code>，但插槽内容是在它的父组件上提供的。</p><p>要使 <code>item</code> 在父级提供的插槽内容上可用，我们可以在 <code>&lt;todo-list&gt;</code> 中添加一个 <code>&lt;slot&gt;</code> 元素并将其作为一个 attribute 绑定：</p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> &lt;ul&gt;
</span><span class="token prefix unchanged"> </span><span class="token line">   &lt;li v-for=&quot;(item, index) in items&quot;&gt;
</span></span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line">     {{ item }}
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">     &lt;slot :item=&quot;item&quot;&gt;&lt;/slot&gt;
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   &lt;/li&gt;
</span><span class="token prefix unchanged"> </span><span class="token line"> &lt;/ul&gt;
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在就可以根据自己的需要自定义插槽的内容了。在父级作用域中，可以使用<strong>带值的 <code>v-slot</code></strong> 来定义提供的插槽 prop 名字：</p><div class="language-html line-numbers-mode" data-ext="html" data-title="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>todo-list</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name"><span class="token namespace">v-slot:</span>default</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>slotProps<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>green<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>{{ slotProps.item }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>todo-list</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+i+`" alt="作用域插槽" tabindex="0" loading="lazy"><figcaption>作用域插槽</figcaption></figure><blockquote><p>插槽 prop 的对象可以任意命名，比如 <code>v-slot:default=&quot;any&quot;</code>。</p></blockquote><h3 id="独占默认插槽" tabindex="-1"><a class="header-anchor" href="#独占默认插槽"><span>独占默认插槽</span></a></h3><p>在上述情况下，当被提供的内容<strong>只有</strong>默认插槽时，组件的标签才可以被当作插槽的 <code>&lt;template&gt;</code> 来使用。这样我们就可以把 <code>v-slot</code> 直接用在组件上：</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;todo-list v-slot:default=&quot;slotProps&quot;&gt;
  &lt;span class=&quot;green&quot;&gt;{{ slotProps.item }}&lt;/span&gt;
&lt;/todo-list&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种写法还可以更简单。就像假定未指明的内容对应默认插槽一样，不带参数的 <code>v-slot</code> 被假定对应默认插槽：</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;todo-list v-slot=&quot;slotProps&quot;&gt;
  &lt;span class=&quot;green&quot;&gt;{{ slotProps.item }}&lt;/span&gt;
&lt;/todo-list&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是只要出现多个插槽，就<strong>必须</strong>使用完整的基于 <code>&lt;template&gt;</code> 的语法：</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;todo-list&gt;
  &lt;template v-slot:default=&quot;slotProps&quot;&gt;
    &lt;span class=&quot;green&quot;&gt;{{ slotProps.item }}&lt;/span&gt;
  &lt;/template&gt;

  &lt;template v-slot:other=&quot;otherSlotProps&quot;&gt;
    ...
  &lt;/template&gt;
&lt;/todo-list&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解构插槽-prop" tabindex="-1"><a class="header-anchor" href="#解构插槽-prop"><span>解构插槽 Prop</span></a></h3><p>作用域插槽的内部工作原理是将你的插槽内容包裹在一个拥有单个参数的函数里：</p><div class="language-javascript line-numbers-mode" data-ext="js" data-title="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">slotProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 插槽内容</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这意味着 <code>v-slot</code> 的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。所以可以使用 ES2015 解构来传入具体的插槽 prop，如下：</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;todo-list v-slot=&quot;{ item }&quot;&gt;
  &lt;span class=&quot;green&quot;&gt;{{ item }}&lt;/span&gt;
&lt;/todo-list&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样可以使模板更简洁，尤其是在该插槽提供了多个 prop 的时候。它同样开启了 prop 重命名等其它可能，例如将 <code>item</code> 重命名为 <code>todo</code>：</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;todo-list v-slot=&quot;{ item: todo }&quot;&gt;
  &lt;span class=&quot;green&quot;&gt;{{ todo }}&lt;/span&gt;
&lt;/todo-list&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你甚至可以定义后备内容，用于插槽 prop 是 undefined 的情形：</p><div class="language-HTML line-numbers-mode" data-ext="HTML" data-title="HTML"><pre class="language-HTML"><code>&lt;todo-list v-slot=&quot;{ item = &#39;Placeholder&#39; }&quot;&gt;
  &lt;span class=&quot;green&quot;&gt;{{ item }}&lt;/span&gt;
&lt;/todo-list&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,62)])])}const u=s(p,[["render",o],["__file","03、插槽.html.vue"]]),r=JSON.parse('{"path":"/frontend/framework/vue/03%E3%80%81%E6%8F%92%E6%A7%BD.html","title":"插槽","lang":"zh-CN","frontmatter":{"title":"插槽","date":"2022-05-25T00:00:00.000Z","category":["Vue"],"tag":["深入组件"],"description":"在开发中，我们经常封装一个个可复用的组件，可以通过 props 给组件传递一些数据，让组件来进行展示。但是为了让这个组件具备更强的通用性，不能将组件中的内容限制为固定的 div、span 等这些元素。比如有时我们想要组件展示按钮，有时想要组件显示图片。这时就需要用到插槽。 基本使用 为了使组件的内容更加自定义，Vue 提供了 <slot> 插槽。 组件...","head":[["meta",{"property":"og:url","content":"https://dribble-njr.github.io/blog/blog/frontend/framework/vue/03%E3%80%81%E6%8F%92%E6%A7%BD.html"}],["meta",{"property":"og:title","content":"插槽"}],["meta",{"property":"og:description","content":"在开发中，我们经常封装一个个可复用的组件，可以通过 props 给组件传递一些数据，让组件来进行展示。但是为了让这个组件具备更强的通用性，不能将组件中的内容限制为固定的 div、span 等这些元素。比如有时我们想要组件展示按钮，有时想要组件显示图片。这时就需要用到插槽。 基本使用 为了使组件的内容更加自定义，Vue 提供了 <slot> 插槽。 组件..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-11-06T15:43:46.000Z"}],["meta",{"property":"article:author","content":"njr"}],["meta",{"property":"article:tag","content":"深入组件"}],["meta",{"property":"article:published_time","content":"2022-05-25T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-11-06T15:43:46.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"插槽\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-05-25T00:00:00.000Z\\",\\"dateModified\\":\\"2024-11-06T15:43:46.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"njr\\",\\"url\\":\\"https://github.com/dribble-njr/blog\\",\\"email\\":\\"wzw15292257101@163.com\\"}]}"]]},"headers":[{"level":2,"title":"1 基本使用","slug":"基本使用","link":"#基本使用","children":[]},{"level":2,"title":"2 具名插槽","slug":"具名插槽","link":"#具名插槽","children":[]},{"level":2,"title":"3 编译作用域","slug":"编译作用域","link":"#编译作用域","children":[]},{"level":2,"title":"4 作用域插槽","slug":"作用域插槽","link":"#作用域插槽","children":[{"level":3,"title":"4.1 独占默认插槽","slug":"独占默认插槽","link":"#独占默认插槽","children":[]},{"level":3,"title":"4.2 解构插槽 Prop","slug":"解构插槽-prop","link":"#解构插槽-prop","children":[]}]}],"git":{"createdTime":1677733227000,"updatedTime":1730907826000,"contributors":[{"name":"dribble-njr","email":"wzw15292257101@163.com","commits":2},{"name":"Stephen-wzw","email":"wzw15292257101@163.com","commits":1}]},"readingTime":{"minutes":5.35,"words":1604},"filePathRelative":"frontend/framework/vue/03、插槽.md","localizedDate":"2022年5月25日","excerpt":"","autoDesc":true}');export{u as comp,r as data};
