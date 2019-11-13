import {
  UPDATE_BELT_SPEED
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
  authenticated
} from 'root/src/shared/constants/authenticationTypes'
import payloadSchema from 'root/src/shared/descriptions/endpoints/schemas/updateBeltSpeedPayloadSchema'

export default {
  [UPDATE_BELT_SPEED]: {
    authentication: authenticated,
    payloadSchema
  }
}
