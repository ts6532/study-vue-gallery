
import GalleryView from '@/views/GalleryView.vue'
import { createWebHistory } from 'vue-router'
import { createRouter } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GalleryView,
    },  
  ],
})

export default router
