<template>
  <canvas ref="canvasRef" class="particle-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId = 0
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

interface Particle { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; color: string }

function initCanvas() {
  canvas = canvasRef.value!
  ctx = canvas.getContext('2d')!
  resize()
  window.addEventListener('resize', resize)
}
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight }

const colors = [
  'rgba(0,0,0,0.03)',
  'rgba(0,0,0,0.025)',
  'rgba(140,122,106,0.04)',
  'rgba(0,0,0,0.02)',
]
const particles: Particle[] = []

function createParticles() {
  const count = Math.floor((canvas.width * canvas.height) / 30000)
  particles.length = 0
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 10 + 3,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.2 - 0.1,
      opacity: Math.random() * 0.35 + 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const p of particles) {
    p.x += p.speedX; p.y += p.speedY
    if (p.x < -30) p.x = canvas.width + 30
    if (p.x > canvas.width + 30) p.x = -30
    if (p.y < -30) p.y = canvas.height + 30
    if (p.y > canvas.height + 30) p.y = -30
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.fill()
  }
  animationId = requestAnimationFrame(animate)
}

onMounted(() => { initCanvas(); createParticles(); animate() })
onUnmounted(() => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize) })
</script>

<style scoped>
.particle-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
</style>
