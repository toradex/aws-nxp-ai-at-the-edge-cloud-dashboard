import {
  mutationIds
} from './allIds'
import Cookies from 'js-cookie'
import {
  Loading,
  QSpinnerHourglass
} from 'quasar'
import {
  has
} from 'ramda'

export default {
  [mutationIds.LOGIN_RESULT](state, data) {
    state.userToken = data
    Cookies.set('userToken', state.userToken)
    this.$router.push('/dashboard')
  },

  [mutationIds.REGISGER_RESULT]() {
    this.$router.push('/user/confirm-text')
  },

  [mutationIds.SAVE_USERDATA](state, data) {
    if (has('userSub', data)) {
      state.usersub = data.userSub
      Cookies.set('usersub', state.usersub)
    }
    if (has('username', data)) {
      state.username = data.username
      Cookies.set('username', state.username)
    }
    if (has('fullname', data)) {
      state.fullname = data.fullname
      Cookies.set('fullname', state.fullname)
    }
    if (has('session', data)) {
      state.idToken = data.session
      Cookies.set('idToken', state.idToken)
    }
  },

  [mutationIds.SET_ERRORS](state, error) {
    state.error = error
  },

  [mutationIds.SET_LOADING](state, loading) {
    state.loading = loading
    if (loading) {
      Loading.show({
        spinner: QSpinnerHourglass
      })
    } else {
      Loading.hide()
    }
  }

}
