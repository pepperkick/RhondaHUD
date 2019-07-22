import Vue from 'vue'
import Router from 'vue-router'

import HUD from '@/views/Hud'
import Admin from '@/views/Admin'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: HUD
        },
        {
            path: '/admin',
            component: Admin
        }
    ]
})
