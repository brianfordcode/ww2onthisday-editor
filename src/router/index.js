import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: "Editor | WW2 on this day"
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  mode: "history",
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`
  next();
})

export default router
