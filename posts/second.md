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

插槽就是子组件给父组件使用的一个占位符，用《slot》《/slot》来表示

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

多个`<Teleport>`







