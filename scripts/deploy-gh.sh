#!/urs/bin/env sh

# 错误捕获
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd .vitepress/dist

# 如果是发布到自定义域名
# echo ''> CNAME

git add .
git commit -m 'deploy'

# 如果发布到 github pages

git push -f git@github.com:previous0504/vitepress-blog.git master:gh-pages

