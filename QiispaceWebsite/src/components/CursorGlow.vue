<template>
  <div class="cursor-glow" :style="glowStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMouseGlow } from '@/composables/useMouseGlow'
const { glowX, glowY } = useMouseGlow()
const glowStyle = computed(() => ({ left: `${glowX.value}px`, top: `${glowY.value}px` }))
</script>

<style scoped>
.cursor-glow {
  position: fixed; pointer-events: none; z-index: 9999;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle at center, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.015) 30%, transparent 70%);
  transform: translate(-50%, -50%); will-change: left, top;
}
</style>
