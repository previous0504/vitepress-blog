---
date: 2022-06-07
title: vue2 b站珠峰源码学习
tags:
- vue2
description: 学习vue2源码笔记
---
## rollup环境搭建

npm init -y 生成package.json

## vue初始化构建

1.vue通过new Vue()构建，用class的话会将所有方法耦合在一起，所以用prototype。

2.Vue方法传入用户的options，_init()用于初始化，但是Vue丢失，可以用函数的方式扩展init方法。

```javascript
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    //用于初始化操作
    const vm = this
    vm.$options = options
```

3.对数据进行劫持，initState初始化状态，options.data、methods、watch等，都可以初始化。

```javascript
function initData(vm) {
    let data = vm.$options.data

    data = typeof data === 'function' ? data.call(vm) : data
  }
```

为什么要用data.call？为了让data中函数的this指向Vue实例。