import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'), // Layout simplificado para login
    children: [
      { path: '/', component: () => import('pages/Login.vue') }, // Página de login na raiz
      { path: '/faturas/imprimir/:id', component: () => import('src/pages/Facturas/ImprimirFacturaPage.vue') }, // Factura

    ],
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'), // Layout principal após login
    // meta: { requiresAuth: true }, // Protegendo a rota do dashboard
    children: [
      { path: '/dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: '/clientes', component: () => import('pages/clientes/ListaClientesPage.vue')},
      { path: '/faturas', component: () => import('src/pages/Facturas/ListaFacturasPage.vue')},
      { path: '/faturas/:id', component: () => import('src/pages/Facturas/DetalhesFacturaPage.vue')},
      { path: '/faturas/criar', component: () => import('src/pages/Facturas/NovaFacturasPage.vue')},
      { path: '/pecas', component: () => import('pages/pecas/ListaPecasPage.vue')},
      { path: '/despesas', component: () => import('pages/Despesas/ListaDespesasPage.vue')},
      { path: '/relatorios', component: () => import('pages/Relatorios/ListaRelatoriosPage.vue')},
      { path: '/funcionarios', component: () => import('pages/Funcionarios/ListarFuncionariosPage.vue')},
      { path: '/servicos', component: () => import('pages/Servicos/ListarServicosPage.vue')},
      { path: '/cargos', component: () => import('pages/Cargos/ListarCargos.vue')},
      {path: '/tipo_pecas', component: () => import('pages/tipo_peca/ListarTipoPeca.vue')},
      {path: '/factura_peca', component: () => import('pages/factura_peca/FacturaPecaPage.vue')

      },



    ],

  },
  // Rota para páginas não encontradas
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
