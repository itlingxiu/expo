import { reactive, watch } from 'vue'

/** 全局 UI 状态（轻量共享，避免引入 Pinia） */
export const uiState = reactive({
  /** 移动端侧边栏抽屉 */
  drawerOpen: false,
  /** 搜索弹窗 */
  searchOpen: false,
  /** 当前页面目录（h2/h3），由 MarkdownPage 填充 */
  toc: [],
  /** 当前目录激活项 id（滚动监听） */
  activeId: '',
  /** 当前页面标题 / 描述 */
  pageTitle: '',
  pageDescription: '',
})

/* ---------- 主题 ---------- */

function applyTheme(t) {
  document.documentElement.classList.toggle('dark', t === 'dark')
}

export function initTheme() {
  // index.html 内联脚本已处理首次渲染；这里监听系统偏好变化
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', (e) => {
    if (!localStorage.getItem('expo-theme')) applyTheme(e.matches ? 'dark' : 'light')
  })
}

export function toggleTheme() {
  const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
  localStorage.setItem('expo-theme', next)
  applyTheme(next)
}

export function isDark() {
  return document.documentElement.classList.contains('dark')
}

/* ---------- 文档状态 ---------- */

export function setDocMeta({ title, description, toc = [] }) {
  uiState.pageTitle = title
  uiState.pageDescription = description
  uiState.toc = toc
  uiState.activeId = ''
  document.title = title ? `${title} · Expo 文档（中文）` : 'Expo 文档 — 中文翻译'
}

watch(
  () => uiState.drawerOpen,
  (open) => {
    document.documentElement.classList.toggle('drawer-open', open)
  }
)
