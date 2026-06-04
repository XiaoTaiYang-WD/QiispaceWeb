import { ref, onMounted, onUnmounted } from 'vue'

export function useMouseGlow() {
  const glowX = ref(0)
  const glowY = ref(0)
  const cursorX = ref(0)
  const cursorY = ref(0)
  const isHovering = ref(false)

  let rafId = 0
  let targetX = 0
  let targetY = 0

  function onMouseMove(e: MouseEvent) {
    targetX = e.clientX
    targetY = e.clientY
  }

  function onMouseEnter() {
    isHovering.value = true
  }

  function onMouseLeave() {
    isHovering.value = false
  }

  function animate() {
    const dx = targetX - cursorX.value
    const dy = targetY - cursorY.value
    cursorX.value += dx * 0.08
    cursorY.value += dy * 0.08
    glowX.value += (targetX - glowX.value) * 0.04
    glowY.value += (targetY - glowY.value) * 0.04
    rafId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    animate()
  })

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseenter', onMouseEnter)
    document.removeEventListener('mouseleave', onMouseLeave)
  })

  return { glowX, glowY, cursorX, cursorY }
}
