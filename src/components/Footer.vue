<script setup>
import Icon from './Icon.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="brand-row">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <rect x="4" y="4" width="16" height="4" rx="2" />
            <rect x="4" y="10" width="13" height="4" rx="2" />
            <rect x="4" y="16" width="16" height="4" rx="2" />
          </svg>
          <span>Expo 文档（中文）</span>
        </div>
        <p>
          本网站是 <a href="https://docs.expo.dev" target="_blank" rel="noopener noreferrer">docs.expo.dev</a>
          的非官方中文翻译版，仅供学习交流使用。内容与设计版权归 Expo（650 Industries, Inc.）所有；
          如有出入，请以英文原文为准。
        </p>
      </div>

      <div class="footer-col">
        <h4>文档</h4>
        <RouterLink to="/get-started/create-a-project">入门</RouterLink>
        <RouterLink to="/guides/overview">指南</RouterLink>
        <RouterLink to="/versions/latest">API 参考</RouterLink>
        <RouterLink to="/router/introduction">Expo Router</RouterLink>
        <RouterLink to="/eas">EAS</RouterLink>
      </div>

      <div class="footer-col">
        <h4>资源</h4>
        <a href="https://expo.dev" target="_blank" rel="noopener noreferrer">expo.dev</a>
        <a href="https://expo.dev/blog" target="_blank" rel="noopener noreferrer">博客</a>
        <a href="https://expo.dev/changelog" target="_blank" rel="noopener noreferrer">变更日志</a>
        <a href="https://expo.dev/templates" target="_blank" rel="noopener noreferrer">模板</a>
        <a href="https://snack.expo.dev" target="_blank" rel="noopener noreferrer">Snack</a>
      </div>

      <div class="footer-col">
        <h4>社区</h4>
        <a href="https://chat.expo.dev" target="_blank" rel="noopener noreferrer">Discord</a>
        <a href="https://forums.expo.dev" target="_blank" rel="noopener noreferrer">论坛</a>
        <a href="https://github.com/expo/expo" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.youtube.com/@ExpoDevs" target="_blank" rel="noopener noreferrer">YouTube</a>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© {{ year }} 650 Industries, Inc. · 中文翻译版为非官方项目</span>
      <div class="footer-social">
        <a href="https://chat.expo.dev" target="_blank" rel="noopener noreferrer" aria-label="Discord"><Icon name="discord" :size="16" /></a>
        <a href="https://github.com/expo/expo" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Icon name="github" :size="16" /></a>
        <a href="https://x.com/expo" target="_blank" rel="noopener noreferrer" aria-label="X"><Icon name="twitter" :size="16" /></a>
        <a href="https://www.youtube.com/@ExpoDevs" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Icon name="youtube" :size="16" /></a>
        <a href="https://www.linkedin.com/company/expo-dev" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" :size="16" /></a>
        <a href="https://www.reddit.com/r/expo" target="_blank" rel="noopener noreferrer" aria-label="Reddit"><Icon name="reddit" :size="16" /></a>
      </div>
    </div>
  </footer>
</template>
