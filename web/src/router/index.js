import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

let baseRouter = ''
if (process.env === 'production') {
  baseRouter = '/validator'
}

Vue.use(Router)

export default new Router({
  base: baseRouter,
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }
  ]
})
