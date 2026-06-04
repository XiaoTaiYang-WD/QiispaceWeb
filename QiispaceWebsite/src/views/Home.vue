<template>
  <div class="home-page">
    <!-- ==================== ACE-style Hero ==================== -->
    <section class="hero" ref="heroRef">
      <div class="hero__bg" ref="heroBgRef">
        <img src="/image/hero-bg.jpg" alt="" class="hero__bg-img" />
        <div class="hero__bg-noise" />
        <div class="hero__bg-overlay" />
      </div>

      <div class="hero__body">
        <div class="hero__tag fade-up">QIISPACE SPA · 身心疗愈</div>
        <h1 class="hero__title split-text">
          <span class="hero__title-light">于城市喧嚣中</span><br />
          <span class="hero__title-bold">寻一处</span>
          <span class="hero__title-accent">身心栖所</span>
        </h1>
        <p class="hero__desc fade-up">
          以自然之力，愈身心之疲。<br />让每一次呼吸都是一场疗愈之旅。
        </p>
        <div class="hero__actions fade-up">
          <router-link to="/services" class="btn btn--primary magnetic-btn">
            探索服务<span class="btn__sparkle">✦</span>
          </router-link>
          <a href="#features" class="btn btn--outline magnetic-btn">了解更多</a>
        </div>
      </div>

      <!-- Right-side vertical stats -->
      <div class="hero__side-stats">
        <div class="hero__stat">
          <span class="hero__stat-num counter counter-animate" :data-target="9">9</span>
          <span class="hero__stat-label">全国门店</span>
        </div>
        <div class="hero__stat">
          <span class="hero__stat-num counter counter-animate" :data-target="100000"> 100000 </span>
          <span class="hero__stat-label">服务次数</span>
        </div>
        <div class="hero__stat">
          <span class="hero__stat-num">99<span class="hero__stat-unit">%</span></span>
          <span class="hero__stat-label">好评推荐</span>
        </div>
      </div>

      <div class="hero__scroll" @click="scrollDown">
        <div class="hero__scroll-ring"><span class="hero__scroll-arrow">↓</span></div>
        <span class="hero__scroll-text">SCROLL</span>
      </div>
    </section>

    <!-- Marquee -->
    <!-- <section class="marquee-section">
      <div class="marquee-track">
        <div class="marquee-content" v-for="n in 2" :key="n">
          <span v-for="(w, i) in marqueeWords" :key="i" class="marquee-item">{{ w }}<span class="marquee-divider">·</span></span>
        </div>
      </div>
    </section> -->

    <!-- Features -->
    <section id="features" class="section">
      <div class="container">
        <h2 class="section__title reveal parallax-depth" data-speed="0.15">为什么选择栖愈</h2>
        <p class="section__subtitle reveal">WHY QIISPACE</p>
        <div class="features-grid parallax-depth" data-speed="0.08">
          <div v-for="(feat, i) in features" :key="i" class="feature-card tilt-card card-reveal">
            <div class="tilt-shine" />
            <span class="feature-card__icon">{{ feat.icon }}</span>
            <h3>{{ feat.title }}</h3>
            <p>{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="section section--alt">
      <div class="container">
        <h2 class="section__title reveal parallax-depth" data-speed="0.12">热门服务</h2>
        <p class="section__subtitle reveal">POPULAR SERVICES</p>
        <div class="services-preview">
          <div v-for="(svc, i) in services" :key="i" class="service-card tilt-card card-reveal">
            <div class="tilt-shine" />
            <div class="service-card__visual">
              <span class="service-card__emoji">{{ svc.emoji }}</span>
              <span class="service-card__badge">HOT</span>
            </div>
            <div class="service-card__info">
              <h3>{{ svc.title }}</h3>
              <p>{{ svc.desc }}</p>
              <span class="service-card__duration">{{ svc.duration }}</span>
            </div>
          </div>
        </div>
        <div class="section__cta reveal">
          <router-link to="/services" class="btn btn--primary magnetic-btn">查看全部服务 →</router-link>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="section stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="(stat, i) in stats" :key="i" class="stat-item reveal">
            <span class="stat-item__number">
              <span class="counter counter-animate" :data-target="stat.value">0</span><small>{{ stat.unit }}</small>
            </span>
            <span class="stat-item__label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Story -->
    <section class="section">
      <div class="container">
        <div class="brand-story">
          <div class="brand-story__text reveal">
            <h2 class="section__title" style="text-align:left;">栖愈之道</h2>
            <p class="section__subtitle" style="text-align:left;">THE QIISPACE WAY</p>
            <p class="brand-story__desc">
              「栖」是栖息、是停留、是安放。<br />
              「愈」是疗愈、是修复、是重生。<br /><br />
              栖愈相信，真正的疗愈来自于身体与自然的重新连接。
              我们精选天然植物精油，融合东方经络智慧与西方芳香疗法，
              为您打造一处远离尘嚣的身心栖息之地。
            </p>
            <router-link to="/about" class="btn btn--outline magnetic-btn">了解更多关于我们</router-link>
          </div>
          <div class="brand-story__visual reveal img-curtain">
            <div class="brand-story__card">
              <span class="brand-story__card-icon">🌿</span>
              <span class="brand-story__card-title">栖愈之道</span>
              <span class="brand-story__card-text">自然 · 疗愈 · 新生</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="container cta-section__content">
        <h2 class="cta-section__title reveal">预约您的心灵之旅</h2>
        <p class="cta-section__subtitle reveal">
          栖愈在全国已有 <strong>{{ storeCount }}</strong> 家门店，期待您的光临
        </p>
        <div class="reveal">
          <button class="btn btn--primary magnetic-btn" @click="showBooking = true">预约体验</button>
        </div>
      </div>
    </section>

    <BookingModal v-model="showBooking" />
    <CouponPopup />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useTiltEffect } from '@/composables/useTiltEffect'
import { useSplitText } from '@/composables/useSplitText'
import BookingModal from '@/components/BookingModal.vue'
import CouponPopup from '@/components/CouponPopup.vue'
import gsap from 'gsap'

const heroRef = ref<HTMLElement | null>(null)
const heroBgRef = ref<HTMLElement | null>(null)
const storeCount = ref(9) // 这里可以替换成实际的门店数量
const showBooking = ref(false)

const features = [
  { icon: '🌿', title: '天然有机', desc: '全线产品采用天然有机植物精油，无添加无刺激，让肌肤回归纯粹。' },
  { icon: '🤲', title: '专业手法', desc: '理疗师均经过300+小时专业培训，融合东西方技法精髓。' },
  { icon: '🎋', title: '静谧空间', desc: '以自然元素打造的疗愈空间，一进门便能感受身心的放松与安宁。' },
  { icon: '💚', title: '定制方案', desc: '根据每位客人的身体状况与需求，量身定制专属疗愈方案。' },
]

const services = [
  { emoji: '💆', title: '深层组织按摩', desc: '针对深层肌肉组织，缓解慢性疼痛与肌肉紧张', duration: '60/90 min' },
  { emoji: '🪷', title: '芳香精油SPA', desc: '精选天然植物精油，沉浸式身心放松体验', duration: '90/120 min' },
  { emoji: '🌸', title: '面部焕颜护理', desc: '深层清洁与滋养，让肌肤重现自然光彩', duration: '60/90 min' },
]

const stats = [
  { value: 9, unit: '+', label: '全国门店' },
  { value: 100000, unit: '+', label: '服务人次' },
  { value: 200, unit: '+', label: '专业理疗师' },
  { value: 99, unit: '%', label: '好评率' },
]

function scrollDown() { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }

// ACE-style: background drift on mouse move
function onHeroMouseMove(e: MouseEvent) {
  const x = (e.clientX / window.innerWidth - 0.5) * 15
  const y = (e.clientY / window.innerHeight - 0.5) * 10
  gsap.to('.hero__bg', { x, y, duration: 1.5, ease: 'power2.out' })
  gsap.to('.hero__body', { x: x * 0.4, y: y * 0.4, duration: 1.5, ease: 'power2.out' })
  gsap.to('.hero__side-stats', { x: -x * 0.3, duration: 1.5, ease: 'power2.out' })
}

function animateCounters() {
  document.querySelectorAll('.counter-animate').forEach((el) => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10)
    if (!target) return
    gsap.fromTo(el, { innerText: 0 }, {
      innerText: target, duration: 2.5, ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    })
  })
}

let magneticCleanups: (() => void)[] = []

function setupMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach((el) => {
    const btn = el as HTMLElement
    const onMove = (e: MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      gsap.to(e.currentTarget, { x: (e.clientX - rect.left - rect.width / 2) * 0.15, y: (e.clientY - rect.top - rect.height / 2) * 0.15, duration: 0.4, ease: 'power2.out' })
    }
    const onLeave = () => { gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }) }
    btn.addEventListener('mousemove', onMove)
    btn.addEventListener('mouseleave', onLeave)
    magneticCleanups.push(() => {
      btn.removeEventListener('mousemove', onMove)
      btn.removeEventListener('mouseleave', onLeave)
    })
  })
}

onMounted(async () => {
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  useScrollReveal()
  useTiltEffect('.tilt-card')
  setupMagneticButtons()

  await nextTick()
  useSplitText('.split-text', 0.3)

  // ACE-style staggered entrance
  gsap.fromTo('.fade-up', { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, stagger: 0.2, ease: 'power3.out', delay: 0.6 })

  // Hero side stats entrance
  gsap.fromTo('.hero__stat', { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 1.2 })

  // Curtain reveal
  gsap.utils.toArray<HTMLElement>('.img-curtain').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, {
      clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
    })
  })

  // Parallax depth
  gsap.utils.toArray<HTMLElement>('.parallax-depth').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-speed') || '0.3')
    gsap.to(el, {
      y: () => window.innerHeight * speed * 0.15, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
    })
  })

  // ACE-style: bg image scale on scroll
  gsap.to('.hero__bg-img', {
    scale: 1.3, duration: 0.8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
    },
  })

  animateCounters()
  heroRef.value?.addEventListener('mousemove', onHeroMouseMove, { passive: true })
})

onUnmounted(() => {
  heroRef.value?.removeEventListener('mousemove', onHeroMouseMove)
  magneticCleanups.forEach(fn => fn())
  magneticCleanups = []
})
</script>

<style scoped>
/* ==================== ACE-style Hero ==================== */
.hero {
  height: 100vh; min-height: 700px;
  display: flex; align-items: center;
  position: relative; overflow: hidden;
}

/* Background */
.hero__bg {
  position: absolute; inset: -2%;
  z-index: 0; will-change: transform;
}
.hero__bg-img {
  width: 100%; height: 100%; object-fit: cover;
  filter: brightness(0.7) saturate(1);
}
.hero__bg-noise {
  position: absolute; inset: 0; z-index: 1;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
}
.hero__bg-overlay {
  position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(
    170deg,
    rgba(0,0,0,0.55) 0%,
    rgba(0,0,0,0.3) 40%,
    rgba(0,0,0,0.25) 70%,
    rgba(0,0,0,0.5) 100%
  );
}

/* Body */
.hero__body {
  position: relative; z-index: 3;
  padding: 0 6vw; max-width: 700px;
  will-change: transform;
}
.hero__tag {
  display: inline-block; padding: 6px 16px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 2px;
  font-size: 0.75rem; letter-spacing: 0.2em;
  color: rgba(255,255,255,0.8);
  margin-bottom: 28px;
  text-transform: uppercase;
}
.hero__title {
  font-family: var(--font-title);
  font-size: clamp(2.6rem, 4vw, 5rem);
  line-height: 1.5; color: #fff;
  letter-spacing: 0.03em; margin-bottom: 24px;
}
.hero__title :deep(span) { display: inline-block; }
.hero__title-light { font-weight: 300; }
.hero__title-bold { font-weight: 700; }
.hero__title-accent {
  font-weight: 700; color: #D4C4B0;
  position: relative;
}
.hero__desc {
  font-size: 1.05rem; color: rgba(255,255,255,0.7);
  line-height: 1.9; margin-bottom: 40px;
  max-width: 440px;
}
.hero__actions { display: flex; gap: 14px; flex-wrap: wrap; }
.btn__sparkle { margin-left: 6px; animation: sparkle 1.5s ease-in-out infinite; }
@keyframes sparkle { 0%,100%{ opacity:0.3; transform:scale(0.8); } 50%{ opacity:1; transform:scale(1.2); } }

/* Hero btn overrides */
.hero :deep(.btn--outline) { color: #fff; border-color: rgba(255,255,255,0.5); }
.hero :deep(.btn--outline):hover { background: #fff; color: #111; border-color: #fff; }
.hero :deep(.btn--primary) { background: #fff; color: #111; }
.hero :deep(.btn--primary):hover { background: rgba(255,255,255,0.85); }

/* Side stats */
.hero__side-stats {
  position: absolute; right: 5vw; top: 50%; transform: translateY(-50%);
  z-index: 3; display: flex; flex-direction: column; gap: 40px;
  will-change: transform;
}
.hero__stat { text-align: right; }
.hero__stat-num {
  display: block; font-family: var(--font-title);
  font-size: 2.2rem; font-weight: 600; color: #fff; line-height: 1;
}
.hero__stat-unit { font-size: 1.2rem; }
.hero__stat-label {
  display: block; font-size: 0.72rem; letter-spacing: 0.12em;
  color: rgba(255,255,255,0.5); margin-top: 6px; text-transform: uppercase;
}

/* Scroll */
.hero__scroll { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; z-index: 3; }
.hero__scroll-ring { width: 36px; height: 56px; border-radius: 18px; border: 2px solid rgba(255,255,255,0.35); display: flex; align-items: flex-start; justify-content: center; padding-top: 8px; }
.hero__scroll-arrow { font-size: 0.8rem; color: #fff; animation: scrollBounce 2s ease-in-out infinite; }
@keyframes scrollBounce { 0%,100%{ transform:translateY(0); opacity:0.4; } 50%{ transform:translateY(12px); opacity:1; } }
.hero__scroll-text { font-size: 0.65rem; letter-spacing: 0.25em; color: rgba(255,255,255,0.5); }

/* ==================== Marquee ==================== */
.marquee-section { background: #EDE8E2; padding: 18px 0; overflow: hidden; white-space: nowrap; }
.marquee-track { display: flex; animation: marquee 30s linear infinite; }
.marquee-content { display: flex; flex-shrink: 0; }
.marquee-item { color: rgba(58,53,50,0.65); font-size: 0.9rem; letter-spacing: 0.08em; padding: 0 20px; }
.marquee-divider { color: rgba(58,53,50,0.2); margin-left: 20px; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* ==================== Features ==================== */
.features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 48px; }
.feature-card { background: var(--color-white); padding: 40px 28px; border-radius: var(--radius-md); text-align: center; position: relative; overflow: hidden; border: 1px solid var(--color-border); transition: all 0.4s; }
.feature-card:hover { border-color: var(--color-dark); transform: translateY(-4px); box-shadow: var(--shadow-md); }
.tilt-shine { position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0; transition: opacity 0.3s; border-radius: var(--radius-md); }
.feature-card__icon { font-size: 2.6rem; display: block; margin-bottom: 16px; position: relative; z-index: 2; transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
.feature-card:hover .feature-card__icon { transform: scale(1.2) rotate(-8deg); }
.feature-card h3 { font-size: 1.08rem; font-weight: 600; margin-bottom: 8px; color: var(--color-text); position: relative; z-index: 2; }
.feature-card p { font-size: 0.88rem; color: var(--color-text-light); line-height: 1.7; position: relative; z-index: 2; }

/* ==================== Services ==================== */
.section--alt { background: #F5F1EC; }
.services-preview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.service-card { background: var(--color-white); border-radius: var(--radius-md); overflow: hidden; position: relative; cursor: pointer; border: 1px solid var(--color-border); transition: all 0.4s; }
.service-card:hover { border-color: var(--color-dark); transform: translateY(-4px); box-shadow: var(--shadow-md); }
.service-card__visual { height: 180px; display: flex; align-items: center; justify-content: center; background: var(--color-primary-bg); position: relative; }
.service-card__emoji { font-size: 3.8rem; position: relative; z-index: 2; transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
.service-card:hover .service-card__emoji { transform: scale(1.2) rotate(-5deg); }
.service-card__badge { position: absolute; top: 12px; right: 14px; background: var(--color-dark); color: #fff; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 3px; letter-spacing: 0.1em; z-index: 2; animation: breathe 2s ease-in-out infinite; }
.service-card__info { padding: 24px; position: relative; z-index: 2; }
.service-card__info h3 { font-size: 1.12rem; font-weight: 600; margin-bottom: 6px; }
.service-card__info p { font-size: 0.85rem; color: var(--color-text-light); line-height: 1.6; }
.service-card__duration { display: inline-block; margin-top: 12px; font-size: 0.8rem; color: var(--color-text-light); background: #F5F1EC; padding: 4px 12px; border-radius: 20px; }
.section__cta { text-align: center; margin-top: 52px; }

/* ==================== Stats ==================== */
.stats-section { background: #EDE8E2; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center; }
.stat-item__number { font-family: var(--font-title); font-size: 3.4rem; font-weight: 600; display: block; letter-spacing: 0.02em; line-height: 1; color: var(--color-dark); }
.stat-item__number small { font-size: 1.6rem; }
.stat-item__label { display: block; margin-top: 10px; font-size: 0.9rem; color: var(--color-text-muted); letter-spacing: 0.1em; }

/* ==================== Brand Story ==================== */
.brand-story { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
.brand-story__desc { font-size: 1rem; color: var(--color-text-light); line-height: 2; margin: 24px 0 36px; }
.brand-story__visual { display: flex; align-items: center; justify-content: center; }
.brand-story__card { background: var(--color-white); padding: 60px 48px; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--color-border); }
.brand-story__card-icon { font-size: 3.5rem; display: block; margin-bottom: 16px; }
.brand-story__card-title { display: block; font-family: var(--font-title); font-size: 1.5rem; color: var(--color-text); letter-spacing: 0.06em; margin-bottom: 8px; }
.brand-story__card-text { display: block; font-size: 0.9rem; color: var(--color-text-muted); letter-spacing: 0.1em; }

/* ==================== CTA ==================== */
.cta-section { background: #EDE8E2; text-align: center; }
.cta-section__content { padding: 90px 24px; }
.cta-section__title { font-family: var(--font-title); font-size: clamp(2rem, 4.5vw, 2.8rem); color: var(--color-text); font-weight: 400; letter-spacing: 0.05em; }
.cta-section__subtitle { color: var(--color-text-light); margin: 18px 0 40px; font-size: 1.05rem; }

/* ==================== Responsive ==================== */
@media (max-width: 968px) {
  .hero__side-stats { display: none; }
  .hero__body { max-width: 100%; padding: 0 5vw; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .services-preview { grid-template-columns: 1fr 1fr; }
  .stats-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
  .brand-story { grid-template-columns: 1fr; gap: 44px; }
}
@media (max-width: 600px) {
  .hero__title { font-size: 2rem; }
  .hero__desc { font-size: 0.9rem; }
  .features-grid { grid-template-columns: 1fr; max-width: 360px; margin: 0 auto; }
  .services-preview { grid-template-columns: 1fr; max-width: 380px; margin: 0 auto; }
  .stats-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
  .stat-item__number { font-size: 2.4rem; }
}
</style>
