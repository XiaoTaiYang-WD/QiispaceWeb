<template>
  <div id="app-root">
    <HeaderBar />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <FooterBar />
    <ParticleBackground />
    <CursorGlow />
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue'
import FooterBar from '@/components/FooterBar.vue'
import ParticleBackground from '@/components/ParticleBackground.vue'
import CursorGlow from '@/components/CursorGlow.vue'
</script>

<style>
.page-enter-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.page-leave-active {
  transition: all 0.3s ease-in;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
