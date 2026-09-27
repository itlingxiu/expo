<script setup>
import { onMounted } from 'vue'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import TocNav from './components/TocNav.vue'
import Footer from './components/Footer.vue'
import SearchModal from './components/SearchModal.vue'
import { initTheme, uiState } from './utils/store'

onMounted(initTheme)
</script>

<template>
  <Header />
  <SearchModal />

  <div class="layout">
    <!-- 移动端抽屉遮罩 -->
    <div class="drawer-mask" @click="uiState.drawerOpen = false" />

    <Sidebar />

    <main class="main-col">
      <RouterView />
    </main>

    <TocNav />
  </div>

  <Footer />
</template>
