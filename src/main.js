import { createApp } from 'vue'
import '@fontsource-variable/inter'
import App from './App.vue'
import router from './router'
import './styles/global.css'

createApp(App).use(router).mount('#app')
