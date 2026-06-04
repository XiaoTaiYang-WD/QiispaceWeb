<template>
  <div class="morphing-blobs" ref="containerRef">
    <div class="blob blob--1" ref="blob1Ref" />
    <div class="blob blob--2" ref="blob2Ref" />
    <div class="blob blob--3" ref="blob3Ref" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const containerRef = ref<HTMLElement | null>(null)
const blob1Ref = ref<HTMLElement | null>(null)
const blob2Ref = ref<HTMLElement | null>(null)
const blob3Ref = ref<HTMLElement | null>(null)

onMounted(() => {
  const blobs = [blob1Ref.value, blob2Ref.value, blob3Ref.value].filter(Boolean)

  blobs.forEach((blob, i) => {
    if (!blob) return
    // Random float animation for each blob
    gsap.to(blob, {
      x: 'random(-60, 60)',
      y: 'random(-40, 40)',
      scale: 0.8 + Math.random() * 0.6,
      duration: 6 + i * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 1.5,
    })
  })
})
</script>

<style scoped>
.morphing-blobs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: -2;
  filter: blur(60px);
}
.blob {
  position: absolute;
  border-radius: 50%;
  opacity: 0.45;
  will-change: transform;
}
.blob--1 {
  width: 45vw;
  height: 45vw;
  max-width: 600px;
  max-height: 600px;
  background: linear-gradient(135deg, #B8DBC5, #8DC9A0);
  top: 5%;
  left: -8%;
  animation: blobMorph1 12s ease-in-out infinite;
}
.blob--2 {
  width: 35vw;
  height: 35vw;
  max-width: 450px;
  max-height: 450px;
  background: linear-gradient(135deg, #C5E0D0, #A8D5B5);
  top: 40%;
  right: -5%;
  animation: blobMorph2 14s ease-in-out infinite;
}
.blob--3 {
  width: 25vw;
  height: 25vw;
  max-width: 350px;
  max-height: 350px;
  background: linear-gradient(135deg, #D8EBDF, #BFDBC8);
  bottom: 10%;
  left: 25%;
  animation: blobMorph3 10s ease-in-out infinite;
}

@keyframes blobMorph1 {
  0%, 100% { border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; }
  25% { border-radius: 55% 45% 60% 40% / 45% 55% 40% 60%; }
  50% { border-radius: 40% 60% 45% 55% / 55% 45% 60% 40%; }
  75% { border-radius: 60% 40% 50% 50% / 40% 60% 45% 55%; }
}
@keyframes blobMorph2 {
  0%, 100% { border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%; }
  33% { border-radius: 55% 45% 55% 45% / 45% 55% 45% 55%; }
  66% { border-radius: 40% 60% 50% 50% / 60% 40% 50% 50%; }
}
@keyframes blobMorph3 {
  0%, 100% { border-radius: 50% 50% 55% 45% / 45% 55% 50% 50%; }
  50% { border-radius: 60% 40% 45% 55% / 50% 50% 55% 45%; }
}
</style>
