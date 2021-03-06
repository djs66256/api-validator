import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import ValidatorContent from '@/components/validator/ValidatorContent'
import ValidatorList from '@/components/validator/List'

import ApiContent from '@/components/api/ApiContent'
import ApiEdit from '@/components/api/Add'

import ModelsContent from '@/components/models/ModelsContent'
import ModelList from '@/components/models/List'
import ModelAdd from '@/components/models/Add'

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
      name: 'validator',
      alias: '/validator',
      component: ValidatorContent,
      children: [
        {
          path: 'list',
          alias: '',
          component: ValidatorList
        }
        // {
        //   path: 'validate'
        // }
      ]
    },
    {
      path: '/api',
      name: 'api',
      component: ApiContent
    },
    {
      path: '/api/add',
      name: 'apiAdd',
      component: ApiEdit
    },
    {
      path: '/api/edit/:api',
      name: 'apiEdit',
      component: ApiEdit
    },
    {
      path: '/models',
      name: 'models',
      component: ModelsContent,
      children: [
        {
          path: 'list',
          alias: '',
          component: ModelList
        }
      ]
    },
    {
      path: '/model/add',
      name: 'modelAdd',
      component: ModelAdd
    },
    {
      path: '/model/edit/:interface',
      name: 'modelEdit',
      component: ModelAdd
    }
  ]
})
