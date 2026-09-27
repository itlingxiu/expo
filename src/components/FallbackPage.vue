<script setup>
import { computed } from 'vue'
import { findNavTitle } from '@/utils/nav'
import Icon from './Icon.vue'

const props = defineProps({
  slug: { type: String, default: '' },
})

const title = computed(() => findNavTitle(props.slug) || props.slug)
const originalUrl = computed(
  () => `https://docs.expo.dev/${props.slug || ''}`
)
</script>

<template>
  <div class="fallback-page">
    <div class="big">🚧</div>
    <h1>{{ title }}</h1>
    <p>
      此页面尚未完成中文翻译。<br />
      我们正在陆续翻译整个 Expo 文档站点，敬请期待。
    </p>
    <div class="fallback-actions">
      <a class="btn btn-primary" :href="originalUrl" target="_blank" rel="noopener noreferrer">
        查看英文原文 <Icon name="external-link" :size="14" />
      </a>
      <RouterLink to="/" class="btn">返回首页</RouterLink>
    </div>
  </div>
</template>
