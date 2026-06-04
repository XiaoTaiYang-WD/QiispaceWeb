import { onMounted, onUnmounted } from 'vue'

export function useTiltEffect(selector: string = '.tilt-card') {
  let cards: NodeListOf<HTMLElement>
  let listeners: (() => void)[] = []

  function handleMouseMove(this: HTMLElement, e: MouseEvent) {
    const rect = this.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8

    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`

    // Dynamic highlight
    const shine = this.querySelector('.tilt-shine') as HTMLElement
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.25) 0%, transparent 60%)`
      shine.style.opacity = '1'
    }
  }

  function handleMouseLeave(this: HTMLElement) {
    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    const shine = this.querySelector('.tilt-shine') as HTMLElement
    if (shine) {
      shine.style.opacity = '0'
    }
  }

  onMounted(() => {
    cards = document.querySelectorAll(selector)
    cards.forEach((card) => {
      const boundMove = handleMouseMove.bind(card as HTMLElement)
      const boundLeave = handleMouseLeave.bind(card as HTMLElement)
      card.addEventListener('mousemove', boundMove)
      card.addEventListener('mouseleave', boundLeave)
      listeners.push(() => {
        card.removeEventListener('mousemove', boundMove)
        card.removeEventListener('mouseleave', boundLeave)
      })
    })
  })

  onUnmounted(() => {
    listeners.forEach((fn) => fn())
  })
}
