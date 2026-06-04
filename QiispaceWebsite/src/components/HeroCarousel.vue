<template>
  <div class="hero-carousel">
    <img
      v-for="(img, i) in images"
      :key="i"
      :src="img"
      :class="['hero-carousel__img', { 'hero-carousel__img--active': i === current }]"
      alt="栖愈SPA"
    />
    <div class="hero-carousel__overlay" />
    <div class="hero-carousel__dots">
      <button
        v-for="(_, i) in images"
        :key="i"
        :class="['hero-carousel__dot', { 'hero-carousel__dot--active': i === current }]"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const images = [
  '/image/carousel-1.jpg',
  '/image/carousel-2.jpg',
  '/image/carousel-3.jpg',
  '/image/carousel-4.jpg',
  '/image/carousel-5.jpg',
  '/image/carousel-6.jpg',
]

const current = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function next() {
  current.value = (current.value + 1) % images.length
}

function goTo(i: number) {
  if (i === current.value) return
  current.value = i
  resetTimer()
}

function resetTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(next, 5000)
}

onMounted(() => {
  timer = setInterval(next, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.hero-carousel {
  position: absolute;
  inset: 0;
  z-index: -2;
  overflow: hidden;
  background: #1a1a1a;
}

.hero-carousel__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  filter: brightness(0.65);
}

.hero-carousel__img--active {
  opacity: 1;
}

.hero-carousel__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(0,0,0,0.1) 0%,
    rgba(0,0,0,0.35) 65%,
    rgba(0,0,0,0.6) 100%
  );
}

.hero-carousel__dots {
  position: absolute;
  top: 50%;
  right: 28px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 3;
}

.hero-carousel__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.45);
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.hero-carousel__dot--active {
  background: #fff;
  height: 24px;
  border-radius: 4px;
}
</style>
