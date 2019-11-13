import {
  resourcePrefix
} from 'root/src/aws/util/functions'

export const COGNITO_AUTH_ROLE = `${resourcePrefix}CognitoAuthRole`
export const COGNITO_UNAUTH_ROLE = `${resourcePrefix}CognitoUnauthRole`
export const IDENTITY_POOL = `${resourcePrefix}IdentityPool`
export const IDENTITY_POOL_ROLE_ATTACHMENT = `${resourcePrefix}IdentityPoolRoleAttachment`
export const USER_POOL_CLIENT = `${resourcePrefix}UserPoolClient`
export const USER_POOL = `${resourcePrefix}UserPool`
export const ADMIN_USER_POOL_GROUP = `${resourcePrefix}AdminUserPoolGroup`
