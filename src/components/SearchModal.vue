<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import searchIndex from '@/content/search-index.json'
import { uiState } from '@/utils/store'
import Icon from './Icon.vue'

const router = useRouter()

const query = ref('')
const hoverIdx = ref(0)
const inputRef = ref(null)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  const list = []
  for (const item of searchIndex) {
    const hay = (item.title + ' ' + item.slug + ' ' + item.section + ' ' + item.text).toLowerCase()
    if (hay.includes(q)) {
      list.push(item)
      if (list.length >= 30) break
    }
  }
  return list
})

function open() {
  uiState.searchOpen = true
  hoverIdx.value = 0
}

watch(
  () => uiState.searchOpen,
  async (open) => {
    if (open) {
      await nextTick()
      inputRef.value?.focus()
    } else {
      query.value = ''
    }
  }
)

function close() {
  uiState.searchOpen = false
}

function go(item) {
  close()
  router.push('/' + item.slug)
}

function onKeydown(e) {
  if (e.key === 'Escape') return close()
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    hoverIdx.value = Math.min(hoverIdx.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    hoverIdx.value = Math.max(hoverIdx.value - 1, 0)
  } else if (e.key === 'Enter') {
    const item = results.value[hoverIdx.value]
    if (item) go(item)
  }
}

function onGlobalKey(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    uiState.searchOpen ? close() : open()
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="uiState.searchOpen" class="search-overlay" @click.self="close">
        <div class="search-panel" @keydown="onKeydown">
          <div class="search-input-row">
            <Icon name="search" :size="17" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="搜索文档（标题、路径、内容）…"
              aria-label="搜索文档"
            />
            <span class="kbd">Esc</span>
          </div>
          <div class="search-results">
            <div v-if="!query" class="search-empty">输入关键词开始搜索，支持中文与英文</div>
            <div v-else-if="!results.length" class="search-empty">没有找到与「{{ query }}」相关的结果</div>
            <div
              v-for="(item, i) in results"
              :key="item.slug"
              class="search-result"
              :class="{ hover: i === hoverIdx }"
              @mouseenter="hoverIdx = i"
              @click="go(item)"
            >
              <div>
                <div class="sr-title" v-html="item.title" />
                <div class="sr-path">{{ item.slug }}</div>
              </div>
              <span class="sr-section">{{ item.section }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
