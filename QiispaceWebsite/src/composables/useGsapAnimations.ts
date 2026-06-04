import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGsapAnimations(): void {
  onMounted(() => {
    // Hero text stagger animation
    const heroElements = document.querySelectorAll('.hero__title span')
    if (heroElements.length) {
      gsap.fromTo(
        heroElements,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.3,
        }
      )
    }

    // Hero subtitle & buttons
    gsap.fromTo(
      '.hero__subtitle, .hero__actions',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.8,
      }
    )

    // ScrollTrigger: cards stagger
    gsap.utils.toArray<HTMLElement>('.card-reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    // Parallax sections
    gsap.utils.toArray<HTMLElement>('.parallax-bg').forEach((el) => {
      gsap.to(el, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement!,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })

    // Number counter animation
    gsap.utils.toArray<HTMLElement>('.counter').forEach((el) => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10)
      if (target) {
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2.5,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    // Image reveal on scroll
    gsap.utils.toArray<HTMLElement>('.img-reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    })
  })
}
