<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="booking-modal__overlay"
      @click.self="close"
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

        <template v-if="!submitted">
          <h3 class="booking-modal__title">预约体验</h3>
          <p class="booking-modal__subtitle">
            填写信息，我们将在 24 小时内与您联系
          </p>

          <form class="booking-modal__form" @submit.prevent="handleSubmit">
            <div class="booking-modal__field">
              <label class="booking-modal__label" for="booking-name">姓名</label>
              <input
                id="booking-name"
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
              <label class="booking-modal__label" for="booking-phone">手机号</label>
              <input
                id="booking-phone"
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
const tweens: gsap.core.Tween[] = []

async function animateIn() {
  visible.value = true
  // Lock body scroll while modal is open
  document.body.style.overflow = 'hidden'
  await nextTick()
  if (!cardRef.value) return
  const overlay = cardRef.value.parentElement
  if (overlay) {
    tweens.push(gsap.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    ))
  }
  tweens.push(gsap.fromTo(
    cardRef.value,
    { scale: 0.9, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.3)' }
  ))
  // Focus depends on v-if="visible" && v-if="!submitted" both being true in template
  nameInputRef.value?.focus()
}

async function animateOut() {
  if (!cardRef.value) {
    visible.value = false
    return
  }
  const overlay = cardRef.value.parentElement
  if (overlay) {
    tweens.push(gsap.to(overlay, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        visible.value = false
      },
    }))
  } else {
    visible.value = false
  }
  tweens.push(gsap.to(cardRef.value, {
    scale: 0.9,
    opacity: 0,
    duration: 0.3,
  }))
}

function close() {
  if (submitting.value) return
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
  emit('update:modelValue', false)
}

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

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  // TODO: Replace with real API call
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

  closeTimer = setTimeout(() => {
    emit('update:modelValue', false)
  }, 2000)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      name.value = ''
      phone.value = ''
      errors.value = {}
      submitted.value = false
      submitting.value = false
      await animateIn()
      // Guard: if modal was closed during animateIn, don't add listener
      if (!props.modelValue) return
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
      await animateOut()
      // Restore body scroll when modal closes
      document.body.style.overflow = ''
    }
  }
)

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  tweens.forEach(t => t.kill())
  if (closeTimer) clearTimeout(closeTimer)
})
</script>

<style scoped>
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
