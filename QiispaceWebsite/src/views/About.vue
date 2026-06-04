<template>
  <div class="about-page">
    <section class="page-hero">
      <div class="page-hero__bg" />
      <div class="page-hero__content">
        <h1 class="page-hero__title reveal">关于我们</h1>
        <p class="page-hero__subtitle reveal">ABOUT QIISPACE</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="story-grid">
          <div class="story-text reveal">
            <h2 class="section__title" style="text-align:left;">栖愈的故事</h2>
            <p class="section__subtitle" style="text-align:left;">OUR STORY</p>
            <p>栖愈 QIISPACE 创立于2015年，源于创始团队对现代都市人身心健康的深切关怀。</p>
            <p>在快节奏的城市生活中，越来越多的人感到身心俱疲。我们相信，真正的健康不应只停留在"不生病"，而应是身、心、灵的和谐统一。</p>
            <p>栖愈之名，「栖」代表着栖息与安放，「愈」代表着疗愈与新生。我们希望为每一位到访的客人，提供一个可以暂时放下外界纷扰、回归内心的栖息之地。</p>
          </div>
          <div class="story-image img-reveal reveal">
            <div class="story-image__placeholder"><span>🌿</span><p>栖愈 · 身心栖息之所</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <h2 class="section__title reveal">品牌理念</h2>
        <p class="section__subtitle reveal">BRAND PHILOSOPHY</p>
        <div class="values-grid">
          <div v-for="(v, i) in values" :key="i" class="value-card card-reveal">
            <span class="value-card__icon">{{ v.icon }}</span><h3>{{ v.title }}</h3><p>{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="philosophy">
          <div class="philosophy__visual reveal"><div class="philosophy__symbol">栖</div></div>
          <div class="philosophy__text reveal">
            <h2 class="section__title" style="text-align:left;">疗愈哲学</h2>
            <p class="section__subtitle" style="text-align:left;">HEALING PHILOSOPHY</p>
            <blockquote class="philosophy__quote">"最好的疗愈，是让身体回归它本来的状态"</blockquote>
            <p>我们相信人体拥有自愈的智慧。栖愈的角色不是"治疗者"，而是"引导者"——通过天然植物精油的能量、专业手法师温暖而精准的双手，以及精心设计的疗愈空间，引导您的身体重新找回那份与生俱来的平衡与活力。</p>
            <p>每一滴精油的甄选，每一个手法的打磨，每一处空间的布置，都经过反复的推敲与坚持。因为我们深知，真正的疗愈，发生在每一个被认真对待的细节里。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="(stat, i) in stats" :key="i" class="stat-item reveal">
            <span class="stat-item__number">{{ stat.value }}<small>{{ stat.unit }}</small></span>
            <span class="stat-item__label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal'
useScrollReveal()
const values = [
  { icon: '🌱', title: '天然纯净', desc: '全线产品坚持天然有机成分，拒绝添加任何有害化学物质。' },
  { icon: '🤝', title: '专业匠心', desc: '每一位理疗师都经过严苛的专业培训与考核。' },
  { icon: '🧘', title: '身心合一', desc: '不只关注身体放松，更注重心灵的安宁与平衡。' },
  { icon: '🌍', title: '可持续美', desc: '从包装到运营，坚持环保理念，不伤害我们赖以生存的地球。' },
]
const stats = [
  { value: 2015, unit: '年', label: '品牌创立' },
  { value: 9, unit: '+', label: '全国门店' },
  { value: 100000, unit: '+', label: '累计服务' },
  { value: 99, unit: '%', label: '好评推荐' },
]
</script>

<style scoped>
.page-hero { height: 40vh; min-height: 280px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.page-hero__bg { position: absolute; inset: 0; background: var(--color-bg); z-index: -2; }
.page-hero__content { text-align: center; z-index: 1; }
.page-hero__title { font-family: var(--font-title); font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 400; color: var(--color-text); letter-spacing: 0.06em; }
.page-hero__subtitle { margin-top: 10px; font-size: 0.85rem; color: var(--color-text-muted); letter-spacing: 0.2em; }

.story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.story-text p { font-size: 0.95rem; color: var(--color-text-light); line-height: 1.9; margin-bottom: 16px; }
.story-image__placeholder { width: 100%; aspect-ratio: 4/3; background: var(--color-primary-bg); border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 4rem; }
.story-image__placeholder p { margin-top: 16px; font-size: 0.85rem; color: var(--color-text-muted); }

.section--alt { background: #F5F1EC; }
.values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.value-card { background: var(--color-white); padding: 36px 24px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--color-border); transition: all 0.4s; }
.value-card:hover { border-color: var(--color-dark); transform: translateY(-6px); box-shadow: var(--shadow-md); }
.value-card__icon { font-size: 2.4rem; display: block; margin-bottom: 14px; }
.value-card h3 { font-size: 1.05rem; color: var(--color-text); margin-bottom: 8px; }
.value-card p { font-size: 0.85rem; color: var(--color-text-light); line-height: 1.7; }

.philosophy { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.philosophy__visual { display: flex; align-items: center; justify-content: center; }
.philosophy__symbol { font-family: var(--font-title); font-size: 10rem; color: var(--color-primary); opacity: 0.2; }
.philosophy__quote { font-family: var(--font-title); font-size: 1.4rem; color: var(--color-primary-dark); border-left: 3px solid var(--color-primary-dark); padding-left: 20px; margin: 20px 0; font-style: italic; }
.philosophy__text p { font-size: 0.95rem; color: var(--color-text-light); line-height: 1.9; margin-bottom: 12px; }

.stats-section { background: #EDE8E2; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center; }
.stat-item__number { font-family: var(--font-title); font-size: 3.2rem; font-weight: 600; display: block; line-height: 1; color: var(--color-dark); }
.stat-item__number small { font-size: 1.5rem; }
.stat-item__label { display: block; margin-top: 10px; font-size: 0.9rem; color: var(--color-text-muted); letter-spacing: 0.08em; }

@media (max-width: 768px) {
  .story-grid, .philosophy, .values-grid { grid-template-columns: 1fr; gap: 40px; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
}
</style>
