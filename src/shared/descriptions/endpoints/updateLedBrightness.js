import {
  UPDATE_LED_BRIGHTNESS
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
  authenticated
} from 'root/src/shared/constants/authenticationTypes'
import payloadSchema from 'root/src/shared/descriptions/endpoints/schemas/updateLedBrightnessPayloadSchema'

export default {
  [UPDATE_LED_BRIGHTNESS]: {
    authentication: authenticated,
    payloadSchema
  }
}
