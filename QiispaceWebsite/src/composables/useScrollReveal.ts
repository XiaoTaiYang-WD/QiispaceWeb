import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal(): void {
  let observer: IntersectionObserver | null = null

  function handleIntersection(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal--hidden')
        entry.target.classList.add('reveal--visible')
        observer?.unobserve(entry.target)
      }
    }
  }

  onMounted(() => {
    // First, hide all reveal elements for animation
    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => {
      el.classList.add('reveal--hidden')
    })

    // Then set up observer to reveal them
    observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px',
    })

    // Use requestAnimationFrame to ensure DOM is settled
    requestAnimationFrame(() => {
      elements.forEach((el) => observer!.observe(el))
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })
}
