import Vue from 'vue'
import Router from 'vue-router'
import App from '../../App.vue'
import store from '../../store'
import Home from '../../home/Index.vue'
import SignIn from '../../page/signin/Index.vue'
import Login from '../../page/login/index.vue'
import Shop from '../../page/shop/Index.vue'
import ShopDetail from '../../page/shop/detail'
import Mine from '../../page/mine/index'
import Integral from '../../page/integral/index'
import Exchange from '../../page/exchange/index'
import AdminProductList from '../../page/admin/product/list'
import AdminTask from '../../page/admin/task/list'
import AdminApply from '../../page/admin/apply/index'
import AdminBrand from '../../page/admin/brand/index'
import AdminSetting from '../../page/admin/setting/index'
import AdminTheme from '../../page/admin/theme/index'
import ActionHistory from '../../page/action_history/Index'

import Vant from 'vant'
import '../../styles/index.less';
// import '../../utils/vconsole';

import 'vant/lib/index.css'
Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: SignIn,
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
      path: '/admin/setting',
      name: 'adminSetting',
      component: AdminSetting,
    },
    {
      path: '/admin/theme',
      name: 'adminTheme',
      component: AdminTheme,
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
    }, {
      path: '/test/(home|index)',
      name: 'HomeTest',
      component: Home,
    },
    {
      path: '/action',
      name: 'ActionHistory',
      component: ActionHistory,
    }
  ],
})

Vue.use(Vant);
export default function createApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  Vue.config.productionTip = false

  return new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}
