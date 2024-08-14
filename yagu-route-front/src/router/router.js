import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../App.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router  // 여기에서 default로 내보냅니다
