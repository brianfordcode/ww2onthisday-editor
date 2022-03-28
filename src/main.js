import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// ALWAYS DISPLAY ALL NON-PUBLISHED EVENTS IN PREVIEW
store.dispatch('loadNonpublishedEvents')

createApp(App).use(store).use(router).mount('#app')
