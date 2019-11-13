import {
  AWSCognitoClient
} from './AWS.Cognito.Client'
import outputs from '@root/cfOutput'
import {
  pathOr
} from 'ramda'
const {
  userPoolId,
  clientId
} = outputs
const client = new AWSCognitoClient({
  UserPoolId: userPoolId, // your user pool id here
  ClientId: clientId // your app client id here
})
class Auth {
  getUserData() {
    return client.getUserData()
  }

  getJwtToken() {
    return client.getJwtToken()
  }

  updateUserData(update) {
    return client.updateUserData(update)
  }

  signOut() {
    return client.signOut()
  }

  signIn(model) {
    return client.signIn(model)
  }

  signUp(model) {
    return client.signUp(model)
  }

  changePassword(model) {
    return client.changePassword(model)
  }

  forgotPassword(model) {
    return client.forgotPassword(model)
  }

  resetPassword(model) {
    return client.resetPassword(model)
  }

  resendConfirmation(model) {
    return client.resendConfirmationCode(model)
  }

  confirmRegistration(model) {
    return client.confirmRegistration(model)
  }

  isLoggedIn() {
    return client.isLoggedIn()
  }

  updateProfile(update) {
    return client.updateUserData(update)
  }

  getSession() {
    return pathOr('', ['session', 'idToken', 'jwtToken'], client)
  }

  checkAuth() {

  }
}

export const AuthService = new Auth()
