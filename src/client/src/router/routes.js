import {
  authenticated,
  admin
} from '@root/src/shared/constants/authenticationTypes'
const MainLayout = () => import('~/layouts/MainLayout.vue')
const DashboardLayout = () => import('~/layouts/DashboardLayout.vue')

const routes = [{
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/user',
    component: MainLayout,
    children: [{
      path: 'login',
      component: () => import('~/pages/User/Login.vue'),
      name: 'login'
    }, {
      path: 'register',
      component: () => import('~/pages/User/Register.vue'),
      name: 'register'
    }, {
      path: 'forget-password',
      component: () => import('~/pages/User/ForgetPassword.vue'),
      name: 'forget-password'
    }, {
      path: 'confirm-code',
      component: () => import('~/pages/User/ConfirmCode.vue'),
      name: 'confirm-code'
    }, {
      path: 'confirm-text',
      component: () => import('~/pages/User/ConfirmText.vue'),
      name: 'confirm-text'
    }],
    meta: {}
  }, {
    path: '/dashboard',
    component: DashboardLayout,
    children: [{
      path: '',
      redirect: '/dashboard/deeplearning-model'
    }, {
      path: 'compute-pfm',
      component: () => import('~/pages/Dashboard/ComputePerformance.vue'),
      name: 'dashboard.computer-pfm',
      meta: {
        title: 'Compute Performance'
      }

    }, {
      path: 'conveyar-status',
      component: () => import('~/pages/Dashboard/ConveyorBeltStatus.vue'),
      name: 'dashboard.conveyar-status',
      meta: {
        title: 'Conveyor Belt Status'
      }

    }, {
      path: 'deeplearning-model',
      component: () => import('~/pages/Dashboard/DeepLearningModelPerformance.vue'),
      name: 'dashboard.deeplearning-model',
      meta: {
        title: 'Deep Learning Model Performance'
      }

    }, {
      path: 'config-panel',
      component: () => import('~/pages/Dashboard/ConfigPanel.vue'),
      name: 'dashboard.config-panel',
      meta: {
        title: 'Admin Panel',
        authType: admin
      }

    }],
    meta: {
      authType: authenticated
    }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('~/pages/Error404.vue')
  })
}

export default routes
