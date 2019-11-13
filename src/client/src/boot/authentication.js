import {
  AuthService
} from '~/services/auth'
import {
  mutationIds
} from '~/store/page/allIds'
import {
  actionIds
} from '~/store/userdata/allIds'
// "async" is optional
import {
  hasPath,
  all,
  map,
  filter,
  path
} from 'ramda'

import authCheck from '~/utils/authCheck'

export default async ({
  router,
  store
}) => {
  router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.authType)) {
      try {
        await AuthService.getUserData()
        store.dispatch('userdata/' + actionIds.GET_USERDATA)
        const allAuthTypes = filter(hasPath(['meta', 'authType']), to.matched)
        if (all(map(authType => authCheck(AuthService.getSession(), path(['meta', 'authType'], authType)), allAuthTypes))) {
          next()
        } else {
          throw 'shouldLogin'
        }
      } catch (err) {
        next({
          name: 'login',
          params: {
            nextUrl: to.fullPath
          }
        })
      }
    } else {
      next()
    }
  })
  router.afterEach((to) => {
    if (hasPath(['meta', 'title'], to)) store.commit('page/' + mutationIds.SET_PAGE_TITLE, to.meta.title)
  })
}
