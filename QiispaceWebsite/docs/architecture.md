# 栖愈 QIISPACE — 技术架构文档

> **版本**: v1.0.0 | **更新日期**: 2026-06-03

---

## 目录

1. [技术选型](#1-技术选型)
2. [架构总览](#2-架构总览)
3. [组件层级](#3-组件层级)
4. [路由设计](#4-路由设计)
5. [数据流](#5-数据流)
6. [Composable 详解](#6-composable-详解)
7. [动效系统](#7-动效系统)
8. [样式架构](#8-样式架构)
9. [构建与部署](#9-构建与部署)

---

## 1. 技术选型

### 1.1 选型对比

| 决策点 | 选择 | 备选 | 选择理由 |
|--------|------|------|----------|
| 框架 | Vue 3 | React / Svelte | Composition API 天然适合逻辑复用 (Composable)；`<script setup>` 极简语法 |
| 构建 | Vite | Webpack / Turbopack | 10x+ HMR 速度，原生 ESM，零配置开箱即用 |
| 动画 | GSAP | Framer Motion / Motion One | 业界最成熟的滚动动画生态 (ScrollTrigger)，无运行时框架绑定 |
| 路由 | vue-router | — | Vue 官方路由，lazy-load 开箱即用 |
| CSS | Scoped + 变量 | Tailwind / CSS Modules | 组件级隔离 + 全局变量主题，学习成本低，无额外依赖 |
| 状态管理 | 无 (ref/reactive) | Pinia / Vuex | SPA 展示型网站无跨页共享状态需求，局部状态足够 |

### 1.2 依赖清单

```json
{
  "dependencies": {
    "vue": "^3.4.21",
    "vue-router": "^4.3.0",
    "gsap": "^3.12.5"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.4",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vue-tsc": "^2.0.6"
  }
}
```

核心原则：**最小依赖**。仅 3 个运行时依赖，无 CSS 框架、无 UI 库、无状态管理库。

---

## 2. 架构总览

```
┌──────────────────────────────────────────────────┐
│                    App.vue                        │
│  ┌────────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ HeaderBar  │  │<router-> │  │  FooterBar  │  │
│  │ z:1000     │  │  view>   │  │             │  │
│  └────────────┘  │+transition│  └─────────────┘  │
│                  └──────────┘                    │
│  ┌────────────────────────────────────────────┐  │
│  │         ParticleBackground (z:0)           │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │           CursorGlow (z:9999)              │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 分层架构

```
┌─────────────────────────┐
│       Views (页面)       │  ← 业务组装层：组合组件 + Composable
├─────────────────────────┤
│     Components (组件)    │  ← 复用层：Header/Footer/Particles/Cursor
├─────────────────────────┤
│    Composables (逻辑)    │  ← 逻辑层：动画/交互/特效 纯函数
├─────────────────────────┤
│   Router / Styles / App  │  ← 基础设施层：路由/主题/全局布局
└─────────────────────────┘
```

---

## 3. 组件层级

### 3.1 全局布局组件

| 组件 | 文件 | 职责 | z-index |
|------|------|------|---------|
| HeaderBar | `components/HeaderBar.vue` | 固定顶部导航，首页/内页双模式 | 1000 |
| FooterBar | `components/FooterBar.vue` | 三列页脚：品牌 + 导航 + 联系 | — |
| ParticleBackground | `components/ParticleBackground.vue` | Canvas 浮动粒子 | 0 |
| CursorGlow | `components/CursorGlow.vue` | 鼠标跟随光晕 | 9999 |

### 3.2 HeaderBar 双模式设计

```
route.name === 'Home' ?
  ┌──────────────────────────────────────┐
  │ 首页模式: 白色文字 + 透明背景         │
  │ scrollY > 60 → 深色文字 + 毛玻璃      │
  └──────────────────────────────────────┘
  :
  ┌──────────────────────────────────────┐
  │ 内页模式: 始终深色文字 + 毛玻璃       │
  └──────────────────────────────────────┘
```

实现方式：`useRoute()` 计算属性 `isHome` → 动态 class `header--light` → CSS 变量覆盖。

### 3.3 废弃组件

| 组件 | 状态 | 原因 |
|------|------|------|
| HeroCarousel | 已弃用 | 轮播图改为单张静态 Hero 图 + 视差效果 |
| MorphingBlobs | 未启用 | 异形 blob 动画，当前未集成到页面 |

---

## 4. 路由设计

```
/ (Home)          →  lazy(() => import('@/views/Home.vue'))
/services         →  lazy(() => import('@/views/Services.vue'))
/about            →  lazy(() => import('@/views/About.vue'))
/stores           →  lazy(() => import('@/views/Stores.vue'))
```

- **History 模式**: `createWebHistory()`，需服务器配置 SPA fallback
- **路由懒加载**: 所有页面 `() => import(...)` 动态导入，首屏仅加载 Home
- **滚动行为**: 路由切换自动 `scrollTo(0, 0, smooth)`
- **动态标题**: `router.afterEach` 钩子更新 `document.title`
- **页面过渡**: `<transition name="page" mode="out-in">`，入场 0.5s 上移淡入，离场 0.3s 上移淡出

---

## 5. 数据流

```
┌─────────────────────────────────────────────┐
│                  数据来源                     │
│  所有数据硬编码在组件内 (services/stores/文案) │
│  当前无后端 API、无 Pinia/Vuex               │
└─────────────────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Home.vue   Services.vue  Stores.vue
       ref([])    ref([])       ref([])
          │           │           │
          ▼           ▼           ▼
      computed    computed      直接渲染
      (无)       filteredServices (无)
```

**数据模型:**

```typescript
// 服务 (Services)
interface Service {
  title: string; emoji: string; price: string;
  desc: string; tags: string[]; duration: string;
  suitable: string; category: string;
}

// 门店 (Stores)
interface Store {
  name: string; address: string; hours: string;
}
```

> **待优化**: Phase 3 将数据抽离到独立 JSON/TS 文件，避免视图和数据耦合。如需动态内容，可引入 headless CMS。

---

## 6. Composable 详解

项目自研 5 个 Composable，遵循 Vue 3 组合式 API 最佳实践：生命周期自动管理、onUnmounted 清理资源。

### 6.1 useScrollReveal

```
用途: IntersectionObserver 驱动的滚动入场动画
触发: 元素进入视口 10% (threshold: 0.1)
实现:
  1. onMounted → querySelectorAll('.reveal') → 加 reveal--hidden
  2. IntersectionObserver → 进入视口 → 切换 reveal--visible
  3. 进入后 unobserve，单次触发
  4. onUnmounted → observer.disconnect()
CSS:
  .reveal--hidden { opacity: 0; transform: translateY(30px); }
  .reveal--visible { opacity: 1; transform: translateY(0); }
  过渡: 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)
```

### 6.2 useTiltEffect

```
用途: 3D 透视旋转卡片效果
选择器: 默认 '.tilt-card'
实现:
  1. mousemove → 计算鼠标相对卡片中心偏移
  2. rotateX = (y - centerY) / centerY * -8  (垂直反转)
  3. rotateY = (x - centerX) / centerX * 8   (水平)
  4. transform: perspective(1000px) rotateX/Y scale3d(1.02)
  5. 同时计算 .tilt-shine 径向渐变高光位置
  6. mouseleave → 归零 + 隐藏高光
  7. onUnmounted → 遍历清理所有事件监听
参数:
  - rotate 范围: ±8°
  - perspective: 1000px
  - 高光: radial-gradient white 0.25 → transparent 60%
```

### 6.3 useSplitText

```
用途: 标题文字逐字弹入动画
参数: selector (选择器), delay (延迟秒数)
实现:
  1. 获取元素 textContent
  2. innerHTML 替换：每个字符用 <span> 包裹 (空格替换为 &nbsp;)
  3. 初始状态: opacity:0, translateY(60px), rotateX(-40deg)
  4. GSAP to: stagger 0.03s, back.out(1.4) 弹性缓动
  5. 设置 aria-label 保持无障碍
动画参数:
  - stagger: 0.03s/字
  - duration: 0.7s
  - ease: back.out(1.4) (超出回弹)
  - 初始状态: y:60px, rotateX:-40°
```

### 6.4 useGsapAnimations

```
用途: 全局 GSAP 动画编排 (已部分内联到各页面)
包含:
  - Hero 标题 staggered 入场 (y:60→0, stagger:0.08)
  - 副标题 & 按钮 fade-up (y:30→0, stagger:0.15)
  - .card-reveal 卡片滚动入场 (ScrollTrigger: top 85%)
  - .parallax-bg 视差背景 (y:-80, scrub:1)
  - .counter 数字滚动计数 (ScrollTrigger: top 90%)
  - .img-reveal 图片 clip-path 揭示 (inset 0 100% → 0)
注意:
  - ScrollTrigger 需在 gsap.registerPlugin() 后使用
  - 本 composable 适合通用动画；页面特化动画建议写在页面组件内
```

### 6.5 useMouseGlow

```
用途: RAF 驱动的鼠标光晕位置追踪
返回: { glowX, glowY } (ref<number>)
实现:
  - mousemove → 更新 targetX/targetY (passive: true)
  - RAF loop → lerp 缓动插值 (系数 0.04/0.08)
  - onUnmounted → removeEventListener + cancelAnimationFrame
```

---

## 7. 动效系统

### 7.1 技术架构

```
┌──────────────────────────────────────────────┐
│                 动效层                        │
│  ┌────────────┐  ┌────────────┐             │
│  │  JS 动画    │  │  CSS 动画   │             │
│  │  GSAP       │  │  transition │             │
│  │  ScrollTrg  │  │  @keyframes │             │
│  │  RAF        │  │  :hover     │             │
│  └────────────┘  └────────────┘             │
│  ┌────────────────────────────┐             │
│  │  Canvas 2D (粒子)          │             │
│  └────────────────────────────┘             │
└──────────────────────────────────────────────┘
```

### 7.2 动效清单

| 动效 | 技术 | 触发 | 文件 |
|------|------|------|------|
| 分裂文字入场 | GSAP stagger | 页面加载 | `useSplitText.ts` |
| Fade-Up 序列 | GSAP fromTo | 页面加载 | `Home.vue` |
| 3D 卡片倾斜 | CSS perspective + mousemove | 鼠标悬停 | `useTiltEffect.ts` |
| 磁性按钮 | GSAP + mousemove | 鼠标悬停 | `Home.vue` |
| 数字计数 | GSAP innerText + ScrollTrigger | 滚入视口 | `Home.vue` |
| 滚动显现 | IntersectionObserver + CSS | 滚入视口 | `useScrollReveal.ts` |
| 幕帘揭示 | GSAP clip-path + ScrollTrigger | 滚入视口 | `Home.vue` |
| 背景缩放 | GSAP scale + ScrollTrigger scrub | 页面滚动 | `Home.vue` |
| 视差深度 | GSAP y + ScrollTrigger scrub | 页面滚动 | `Home.vue` |
| Canvas 粒子 | RAF + Canvas 2D | 持续 | `ParticleBackground.vue` |
| 鼠标光晕 | RAF + radial-gradient | 鼠标移动 | `CursorGlow.vue` |
| 页面过渡 | Vue `<transition>` | 路由切换 | `App.vue` |

### 7.3 性能策略

| 策略 | 实现 |
|------|------|
| Passive 事件 | 滚动/鼠标移动 + `{ passive: true }` |
| RAF 动画 | `requestAnimationFrame`，卸载时 `cancelAnimationFrame` |
| 单次播放 | ScrollTrigger `toggleActions: 'play none none none'` |
| GPU 加速 | 关键元素 `will-change: transform` |
| 懒加载路由 | `() => import(...)` |
| IntersectionObserver | 仅处理可见元素，进入后 unobserve |

### 7.4 ScrollTrigger 使用规范

```typescript
// ✅ 正确：动态 import 避免重复注册
const { ScrollTrigger } = await import('gsap/ScrollTrigger')
gsap.registerPlugin(ScrollTrigger)

// ✅ 正确：单次播放，不反转
scrollTrigger: {
  trigger: el,
  start: 'top 85%',
  toggleActions: 'play none none none',
}

// ✅ 正确：scrub 实时同步滚动位置
scrollTrigger: {
  trigger: el,
  start: 'top bottom',
  end: 'bottom top',
  scrub: 1,
}
```

---

## 8. 样式架构

### 8.1 CSS 自定义属性主题系统

所有颜色通过 `:root` 下的 CSS 变量集中管理，组件通过 `var(--color-xxx)` 引用。修改主题只需改变量值。

```css
:root {
  /* Primary */
  --color-primary: #B8A088;
  --color-primary-light: #D4C4B0;
  --color-primary-dark: #8C7A6A;
  --color-primary-bg: #F6F1EA;

  /* Neutrals */
  --color-bg: #FAF8F5;        /* 暖白底色 */
  --color-surface: #FFFFFF;   /* 卡片白 */
  --color-dark: #3A3532;      /* 暗色辅色 */
  --color-text: #1A1A1A;      /* 正文 */
  --color-text-light: #777;   /* 次要文字 */
  --color-text-muted: #AAA;   /* 辅助文字 */
  --color-border: #E8E5E0;    /* 边框 */

  /* Typography */
  --font-base: 'PingFang SC', ...;   /* 黑体系 */
  --font-title: 'STSong', ...;       /* 宋体系 */

  /* Spacing / Shadow / Radius */
  --section-padding: 100px 0;
  --shadow-sm/md/lg: ...;
  --radius-sm(8px) / md(16px) / lg(24px);
}
```

### 8.2 样式分层

| 层级 | 文件 | 作用 |
|------|------|------|
| 变量 + Reset | `global.css` (:root, *, body) | 全局基础 |
| 通用类 | `global.css` (.container, .section, .btn, .reveal) | 跨页面复用 |
| 组件样式 | `global.css` (.header, .footer) | 全局组件 |
| 页面样式 | 各 `.vue` 文件 `<style scoped>` | 页面特化 |

### 8.3 响应式断点

| 断点 | 目标设备 | 策略 |
|------|----------|------|
| ≥969px | 桌面 | 完整多列布局 |
| ≤968px | 平板 | 2 列，隐藏侧边数据 |
| ≤768px | 平板竖屏 | 移动端汉堡菜单 |
| ≤600px | 手机 | 单列，字号缩小 |
| ≤480px | 小手机 | 流程步骤单列 |

### 8.4 交替区块

用于区分相邻 section 的视觉层次：

```
section (白底 #FAF8F5)
  → section--alt (#F5F1EC)
    → stats/CTA (#EDE8E2)
```

---

## 9. 构建与部署

### 9.1 构建流程

```
vue-tsc (类型检查) → vite build (打包) → dist/
```

### 9.2 配置要点

| 配置 | 值 | 说明 |
|------|-----|------|
| 开发端口 | 5173 | Vite 默认 |
| 路径别名 | `@/` → `src/` | `vite.config.ts` + `tsconfig.json` |
| 输出目录 | `dist/` | 静态文件，可直接部署 |
| History 模式 | `createWebHistory()` | 需服务器配置 SPA fallback |

### 9.3 部署平台建议

| 平台 | 适合场景 | SPA Fallback 配置 |
|------|----------|-------------------|
| Vercel | 个人/小团队 | 自动识别，零配置 |
| Netlify | 个人/小团队 | `_redirects` 文件 |
| Nginx | 自托管 | `try_files $uri /index.html` |

### Nginx 配置示例

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 附录

### A. 已知技术债

| 问题 | 严重度 | 计划 |
|------|--------|------|
| 数据硬编码在组件中 | 🟡 中 | Phase 3 抽离到独立数据文件 |
| GSAP 商业授权待确认 | 🔴 高 | 确认或评估 Motion One 替代 |
| SEO 不完整 (meta/OG) | 🟡 中 | 补充 index.html meta 标签 |
| 图片懒加载未实现 | 🟡 中 | 使用 loading="lazy" 或 IntersectionObserver |
| 残留资源 (carousel-*.jpg) | 🟢 低 | 清理未使用文件 |

### B. 文件索引

| 文件 | 行数 | 用途 |
|------|------|------|
| `src/views/Home.vue` | 459 | 首页 (最复杂页面) |
| `src/styles/global.css` | 335 | 全局样式 |
| `src/views/Services.vue` | 125 | 服务介绍 |
| `src/composables/useGsapAnimations.ts` | 114 | 通用动画 |
| `src/views/Stores.vue` | 89 | 门店列表 |
| `src/views/About.vue` | ~220 | 关于我们 |
| `src/components/ParticleBackground.vue` | 68 | Canvas 粒子 |
| `src/composables/useTiltEffect.ts` | 51 | 3D 倾斜 |
| `src/composables/useSplitText.ts` | 31 | 文字分裂 |
| `src/composables/useScrollReveal.ts` | 41 | 滚动显现 |
| `src/composables/useMouseGlow.ts` | 52 | 鼠标光晕 |
| `src/components/HeaderBar.vue` | 47 | 导航 |
| `src/components/FooterBar.vue` | 34 | 页脚 |
| `src/router/index.ts` | 43 | 路由 |
| `src/App.vue` | 39 | 根组件 |
| `src/main.ts` | 8 | 入口 |

> **最后更新**: 2026-06-03
