import {
  GET_USER_DATA
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
  authenticated
} from 'root/src/shared/constants/authenticationTypes'

export default {
  [GET_USER_DATA]: {
    authentication: authenticated
  }
}
