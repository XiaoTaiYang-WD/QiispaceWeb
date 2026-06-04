<template>
  <header :class="['header', { 'header--scrolled': isScrolled, 'header--light': isHome }]">
    <div class="header__inner">
      <router-link to="/" class="header__logo">
        栖愈 QIISPACE
      </router-link>

      <nav :class="['header__nav', { 'header__nav--open': menuOpen }]">
        <router-link to="/" @click="menuOpen = false">首页</router-link>
        <router-link to="/services" @click="menuOpen = false">服务介绍</router-link>
        <router-link to="/about" @click="menuOpen = false">关于我们</router-link>
        <router-link to="/stores" @click="menuOpen = false">门店列表</router-link>
      </nav>

      <button
        class="header__menu-btn"
        @click="menuOpen = !menuOpen"
        aria-label="菜单"
      >
        <span :style="menuOpen ? { transform: 'rotate(45deg) translateY(5px)' } : {}" />
        <span :style="menuOpen ? { opacity: '0' } : {}" />
        <span :style="menuOpen ? { transform: 'rotate(-45deg) translateY(-5px)' } : {}" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)
const menuOpen = ref(false)
const isHome = computed(() => route.name === 'Home')

function onScroll() {
  isScrolled.value = window.scrollY > 60
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
