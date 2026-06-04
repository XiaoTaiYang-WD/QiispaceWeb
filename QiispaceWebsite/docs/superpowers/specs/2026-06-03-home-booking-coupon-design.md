# 首页预约表单 & 优惠弹窗 — 设计规格

> **状态**: 设计已确认 | **日期**: 2026-06-03 | **版本**: v1.0

---

## 1. 功能概述

在首页新增两个转化类交互：

1. **预约表单弹窗** — 点击首页 CTA 按钮弹出，收集姓名 + 手机号
2. **优惠浮动按钮 + 弹窗** — 首页右下角固定悬浮按钮，点击弹出新客优惠领取

---

## 2. 组件结构

```
src/components/
├── BookingModal.vue    ← 新增：预约表单弹窗
└── CouponPopup.vue     ← 新增：优惠浮动按钮 + 弹窗

src/views/Home.vue
  → CTA 区按钮 @click="showBooking = true"
  → 模板末尾引入 <BookingModal> + <CouponPopup>
```

### 触发关系

```
Home.vue CTA "预约体验"
  ↓ click
BookingModal v-model:visible
  → 姓名 + 手机号 → "提交预约"
  → 成功提示 → 2s 后自动关闭

Home.vue 右下角浮动按钮 "¥"
  ↓ click
CouponPopup (内部 visible)
  → 手机号 → "立即领取"
  → 显示优惠码 QIISPACE50
```

---

## 3. BookingModal 规格

### 3.1 接口

| Props | 类型 | 默认 | 说明 |
|-------|------|------|------|
| modelValue | boolean | false | v-model 控制显隐，true=打开，false=关闭 |

| Emits | 参数 | 说明 |
|-------|------|------|
| update:modelValue | boolean | 双向绑定，弹窗请求关闭时 emit(false) |

### 3.2 表单状态机

```
初始态（表单清空）
  → 用户输入中
    → 点击提交 → 前端校验
      → 校验失败 → 字段下方红字提示
      → 校验通过 → 按钮 loading → 模拟提交(1.2s)
        → 成功态：显示 ✓ "预约成功，我们将在 24 小时内联系您"
        → 2s 后自动 emit('update:modelValue', false)
```

### 3.3 字段校验

| 字段 | 类型 | 校验规则 |
|------|------|----------|
| 姓名 | text | 必填，2-20 个字符，trim 后校验 |
| 手机号 | tel | 必填，中国大陆手机号正则 `/^1[3-9]\d{9}$/` |

### 3.4 动画

| 阶段 | 元素 | 动画 |
|------|------|------|
| 打开 | 遮罩 | GSAP opacity 0→1, duration 0.3s |
| 打开 | 卡片 | GSAP scale 0.9→1 + opacity 0→1, duration 0.4s, ease: back.out(1.3) |
| 关闭 | 遮罩 | GSAP opacity 1→0, 0.25s |
| 关闭 | 卡片 | GSAP scale 1→0.9 + opacity 1→0, 0.3s |
| 提交成功 | 成功图标 | GSAP scale 0→1, 0.4s, elastic.out |

### 3.5 关闭方式

- 点击右上角 ✕ 按钮
- 点击遮罩（卡片外区域）
- 按 ESC 键

### 3.6 样式

| 元素 | 规则 |
|------|------|
| 遮罩 | position: fixed, z-index: 2000, background: rgba(0,0,0,0.4) |
| 卡片 | position: fixed, z-index: 2001, background: #fff, width: 480px, border-radius: var(--radius-md), 水平垂直居中 |
| 输入框 | height: 48px, border: 1px solid var(--color-border), border-radius: var(--radius-sm), padding: 0 12px |
| 输入框聚焦 | border-color: var(--color-dark) |
| 提交按钮 | .btn--primary, 全宽, 提交中时 opacity: 0.7 + 旋转 spinner |
| 错误提示 | font-size: 0.8rem, color: #e74c3c, margin-top: 4px |
| 成功图标 | font-size: 3rem |

### 3.7 移动端

| 断点 | 变化 |
|------|------|
| ≤600px | 卡片 width: 90vw, padding: 28px 20px, 输入框 height: 44px |

### 3.8 无障碍

- `aria-modal="true"` 标记模态框
- 打开时 `focusTrap`：聚焦第一个 input
- ESC 关闭
- 遮罩区域 `aria-hidden` 防止误触

---

## 4. CouponPopup 规格

### 4.1 浮动按钮

| 位置 | 样式 |
|------|------|
| position: fixed | bottom: 28px, right: 28px, z-index: 999 |
| 尺寸 | width: 56px, height: 56px, border-radius: 50% |
| 背景 | var(--color-dark) |
| 图标 | "¥" 白色 1.2rem bold |
| 动画 | breathe keyframe（已有 `@keyframes breathe`），2s infinite |

### 4.2 弹窗接口

| Props | 类型 | 说明 |
|-------|------|------|
| (无) | — | 弹窗显隐由组件内部 ref 管理 |

### 4.3 弹窗内容

```
┌─────────────────────────┐
│                    [✕]  │
│     🎁 新客专享          │
│     ───────            │
│     ¥50                 │  (font-size: 3rem, bold, color: var(--color-primary-dark))
│     首次体验立减 50 元    │
│                         │
│  ┌──────────────────┐   │
│  │ 请输入手机号      │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │    立即领取       │   │  (全宽 .btn--primary)
│  └──────────────────┘   │
└─────────────────────────┘
```

成功态替换内容：

```
     ✓ 领取成功！
  优惠码：QIISPACE50
  到店出示即可使用
```

### 4.4 状态机

```
初始态（浮动按钮可见，弹窗关闭）
  → 点击按钮 → 弹窗打开
    → 输入手机号 → 前端校验
      → 校验失败 → 红字提示
      → 校验通过 → 成功态
        → 显示优惠码 + 使用说明
```

### 4.5 动画

| 阶段 | 动画 |
|------|------|
| 弹窗打开 | 遮罩 fade in 0.3s + 卡片从右下角 scale 0.8→1 + opacity 0→1, 0.35s, back.out(1.3) |
| 弹窗关闭 | 反向：scale→0.8 + opacity→0, 0.25s |
| 成功态 | 优惠码数字放大弹入 |

### 4.6 关闭方式

- ✕ 按钮
- 点击遮罩
- ESC 键

### 4.7 样式

| 元素 | 规则 |
|------|------|
| 弹窗卡片 | width: 380px, border-radius: var(--radius-md), 顶部强调色渐变条（3px, var(--color-primary)) |
| 金额 | font-family: var(--font-title), font-size: 3rem, color: var(--color-primary-dark) |
| 优惠码 | monospace 字体, 大号粗体, 白色底 + var(--color-primary-bg) padding 包裹 |

### 4.8 移动端

| 断点 | 变化 |
|------|------|
| ≤600px | 弹窗 width: 90vw, max-width: 380px |
| ≤480px | 浮动按钮缩小为 44px, bottom: 16px, right: 16px |

---

## 5. Home.vue 改动

```diff
+ import BookingModal from '@/components/BookingModal.vue'
+ import CouponPopup from '@/components/CouponPopup.vue'
+ const showBooking = ref(false)

- <router-link to="/stores" class="btn btn--primary magnetic-btn">查找附近门店</router-link>
+ <button class="btn btn--primary magnetic-btn" @click="showBooking = true">预约体验</button>

  <!-- 模板末尾 -->
+ <BookingModal v-model="showBooking" />
+ <CouponPopup />
```

### 注意事项

- CTA 区从 `<router-link>` 改为 `<button>` + 事件，原有的磁性按钮效果需要适配 `<button>` 元素（当前实现基于 `.magnetic-btn` 选择器，不区分标签类型，应兼容）
- 历史 CTA 文案"查找附近门店"改为"预约体验"
- CouponPopup 无外部 props，直接挂载即可

---

## 6. 文件清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 新建 | `src/components/BookingModal.vue` | 预约表单弹窗 |
| 新建 | `src/components/CouponPopup.vue` | 优惠浮动按钮 + 弹窗 |
| 修改 | `src/views/Home.vue` | 引入组件 + CTA 绑定事件 |

---

## 7. 不在范围内

- ❌ 后端 API 对接（当前为模拟提交，1.2s 延时）
- ❌ 短信验证码
- ❌ 表单数据持久化
- ❌ 门店/服务选择（简版表单）
- ❌ 优惠券核销逻辑

---

> **下一步**: 进入 writing-plans 编写实施计划
