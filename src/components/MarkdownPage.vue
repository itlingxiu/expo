<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { renderMarkdown, parseFrontmatter, extractToc, hydrateContent } from '@/utils/md'
import { setDocMeta, uiState } from '@/utils/store'
import { findNavTitle } from '@/utils/nav'
import PrevNext from './PrevNext.vue'
import HelpfulWidget from './HelpfulWidget.vue'
import FallbackPage from './FallbackPage.vue'

const route = useRoute()

/** 懒加载所有内容文件：/src/content/pages/xxx.md → 原文字符串 */
const pageModules = import.meta.glob('/src/content/pages/**/*.md', {
  query: '?raw',
  import: 'default',
})

const html = ref('')
const front = ref(null) // frontmatter 属性
const missing = ref(false)
const currentSlug = ref('')
const contentRef = ref(null)

let observer = null

/** 根据路径查找内容文件（支持目录 index） */
function resolveFile(slug) {
  const base = '/src/content/pages/'
  if (pageModules[`${base}${slug}.md`]) return `${base}${slug}.md`
  if (pageModules[`${base}${slug}/index.md`]) return `${base}${slug}/index.md`
  return null
}

async function load(slug) {
  currentSlug.value = slug
  const file = resolveFile(slug)
  if (!file) {
    missing.value = true
    html.value = ''
    front.value = null
    setDocMeta({
      title: (findNavTitle(slug) || slug.split('/').pop()) + ' · 尚未翻译',
      description: '',
      toc: [],
    })
    return
  }
  missing.value = false
  const loaded = await pageModules[file]()
  const raw = typeof loaded === 'string' ? loaded : loaded.default
  const { attrs, body } = parseFrontmatter(raw)
  front.value = attrs
  html.value = renderMarkdown(body)
  setDocMeta({
    title: attrs.title || '',
    description: attrs.description || '',
    toc: [],
  })
}

/** 内容渲染完成后：交互水合 + 提取目录 + 处理锚点 */
function afterRender() {
  const el = contentRef.value
  if (!el) return
  hydrateContent(el)
  setDocMeta({
    title: front.value?.title || uiState.pageTitle,
    description: front.value?.description || '',
    toc: extractToc(el),
  })
  setupScrollSpy(el)
  // 锚点跳转
  if (route.hash) {
    const target = document.getElementById(route.hash.slice(1))
    if (target) {
      setTimeout(() => {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 76 })
      }, 60)
    }
  }
}

function setupScrollSpy(el) {
  observer?.disconnect()
  const headings = [...el.querySelectorAll('h2, h3')]
  if (!headings.length || !('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) uiState.activeId = entry.target.id
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
  )
  headings.forEach((h) => observer.observe(h))
}

watch(
  () => route.path,
  (p) => load(p === '/' ? '' : p.replace(/^\/+|\/+$/g, '')),
  { immediate: true }
)

// v-html 更新后：水合交互、提取目录、处理锚点
watch(html, async () => {
  await nextTick()
  afterRender()
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="doc-body">
    <FallbackPage v-if="missing" :slug="currentSlug" />
    <template v-else>
      <p v-if="front && front.description" class="doc-description">{{ front.description }}</p>
      <!-- 内容由 v-html 渲染；标题/交互在 afterRender 中处理 -->
      <div ref="contentRef" class="md-content" v-html="html" />
      <PrevNext :slug="currentSlug" />
      <HelpfulWidget :slug="currentSlug" />
    </template>
  </div>
</template>
