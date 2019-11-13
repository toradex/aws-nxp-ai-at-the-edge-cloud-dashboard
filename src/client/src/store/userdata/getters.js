import authCheck from '~/utils/authCheck.js'

export default {
  loading(state) {
    return state.loading
  },
  error(state) {
    return state.error
  },
  focused(state) {
    return state.focused
  },
  username(state) {
    return state.username
  },
  fullname(state) {
    return state.fullname
  },
  isRightAuthentication(state) {
    return (authType) => authCheck(state.idToken, authType)
  }

}
