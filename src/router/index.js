import Vue from 'vue'
import Router from 'vue-router'

const Home = () => import(/* webpackChunkName: "Home" */'@/home/Index.vue')
const List = () => import(/* webpackChunkName: "List" */'@/list/Index.vue')
const Detail = () => import(/* webpackChunkName: "Detail" */'@/detail/Index.vue')
const SignIn = () => import(/* webpackChunkName: "Detail" */'@/page/signin/Index.vue')
const Login = () => import(/* webpackChunkName: "Detail" */'@/page/login/index.vue')
const Shop = () => import(/* webpackChunkName: "Detail" */'@/page/shop/Index.vue')
const ShopDetail = () => import(/* webpackChunkName: "Detail" */'@/page/shop/detail.vue')
const Mine = () => import(/* webpackChunkName: "Detail" */'@/page/mine/index.vue')
const Integral = () => import(/* webpackChunkName: "Detail" */'@/page/integral/index.vue')
const Exchange = () => import(/* webpackChunkName: "Detail" */'@/page/exchange/index.vue')
const AdminProductList = () => import(/* webpackChunkName: "Detail" */'@/page/admin/product/list.vue')
const AdminTask = () => import(/* webpackChunkName: "Detail" */'@/page/admin/task/list.vue')
const AdminApply = () => import(/* webpackChunkName: "Detail" */'@/page/admin/apply/index.vue')
const AdminBrand = () => import(/* webpackChunkName: "Detail" */'@/page/admin/brand/index.vue')
const actionHistory = () => import(/* webpackChunkName: "Detail" */'@/page/action_history/Index.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [  {
    path: '/',
    name: 'Login',
    component: Login,
  },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
    },
    {
      path: '/shop',
      name: 'shop',
      component: Shop,
    },
    {
      path: '/shopDetail',
      name: 'shopDetail',
      component: ShopDetail,
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine,

    },
    {
      path: '/integral',
      name: 'integral',
      component: Integral,
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: Exchange,
    },
    {
      path: '/admin/productList',
      name: 'adminProductList',
      component: AdminProductList,
    },
    {

      path: '/admin/taskList',
      name: 'adminTask',
      component: AdminTask,
    },
    {

      path: '/admin/apply',
      name: 'adminApply',
      component: AdminApply,
    },
    {
      path: '/admin/brand',
      name: 'adminBrand',
      component: AdminBrand,
    },
    {
      path: '/index.html',
      name: 'HomeHtml',
      component: Home,
    },
    {
      path: '/test/(home|index)',
      name: 'HomeTest',
      component: Home,
    },
    {
      path: '/action',
      name: 'ActionHistory',
      component: actionHistory,
    }
  ],
})
