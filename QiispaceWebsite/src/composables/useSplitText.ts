import gsap from 'gsap'

export function useSplitText(selector: string, delay: number = 0) {
  const elements = document.querySelectorAll(selector)

  elements.forEach((el) => {
    const text = el.textContent || ''
    el.innerHTML = ''
    el.setAttribute('aria-label', text)

    const chars = text.split('').map((char) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? ' ' : char
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      span.style.transform = 'translateY(60px) rotateX(-40deg)'
      el.appendChild(span)
      return span
    })

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.7,
      stagger: 0.03,
      ease: 'back.out(1.4)',
      delay,
    })
  })
}
