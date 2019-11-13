import {
  GET_USER_LIST
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
  admin
} from 'root/src/shared/constants/authenticationTypes'
import payloadSchema from 'root/src/shared/descriptions/endpoints/schemas/getUserListPayloadSchema'

export default {
  [GET_USER_LIST]: {
    authentication: admin,
    payloadSchema
  }
}
