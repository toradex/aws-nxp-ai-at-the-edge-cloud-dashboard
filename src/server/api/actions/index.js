import {
  GET_DEVICE_DATA,
  GET_USER_LIST,
  GET_USER_DATA,
  GET_BOARD_DATA,
  UPDATE_USER_DATA,
  UPDATE_BELT_SPEED,
  UPDATE_LED_BRIGHTNESS,
	RESET_DEVICE_DATA,
	UPDATE_BOARD_ALIAS
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import getDeviceData from 'root/src/server/api/actions/getDeviceData'
import getUserList from 'root/src/server/api/actions/getUserList'
import getUserData from 'root/src/server/api/actions/getUserData'
import updateUserData from 'root/src/server/api/actions/updateUserData'
import updateBeltSpeed from 'root/src/server/api/actions/updateBeltSpeed'
import updateLedBrightness from 'root/src/server/api/actions/updateLedBrightness'
import getBoardData from 'root/src/server/api/actions/getBoardData'
import resetDeviceData from 'root/src/server/api/actions/resetDeviceData'
import updateBoardAlias from 'root/src/server/api/actions/updateBoardAlias'

export default {
  [GET_DEVICE_DATA]: getDeviceData,
  [RESET_DEVICE_DATA]: resetDeviceData,
  [GET_USER_LIST]: getUserList,
  [GET_USER_DATA]: getUserData,
  [UPDATE_USER_DATA]: updateUserData,
  [UPDATE_BELT_SPEED]: updateBeltSpeed,
  [UPDATE_LED_BRIGHTNESS]: updateLedBrightness,
	[GET_BOARD_DATA]: getBoardData,
	[UPDATE_BOARD_ALIAS]: updateBoardAlias
}
