<template>
  <div class="tags">
    <span
      @click="toggleTag(key)"
      v-for="(item, key) in data"
      :key="key"
      class="tag"
    >
      {{ key }} <strong>{{ data[key].length }}</strong>
    </span>
  </div>
  <div class="header">{{ selectTag }}</div>
  <a
    :href="withBase(article.regularPath)"
    v-for="(article, index) in data[selectTag]"
    :key="index"
    class="article"
  >
    <div class="title">
      {{ article.frontMatter.title }}
    </div>
    <div class="date">{{ article.frontMatter.date }}</div>
  </a>
</template>
<script setup>
import { computed, ref } from "vue";
import { withBase, useData } from "vitepress";
import { initTags } from "../utils/utils";
const { theme } = useData();
const data = computed(() => initTags(theme.value.posts));
// 选择tag标签
let selectTag = ref("");
const toggleTag = (tag) => {
  selectTag.value = tag;
};

console.log(data);
</script>
<style scoped>
.header {
  color: var(--text-color);
  font-size: 2rem;
  font-weight: 600;
  margin: 1rem 0;
  text-align: center;
}
.tags {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.tag {
  display: inline-block;
  position: relative;
  padding: 4px 20px;
  padding-right: 10px;
  margin: 0 16px 12px 0;
  font-size: 14px;
  line-height: 25px;
  background-color: rgb(33, 150, 243, 0.5);
  transition: 0.4s;
  color: #fff;
  cursor: pointer;
  border-radius: 33px 0 0 33px;
}
.tag::before {
  content: "";
  position: absolute;
  width: 5px;
  margin-top: 10px;
  margin-left: -15px;
  height: 5px;
  background: #fff;
  border-radius: 50%;
}
.year {
  padding: 15px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
}
.article {
  padding: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
}

.article:hover .date {
  color: #000;
}
.article:hover .title {
  color: #2b90c1;
}
.article:hover {
  text-decoration: none;
}
.title {
  color: #4a9ae1;
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
  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
