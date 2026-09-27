<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { nav } from '@/content/nav'
import { uiState } from '@/utils/store'
import Icon from './Icon.vue'

const route = useRoute()

/** 可折叠分组的折叠状态（默认全部展开） */
const collapsed = ref(new Set())

function toggle(key) {
  const next = new Set(collapsed.value)
  next.has(key) ? next.delete(key) : next.add(key)
  collapsed.value = next
}

/** 当前激活 slug */
const activeSlug = () => (route.path === '/' ? '' : route.path.replace(/^\/+|\/+$/g, ''))

function isActive(slug) {
  return activeSlug() === slug || activeSlug().startsWith(slug + '/')
}

/** 关闭移动端抽屉并滚动到顶部 */
function onNavigate() {
  uiState.drawerOpen = false
}

// 激活项滚动到可视区域
watch(
  () => route.path,
  async () => {
    await nextTick()
    const el = document.querySelector('.side-link.router-link-active')
    el?.scrollIntoView({ block: 'nearest' })
  }
)
</script>

<template>
  <nav class="sidebar" aria-label="文档导航">
    <template v-for="(top, ti) in nav" :key="ti">
      <!-- 分组标题 -->
      <template v-if="top.items && !top.slug">
        <div class="side-section">
          <div class="side-section-label">{{ top.section }}</div>
          <template v-for="(item, ii) in top.items" :key="ii">
            <!-- 有子项的折叠组 -->
            <template v-if="item.items">
              <button
                type="button"
                class="side-group-title"
                :class="{ collapsed: collapsed.has(ti + '-' + ii) }"
                @click="toggle(ti + '-' + ii)"
              >
                <Icon name="chevron-down" :size="13" class="chev" />
                <span>{{ item.title }}</span>
              </button>
              <div class="side-items indented" :class="{ collapsed: collapsed.has(ti + '-' + ii) }">
                <RouterLink
                  v-for="(child, ci) in item.items"
                  :key="ci"
                  :to="'/' + child.slug"
                  class="side-link"
                  @click="onNavigate"
                >
                  {{ child.title }}
                </RouterLink>
              </div>
            </template>
            <!-- 普通链接 -->
            <RouterLink v-else :to="'/' + item.slug" class="side-link" @click="onNavigate">
              {{ item.title }}
            </RouterLink>
          </template>
        </div>
      </template>
    </template>
  </nav>
</template>
