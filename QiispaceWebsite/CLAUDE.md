# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

栖愈 QIISPACE SPA 品牌官网。Vue 3 + TypeScript + Vite 单页应用，暖白主色调 + 暗色辅色。

## 常用命令

```bash
npm run dev       # 开发服务器 (http://localhost:5173)
npm run build     # 生产构建 (vue-tsc 类型检查 + vite build)
npm run preview   # 预览生产构建
```

## 架构

### 路由 (`src/router/index.ts`)
4 个页面，lazy-load：`/` (Home) · `/services` (Services) · `/about` (About) · `/stores` (Stores)。使用 `createWebHistory`。

### 全局布局 (`src/App.vue`)
HeaderBar → `<router-view>` (带 page transition) → FooterBar → ParticleBackground → CursorGlow

### 全局样式 (`src/styles/global.css`)
CSS 自定义属性控制整个主题。暖白底色 `--color-bg: #FAF8F5`，辅色 `--color-dark: #3A3532`，强调色 `--color-primary: #B8A088`。所有组件通过 `var(--color-xxx)` 引用，修改主题只需改 CSS 变量。

### 特效体系
- **GSAP + ScrollTrigger**：首页 Hero 文字入场、背景缩放滚动、clip-path 幕帘揭示、视差深度层、数字滚动计数
- **Canvas 粒子**：ParticleBackground 全局浮动粒子
- **鼠标光晕**：CursorGlow 跟随鼠标的径向渐变
- **3D 卡片倾斜**：useTiltEffect composable，`.tilt-card` 元素鼠标悬停透视旋转
- **文字分裂入场**：useSplitText，逐字弹入动画
- **滚动显现**：useScrollReveal，IntersectionObserver 驱动 `.reveal` 元素入场

### Header 导航 (`src/components/HeaderBar.vue`)
通过 `useRoute` 判断 `route.name === 'Home'` 添加 `header--light` 类。首页白字+暗色毛玻璃滚动背景，其他页深色字+暖白毛玻璃。

### Hero 首屏 (`src/views/Home.vue` Hero 部分)
单张全屏背景图 `/image/hero-bg.jpg`（Pexels 免费商用）。三层鼠标视差（背景/文字/侧边数据），4 秒自动轮播（已弃用 HeroCarousel 改用静态图），滚动时背景 scale 1→1.4 放大。

### 图片资源
`public/image/` 下：`carousel-1~6.jpg`（裁剪后的门店实拍），`hero-bg.jpg`（Unsplash/Pexels 下载的首屏图，可随时替换）

## 注意事项
- Node.js v19.9.0，部分新包（sharp）不兼容
- `npm install` 需要 `--cache /tmp/npm-cache` 避免权限问题
- 项目使用 `@/` 路径别名指向 `src/`
- GSAP ScrollTrigger 需动态 import 避免重复注册：`await import('gsap/ScrollTrigger')`
