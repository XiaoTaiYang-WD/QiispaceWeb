<template>
  <div class="services-page">
    <section class="page-hero">
      <div class="page-hero__bg" />
      <div class="page-hero__content">
        <h1 class="page-hero__title reveal">全部服务项目</h1>
        <p class="page-hero__subtitle reveal">ALL SERVICES</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- <h2 class="section__title reveal">全部服务项目</h2>
        <p class="section__subtitle reveal">ALL SERVICES</p> -->
        <div class="service-tabs reveal">
          <button v-for="cat in categories" :key="cat" :class="['service-tabs__btn', { 'service-tabs__btn--active': activeCat === cat }]" @click="activeCat = cat">{{ cat }}</button>
        </div>
        <div class="services-list">
          <div v-for="(svc, i) in filteredServices" :key="i" class="service-detail card-reveal">
            <div class="service-detail__visual"><span class="service-detail__emoji">{{ svc.emoji }}</span></div>
            <div class="service-detail__body">
              <div class="service-detail__header"><h3>{{ svc.title }}</h3><span class="service-detail__price">{{ svc.price }}</span></div>
              <p class="service-detail__desc">{{ svc.desc }}</p>
              <ul class="service-detail__tags"><li v-for="tag in svc.tags" :key="tag">{{ tag }}</li></ul>
              <div class="service-detail__footer"><span>⏱ {{ svc.duration }}</span><span>✨ {{ svc.suitable }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <h2 class="section__title reveal">服务流程</h2>
        <p class="section__subtitle reveal">SERVICE PROCESS</p>
        <div class="process-steps">
          <div v-for="(step, i) in process" :key="i" class="process-step card-reveal">
            <div class="process-step__num">{{ i + 1 }}</div>
            <div class="process-step__icon">{{ step.icon }}</div>
            <h4>{{ step.title }}</h4>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section cta-section">
      <div class="container cta-section__content">
        <h2 class="cta-section__title reveal">准备好开始您的疗愈之旅了吗？</h2>
        <p class="cta-section__subtitle reveal">选择栖愈，给身心一个深呼吸的机会</p>
        <div class="reveal"><router-link to="/stores" class="btn btn--white">预约体验</router-link></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
useScrollReveal()

interface Service { title: string; emoji: string; price: string; desc: string; tags: string[]; duration: string; suitable: string; category: string }
const categories = ['全部', '身体按摩', '面部护理', '芳香疗法', '特色疗程']
const activeCat = ref('全部')
const services: Service[] = [
  { title: '深层组织按摩', emoji: '💆', price: '¥398', desc: '针对深层肌肉组织进行专业按摩，有效缓解慢性肌肉紧张与酸痛。', tags: ['身体按摩', '深层放松'], duration: '60/90分钟', suitable: '久坐办公、运动恢复', category: '身体按摩' },
  { title: '瑞典式放松按摩', emoji: '🤲', price: '¥358', desc: '经典瑞典按摩手法，配合温和揉捏推压，促进血液循环，缓解日常压力。', tags: ['身体按摩', '放松减压'], duration: '60/90分钟', suitable: '压力大、睡眠差', category: '身体按摩' },
  { title: '热石能量按摩', emoji: '🪨', price: '¥528', desc: '选用天然火山玄武岩热石，温热能量渗透深层组织，疏通经络驱寒暖身。', tags: ['身体按摩', '热石理疗'], duration: '90分钟', suitable: '体寒怕冷、经络不通', category: '身体按摩' },
  { title: '芳香精油SPA', emoji: '🪷', price: '¥468', desc: '精选法国进口天然植物精油，调配专属配方，全身心的深度疗愈体验。', tags: ['芳香疗法', '精油SPA'], duration: '90/120分钟', suitable: '身心俱疲、追求深度放松', category: '芳香疗法' },
  { title: '薰衣草安睡疗程', emoji: '💜', price: '¥498', desc: '以薰衣草精油为主调，配合舒缓按摩手法，帮助改善睡眠质量。', tags: ['芳香疗法', '助眠疗程'], duration: '90分钟', suitable: '失眠多梦、焦虑紧张', category: '芳香疗法' },
  { title: '面部焕颜护理', emoji: '🌸', price: '¥388', desc: '深层清洁毛孔、温和去除角质，配合精华导入与提拉手法，重现光泽。', tags: ['面部护理', '深层清洁'], duration: '60/90分钟', suitable: '所有肤质、暗沉肌', category: '面部护理' },
  { title: '玉石面部刮痧', emoji: '💎', price: '¥428', desc: '天然玉石刮痧板沿面部经络轻柔刮拭，淡化细纹，提亮肤色。', tags: ['面部护理', '抗衰护理'], duration: '60分钟', suitable: '面部浮肿、肤色暗沉', category: '面部护理' },
  { title: '东方经络疏通', emoji: '🎋', price: '¥558', desc: '融合中医经络理论与现代按摩手法，配合草本热敷，调和气血。', tags: ['特色疗程', '中医经络'], duration: '90分钟', suitable: '经络不通、亚健康', category: '特色疗程' },
]
const filteredServices = computed(() => activeCat.value === '全部' ? services : services.filter(s => s.category === activeCat.value))
const process = [
  { icon: '📝', title: '需求咨询', desc: '填写健康问卷，专业顾问一对一了解您的身体状况与需求' },
  { icon: '🎯', title: '方案定制', desc: '根据评估结果，为您量身定制最合适的疗愈方案' },
  { icon: '💆', title: '疗愈体验', desc: '在静谧的疗愈空间中，享受专业理疗师的服务' },
  { icon: '🍵', title: '调理休憩', desc: '疗程结束后享用养生茶饮，让身心慢慢回归' },
]
</script>

<style scoped>
.page-hero { height: 40vh; min-height: 280px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.page-hero__bg { position: absolute; inset: 0; background: var(--color-bg); z-index: -2; }
.page-hero__content { text-align: center; z-index: 1; }
.page-hero__title { font-family: var(--font-title); font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 400; color: var(--color-text); letter-spacing: 0.06em; }
.page-hero__subtitle { margin-top: 10px; font-size: 0.85rem; color: var(--color-text-muted); letter-spacing: 0.2em; }
.service-tabs { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
.service-tabs__btn { padding: 10px 24px; border-radius: 24px; font-size: 0.9rem; background: var(--color-white); color: var(--color-text-light); border: 1px solid var(--color-border); transition: all 0.3s; cursor: pointer; }
.service-tabs__btn--active, .service-tabs__btn:hover { background: var(--color-dark); color: #fff; border-color: var(--color-dark); }
.services-list { display: flex; flex-direction: column; gap: 20px; }
.service-detail { display: grid; grid-template-columns: 180px 1fr; background: var(--color-white); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border); transition: all 0.4s; }
.service-detail:hover { border-color: var(--color-dark); transform: translateX(4px); box-shadow: var(--shadow-sm); }
.service-detail__visual { background: var(--color-primary-bg); display: flex; align-items: center; justify-content: center; min-height: 160px; }
.service-detail__emoji { font-size: 3rem; transition: transform 0.4s ease; }
.service-detail:hover .service-detail__emoji { transform: scale(1.15); }
.service-detail__body { padding: 24px 28px; }
.service-detail__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.service-detail__header h3 { font-size: 1.15rem; font-weight: 600; color: var(--color-text); }
.service-detail__price { font-family: var(--font-title); font-size: 1.2rem; color: var(--color-dark); font-weight: 600; white-space: nowrap; }
.service-detail__desc { font-size: 0.9rem; color: var(--color-text-light); line-height: 1.7; margin-bottom: 12px; }
.service-detail__tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.service-detail__tags li { font-size: 0.78rem; background: var(--color-primary-bg); color: var(--color-primary-dark); padding: 4px 12px; border-radius: 20px; }
.service-detail__footer { display: flex; gap: 24px; font-size: 0.82rem; color: var(--color-text-muted); }
.section--alt { background: #F5F1EC; }
.process-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.process-step { text-align: center; background: var(--color-white); padding: 36px 20px; border-radius: var(--radius-md); border: 1px solid var(--color-border); position: relative; transition: all 0.4s; }
.process-step:hover { border-color: var(--color-dark); transform: translateY(-6px); box-shadow: var(--shadow-md); }
.process-step__num { position: absolute; top: 12px; right: 16px; font-family: var(--font-title); font-size: 2.5rem; color: var(--color-primary); opacity: 0.2; }
.process-step__icon { font-size: 2.2rem; margin-bottom: 12px; }
.process-step h4 { font-size: 1rem; margin-bottom: 6px; color: var(--color-text); }
.process-step p { font-size: 0.82rem; color: var(--color-text-light); line-height: 1.6; }
.cta-section { background: #ede8e2; text-align: center; }
.cta-section__content { padding: 80px 24px; }
.cta-section__title { font-family: var(--font-title); font-size: clamp(1.6rem, 3.5vw, 2.2rem);  font-weight: 400; }
.cta-section__subtitle { margin: 16px 0 36px; font-size: 1rem; }
@media (max-width: 768px) {
  .service-detail { grid-template-columns: 1fr; }
  .service-detail__visual { min-height: 100px; }
  .process-steps { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) { .process-steps { grid-template-columns: 1fr; } }
</style>
