---
page: true
sidebar: false
---
<script setup>
// import {} from './.'
import Page from "./.vitepress/theme/components/Page.vue";

import { useData } from "vitepress";
const { theme } = useData();
</script>
<Page :posts="theme.posts" />

