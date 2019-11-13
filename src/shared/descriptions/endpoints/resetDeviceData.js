import {
  RESET_DEVICE_DATA
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
  authenticated
} from 'root/src/shared/constants/authenticationTypes'
import payloadSchema from 'root/src/shared/descriptions/endpoints/schemas/resetDeviceDataPayloadSchema'

export default {
  [RESET_DEVICE_DATA]: {
    authentication: authenticated,
    payloadSchema
  }
}
