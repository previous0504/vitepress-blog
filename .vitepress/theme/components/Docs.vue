<template>
  <div v-for="(yearList, index) in data" :key="index">
    <div class="year">
      {{ yearList[0].frontMatter.date.split("-")[0] }}
    </div>
    <a
      :href="withBase(article.regularPath)"
      v-for="(article, index) in yearList"
      :key="index"
      class="article"
    >
      <div class="title">
        <div class="title-o"></div>
        {{ article.frontMatter.title }}
      </div>
      <div class="date">{{ article.frontMatter.date.slice(5)||'' }}</div>
    </a>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useYearSort } from "../utils/utils";
import { withBase, useData } from "vitepress";
const { theme } = useData();
// console.log(theme.value.posts);
const data = computed(() => useYearSort(theme.value.posts));
console.log(data);
</script>
<style scoped>
.year {
    padding: 15px 0;
    font-size: 1.3rem;
    border-bottom: 1px solid #ccc;
    font-weight: 600;
    color: var(--text-color);
  }
  .article {
    padding: 2px;
    margin: 10px 0;
    display: flex;
    
    justify-content: space-between;
    align-items: center;
  }
  .title {
      color: var(--accent-color);
    font-size: 1.1rem;
  }
  .date {
    color: #ccc;
    font-size: 1rem;
  }
  
    @media screen and (max-width: 700px) {
    .header {
      font-size: 1.5rem;
    }
    .article {
      padding: 2px;
    }
    .date,
    .title {
      font-size: 0.9rem;
    }
    .title{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
</style>

