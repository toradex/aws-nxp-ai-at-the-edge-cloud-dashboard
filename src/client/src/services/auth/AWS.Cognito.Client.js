import * as AWS from 'aws-sdk/global'
import outputs, {
  region
} from '@root/cfOutput'
const {
  identityPoolId
} = outputs
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js'

export class AWSCognitoClient {
  // userPool = new CognitoUserPool;
  // userPool;
  _poolData;

  session;

  // = new CognitoUserSession;
  constructor(poolData, cognitoUserPool) {
    this._poolData = poolData
    this.userPool = cognitoUserPool || new CognitoUserPool(this._poolData)
    this.loginHint = ''
  }

  signUp(model) {
    return new Promise((resolve, reject) => {
      if (!model) {
        reject({
          code: 'INVALID_DATA',
          message: 'Invalid user data model'
        })
      }
      if (!model.username || model.username.length < 2) {
        reject({
          code: 'INVALID_Email',
          message: 'Invalid user email'
        })
      }
      if (!model.password || model.password.length < 2) {
        reject({
          code: 'INVALID_PASSWORD',
          message: 'Invalid password'
        })
      }
      const attributeList = Object.entries(model.data || {}).map(v => {
        return new CognitoUserAttribute({
          Name: v[0],
          Value: v[1]
        })
      })
      const done = (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }

      this.userPool.signUp(model.username, model.password, attributeList, null, done)
    })
  }

  signIn(model) {
    return new Promise((resolve, reject) => {
      if (!model) {
        reject({
          code: 'INVALID_DATA',
          message: 'Invalid user data model'
        })
      }
      if (!model.username || model.username.length < 2) {
        reject({
          code: 'INVALID_USEREMAIL',
          message: 'Invalid user email'
        })
      }
      if (!model.password || model.password.length < 2) {
        reject({
          code: 'INVALID_PASSWORD',
          message: 'Invalid password'
        })
      }

      const authenticationDetails = new AuthenticationDetails({
        Username: model.username,
        Password: model.password
      })
      const cognitoUser = new CognitoUser({
        Username: model.username,
        Pool: this.userPool
      })
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          this.accessToken = result.getAccessToken().getJwtToken()
          this.session = result
          this.loginHint = model.username
          this._resetCredentials()
          AWS.config.credentials.refresh((error) => {
            if (error) {
              reject(error)
            } else {
              resolve(this.accessToken)
            }
          })
        },

        onFailure: (err) => {
          reject(err)
        }

      })
    })
  }

  changePassword(model) {
    return new Promise((resolve, reject) => {
      if (!model) {
        reject({
          code: 'INVALID_DATA',
          message: 'Invalid data'
        })
      }
      if (!model.oldPassword || model.oldPassword.length < 2 ||
        !model.newPassword || model.newPassword.length < 2) {
        reject({
          code: 'INVALID_PASSWORD',
          message: 'Invalid password'
        })
      }
      this.getCurrentUser().then(cognitoUser => {
        cognitoUser.changePassword(model.oldPassword, model.newPassword, (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        })
      }).catch(reject)
    })
  }

  resetPassword(model) {
    return new Promise((resolve, reject) => {
      if (!model) {
        reject({
          code: 'INVALID_DATA',
          message: 'Invalid data'
        })
      }
      if (!model.code || model.code.length < 2) {
        reject({
          code: 'INVALID_CODE',
          message: 'Invalid verification code'
        })
      }
      if (!model.newPassword || model.newPassword.length < 2) {
        reject({
          code: 'INVALID_PASSWORD',
          message: 'Invalid password'
        })
      }

      const cognitoUser = new CognitoUser({
        Username: model.username,
        Pool: this.userPool
      })
      cognitoUser.confirmPassword(model.code, model.newPassword, {
        onSuccess(data) {
          resolve(data)
        },
        onFailure(err) {
          reject(err)
        }
      })
    })
  }

  forgotPassword(model) {
    return new Promise((resolve, reject) => {
      if (!model) {
        reject({
          code: 'INVALID_DATA',
          message: 'Invalid data'
        })
      }
      if (!model.username || model.username.length < 2) {
        reject({
          code: 'INVALID_EMAIL',
          message: 'Invalid email'
        })
      }
      const cognitoUser = new CognitoUser({
        Username: model.username,
        Pool: this.userPool
      })
      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          resolve(data)
        },
        onFailure: (err) => {
          reject(err)
        }

      })
    })
  }

  confirmRegistration(model) {
    return new Promise((resolve, reject) => {
      if (!model) {
        reject({
          code: 'INVALID_DATA',
          message: 'Invalid data'
        })
      }
      if (!model.code || model.code.length < 2) {
        reject({
          code: 'INVALID_CODE',
          message: 'Invalid code'
        })
      }
      const cognitoUser = new CognitoUser({
        Username: model.username,
        Pool: this.userPool
      })
      cognitoUser.confirmRegistration(model.code, true, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
    })
  }

  resendConfirmationCode(model) {
    return new Promise((resolve, reject) => {
      if (!model) {
        reject({
          code: 'INVALID_DATA',
          message: 'Invalid data'
        })
      }
      if (!model.username || model.username.length < 2) {
        reject({
          code: 'INVALID_USEREMAIL',
          message: 'Invalid user email'
        })
      }
      const cognitoUser = new CognitoUser({
        Username: model.username,
        Pool: this.userPool
      })
      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  signOut() {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then(cognitoUser => {
        return cognitoUser.globalSignOut({
          onSuccess: resolve(),
          onFailure: (err) => {
            cognitoUser.signOut()
            reject(err)
          }
        })
      })
    })
  }

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.userPool.getCurrentUser()
      this.loginHint = cognitoUser.getUsername()
      if (cognitoUser != null) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(err)
          }
          this.session = session
          this._resetCredentials()
          resolve(cognitoUser)
        })
      } else {
        reject(false)
      }
    })
  }

  getJwtToken() {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.userPool.getCurrentUser()
      this.loginHint = cognitoUser.getUsername()
      if (cognitoUser != null) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(err)
          }
          this.session = session
          this._resetCredentials()
          resolve(this.session.getIdToken().getJwtToken())
        })
      } else {
        reject(false)
      }
    })
  }

  _resetCredentials() {
    AWS.config.region = region // Region
    const credentialParams = {
      IdentityPoolId: identityPoolId,
      Logins: {
        [`cognito-idp.${region}.amazonaws.com/${this._poolData.UserPoolId}`]: this.session.getIdToken().getJwtToken()
      }
    }
    const credentials = new AWS.CognitoIdentityCredentials(credentialParams)
    credentials.clearCachedId()
    AWS.config.credentials = credentials
  }

  getUserData() {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then(cognitoUser => {
        cognitoUser.getUserAttributes((err, result) => {
          if (err) {
            reject(err)
          }
          const data = {};
          (result || []).forEach(attr => {
            data[attr.getName()] = attr.getValue()
          })

          resolve(data)
        })
      }).catch(reject)
    })
  }

  updateUserData(update) {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then(cognitoUser => {
        const attributeList = Object.entries(update || {}).map(v => {
          return new CognitoUserAttribute({
            Name: v[0],
            Value: v[1]
          })
        })
        cognitoUser.updateAttributes(attributeList, (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
        })
      }).catch(reject)
    })
  }

  isLoggedIn() {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then(cognitoUser => {
        // (new CognitoUser()).getSession()
        cognitoUser.getSession((err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result.isValid())
        })
      }).catch(reject)
    })
  }
}
