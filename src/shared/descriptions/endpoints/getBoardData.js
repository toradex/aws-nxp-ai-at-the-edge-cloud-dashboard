import {
  GET_BOARD_DATA
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
  admin
} from 'root/src/shared/constants/authenticationTypes'

export default {
  [GET_BOARD_DATA]: {
    authentication: admin,
  }
}
