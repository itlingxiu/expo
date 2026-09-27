<script setup>
import { uiState } from '@/utils/store'

function jump(id) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 76
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
</script>

<template>
  <aside v-if="uiState.toc.length" class="toc-col" aria-label="本页目录">
    <div class="toc-title">本页内容</div>
    <a
      v-for="item in uiState.toc"
      :key="item.id"
      href="#"
      class="toc-link"
      :class="['lv' + item.level, { active: uiState.activeId === item.id }]"
      @click.prevent="jump(item.id)"
    >
      {{ item.text }}
    </a>
  </aside>
</template>
