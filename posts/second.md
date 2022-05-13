---
date: 2022-05-14
title: vue3初探
tags:
- vue3
description: 学习vue3博客系统demo遇到的一些问题记录
---
# vue3初探
### 1.分享

1.json-server 创建db.json文件，来创建数据

​	json-server --watch data/db.json --port 4000

* 子组件接收：defineProps({}) 

  ```javascript
  const props = defineProps({ post: Object })
  ```

* 使用命名路由时候，routes中得加props:true