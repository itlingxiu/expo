<script setup>
import { computed } from 'vue'
import { getPrevNext } from '@/utils/nav'
import Icon from './Icon.vue'

const props = defineProps({
  slug: { type: String, default: '' },
})

const links = computed(() => getPrevNext(props.slug))
</script>

<template>
  <nav v-if="links.prev || links.next" class="prev-next">
    <RouterLink v-if="links.prev" :to="'/' + links.prev.slug" class="pn-card">
      <span class="pn-label"><Icon name="arrow-left" :size="13" /> 上一篇</span>
      <span class="pn-title">{{ links.prev.title }}</span>
    </RouterLink>
    <RouterLink v-if="links.next" :to="'/' + links.next.slug" class="pn-card next">
      <span class="pn-label">下一篇 <Icon name="arrow-right" :size="13" /></span>
      <span class="pn-title">{{ links.next.title }}</span>
    </RouterLink>
  </nav>
</template>
