<script setup>
import { ref, onMounted } from 'vue'
import Icon from './Icon.vue'
import { setDocMeta } from '@/utils/store'

onMounted(() => {
  setDocMeta({ title: 'Expo 文档', description: '', toc: [] })
})

const copied = ref(false)
const command = 'npx create-expo-app@latest'

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(command)
  } catch {
    /* 忽略 */
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}

const cards = [
  {
    icon: 'book',
    title: '通用应用教程',
    desc: 'Android、iOS 与 Web 全平台，从零到一的完整教程。',
    to: '/tutorial/introduction',
    cta: '开始学习',
  },
  {
    icon: 'rocket',
    title: '一键发布到应用商店',
    desc: '无需配置、无需经验，从 GitHub 仓库直接发布应用（Launch）。',
    href: 'https://launch.expo.dev',
    cta: '打开 Launch',
  },
  {
    icon: 'terminal',
    title: 'EAS 工作流（CI/CD）教程',
    desc: '使用 Expo Application Services 工作流自动化构建、测试与部署。',
    to: '/tutorial/cicd/introduction',
    cta: '查看教程',
  },
  {
    icon: 'cloud',
    title: '从命令行部署',
    desc: '用 npx testflight 上传 TestFlight；用 npx eas-cli deploy 部署 Web。',
    to: '/deploy/web',
    cta: '查看部署指南',
  },
  {
    icon: 'box',
    title: 'EAS 教程',
    desc: '开发构建、应用商店提交、OTA 更新的完整 EAS 流程。',
    to: '/tutorial/eas/introduction',
    cta: '查看教程',
  },
  {
    icon: 'compass',
    title: 'Expo Router',
    desc: '基于文件的路由系统，为原生应用带来 Web 般的开发体验。',
    to: '/router/introduction',
    cta: '了解 Router',
  },
  {
    icon: 'play',
    title: '在浏览器中试用 Expo',
    desc: 'Snack：零本地环境，在浏览器中直接运行 Expo 项目。',
    href: 'https://snack.expo.dev',
    cta: '打开 Snack',
  },
  {
    icon: 'message-circle',
    title: '与社区交流',
    desc: '加入 Discord，与 70,000+ 开发者一起讨论 Expo。',
    href: 'https://chat.expo.dev',
    cta: '加入 Discord',
  },
  {
    icon: 'sparkles',
    title: '探索 API',
    desc: '相机、图片、通知等模块；查看全部 Expo SDK API。',
    to: '/versions/latest',
    cta: '查看全部 API',
  },
  {
    icon: 'puzzle',
    title: '探索示例',
    desc: 'StickerSmash、Router 菜单、API Routes + OpenAI 等官方示例。',
    href: 'https://expo.dev/examples',
    cta: '浏览示例',
  },
  {
    icon: 'film',
    title: '观看最新演讲',
    desc: 'Chain React 2026、App.js Conf 2026 等大会的最新分享。',
    href: 'https://www.youtube.com/@ExpoDevs',
    cta: '前往 YouTube',
  },
  {
    icon: 'bot',
    title: '使用 AI Agent 构建',
    desc: '用 Claude Code、Codex 等 AI 代理结合 Expo 插件开发应用。',
    to: '/agents',
    cta: '查看 Agent 指南',
  },
]

const community = [
  { icon: 'discord', label: 'Discord', desc: '实时聊天', href: 'https://chat.expo.dev' },
  { icon: 'message-circle', label: '论坛', desc: '问答与讨论', href: 'https://forums.expo.dev' },
  { icon: 'github', label: 'GitHub', desc: '源代码与 Issue', href: 'https://github.com/expo/expo' },
  { icon: 'youtube', label: 'YouTube', desc: '视频与演讲', href: 'https://www.youtube.com/@ExpoDevs' },
  { icon: 'linkedin', label: 'LinkedIn', desc: '官方动态', href: 'https://www.linkedin.com/company/expo-dev' },
  { icon: 'twitter', label: 'X', desc: '最新消息', href: 'https://x.com/expo' },
]
</script>

<template>
  <div class="doc-body home">
    <div class="home-banner">
      <Icon name="info" :size="16" />
      <span>
        本网站是 <a href="https://docs.expo.dev" target="_blank" rel="noopener noreferrer">docs.expo.dev</a>
        的非官方中文翻译版。内容基于官方文档逐页翻译，如有疑问请以英文原文为准。
      </span>
    </div>

    <section class="home-hero">
      <h1>构建能随处运行的出色应用</h1>
      <p class="hero-sub">
        只需维护一个 JavaScript / TypeScript 项目，即可在所有用户的设备上原生运行 —— Android、iOS、Web 全平台覆盖。
      </p>

      <div class="quickstart">
        <div class="quickstart-code">
          <span class="dollar">$</span>
          <code>{{ command }}</code>
          <button class="qs-copy" type="button" @click="copyCommand">
            <Icon :name="copied ? 'check' : 'copy'" :size="13" />
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>
        <span class="quickstart-hint">
          创建项目后，继续阅读
          <RouterLink to="/get-started/set-up-your-environment">设置开发环境</RouterLink>
          指南。
        </span>
      </div>
    </section>

    <h2 class="home-section-title">发现更多</h2>
    <p class="home-section-sub">快速了解 Expo 生态：教程、部署、路由、社区与 AI 工具。</p>

    <div class="home-cards">
      <template v-for="(card, i) in cards" :key="i">
        <RouterLink v-if="card.to" :to="card.to" class="hcard">
          <span class="hcard-icon"><Icon :name="card.icon" :size="18" /></span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
          <span class="hcard-arrow">{{ card.cta }} <Icon name="arrow-right" :size="13" /></span>
        </RouterLink>
        <a v-else :href="card.href" target="_blank" rel="noopener noreferrer" class="hcard">
          <span class="hcard-icon"><Icon :name="card.icon" :size="18" /></span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
          <span class="hcard-arrow">{{ card.cta }} <Icon name="arrow-right" :size="13" /></span>
        </a>
      </template>
    </div>

    <h2 class="home-section-title">加入社区</h2>
    <p class="home-section-sub">在 Expo 社区获取帮助、分享作品，或参与 Expo 开源项目。</p>

    <div class="community-grid">
      <a v-for="c in community" :key="c.label" class="comm-item" :href="c.href" target="_blank" rel="noopener noreferrer">
        <Icon :name="c.icon" :size="18" />
        <span>{{ c.label }}</span>
        <span style="margin-left:auto;font-weight:400;font-size:12px;color:var(--text-3)">{{ c.desc }}</span>
      </a>
    </div>
  </div>
</template>
