import{o as n,c as a,f as s}from"./app.687b2c88.js";const t='{"title":"vue2 b站珠峰源码学习","description":"学习vue2源码笔记","frontmatter":{"date":"2022-06-07","title":"vue2 b站珠峰源码学习","tags":["vue2"],"description":"学习vue2源码笔记"},"relativePath":"posts/third.md","lastUpdated":1654535410394}',p={},o=[s('<h5 id="rollup环境搭建" tabindex="-1">rollup环境搭建 <a class="header-anchor" href="#rollup环境搭建" aria-hidden="true">#</a></h5><p>npm init -y 生成package.json</p><h6 id="初始化构建" tabindex="-1">初始化构建 <a class="header-anchor" href="#初始化构建" aria-hidden="true">#</a></h6><p>1.vue通过new Vue()构建，用class的话会将所有方法耦合在一起，所以用prototype。</p><p>2.Vue方法传入用户的options，_init()用于初始化，但是Vue丢失，可以用函数的方式扩展init方法。</p><div class="language-javascript"><pre><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initMixin</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">_init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">//用于初始化操作</span>\n    <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token keyword">this</span>\n    vm<span class="token punctuation">.</span>$options <span class="token operator">=</span> options\n</code></pre></div><p>3.对数据进行劫持，initState初始化状态，options.data、methods、watch等，都可以初始化。</p><div class="language-javascript"><pre><code><span class="token keyword">function</span> <span class="token function">initData</span><span class="token punctuation">(</span><span class="token parameter">vm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">let</span> data <span class="token operator">=</span> vm<span class="token punctuation">.</span>$options<span class="token punctuation">.</span>data\n\n    data <span class="token operator">=</span> <span class="token keyword">typeof</span> data <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span> <span class="token operator">?</span> <span class="token function">data</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span> <span class="token operator">:</span> data\n  <span class="token punctuation">}</span>\n</code></pre></div><p>为什么要用data.call？为了让data中函数的this指向Vue实例。</p>',9)];p.render=function(s,t,p,e,c,i){return n(),a("div",null,o)};export{t as __pageData,p as default};
