import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/formRecord.vue')
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('../views/success.vue')
    }
  ]
});

export default router;
