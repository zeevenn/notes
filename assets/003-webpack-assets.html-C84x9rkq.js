import{_ as c,c as d,a as e,d as s,b as a,w as o,e as l,r as p,o as r}from"./app-COf9lzrb.js";const u={},v={href:"https://github.com/Stephen-wzw/webpack-demo",target:"_blank",rel:"noopener noreferrer"},k={href:"https://webpack.docschina.org/configuration/module/",target:"_blank",rel:"noopener noreferrer"};function m(g,n){const i=p("ExternalLinkIcon"),t=p("RouteLink");return r(),d("div",null,[e("blockquote",null,[e("p",null,[n[1]||(n[1]=s("项目地址：",-1)),e("a",v,[n[0]||(n[0]=s("https://github.com/Stephen-wzw/webpack-demo",-1)),a(i)])])]),e("p",null,[n[3]||(n[3]=s("继续使用",-1)),a(t,{to:"/frontend/engineering/build-tool/webpack/0006%E3%80%81webpack%E6%89%93%E5%8C%85CSS.html"},{default:o(()=>[...n[2]||(n[2]=[s("之前的项目",-1)])]),_:1}),n[4]||(n[4]=s("。",-1))]),n[8]||(n[8]=l(`<h2 id="打包图片资源" tabindex="-1"><a class="header-anchor" href="#打包图片资源"><span>打包图片资源</span></a></h2><p>在项目中引入图片文件夹，并添加两张图片：</p><p><strong>project</strong></p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> webpack-demo
</span><span class="token prefix unchanged"> </span><span class="token line"> |- node_modules
</span><span class="token prefix unchanged"> </span><span class="token line"> |- package-lock.json
</span><span class="token prefix unchanged"> </span><span class="token line"> |- package.json
</span><span class="token prefix unchanged"> </span><span class="token line"> |- index.html
</span><span class="token prefix unchanged"> </span><span class="token line"> |- /src
</span><span class="token prefix unchanged"> </span><span class="token line">   |- /css
</span><span class="token prefix unchanged"> </span><span class="token line">     |- style.css
</span><span class="token prefix unchanged"> </span><span class="token line">     |- title.less
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">   |- /img
</span><span class="token prefix inserted">+</span><span class="token line">     |- avatar.png
</span><span class="token prefix inserted">+</span><span class="token line">     |- wallpaper.png
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   |- /js
</span><span class="token prefix unchanged"> </span><span class="token line">     |- format.js
</span><span class="token prefix unchanged"> </span><span class="token line">     |- math.js
</span><span class="token prefix unchanged"> </span><span class="token line">   |- index.js
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面通过两种方式引入图片资源：</p><ul><li><code>img</code> 元素，设置 <code>src</code> 属性；</li><li>其他元素，css 设置 <code>background-image</code> 属性。</li></ul><p><strong>index.js</strong></p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> import { sum } from &quot;./js/math.js&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> const { priceFormat } = require(&quot;./js/format&quot;);
</span><span class="token prefix unchanged"> </span><span class="token line"> import &quot;./css/style.css&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> import &quot;./css/title.less&quot;;
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> // 导入图片
</span><span class="token prefix inserted">+</span><span class="token line"> import avatar from &quot;./img/avatar.png&quot;;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> console.log(sum(10, 20));
</span><span class="token prefix unchanged"> </span><span class="token line"> console.log(priceFormat());
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> const div = document.createElement(&quot;div&quot;);
</span><span class="token prefix unchanged"> </span><span class="token line"> div.className = &quot;title&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line"> div.innerHTML = &quot;webpack-css&quot;;
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> // 方式一：设置 img 元素的 src
</span><span class="token prefix inserted">+</span><span class="token line"> const imgEl = document.createElement(&quot;img&quot;);
</span><span class="token prefix inserted">+</span><span class="token line"> imgEl.src = avatar;
</span><span class="token prefix inserted">+</span><span class="token line">
</span><span class="token prefix inserted">+</span><span class="token line"> // 方式二：设置背景图片
</span><span class="token prefix inserted">+</span><span class="token line"> const bgEl = document.createElement(&quot;div&quot;);
</span><span class="token prefix inserted">+</span><span class="token line"> bgEl.className = &quot;image-bg&quot;;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> document.body.appendChild(div);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> document.body.appendChild(imgEl);
</span><span class="token prefix inserted">+</span><span class="token line"> document.body.appendChild(bgEl);
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为方式二修改 <code>style.css</code> 文件：</p><p><strong>style.css</strong></p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code>.title {
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> color: #000;
</span><span class="token prefix unchanged"> </span><span class="token line"> font-weight: 700;
</span><span class="token prefix unchanged"> </span><span class="token line"> font-size: 30px;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> user-select: none;
</span></span>}

<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line"> .image-bg {
</span><span class="token prefix inserted">+</span><span class="token line">   background-image: url(&quot;../img/wallpaper.jpg&quot;);
</span><span class="token prefix inserted">+</span><span class="token line">   background-repeat: no-repeat;
</span><span class="token prefix inserted">+</span><span class="token line">   background-size: contain;
</span><span class="token prefix inserted">+</span><span class="token line">   width: 500px;
</span><span class="token prefix inserted">+</span><span class="token line">   height: 300px;
</span><span class="token prefix inserted">+</span><span class="token line"> }
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面需要配置 <code>webpack.config.js</code>，在 webpack5 以前，图片等资源一般使用 <code>file-loader</code> 或 <code>url-loader</code> 进行打包，但是 webpack5 后，这两个 loader 在官方文档中已经被删掉了，因此使用它们会出现一系列的问题。现在更推荐使用**资源模块类型(asset module type)**进行打包。</p><p>但是虽然官方已经不推荐使用了，了解下他们的各自用途还是必要的:</p><ul><li><code>file-loader</code>：将文件发送到输出目录；</li><li><code>url-loader</code>：将文件作为 data URI 内联到 bundle 中，可以将较小的文件转成 base64 的 URI；</li><li><code>raw-loader</code>：将文件导入为字符串。</li></ul><p>而在 webpack5 中，通过添加四种新的模块类型，替换上面这些 loader：</p><ul><li><code>asset/resource</code> 发送一个单独的文件并导出 URL。之前使用 <code>file-loader</code> 实现；</li><li><code>asset/inline</code> 导出一个资源的 data URI。之前通过使用 <code>url-loader</code> 实现；</li><li><code>asset/source</code> 导出资源的源代码。之前通过使用 <code>raw-loader</code> 实现；</li><li><code>asset</code> 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 <code>url-loader</code>，并且配置资源体积限制实现。</li></ul><p>那么现在可以对 <code>webpack.config.js</code> 配置 <code>asset</code> 对图片进行打包：</p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">const path = require(&quot;path&quot;);
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">module.exports = {
</span><span class="token prefix unchanged"> </span><span class="token line">  entry: &quot;./src/index.js&quot;,
</span><span class="token prefix unchanged"> </span><span class="token line">  output: {
</span><span class="token prefix unchanged"> </span><span class="token line">    filename: &quot;bundle.js&quot;,
</span><span class="token prefix unchanged"> </span><span class="token line">    path: path.resolve(__dirname, &quot;dist&quot;), // 需要使用绝对路径
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">    publicPath: &quot;./dist/&quot;,  // 保证 css url 导入时路径正确
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">  },
</span><span class="token prefix unchanged"> </span><span class="token line">  module: {
</span><span class="token prefix unchanged"> </span><span class="token line">    rules: [
</span><span class="token prefix unchanged"> </span><span class="token line">      {
</span><span class="token prefix unchanged"> </span><span class="token line">        test: /\\.(less|css)$/,
</span><span class="token prefix unchanged"> </span><span class="token line">        use: [&quot;style-loader&quot;, &quot;css-loader&quot;, &quot;less-loader&quot;]
</span><span class="token prefix unchanged"> </span><span class="token line">      },
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">      {
</span><span class="token prefix inserted">+</span><span class="token line">        test: /\\.(jpe?g|png|gif|svg)$/,
</span><span class="token prefix inserted">+</span><span class="token line">        type: &quot;asset&quot;,
</span><span class="token prefix inserted">+</span><span class="token line">        generator: {
</span><span class="token prefix inserted">+</span><span class="token line">          filename: &quot;img/[name]_[hash:8][ext]&quot;
</span><span class="token prefix inserted">+</span><span class="token line">        },
</span><span class="token prefix inserted">+</span><span class="token line">        parser: {
</span><span class="token prefix inserted">+</span><span class="token line">          dataUrlCondition: {
</span><span class="token prefix inserted">+</span><span class="token line">            maxSize: 100 * 1024 // 100 kb
</span><span class="token prefix inserted">+</span><span class="token line">          }
</span><span class="token prefix inserted">+</span><span class="token line">        }
</span><span class="token prefix inserted">+</span><span class="token line">      }
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">    ],
</span><span class="token prefix unchanged"> </span><span class="token line">  },
</span><span class="token prefix unchanged"> </span><span class="token line">};
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>generator</code> 可以配置生成器的选项，<code>parser</code> 可以配置解析器的选项。</p>`,19)),e("blockquote",null,[e("p",null,[n[6]||(n[6]=s("具体配置项可查阅",-1)),e("a",k,[n[5]||(n[5]=s("官方文档",-1)),a(i)]),n[7]||(n[7]=s("。",-1))])]),n[9]||(n[9]=l(`<p>其中 <code>dataUrlCondition</code> 的含义为：如果一个模块源码大小小于 maxSize，那么模块会被作为一个 Base64 编码的字符串注入到包中， 否则模块文件会被生成到输出的目标目录中。</p><h2 id="打包字体资源" tabindex="-1"><a class="header-anchor" href="#打包字体资源"><span>打包字体资源</span></a></h2><p>在项目中引入字体文件夹，并添加字体文件：</p><p><strong>project</strong></p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line"> webpack-demo
</span><span class="token prefix unchanged"> </span><span class="token line"> |- node_modules
</span><span class="token prefix unchanged"> </span><span class="token line"> |- package-lock.json
</span><span class="token prefix unchanged"> </span><span class="token line"> |- package.json
</span><span class="token prefix unchanged"> </span><span class="token line"> |- index.html
</span><span class="token prefix unchanged"> </span><span class="token line"> |- /src
</span><span class="token prefix unchanged"> </span><span class="token line">   |- /css
</span><span class="token prefix unchanged"> </span><span class="token line">     |- style.css
</span><span class="token prefix unchanged"> </span><span class="token line">     |- title.less
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">   |- /font
</span><span class="token prefix inserted">+</span><span class="token line">     |- iconfont.css
</span><span class="token prefix inserted">+</span><span class="token line">     |- iconfont.eot
</span><span class="token prefix inserted">+</span><span class="token line">     |- iconfont.ttf
</span><span class="token prefix inserted">+</span><span class="token line">     |- iconfont.woff
</span><span class="token prefix inserted">+</span><span class="token line">     |- iconfont.woff2
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">   |- /img
</span><span class="token prefix unchanged"> </span><span class="token line">     |- avatar.png
</span><span class="token prefix unchanged"> </span><span class="token line">     |- wallpaper.png
</span><span class="token prefix unchanged"> </span><span class="token line">   |- /js
</span><span class="token prefix unchanged"> </span><span class="token line">     |- format.js
</span><span class="token prefix unchanged"> </span><span class="token line">     |- math.js
</span><span class="token prefix unchanged"> </span><span class="token line">   |- index.js
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>index.js</strong></p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">import { sum } from &quot;./js/math.js&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line">const { priceFormat } = require(&quot;./js/format&quot;);
</span><span class="token prefix unchanged"> </span><span class="token line">import &quot;./css/style.css&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line">import &quot;./css/title.less&quot;;
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">import &quot;./font/iconfont.css&quot;;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">// 导入图片
</span><span class="token prefix unchanged"> </span><span class="token line">import avatar from &quot;./img/avatar.png&quot;;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">console.log(sum(10, 20));
</span><span class="token prefix unchanged"> </span><span class="token line">console.log(priceFormat());
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">const div = document.createElement(&quot;div&quot;);
</span><span class="token prefix unchanged"> </span><span class="token line">div.className = &quot;title&quot;;
</span><span class="token prefix unchanged"> </span><span class="token line">div.innerHTML = &quot;webpack-css&quot;;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">// 方式一：设置 img 元素的 src
</span><span class="token prefix unchanged"> </span><span class="token line">const imgEl = document.createElement(&quot;img&quot;);
</span><span class="token prefix unchanged"> </span><span class="token line">imgEl.src = avatar;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">// 方式二：设置背景图片
</span><span class="token prefix unchanged"> </span><span class="token line">const bgEl = document.createElement(&quot;div&quot;);
</span><span class="token prefix unchanged"> </span><span class="token line">bgEl.className = &quot;image-bg&quot;;
</span></span>
<span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">// i元素
</span><span class="token prefix inserted">+</span><span class="token line">const iEl = document.createElement(&#39;i&#39;);
</span><span class="token prefix inserted">+</span><span class="token line">iEl.className = &quot;iconfont icon-ashbin&quot;;
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">document.body.appendChild(div);
</span><span class="token prefix unchanged"> </span><span class="token line">document.body.appendChild(imgEl);
</span><span class="token prefix unchanged"> </span><span class="token line">document.body.appendChild(bgEl);
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">document.body.appendChild(iEl);
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改 <code>webpack.config.js</code> 配置 <code>asset/resource</code> 对字体进行打包：</p><div class="language-diff line-numbers-mode" data-ext="diff" data-title="diff"><pre class="language-diff"><code><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">const path = require(&quot;path&quot;);
</span></span>
<span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">module.exports = {
</span><span class="token prefix unchanged"> </span><span class="token line">  entry: &quot;./src/index.js&quot;,
</span><span class="token prefix unchanged"> </span><span class="token line">  output: {
</span><span class="token prefix unchanged"> </span><span class="token line">    filename: &quot;bundle.js&quot;,
</span><span class="token prefix unchanged"> </span><span class="token line">    path: path.resolve(__dirname, &quot;dist&quot;), // 需要使用绝对路径
</span><span class="token prefix unchanged"> </span><span class="token line">    publicPath: &#39;./dist/&#39;,
</span><span class="token prefix unchanged"> </span><span class="token line">  },
</span><span class="token prefix unchanged"> </span><span class="token line">  module: {
</span><span class="token prefix unchanged"> </span><span class="token line">    rules: [
</span><span class="token prefix unchanged"> </span><span class="token line">      {
</span><span class="token prefix unchanged"> </span><span class="token line">        test: /\\.(less|css)$/,
</span><span class="token prefix unchanged"> </span><span class="token line">        use: [&quot;style-loader&quot;, &quot;css-loader&quot;, &quot;less-loader&quot;]
</span><span class="token prefix unchanged"> </span><span class="token line">      },
</span><span class="token prefix unchanged"> </span><span class="token line">      {
</span><span class="token prefix unchanged"> </span><span class="token line">        test: /\\.(jpe?g|png|gif|svg)$/,
</span><span class="token prefix unchanged"> </span><span class="token line">        type: &quot;asset&quot;,
</span><span class="token prefix unchanged"> </span><span class="token line">        generator: {
</span><span class="token prefix unchanged"> </span><span class="token line">          filename: &quot;img/[name]_[hash:8][ext]&quot;
</span><span class="token prefix unchanged"> </span><span class="token line">        },
</span><span class="token prefix unchanged"> </span><span class="token line">        parser: {
</span><span class="token prefix unchanged"> </span><span class="token line">          dataUrlCondition: {
</span><span class="token prefix unchanged"> </span><span class="token line">            maxSize: 100 * 1024
</span><span class="token prefix unchanged"> </span><span class="token line">          }
</span><span class="token prefix unchanged"> </span><span class="token line">        }
</span><span class="token prefix unchanged"> </span><span class="token line">      },
</span></span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">      {
</span><span class="token prefix inserted">+</span><span class="token line">        test: /\\.(eot|ttf|woff2?)$/,
</span><span class="token prefix inserted">+</span><span class="token line">        type: &quot;asset/resource&quot;,
</span><span class="token prefix inserted">+</span><span class="token line">        generator: {
</span><span class="token prefix inserted">+</span><span class="token line">          filename: &quot;font/[name]_[hash:6][ext]&quot;
</span><span class="token prefix inserted">+</span><span class="token line">        }
</span><span class="token prefix inserted">+</span><span class="token line">      }
</span></span><span class="token unchanged"><span class="token prefix unchanged"> </span><span class="token line">    ],
</span><span class="token prefix unchanged"> </span><span class="token line">  },
</span><span class="token prefix unchanged"> </span><span class="token line">};
</span></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行 <code>npm run build</code> 打包，接下来打开浏览器可以看到 <code>i</code> 元素正常加载，控制台也未报错。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>webpack5 提供四种资源模块类型代替之前的 loader，可以对图片、字体等资源进行打包。</p>`,12))])}const f=c(u,[["render",m],["__file","003-webpack-assets.html.vue"]]),h=JSON.parse('{"path":"/frontend/engineering/build-tool/webpack/003-webpack-assets.html","title":"webpack 打包其他资源","lang":"zh-CN","frontmatter":{"title":"webpack 打包其他资源","date":"2022-05-13T00:00:00.000Z","category":["工程化"],"tag":["项目打包","webpack"],"description":" 项目地址：https://github.com/Stephen-wzw/webpack-demo 继续使用。 打包图片资源 在项目中引入图片文件夹，并添加两张图片： project 下面通过两种方式引入图片资源： img 元素，设置 src 属性； 其他元素，css 设置 background-image 属性。 index.js 为方式二修改 st...","head":[["meta",{"property":"og:url","content":"https://dribble-njr.github.io/blog/blog/frontend/engineering/build-tool/webpack/003-webpack-assets.html"}],["meta",{"property":"og:title","content":"webpack 打包其他资源"}],["meta",{"property":"og:description","content":" 项目地址：https://github.com/Stephen-wzw/webpack-demo 继续使用。 打包图片资源 在项目中引入图片文件夹，并添加两张图片： project 下面通过两种方式引入图片资源： img 元素，设置 src 属性； 其他元素，css 设置 background-image 属性。 index.js 为方式二修改 st..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-01-23T04:40:58.000Z"}],["meta",{"property":"article:author","content":"njr"}],["meta",{"property":"article:tag","content":"项目打包"}],["meta",{"property":"article:tag","content":"webpack"}],["meta",{"property":"article:published_time","content":"2022-05-13T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-01-23T04:40:58.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"webpack 打包其他资源\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-05-13T00:00:00.000Z\\",\\"dateModified\\":\\"2026-01-23T04:40:58.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"njr\\",\\"url\\":\\"https://github.com/dribble-njr/blog\\",\\"email\\":\\"wzw15292257101@163.com\\"}]}"]]},"headers":[{"level":2,"title":"1 打包图片资源","slug":"打包图片资源","link":"#打包图片资源","children":[]},{"level":2,"title":"2 打包字体资源","slug":"打包字体资源","link":"#打包字体资源","children":[]},{"level":2,"title":"3 总结","slug":"总结","link":"#总结","children":[]}],"git":{"createdTime":1704616104000,"updatedTime":1769143258000,"contributors":[{"name":"dribble-njr","email":"wzw15292257101@163.com","commits":2},{"name":"ziven","email":"contact@ziven.me","commits":1}]},"readingTime":{"minutes":3.43,"words":1030},"filePathRelative":"frontend/engineering/build-tool/webpack/003-webpack-assets.md","localizedDate":"2022年5月13日","excerpt":"","autoDesc":true}');export{f as comp,h as data};
