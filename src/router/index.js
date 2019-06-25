import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import HelloWorld from '@/components/HelloWorld'
import Lucking from '@/components/Lucking/Lucking'

Vue.use(Router)
Vue.use(ElementUI)

export default new Router({
  routes: [
    {
      path: '/draw/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/draw/Lucking/:id?',
      name: 'Lucking',
      component: Lucking
    }
  ]
})
