/* eslint-disable no-throw-literal */
import {
  actionIds,
  mutationIds
} from './allIds'
import {
  AuthService
} from '~/services/auth'
import {
  Notify
} from 'quasar'

import {
  GET_DEVICE_DATA
} from '@shared/descriptions/endpoints/endpointIds'
import invokeApiLambda from '~/utils/server/invokeApiLambda'


export default {
  [actionIds.SET_ERRORS]({
    commit
  }, errors) {
    commit(mutationIds.SET_ERRORS, errors)
  },

  [actionIds.SAVE_USERDATA]({
    commit
  }, data) {
    commit(mutationIds.SAVE_USERDATA, data)
  },

  async [actionIds.GET_USER_LIST]({
    commit
  }) {
    const result = await invokeApiLambda(GET_DEVICE_DATA)
    commit(mutationIds.UPDATE_DEVICE_DATA, result)
  },

  async [actionIds.REGISGER_USER]({
    commit
  }, userData) {
    commit(mutationIds.SET_LOADING, true)
    try {
      if (!userData.acceptTerms) {
        throw {
          message: 'You must accept the license and terms to continue'
        }
      }
      const result = await AuthService.signUp(userData)
      commit(mutationIds.SAVE_USERDATA, {
        userSub: result.userSub,
        username: result.user.username
      })

      commit(mutationIds.REGISGER_RESULT, result)
    } catch (err) {
      commit(mutationIds.SET_ERRORS, err)
    }

    commit(mutationIds.SET_LOADING, false)
  },

  async [actionIds.LOGIN]({
    commit
  }, userData) {
    commit(mutationIds.SET_LOADING, true)
    commit(mutationIds.SAVE_USERDATA, userData)
    try {
      const result = await AuthService.signIn(userData)
      commit(mutationIds.LOGIN_RESULT, result)
    } catch (err) {
      commit(mutationIds.SET_ERRORS, err)
    }
    commit(mutationIds.SET_LOADING, false)
  },
  // Action for confirm code
  async [actionIds.RESEND_CONFIRM_CODE]({
    commit
  }, username) {
    commit(mutationIds.SET_LOADING, true)
    try {
      if (!username) {
        throw {
          message: 'You should sign up again'
        }
      }
      await AuthService.resendConfirmation({
        username
      })
      this.$router.push('/user/confirm-code')
    } catch (err) {
      Notify.create({
        color: 'negative',
        message: 'You should signup again!',
        icon: 'report_problem'
      })
      this.$router.push('/user/register')
    }
    commit(mutationIds.SET_LOADING, false)
  },
  // Action for Log out
  async [actionIds.LOGOUT]() {
    await AuthService.signOut()
    this.$router.push('/user/login')
  }, // Action for Log out
  async [actionIds.GET_USERDATA]({
    commit,
  }) {
    const userData = await AuthService.getUserData()
    const session = AuthService.getSession()
    commit(mutationIds.SAVE_USERDATA, {
      userSub: userData.sub,
      username: userData.email,
      fullname: userData.name,
      session
    })
  }
}
