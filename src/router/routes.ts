import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
    { path: '/dashboard', component: () => import('pages/DashboardPage.vue') },
    { path: '/clientes', component: () => import('pages/clientes/ListaClientesPage.vue')},
  ],
  },
  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    children: [{ path: '/login', component: () => import('pages/Login.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
