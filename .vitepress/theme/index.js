
import DefaultTheme from "vitepress/theme";
import NewLayout from './components/NewLayout.vue'
import Page from "./components/Page.vue";
import Docs from "./components/Docs.vue";
import Tags from "./components/Tags.vue";
import About from "./components/About.vue";


export default {
  ...DefaultTheme,
  Layout:NewLayout,
  NotFound: () => "custom 404", // <- this is a Vue 3 functional component
  enhanceApp({ app, router, siteData }) {
    app.component('Page',Page)
    app.component('Docs',Docs)
    app.component('Tags',Tags)
    app.component('About',About)
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
  },
};
