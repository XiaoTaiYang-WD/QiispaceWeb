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
              id="coupon-phone"
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
const tweens: gsap.core.Tween[] = []

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
  document.body.style.overflow = 'hidden'
  await nextTick()
  if (!popupRef.value) return
  const overlay = popupRef.value.parentElement
  if (overlay) {
    tweens.push(gsap.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    ))
  }
  tweens.push(gsap.fromTo(
    popupRef.value,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.3)' }
  ))
  phoneInputRef.value?.focus()
  document.addEventListener('keydown', onKeydown)
}

// --- 关闭 ---
async function close() {
  if (submitting.value) return
  document.body.style.overflow = ''
  if (!popupRef.value) {
    popupVisible.value = false
    return
  }
  const overlay = popupRef.value.parentElement
  if (overlay) {
    tweens.push(gsap.to(overlay, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        popupVisible.value = false
      },
    }))
  } else {
    popupVisible.value = false
  }
  tweens.push(gsap.to(popupRef.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.25,
  }))
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
  // TODO: Replace with real API call
  await new Promise((r) => setTimeout(r, 1000))
  submitting.value = false
  claimed.value = true

  await nextTick()
  if (codeRef.value) {
    tweens.push(gsap.fromTo(
      codeRef.value,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
    ))
  }
}

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  tweens.forEach(t => t.kill())
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
.coupon-popup__label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 6px;
  display: block;
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
