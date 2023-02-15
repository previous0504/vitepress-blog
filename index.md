---
page: true
sidebar: false
---
<script setup>
import { useData } from "vitepress";
const { theme } = useData();
console.log(theme)
</script>
<Page :posts="theme.posts" />

