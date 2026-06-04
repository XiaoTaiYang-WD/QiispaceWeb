# 栖愈 QIISPACE 品牌官网

> 于城市喧嚣中，寻一处身心栖所

高端身心疗愈 SPA 品牌展示型官网。Vue 3 + TypeScript + Vite 单页应用，暖白主色调搭配沉浸式动效体验。

---

## 技术栈

| 层级 | 选型 | 版本 |
|------|------|------|
| 框架 | Vue 3 (Composition API, `<script setup>`) | ^3.4.21 |
| 类型 | TypeScript | ^5.4.0 |
| 构建 | Vite | ^5.2.0 |
| 路由 | vue-router (HTML5 History) | ^4.3.0 |
| 动画 | GSAP + ScrollTrigger | ^3.12.5 |
| CSS | Scoped CSS + CSS Custom Properties | — |

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173)
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

---

## 项目结构

```
QiispaceWebsite/
├── public/image/           # 静态图片资源
├── src/
│   ├── main.ts             # 入口
│   ├── App.vue             # 根组件 (全局布局)
│   ├── router/index.ts     # 路由配置 (4 页面, lazy-load)
│   ├── styles/global.css   # CSS 变量主题 + 全局样式
│   ├── views/              # 页面组件
│   │   ├── Home.vue        # 首页 (/)
│   │   ├── Services.vue    # 服务介绍 (/services)
│   │   ├── About.vue       # 关于我们 (/about)
│   │   └── Stores.vue      # 门店列表 (/stores)
│   ├── components/         # 公共组件
│   │   ├── HeaderBar.vue   # 导航栏
│   │   ├── FooterBar.vue   # 页脚
│   │   ├── ParticleBackground.vue  # Canvas 粒子背景
│   │   └── CursorGlow.vue  # 鼠标光晕
│   └── composables/        # 可复用逻辑
│       ├── useGsapAnimations.ts    # GSAP 动画编排
│       ├── useScrollReveal.ts      # 滚动显现
│       ├── useSplitText.ts         # 文字分裂入场
│       ├── useTiltEffect.ts        # 3D 卡片倾斜
│       └── useMouseGlow.ts         # 鼠标光晕追踪
├── docs/
│   └── architecture.md     # 技术架构文档
├── PRD.md                  # 产品需求文档
└── CLAUDE.md               # AI 编码上下文
```

---

## 页面

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | ACE-style Hero + 品牌优势 + 热门服务 + 数据统计 + 品牌故事 + CTA |
| `/services` | 服务介绍 | 8 个服务分类筛选 + 服务流程 + CTA |
| `/about` | 关于我们 | 品牌故事 + 理念/价值观 + 疗愈哲学 + 品牌数据 |
| `/stores` | 门店列表 | 9 家门店列表 + 地址/营业时间 |

---

## 特效体系

- **GSAP + ScrollTrigger**：Hero 入场动画、背景缩放滚动、clip-path 幕帘揭示、视差深度层、数字滚动计数
- **Canvas 粒子**：ParticleBackground 全局浮动粒子，密度自适应窗口
- **鼠标光晕**：CursorGlow 跟随鼠标的 500px 径向渐变
- **3D 卡片倾斜**：useTiltEffect，perspective 透视旋转 + 径向高光
- **文字分裂入场**：useSplitText，逐字 GSAP stagger 弹性动画
- **滚动显现**：useScrollReveal，IntersectionObserver 驱动入场

---

## 设计系统

暖白主色调 `#FAF8F5`，暗色辅色 `#3A3532`，强调色 `#B8A088`。

所有颜色通过 CSS 自定义属性集中管理，详见 `src/styles/global.css`。

---

## 相关文档

- [产品需求文档 (PRD)](./PRD.md)
- [技术架构文档](./docs/architecture.md)
- [AI 编码上下文](./CLAUDE.md)
