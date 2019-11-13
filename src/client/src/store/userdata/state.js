import Cookies from 'js-cookie'
export default {
  usersub: Cookies.get('usersub'),
  username: Cookies.get('username'),
  fullname: Cookies.get('fullname'),
  idToken: Cookies.get('idToken'),
  loading: false,
  error: {
    message: false
  },
  focused: {},
  userToken: ''
}
