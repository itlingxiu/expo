<script setup>
import { ref, computed } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  slug: { type: String, default: '' },
})

const voted = ref(null) // 'yes' | 'no' | null

const originalUrl = computed(() => {
  const s = props.slug || ''
  return s ? `https://docs.expo.dev/${s}` : 'https://docs.expo.dev'
})

function vote(v) {
  voted.value = v
}
</script>

<template>
  <div class="helpful">
    <template v-if="!voted">
      <span>这个页面有帮助吗？</span>
      <div class="helpful-btns">
        <button type="button" aria-label="有帮助" @click="vote('yes')">
          <Icon name="thumbs-up" :size="15" /> 有帮助
        </button>
        <button type="button" aria-label="没有帮助" @click="vote('no')">
          <Icon name="thumbs-down" :size="15" /> 没有
        </button>
      </div>
    </template>
    <span v-else class="thanks">感谢你的反馈！</span>
    <a class="orig-link" :href="originalUrl" target="_blank" rel="noopener noreferrer">
      查看英文原文 <Icon name="external-link" :size="12" />
    </a>
  </div>
</template>
