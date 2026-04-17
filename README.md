# Vue 3 + Vite

个人后台管理系统

项目结构
mock/
├── db.json          # 模拟接口数据
src/
├── api/             # 接口请求（登录、用户管理等）
├── assets/          # 静态资源 + 全局样式
├── components/      # 公共组件
├── config/          # 应用接口域名配置
├── layout/          # 布局组件（侧边栏+顶部导航）
├── router/          # 路由配置 + 权限守卫
├── store/           # Pinia状态管理（用户、路由）
├── utils/           # 工具类（Axios封装）
├── views/           # 页面（登录、首页、用户/角色管理、404）
├── App.vue          # 根组件
└── main.js          # 入口文件
package.json         # 依赖配置
vite.config.js       # Vite配置（代理、别名）


项目初始化
# 安装依赖
yarn install

# 启动模拟接口
npx json-server db.json

# 启动前端项目
yarn dev