import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Principal from '../views/PrincipalView.vue'
import Reporte from '../views/ReporteAsistencia.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: Login
  },
  {
    path: '/main',
    name: 'PrincipalView',
    component: Principal
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/PrincipalView.vue')
  },
  {
    path:'/reporte',
    component:Reporte

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
