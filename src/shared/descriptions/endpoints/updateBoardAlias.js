import {
  UPDATE_BOARD_ALIAS
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
  authenticated
} from 'root/src/shared/constants/authenticationTypes'
import payloadSchema from 'root/src/shared/descriptions/endpoints/schemas/updateBoardAliasPayloadSchema'

export default {
  [UPDATE_BOARD_ALIAS]: {
		authentication: authenticated,
		payloadSchema,
  }
}
