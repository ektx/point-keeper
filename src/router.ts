import { createRouter, createWebHashHistory } from 'vue-router'

const routers = [
    {
        path: '/',
        name: 'root',
        component: () => import('../src/App.vue')
    }
]

export default createRouter({
    history: createWebHashHistory('point-keeper'),
    routes: routers
})