import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import List from '../views/List.vue'
import Video from '../views/Video.vue'
import File from '../views/File.vue'
import Archive from '../views/Archive.vue'
import Record from '../views/Record.vue'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import ResourceCrud from '../views/ResourceCrud.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'Home',
    component: Home,
    children: [
      {
        name: 'List',
        path: '/',
        component: List,
      },
      {
        name: 'Video',
        path: '/play/:id',
        component: Video,
        props: true
      },
      {
        name: 'History',
        path: 'user/:resource',
        component: Record,
        props: true
      },
      {
        name: 'Favorite',
        path: 'user/:resource',
        component: Record,
        props: true
      },
      {
        name: 'File',
        path: '/file',
        component: File
      },
      {
        name: 'Archive',
        path: '/archive',
        component: Archive
      },
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Main,
    children: [
      { name: 'Default', path: '/admin', redirect: '/admin/login' },
      { name: 'Videos-Crud', path: '/admin/:resource/list', component: ResourceCrud, props: true }
    ]
  },
  { name: 'Login', path: '/admin/login', component: Login }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
//挂载路由导航守卫
//前端
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  //from代表从那个路径导航而来
  //next放行 next()放行 next('/login')跳转到登陆页面
  if (to.path === '/history' || to.path === '/favorite') {
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/')
    next()
  } else {
    next()
  }

})

export default router
