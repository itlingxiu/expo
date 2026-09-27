import { nav } from '@/content/nav'

/**
 * 将导航树拍平成有序页面列表（含所属分组标题），
 * 用于“上一篇 / 下一篇”和搜索结果的归属展示。
 */
export function flattenNav() {
  const out = []
  const walk = (node, sectionTitle) => {
    if (node.section) {
      for (const child of node.items || []) walk(child, node.section)
      return
    }
    if (node.slug) {
      out.push({ slug: node.slug, title: node.title, section: sectionTitle })
    }
    for (const child of node.items || []) walk(child, sectionTitle)
  }
  for (const top of nav) walk(top, top.section)
  return out
}

let cached = null
export function getFlatNav() {
  if (!cached) cached = flattenNav()
  return cached
}

/** 根据当前路径找到上一篇 / 下一篇 */
export function getPrevNext(currentSlug) {
  const flat = getFlatNav()
  const idx = flat.findIndex((p) => p.slug === currentSlug)
  if (idx === -1) return { prev: null, next: null }
  return { prev: flat[idx - 1] || null, next: flat[idx + 1] || null }
}

/** 在导航树中查找条目的标题（回退页显示用） */
export function findNavTitle(slug) {
  const flat = getFlatNav()
  const found = flat.find((p) => p.slug === slug)
  return found ? found.title : null
}
