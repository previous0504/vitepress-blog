const { getPosts, generatePaginationPages } = require("./theme/serverUtils");
async function config() {
  return {
    head:[
      // ["link", { rel: "icon", href: "/favicon.ico" }],
    ],
    // 网站标题
    base:'/vitepress-blog',
    title: "Tao's blog",
    description: "Interview with blog",
    // 打包目录
    dest: "./dist",
    // 主题配置
    themeConfig: {
      logo: '/favicon.ico',
      posts:await getPosts(),
      smoothScroll: true,
      //nav
      nav: [
        { text: "首页", link: "/" },
        { text: "归档", link: "/pages/docs" },
        { text: "标签", link: "/pages/tags" },
        { text: "关于", link: "/pages/about" },
      ],
      // sidebar:[ { text: '我的', link: '/mine/' }],
    },

    // 使用插件
    plugins: [
      "@vuepress/active-header-links", // 页面滚动时自动激活侧边栏链接的插件
      "@vuepress/back-to-top", // 返回顶部插件
      "@vuepress/nprogress", //页面顶部进度条
    ],
  };
}

module.exports = config()
