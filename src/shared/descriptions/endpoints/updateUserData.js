import {
  UPDATE_USER_DATA
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
  admin
} from 'root/src/shared/constants/authenticationTypes'
import payloadSchema from 'root/src/shared/descriptions/endpoints/schemas/updateUserDataPayloadSchema'

export default {
  [UPDATE_USER_DATA]: {
    authentication: admin,
    payloadSchema
  }
}
