<template>
  <div class="stores-page">
    <section class="page-hero">
      <div class="page-hero__bg" />
      <div class="page-hero__content">
        <h1 class="page-hero__title reveal">门店列表</h1>
        <p class="page-hero__subtitle reveal">共 {{ stores.length }} 家门店 · 全部位于北京</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- <h2 class="section__title reveal">门店列表</h2> -->
        <!-- <p class="section__subtitle reveal">共 {{ stores.length }} 家门店</p> -->
        <div class="store-list">
          <div v-for="(store, i) in stores" :key="i" class="store-item card-reveal">
            <div class="store-item__index">{{ padIndex(i + 1) }}</div>
            <div class="store-item__info">
              <h3>{{ store.name }}</h3>
              <p>📍 {{ store.address }}</p>
            </div>
            <div class="store-item__meta">
              <span>🕐 {{ store.hours }}</span>
              <!-- <span>📞 {{ store.phone }}</span> -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- <section class="section cta-section">
      <div class="container cta-section__content">
        <h2 class="cta-section__title reveal">更多城市陆续开放中</h2>
        <p class="cta-section__subtitle reveal">栖愈持续扩展中，敬请期待更多门店</p>
        <div class="reveal"><a href="tel:400-000-0000" class="btn btn--white">立即致电预约</a></div>
      </div>
    </section> -->
  </div>
</template>

<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useGsapAnimations } from '@/composables/useGsapAnimations'

useScrollReveal()
useGsapAnimations()

interface Store { name: string; address: string; hours: string; phone?: string }
const stores: Store[] = [
  { name: '北京中关村店', address: '北京市海淀区彩和坊西小街1号中湾国际二层底商', hours: '11:00 - 23:00' },
  { name: '北京望京店', address: '北京市朝阳区望京街道阜通西大街望京西园三区314号楼B座3单元102号', hours: '12:00 - 24:00' },
  { name: '北京合生汇店', address: '北京市朝阳区大郊亭中街2号院华腾国际甲3号楼一层10号底商', hours: '11:30 - 24:00' },
  { name: '北京三里屯店', address: '北京市朝阳区工体北路8号院三里屯SOHO-5号商场-5层5507室', hours: '12:00 - 24:00' },
  { name: '北京亚运村店', address: '北京市朝阳区育慧北路育慧里21区4号楼B1', hours: '12:00 - 24:00' },
  { name: '北京青年路国美店', address: '北京市朝阳区青年路西里2号院9号楼商业07室', hours: '12:00 - 24:00'  },
  { name: '北京朝阳大悦城店', address: '北京市朝阳区青年路西里5号院16号楼润枫水尚底商', hours: '11:00 - 24:00'  },
  { name: '北京双井店', address: '北京市朝阳区光华北一街富力城B区3号楼商业15号5-15号底商', hours: '12:00 - 24:00' },
  { name: '上海静安店', address: '上海市静安区武定路1125号2层c-01室', hours: '11:00 - 24:00'},

]
function padIndex(n: number): string { return n.toString().padStart(2, '0') }
</script>

<style scoped>
.page-hero { height: 40vh; min-height: 280px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.page-hero__bg { position: absolute; inset: 0; background: var(--color-bg); z-index: -2; }
.page-hero__content { text-align: center; z-index: 1; }
.page-hero__title { font-family: var(--font-title); font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 400; color: var(--color-text); letter-spacing: 0.06em; }
.page-hero__subtitle { margin-top: 10px; font-size: 0.85rem; color: var(--color-text-muted); letter-spacing: 0.2em; }

.store-list { border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
.store-item { display: grid; grid-template-columns: 56px 1fr 240px; align-items: center; padding: 18px 24px; border-bottom: 1px solid var(--color-border); background: var(--color-white); transition: background 0.25s; }
.store-item:last-child { border-bottom: none; }
.store-item:hover { background: var(--color-bg); }
.store-item__index { font-family: var(--font-title); font-size: 1.2rem; color: var(--color-text-muted); text-align: center; }
.store-item__info h3 { font-size: 1rem; font-weight: 600; color: var(--color-text); margin-bottom: 2px; }
.store-item__info p { font-size: 0.82rem; color: var(--color-text-light); line-height: 1.5; }
.store-item__meta { display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; color: var(--color-text-muted); }

.cta-section { background: #ede8e2; text-align: center; }
.cta-section__content { padding: 80px 24px; }
.cta-section__title { font-family: var(--font-title); font-size: clamp(1.6rem, 3.5vw, 2.2rem);  font-weight: 400; }
.cta-section__subtitle {  margin: 16px 0 36px; font-size: 1rem; }

@media (max-width: 768px) {
  .store-item { grid-template-columns: 36px 1fr; gap: 8px; padding: 16px; }
  .store-item__meta { grid-column: 2; }
}
</style>
