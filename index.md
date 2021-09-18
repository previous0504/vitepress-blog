---
page: true
sidebar: false
---

<script setup>
import Page from "./.vitepress/theme/components/Page.vue";

import { useData } from "vitepress";
const { theme } = useData();
// const pageSize = theme.value.pageSize;
const posts = theme.posts
</script>
<Page :posts="theme.posts" />
