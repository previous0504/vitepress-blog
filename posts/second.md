---
date: 2023-02-15
title: vue3学习笔记
tags:
- vue3
- typescript
description: 跟着b站小满zs学习vue3
---
## 介绍vue

vue使用了MVVM(Model-View-ViewModel) 架构

1.view:视图层(UI用户界面)

2.viewModel:业务逻辑层(一切js可视为业务逻辑)

3.model:数据层(存储数据及对数据的处理如增删改查)

![image](/imgs/mvvm.png)

## npm run dev详解

先从本地的node_modules中查找.bin文件夹里找有没有vite可以执行，如果没有，会去全局找，全局没有的话会去找环境变量，环境变量没有的话会报错。

## 虚拟dom、diff算法

* 使用AST静态节点🌲来代替dom节点

### 1.无key的时候

![image](/imgs/nokey.png)

### 2.有key的时候

![image](/imgs/haskey.png)

最长递增子序列 * leetcode-300

https://leetcode.cn/problems/longest-increasing-subsequence/

1.动态规划(Dp)，时间复杂度O(n)²

```javascript
 */
var lengthOfLIS = function (nums) {
     let dp = Array.from({ length: nums.length }, () => 1)
    for (let i = 0; i < nums.length; i++) {
            for (let j = 0; j < i;j++) {
                if (nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[i],dp[j]+1)
                
                }
            } 
    }
    return Math.max(...dp)
};
```

2.贪心算法+二分法查找

```javascript
var lengthOfLIS = function (nums) {
    if (nums.length === 0) return 0;
    let result = [nums[0]];
    for (let i = 1; i < nums.length; ++i) {
        // 如果当前数值大于已选结果的最后一位，则直接往后新增，若当前数值更小，则直接替换前面第一个大于它的数值
        if (nums[i] > result[result.length - 1]) {
            result[result.length] = nums[i];
        } else {
            // 二分查找：找到第一个大于当前数值的结果进行替换
            let left = 0, right = result.length - 1;
            while (left < right) {
                let middle = ((left + right))>>1;
                if (result[middle] < nums[i]) {
                    left = middle + 1;
                } else {
                    right = middle;
                }
            }
            // 替换当前下标
            result[left] = nums[i];
        }
    }
    return result.length;
};
```



## 响应式原理

未完待续……

### Ref

* **ref**，接受一个内部值，返回一个响应式、可更改的ref对象，只有一个指向其内部值的属性.value

* **isRef**，检测某个值是否为ref

* **toRef**，基于响应式对象上的一个属性，创建一个对应的 ref。这样创建的 ref 与其源属性保持同步：改变源属性的值将更新 ref 的值，反之亦然。

  

  ```javascript
  const state = reactive({
    foo: 1,
    bar: 2
  })
  
  const fooRef = toRef(state, 'foo')
  
  // 更改该 ref 会更新源属性
  fooRef.value++
  console.log(state.foo) // 2
  
  // 更改源属性也会更新该 ref
  state.foo++
  console.log(fooRef.value) // 3
  
  ```

* **toRefs**

  ```javascript
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })
  
    // ...基于状态的操作逻辑
  
    // 在返回时都转为 ref
    return toRefs(state)
  }
  
  // 可以解构而不会失去响应性
  const { foo, bar } = useFeatureX()
  ```

  

* **shallowRef**  浅层的响应式 可用**triggerRef** 强制触发依赖于一个[浅层 ref](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) 的副作用

  ```javascript
  const state = shallowRef({ count: 1 })
  
  // 不会触发更改
  state.value.count = 2
  
  // 会触发更改
  state.value = { count: 2 }
  ```

  

* **customRef ** 自定义的ref，可以加入防抖等功能

### Reactive

* reactive 返回一个对象的响应式代理

* shallowReactive
* toRaw 返回原始对象

### Computed

```javascript
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

### Watch

* **watch** 

```javascript
const state = reactive({ count: 0 })
// 监听一个getter函数
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)
// 监听多个值
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

* **watchEffect**  默认immediate:true，无需指定属性

  ```javascript
  const stop = watchEffect((effect)=>{
    let ipt:HTMLInputElement = document.querySelector('#ipt') as HTMLInputElement
    console.log(ipt)
    console.log(message1.value)
    effect(()=>{
      console.log('before')
    })
   
  },{
    flush:'post'//在dom渲染之后调用，默认为pre
  })
  ```

  

## 生命周期

一个组件从创建到销毁的过程称为生命周期

vue3的组合式api(setup)是没有 beforeCreate 和 created 生命周期的

### onBeforeMount()

在组件DOM实际渲染安装之前调用，根元素还不存在

### onMounted()

在组件的第一次渲染后调用，允许直接DOM访问

### onBeforeUpdate()

数据更新时调用，发生在虚拟DOM打补丁之前

### onUpdated()

DOM更新后，updated的方法即会调用

### onBeforeUnmount()

在卸载组件实例之前调用

### onUnmounted()

卸载组件实例后调用，调用此钩子所有指令都被解除绑定，所有时间侦听器都被移除，所有子组件实例被卸载

## 父子组件传参

### defineProps

**defineProps**-子组件接收父组件的值

```javascript
// js
const props = defineProps({
  data:{
    type:String,
    default:''
  }
})
//ts withDefaults(ts特有的)
const props1 = withDefaults(defineProps<{
    data:string
}>(),{
    data:'xxx'
})
```

### defineEmits

**defineEmits**-父组件接收子组件的值

```javascript
const obj = reactive<number[]>([4,5,6])
//js 
const emit = defineEmits(['on-click'])
//ts
const emit = defineEmits<{
    (e:'on-click',obj:number[]):void
}>()
const clickTap = ()=>{
    emit('on-click',obj)
}
```

### ref (defineExpose)

**ref** -父组件使用子组件的值或者方法

```javascript
// 父组件代码
<template>
 <A ref="child"></A>
</template>
<script>
const child = ref<InstanceType<typeof A> | null>(null)
</script>
// 子组件代码
const obj = reactive<number[]>([4,5,6])
const name = ref('123')

defineExpose({
    obj,
    name
})
```

### 案例(封装瀑布流事件)

使用js来实现绝对定位,具体代码如下

```javascript

<!-- 瀑布流案例 -->
<template>
    <div class="wraps">
        <div :style="{height:item.height+'px',background:item.background,top:item.top+'px',left:item.left + 'px'}"
            v-for="item in waterList" class="items"></div>
    </div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from 'vue'
const props = defineProps(['list'])

const waterList = reactive<any[]>([])
const init = () => {
    // 存储高度
    const heightList: any[] = []
    const width = 130
    // clientWidth元素的宽度，包含padding
    const x = document.body.clientWidth

    // 计算出一列放几条数据
    const column = Math.floor(x / width)
    console.log(column);

    for (let i = 0; i < props.list.length; i++) {
        if (i < column) {
            props.list[i].top = 10;
            props.list[i].left = i * width;
            heightList.push(props.list[i].height + 10)
            waterList.push(props.list[i])
        } else {
            let current = heightList[0]
            let index = 0;
            // 找出第一行最小的高度
            heightList.forEach((h, inx) => {
                if (current > h) {
                    current = h;
                    index = inx;
                }
            })
            props.list[i].top = (current + 20);
            props.list[i].left = index * width;
            // 拼装第二行的高度
            heightList[index] =  (heightList[index] + props.list[i].height + 20);
            waterList.push(props.list[i])
        }
    }
}
onMounted(() => {
    window.onresize = () => init()
    init()
})

</script>

<style >
.wraps {
    position: relative;
    width: 100%;
    height: 100%;

}

.items {
    position: absolute;
    width: 120px;
}
</style>

```
## 全局组件，局部组件，递归组件

### 全局组件

```javascript
//main.ts
import Card from './components/Card/index.vue'
createApp(App).component('Card',Card).mount('#app')

//如果要注册所有的组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```
### 递归组件

原理和js递归是一样的，自己调用自己，通过一个条件来结束递归，否则导致内存泄漏

```vue
// 父组件
<Tree :data="data"></Tree>
// 子组件
// 递归组件
<template>
    <div @click.stop="clickTap(item,$event)" v-for="item in data" >
        <input type="checkbox" v-model="item.checked"> <span>{{ item.name }}</span>
        <Tree v-if="item?.children?.length" :data="item?.children"></Tree>
    </div>
</template>
<script setup lang="ts">
interface TreeList  {
  name:string,
  checked:boolean,
  children?:TreeList[]
}
type Props<T> = {
    data?:T[] | []
}
const props = defineProps<Props<TreeList>>()
const clickTap = (item:TreeList,e:Event)=>{
    console.log(item,e)
}

</script>
// 默认递归组件名称就是文件名，这里新建一个script来命名
// 使用插件 <script setup name='xxx' lang='ts'>
<script lang="ts">
export default{
    name:'tao'
}
</script>
<style lang="css">

</style>
```
### 动态组件

让多个组件使用同一个挂载点，并动态切换


```vue
<template>
  <div>
    当前组件 {{ currentTab }}
    <!-- {{ tabs }} -->
    <button v-for="(_, tab) in tabs" :key="tab" :class="['tab-button', { active: currentTab === tab }]"
      @click="currentTab = tab">{{ tab}}</button>
    <!-- <Tree :data="data"></Tree> -->
    <component :is="tabs[currentTab]"></component>
  </div>
</template>
<script setup lang="ts">
import A from './components/aciveComponent/A.vue'
import B from './components/aciveComponent/B.vue'
import C from './components/aciveComponent/C.vue'

const currentTab = ref('A')

const tabs:any = {
  A, B, C
}
</script>
```

1.在vue2通过组件名切换，在vue3 setup是通过组件实例切换

2.如果组件实例放在Reactive，得使用shallowRef或markRaw跳过proxy代理

## 插槽

插槽就是子组件给父组件使用的一个占位符，用`<slot></slot>`来表示

### 匿名插槽

在子组件放置一个插槽`<slot></slot>`

### 具名插槽

`<slot name="header"></slot>` 父组件 `<template v-slot:header></template>`

### 作用域插槽

父组件使用子组件的数据

```vue
// 父组件
<template>
    <div>
        <slot :data="obj"></slot>
    </div>
</template>
<script setup lang="ts">
const obj = {
    name:'兵哥哥',
    age:20
}
</script>


// 子组件
<template>
  <div>
  <SlotA v-slot="{data}">{{data.name}}</SlotA>
  </div>
</template>
<script setup lang="ts">
import SlotA from './components/SlotA.vue'
</script>
```

### 动态插槽

插槽可以是一个变量名

`<template #[name]></template>`

## 异步组件&Suspense

### Ajax(异步的javascript和XML)

Ajax的核心是XMLHttpRequest对象

对象方法

 1.const xhr = new XMLHttpRequest()

 2.abort()取消请求

 3.open(method,url,async,user,psw),method:请求类型，url:文件位置,async:true异步 false同步

4.send()

onreadystatechange 每当readyState属性改变，就会调用该函数

readyState共有5种状态

* 0: 请求未初始化

* 1: 服务器连接已建立

* 2: 请求已接收

* 3: 请求处理中

* 4: 请求已完成，且响应已就绪

  

status : 200:'OK' 404:'未找到页面'

### 封装axios

```javascript
export const axios = {
    get<T>(url:string):Promise<T>{
        return new Promise((resolve)=>{
            const xhr = new XMLHttpRequest()
            xhr.open('GET',url)
            xhr.send()
            xhr.onreadystatechange = ()=>{
                if(xhr.readyState == 4 && xhr.status == 200){
                    setTimeout(()=>{
                        resolve(JSON.parse(xhr.responseText))
                    },2000)
                   
                }
            }
        })
    }
}
```

### Suspense

两个插槽 

#default展示异步依赖加载完的组件 

#fallback展示加载中的内容

```vue

<template>
  <div>
    <Suspense>
      <template #default>
        <asyncCom></asyncCom>
      </template>
      <template #fallback>
        <Skeleton></Skeleton>
      </template>
    </Suspense>
  </div>
</template>
<script setup lang="ts">
import Skeleton from './components/sync/Skeleton.vue'
// import asyncCom from './components/sync/Sync.vue'

const asyncCom:any = defineAsyncComponent(() => 
  import('./components/sync/Sync.vue')
)
</script>

<style >

</style>

```

* defineAsyncComponent方法可接收一个返回Promise的加载函数
* 也可搭配ES模块动态导入
* 用异步组件打包会额外生成一个js文件，可以优化首屏渲染的时间

## Teleport

可以将一个组件内部的一部分模版“传送”到该组件的DOM结构外层的位置去

modal的情况使用比较多

`<Teleport :disabled="isMobile" to="body">..</Teleport>`

多个`<Teleport>`挂载同一个dom，会依次渲染

## Keepalive

它能够在多个组件动态切换时缓存被移除的组件实例,名称会根据组件的**name**进行匹配

```vue
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive>
  <component :exclude="/a|b" :include="['a', 'b']" :max="10" :is="activeComponent" />
</KeepAlive>
```

生命周期：onActivated() onDeactivated() onMounted()只有第一次进入页面会调用

## Transtion

省略

## 依赖注入

provide():第一个参数是要注入的key，第二个参数是要注入的值

inject()

```vue
<script setup>
import { inject } from 'vue'
import { fooSymbol } from './injectionSymbols'

// 注入值的默认方式
const foo = inject('foo')

// 注入响应式的值
const count = inject('count')

// 通过 Symbol 类型的 key 注入
const foo2 = inject(fooSymbol)

// 注入一个值，若为空则使用提供的默认值
const bar = inject('foo', 'default value')

// 注入一个值，若为空则使用提供的工厂函数
const baz = inject('foo', () => new Map())

// 注入时为了表明提供的默认值是个函数，需要传入第三个参数
const fn = inject('function', () => {}, false)
</script>
```

## 兄弟组件传参和Bus

1.借助父组件传参，父组件充当桥梁

2.Event Bus (mitt)

```typescript
interface Event {
  on: (name: string, fn: Function) => void,
  emit: (name: string, ...args: Array<any>) => void,
  off: () => void,
  once: () => void
}
interface List {
  [key: string]: Array<Function>
}

class Dispatch implements Event {
  list: List
  constructor() {
    this.list = {}
  }
  // 接收
  on(name: string, fn: Function) {
    let callback = this.list[name] || []
    callback.push(fn)
    this.list[name] = callback
    // console.log('on', this.list)
  }
  // 发射
  emit(name: string, ...args: Array<any>) {
    let eventName = this.list[name] || []
    if (eventName) {
      eventName.forEach(fn => { 
        fn.apply(this, args) 
      }
      )
    } else {
      console.error('名称错误')
    }
  }
  off() {

  }
  once() {

  }
}
```

## Jsx 手写babel插件

未完待续……

## v-model

* v-model是语法糖，通过props和emit组合而成

* prop: value -> modelValue

* v-bind的.sync修饰符和组件的model选项已移除

* 新增多个v-model

* ```javascript
  const props = defineProps(['name','nameModifiers'])
  ```

  

## 自定义指令

### vue3指令的钩子函数

* created
* beforeMount
* mounted
* beforeUpdate
* updated
* beforeUnmount
* Unmounted

### 函数简写

v-permission -> 此时只在 mounted 和 updated 时候触发

```javascript
const vPermission: Directive = (el,binding)=>{
  console.log(el,binding)
  el.style.display = 'none'
}
```

### 生命周期钩子参数详解

1.el -> 当前绑定的DOM元素

2.binding 

* instance：使用指令的组件实例子
* value：传递给指令的值 v-permission="2"，该值为2
* oldValue: 先前的值，仅在beforeUpdate和updated中可用
* arg:传递给指令的参数，v-permission:foo，arg为'foo'
* modifiers：包括修饰符的对象，v-permission:foo.a，modifiers为'a'
* dir: 在注册指令时作为参数传递 

![image-20230316160806441](/Users/zhangzhentao/Library/Application Support/typora-user-images/image-20230316160806441.png)

3.vnode:代表绑定元素的VNode

## 自定义hooks

```typescript
// bas464.ts
import { onMounted } from "vue"

type Options = {
    el:string
}

export default function(options:Options):Promise<{baseUrl:string}>{
    return new Promise(resolve=>{
        onMounted(()=>{
            const file:HTMLImageElement = document.querySelector(options.el) as HTMLImageElement;
            file.onload= ()=>{
                resolve({baseUrl:toBase64(file)})
            }
        })
        const toBase64 = (el:any)=>{
            const canvas:HTMLCanvasElement = document.createElement('canvas')
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
            canvas.width = el.width;
            canvas.height = el.height;
            ctx?.drawImage(el,0,0,canvas.width,canvas.height)
            return canvas.toDataURL('a.webp')
            
        }
    })
   
}
```

```vue
// image.vue
<template>
  <div>
    自定义hooks
    <img id='img' height="300" width="300" src="../public/a.webp" alt="">
  </div>
</template>
<script setup lang="ts">
import useBase64 from './hooks/base64'
useBase64({el:'#img'}).then(res=>{
  console.log(res.baseUrl)
})
</script>

<style ></style>

```

## vue3定义全局函数和变量

app.config.globalProperties.msg = 'hello'

组件中使用 getCurrentInstance()来获取实例

```javascript
const app = getCurrentInstance()
app?.proxy.msg
```

## 编写vue3插件

```typescript
//index.ts
// 声明类型
import {App,createVNode,VNode} from 'vue'
import { render } from 'vue'
import Loading from './index.vue'


export default  {
    install:(app: App)=>{
        // 创建组件VNode
        const vnode:VNode = createVNode(Loading)
        // 渲染
        render(vnode,document.body)
        // 全局挂载
        app.config.globalProperties.$loading = {
            show:vnode.component?.exposed?.show,
            hide:vnode.component?.exposed?.hide,
        }
    }
}
```

```vue
// 全局loading组件 通过defineExpose导出
<template>
    <div v-if="loading" class="loading">
        loading...
    </div>
</template>
<script setup lang="ts">
const loading = ref(false)
const show = ()=>{
    loading.value = true
}
const hide = ()=>{
    loading.value = false
}
defineExpose({
    show,hide
})
</script>
  
<style scoped>
.loading {
    background-color: black;
    width: 500px;
    height: 500px;
}
</style>
  
```

```vue
// 如何使用
<template>
  <div class="plugin">
  
  </div>
</template>
<script setup lang="ts">
import { getCurrentInstance} from 'vue'
onMounted(()=>{
  const app:any = getCurrentInstance()
  app?.proxy.$loading.show()
  setTimeout(()=>{
    app?.proxy.$loading.hide()
  },5000)
})
</script>

<style scoped>
.plugin{
  background-color: #fff;
}</style>

```

## Event Loop nextTick

未完待续

## 函数式编程 h函数

h函数相当于使用createVnode()来创建虚拟dom，再用render()来渲染

```vue
<template>
  <Btn @on-click="getBtn" name="哈哈哈">
    <template #default>
      这是插槽
    </template>
   
  </Btn>
</template>
<script setup lang="ts">
import { h } from 'vue'

type Props = {
  name?: string
}

const Btn = (props: Props, context: any) => {
  return h('div', {
    class: 'c-orange-9 flex justify-between',
    onClick: () => {
      context.emit('on-click', '我是按钮')
    }
  }, context.slots.default()
	// props.name
  )
}
const getBtn = (str: string) => {
  console.log(str);

}
</script>

<style scoped></style>

```

## 桌面程序Electron

等待填入..踩坑

## webpack构建vue3

## vue3性能优化

## web components(shadow dom)





