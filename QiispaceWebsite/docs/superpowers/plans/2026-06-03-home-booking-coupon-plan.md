# 首页预约表单 & 优惠弹窗 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在首页新增 BookingModal（预约表单弹窗）和 CouponPopup（优惠浮动按钮+弹窗）两个转化组件。

**Architecture:** 两个独立 SFC 组件，各自管理内部状态。BookingModal 通过 v-model 由 Home.vue 控制显隐；CouponPopup 完全自治，浮动按钮常驻首页。均使用 GSAP 处理开闭动画，前端表单校验，模拟提交。

**Tech Stack:** Vue 3 Composition API + GSAP + Scoped CSS + CSS Variables

**Source spec:** `docs/superpowers/specs/2026-06-03-home-booking-coupon-design.md`

---

## File Map

| 操作 | 文件 | 职责 |
|------|------|------|
| Create | `src/components/BookingModal.vue` | 预约表单弹窗：表单校验 → 模拟提交 → 成功提示 |
| Create | `src/components/CouponPopup.vue` | 浮动按钮 + 优惠弹窗：手机号领取 → 显示优惠码 |
| Modify | `src/views/Home.vue:149-150` | CTA 从 `<router-link>` 改为 `<button>` + 引入组件 |

---

### Task 1: Create BookingModal.vue

**Files:**
- Create: `src/components/BookingModal.vue`

- [ ] **Step 1: Write the complete component**

```vue
<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="booking-modal__overlay"
      @click.self="close"
      @keydown.esc="close"
    >
      <div
        ref="cardRef"
        class="booking-modal__card"
        role="dialog"
        aria-modal="true"
        aria-label="预约体验"
      >
        <button class="booking-modal__close" @click="close" aria-label="关闭">
          ✕
        </button>

        <!-- 表单态 -->
        <template v-if="!submitted">
          <h3 class="booking-modal__title">预约体验</h3>
          <p class="booking-modal__subtitle">
            填写信息，我们将在 24 小时内与您联系
          </p>

          <form class="booking-modal__form" @submit.prevent="handleSubmit">
            <div class="booking-modal__field">
              <label class="booking-modal__label">姓名</label>
              <input
                ref="nameInputRef"
                v-model="name"
                type="text"
                class="booking-modal__input"
                placeholder="请输入您的姓名"
                maxlength="20"
                :class="{ 'booking-modal__input--error': errors.name }"
              />
              <span v-if="errors.name" class="booking-modal__error">
                {{ errors.name }}
              </span>
            </div>

            <div class="booking-modal__field">
              <label class="booking-modal__label">手机号</label>
              <input
                v-model="phone"
                type="tel"
                class="booking-modal__input"
                placeholder="请输入您的手机号"
                maxlength="11"
                :class="{ 'booking-modal__input--error': errors.phone }"
              />
              <span v-if="errors.phone" class="booking-modal__error">
                {{ errors.phone }}
              </span>
            </div>

            <button
              type="submit"
              class="booking-modal__submit btn btn--primary"
              :disabled="submitting"
            >
              <span v-if="submitting" class="booking-modal__spinner" />
              {{ submitting ? '提交中...' : '提交预约' }}
            </button>
          </form>
        </template>

        <!-- 成功态 -->
        <template v-else>
          <div class="booking-modal__success">
            <span ref="successIconRef" class="booking-modal__success-icon">✓</span>
            <h3 class="booking-modal__success-title">预约成功</h3>
            <p class="booking-modal__success-desc">
              我们将在 24 小时内与您联系
            </p>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import gsap from 'gsap'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const visible = ref(false)
const submitted = ref(false)
const submitting = ref(false)
const name = ref('')
const phone = ref('')
const errors = ref<{ name?: string; phone?: string }>({})

const cardRef = ref<HTMLElement | null>(null)
const nameInputRef = ref<HTMLInputElement | null>(null)
const successIconRef = ref<HTMLElement | null>(null)

let closeTimer: ReturnType<typeof setTimeout> | null = null

// --- 动画: 打开 ---
async function animateIn() {
  visible.value = true
  await nextTick()
  if (!cardRef.value) return
  gsap.fromTo(
    cardRef.value.parentElement!,
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  )
  gsap.fromTo(
    cardRef.value,
    { scale: 0.9, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.3)' }
  )
  nameInputRef.value?.focus()
}

// --- 动画: 关闭 ---
async function animateOut() {
  if (!cardRef.value) {
    visible.value = false
    return
  }
  const overlay = cardRef.value.parentElement!
  gsap.to(cardRef.value, {
    scale: 0.9,
    opacity: 0,
    duration: 0.3,
  })
  gsap.to(overlay, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      visible.value = false
    },
  })
}

// --- 关闭方法 ---
function close() {
  if (submitting.value) return
  emit('update:modelValue', false)
}

// --- 表单校验 ---
function validate(): boolean {
  const errs: { name?: string; phone?: string } = {}
  const nameTrimmed = name.value.trim()
  if (!nameTrimmed) {
    errs.name = '请输入姓名'
  } else if (nameTrimmed.length < 2) {
    errs.name = '姓名至少 2 个字符'
  }
  if (!phone.value) {
    errs.phone = '请输入手机号'
  } else if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    errs.phone = '请输入正确的手机号'
  }
  errors.value = errs
  return Object.keys(errs).length === 0
}

// --- 提交 ---
async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  // 模拟 API 请求
  await new Promise((r) => setTimeout(r, 1200))
  submitting.value = false
  submitted.value = true

  await nextTick()
  if (successIconRef.value) {
    gsap.fromTo(
      successIconRef.value,
      { scale: 0 },
      { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' }
    )
  }

  // 2 秒后自动关闭
  closeTimer = setTimeout(() => {
    emit('update:modelValue', false)
  }, 2000)
}

// --- ESC 关闭 ---
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

// --- 监听 modelValue ---
watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      // 重置状态
      name.value = ''
      phone.value = ''
      errors.value = {}
      submitted.value = false
      submitting.value = false
      await animateIn()
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
      await animateOut()
    }
  }
)

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  if (closeTimer) clearTimeout(closeTimer)
})
</script>

<style scoped>
/* ========== Overlay ========== */
.booking-modal__overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* ========== Card ========== */
.booking-modal__card {
  position: relative;
  z-index: 2001;
  background: var(--color-white);
  border-radius: var(--radius-md);
  width: 480px;
  max-width: 100%;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

.booking-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  font-size: 1.2rem;
  color: var(--color-text-muted);
  border-radius: 50%;
  transition: all 0.2s;
}
.booking-modal__close:hover {
  background: var(--color-primary-bg);
  color: var(--color-text);
}

/* ========== Title ========== */
.booking-modal__title {
  font-family: var(--font-title);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 6px;
}
.booking-modal__subtitle {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  margin-bottom: 32px;
}

/* ========== Form ========== */
.booking-modal__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.booking-modal__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.booking-modal__label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
}
.booking-modal__input {
  height: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-white);
  transition: border-color 0.2s;
  outline: none;
}
.booking-modal__input::placeholder {
  color: var(--color-text-muted);
}
.booking-modal__input:focus {
  border-color: var(--color-dark);
}
.booking-modal__input--error {
  border-color: #e74c3c;
}
.booking-modal__input--error:focus {
  border-color: #e74c3c;
}
.booking-modal__error {
  font-size: 0.8rem;
  color: #e74c3c;
}

/* ========== Submit ========== */
.booking-modal__submit {
  width: 100%;
  margin-top: 4px;
}
.booking-modal__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.booking-modal__spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ========== Success ========== */
.booking-modal__success {
  text-align: center;
  padding: 20px 0;
}
.booking-modal__success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 2rem;
  margin-bottom: 16px;
}
.booking-modal__success-title {
  font-family: var(--font-title);
  font-size: 1.3rem;
  margin-bottom: 6px;
  color: var(--color-text);
}
.booking-modal__success-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

/* ========== Responsive ========== */
@media (max-width: 600px) {
  .booking-modal__overlay {
    padding: 16px;
  }
  .booking-modal__card {
    width: 90vw;
    padding: 28px 20px;
  }
  .booking-modal__input {
    height: 44px;
  }
}
</style>
```

- [ ] **Step 2: Verify the file exists and has no syntax issues**

Run: `npx vue-tsc --noEmit src/components/BookingModal.vue 2>&1 || true`
Expected: No errors related to BookingModal.vue (other project-level errors may exist)

---

### Task 2: Create CouponPopup.vue

**Files:**
- Create: `src/components/CouponPopup.vue`

- [ ] **Step 1: Write the complete component**

```vue
<template>
  <!-- 浮动按钮 -->
  <button
    v-if="!popupVisible && !claimed"
    class="coupon-popup__fab"
    aria-label="领取优惠"
    @click="open"
  >
    <span class="coupon-popup__fab-icon">¥</span>
  </button>

  <!-- 弹窗 -->
  <Teleport to="body">
    <div
      v-if="popupVisible"
      class="coupon-popup__overlay"
      @click.self="close"
    >
      <div
        ref="popupRef"
        class="coupon-popup__card"
        role="dialog"
        aria-modal="true"
        aria-label="新客优惠"
      >
        <div class="coupon-popup__accent-bar" />
        <button class="coupon-popup__close" @click="close" aria-label="关闭">
          ✕
        </button>

        <!-- 表单态 -->
        <template v-if="!claimed">
          <p class="coupon-popup__gift">🎁</p>
          <h3 class="coupon-popup__title">新客专享</h3>
          <div class="coupon-popup__divider" />
          <p class="coupon-popup__amount">¥50</p>
          <p class="coupon-popup__desc">首次体验立减 50 元</p>

          <div class="coupon-popup__field">
            <input
              ref="phoneInputRef"
              v-model="phone"
              type="tel"
              class="coupon-popup__input"
              placeholder="请输入手机号"
              maxlength="11"
              :class="{ 'coupon-popup__input--error': errorMsg }"
            />
            <span v-if="errorMsg" class="coupon-popup__error">{{ errorMsg }}</span>
          </div>

          <button
            class="coupon-popup__submit btn btn--primary"
            :disabled="submitting"
            @click="handleClaim"
          >
            <span v-if="submitting" class="coupon-popup__spinner" />
            {{ submitting ? '领取中...' : '立即领取' }}
          </button>
        </template>

        <!-- 成功态 -->
        <template v-else>
          <p class="coupon-popup__success-icon">✓</p>
          <h3 class="coupon-popup__success-title">领取成功！</h3>
          <div class="coupon-popup__code-box">
            <span class="coupon-popup__code-label">优惠码</span>
            <span ref="codeRef" class="coupon-popup__code">QIISPACE50</span>
          </div>
          <p class="coupon-popup__code-hint">到店出示即可使用</p>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, onUnmounted } from 'vue'
import gsap from 'gsap'

const popupVisible = ref(false)
const claimed = ref(false)
const submitting = ref(false)
const phone = ref('')
const errorMsg = ref('')

const popupRef = ref<HTMLElement | null>(null)
const phoneInputRef = ref<HTMLInputElement | null>(null)
const codeRef = ref<HTMLElement | null>(null)

// --- 动画: 打开 ---
async function open() {
  popupVisible.value = true
  await nextTick()
  if (!popupRef.value) return
  gsap.fromTo(
    popupRef.value.parentElement!,
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  )
  gsap.fromTo(
    popupRef.value,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.3)' }
  )
  phoneInputRef.value?.focus()
  document.addEventListener('keydown', onKeydown)
}

// --- 动画: 关闭 ---
async function close() {
  if (submitting.value) return
  if (!popupRef.value) {
    popupVisible.value = false
    return
  }
  const overlay = popupRef.value.parentElement!
  gsap.to(popupRef.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.25,
  })
  gsap.to(overlay, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      popupVisible.value = false
    },
  })
  document.removeEventListener('keydown', onKeydown)
}

// --- ESC ---
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

// --- 领取 ---
async function handleClaim() {
  errorMsg.value = ''
  if (!phone.value) {
    errorMsg.value = '请输入手机号'
    return
  }
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    errorMsg.value = '请输入正确的手机号'
    return
  }

  submitting.value = true
  await new Promise((r) => setTimeout(r, 1000))
  submitting.value = false
  claimed.value = true

  await nextTick()
  if (codeRef.value) {
    gsap.fromTo(
      codeRef.value,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
    )
  }
}

// --- 重新打开时重置 ---
function reset() {
  phone.value = ''
  errorMsg.value = ''
  claimed.value = false
  submitting.value = false
}

// 注: 由于打开方法直接调用 open()，在 open() 开头重置即可
const originalOpen = open
const openWithReset = async () => {
  reset()
  await originalOpen()
}
// 覆盖 — 使用 wrapper
const openFn = async () => {
  reset()
  popupVisible.value = true
  await nextTick()
  if (!popupRef.value) return
  gsap.fromTo(
    popupRef.value.parentElement!,
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  )
  gsap.fromTo(
    popupRef.value,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.3)' }
  )
  phoneInputRef.value?.focus()
  document.addEventListener('keydown', onKeydown)
}

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
/* ========== FAB ========== */
.coupon-popup__fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 999;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-dark);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  animation: couponBreathe 2s ease-in-out infinite;
  transition: transform 0.2s;
}
.coupon-popup__fab:hover {
  transform: scale(1.1);
}
.coupon-popup__fab:active {
  transform: scale(0.95);
}
.coupon-popup__fab-icon {
  font-size: 1.2rem;
  font-weight: 700;
}
@keyframes couponBreathe {
  0%,
  100% {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
  50% {
    box-shadow: 0 4px 28px rgba(0, 0, 0, 0.3);
  }
}

/* ========== Overlay ========== */
.coupon-popup__overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* ========== Card ========== */
.coupon-popup__card {
  position: relative;
  z-index: 2001;
  background: var(--color-white);
  border-radius: var(--radius-md);
  width: 380px;
  max-width: 100%;
  padding: 36px 32px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}
.coupon-popup__accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-primary);
}
.coupon-popup__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  font-size: 1.1rem;
  color: var(--color-text-muted);
  border-radius: 50%;
  transition: all 0.2s;
}
.coupon-popup__close:hover {
  background: var(--color-primary-bg);
  color: var(--color-text);
}

/* ========== Content ========== */
.coupon-popup__gift {
  font-size: 2.2rem;
  margin-bottom: 4px;
}
.coupon-popup__title {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text);
}
.coupon-popup__divider {
  width: 40px;
  height: 1px;
  background: var(--color-border);
  margin: 12px auto;
}
.coupon-popup__amount {
  font-family: var(--font-title);
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  line-height: 1;
  margin-bottom: 6px;
}
.coupon-popup__desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 28px;
}

/* ========== Form ========== */
.coupon-popup__field {
  margin-bottom: 16px;
  text-align: left;
}
.coupon-popup__input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-white);
  transition: border-color 0.2s;
  outline: none;
}
.coupon-popup__input::placeholder {
  color: var(--color-text-muted);
}
.coupon-popup__input:focus {
  border-color: var(--color-dark);
}
.coupon-popup__input--error {
  border-color: #e74c3c;
}
.coupon-popup__error {
  display: block;
  font-size: 0.8rem;
  color: #e74c3c;
  margin-top: 4px;
}
.coupon-popup__submit {
  width: 100%;
}
.coupon-popup__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.coupon-popup__spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ========== Success ========== */
.coupon-popup__success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 1.6rem;
  margin-bottom: 12px;
}
.coupon-popup__success-title {
  font-family: var(--font-title);
  font-size: 1.2rem;
  color: var(--color-text);
  margin-bottom: 20px;
}
.coupon-popup__code-box {
  background: var(--color-primary-bg);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin-bottom: 10px;
}
.coupon-popup__code-label {
  display: block;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}
.coupon-popup__code {
  font-family: 'SF Mono', 'Cascadia Code', 'Menlo', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-dark);
  letter-spacing: 0.08em;
}
.coupon-popup__code-hint {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

/* ========== Responsive ========== */
@media (max-width: 600px) {
  .coupon-popup__card {
    width: 90vw;
    max-width: 380px;
    padding: 28px 20px;
  }
}
@media (max-width: 480px) {
  .coupon-popup__fab {
    width: 44px;
    height: 44px;
    bottom: 16px;
    right: 16px;
  }
  .coupon-popup__fab-icon {
    font-size: 1rem;
  }
}
</style>
```

Wait — 上面代码里 `openFn` 函数我定义了但 template 里用的是 `open`。让我修正：template 里 `@click="open"` 需要改成实际调用的函数。实际上最初定义的 `open` 函数逻辑重复了。让我重写 script 部分使其干净。

- [ ] **Step 2: Fix script to remove duplicate open logic — the actual working code is:**

用下面的完整 `<script setup>` 替换 Step 1 中的对应部分：

```typescript
<script setup lang="ts">
import { ref, nextTick, onUnmounted } from 'vue'
import gsap from 'gsap'

const popupVisible = ref(false)
const claimed = ref(false)
const submitting = ref(false)
const phone = ref('')
const errorMsg = ref('')

const popupRef = ref<HTMLElement | null>(null)
const phoneInputRef = ref<HTMLInputElement | null>(null)
const codeRef = ref<HTMLElement | null>(null)

// --- ESC ---
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

// --- 打开 ---
async function open() {
  // 重置状态
  phone.value = ''
  errorMsg.value = ''
  claimed.value = false
  submitting.value = false

  popupVisible.value = true
  await nextTick()
  if (!popupRef.value) return
  gsap.fromTo(
    popupRef.value.parentElement!,
    { opacity: 0 },
    { opacity: 1, duration: 0.3 }
  )
  gsap.fromTo(
    popupRef.value,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.3)' }
  )
  phoneInputRef.value?.focus()
  document.addEventListener('keydown', onKeydown)
}

// --- 关闭 ---
async function close() {
  if (submitting.value) return
  if (!popupRef.value) {
    popupVisible.value = false
    return
  }
  const overlay = popupRef.value.parentElement!
  gsap.to(popupRef.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.25,
  })
  gsap.to(overlay, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      popupVisible.value = false
    },
  })
  document.removeEventListener('keydown', onKeydown)
}

// --- 领取 ---
async function handleClaim() {
  errorMsg.value = ''
  if (!phone.value) {
    errorMsg.value = '请输入手机号'
    return
  }
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    errorMsg.value = '请输入正确的手机号'
    return
  }

  submitting.value = true
  await new Promise((r) => setTimeout(r, 1000))
  submitting.value = false
  claimed.value = true

  await nextTick()
  if (codeRef.value) {
    gsap.fromTo(
      codeRef.value,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
    )
  }
}

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>
```

把这段替换到 Step 1 的 `<script setup>` 部分，template 中的 `@click="open"` 绑定即正确。

- [ ] **Step 3: Verify the file**

Run: `npx vue-tsc --noEmit src/components/CouponPopup.vue 2>&1 || true`
Expected: No errors from CouponPopup.vue

---

### Task 3: Modify Home.vue — import components + change CTA

**Files:**
- Modify: `src/views/Home.vue`

- [ ] **Step 1: Add imports and ref**

In `<script setup>`, add two imports after the existing composable imports, and add the `showBooking` ref:

```typescript
// Add after: import { useSplitText } from '@/composables/useSplitText'
import BookingModal from '@/components/BookingModal.vue'
import CouponPopup from '@/components/CouponPopup.vue'

// Add after: const storeCount = ref(9)
const showBooking = ref(false)
```

- [ ] **Step 2: Change CTA button**

Replace the existing CTA section (lines 149-151):

From:
```html
        <div class="reveal">
          <router-link to="/stores" class="btn btn--primary magnetic-btn">查找附近门店</router-link>
        </div>
```

To:
```html
        <div class="reveal">
          <button class="btn btn--primary magnetic-btn" @click="showBooking = true">预约体验</button>
        </div>
```

- [ ] **Step 3: Add components to template**

After the closing `</section>` of the CTA section and before the closing `</div>` of `.home-page`:

```html
    <BookingModal v-model="showBooking" />
    <CouponPopup />
```

These go after line 153 (`</section>`) and before line 154 (`</div>`).

- [ ] **Step 4: Type-check and build**

Run: `npm run build`
Expected: Build succeeds with no errors.

---

## Self-Review Summary

- **Spec coverage**: BookingModal (Section 3) → Task 1. CouponPopup (Section 4) → Task 2. Home.vue changes (Section 5) → Task 3. All covered.
- **No placeholders**: All code is complete — no TBD, TODO, "add validation", "handle edge cases".
- **Type consistency**: `modelValue: boolean` matches `defineProps` → `props.modelValue`. `update:modelValue` emit matches `v-model` binding in Home.vue. `showBooking` ref type inferred as `boolean`.
- **Out of scope items correctly excluded**: No backend API, no SMS verification, no data persistence, no coupon redemption logic.
