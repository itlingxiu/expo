<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Icon from './Icon.vue'
import { uiState, toggleTheme, isDark } from '@/utils/store'

const moreOpen = ref(false)
const dark = ref(false)

function openSearch() {
  uiState.searchOpen = true
}
function toggleMore() {
  moreOpen.value = !moreOpen.value
}

function onKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    openSearch()
  }
  if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
    e.preventDefault()
    openSearch()
  }
}

function onClickOutside(e) {
  if (!e.target.closest('.nav-drop')) moreOpen.value = false
}

onMounted(() => {
  dark.value = isDark()
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onClickOutside)
})

function onToggleTheme() {
  toggleTheme()
  dark.value = isDark()
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <button class="icon-btn header-burger" aria-label="打开导航菜单" @click="uiState.drawerOpen = true">
        <Icon name="menu" />
      </button>

      <RouterLink to="/" class="header-brand" @click="uiState.drawerOpen = false">
        <span class="brand-mark">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#000">
            <rect x="4" y="4" width="16" height="4" rx="2" />
            <rect x="4" y="10" width="13" height="4" rx="2" />
            <rect x="4" y="16" width="16" height="4" rx="2" />
          </svg>
        </span>
        <span>Expo</span>
        <span class="brand-divider" />
        <span class="brand-sub">文档</span>
      </RouterLink>

      <button class="header-search-btn" type="button" @click="openSearch">
        <Icon name="search" :size="15" />
        <span>搜索文档…</span>
        <span class="kbd">Ctrl K</span>
      </button>

      <nav class="header-nav">
        <a href="https://expo.dev/learn" target="_blank" rel="noopener noreferrer">学习</a>
        <RouterLink to="/guides/overview">指南</RouterLink>
        <RouterLink to="/versions/latest">API 参考</RouterLink>
        <div class="nav-drop">
          <button type="button" @click="toggleMore">
            更多
            <Icon name="chevron-down" :size="14" />
          </button>
          <div v-if="moreOpen" class="nav-drop-menu">
            <a href="https://expo.dev/changelog" target="_blank" rel="noopener noreferrer">变更日志</a>
            <a href="https://expo.dev/blog" target="_blank" rel="noopener noreferrer">博客</a>
            <a href="https://expo.dev/tools" target="_blank" rel="noopener noreferrer">工具</a>
            <a href="https://forums.expo.dev" target="_blank" rel="noopener noreferrer">论坛</a>
            <a href="https://chat.expo.dev" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>
        <button class="icon-btn" type="button" :aria-label="dark ? '切换到亮色模式' : '切换到深色模式'" @click="onToggleTheme">
          <Icon :name="dark ? 'sun' : 'moon'" :size="17" />
        </button>
        <a class="icon-btn" href="https://github.com/expo/expo" target="_blank" rel="noopener noreferrer" aria-label="GitHub 仓库">
          <Icon name="github" :size="18" />
        </a>
      </nav>
    </div>
  </header>
</template>
