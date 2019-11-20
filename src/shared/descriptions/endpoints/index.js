import map from 'ramda/src/map'

import getDeviceData from 'root/src/shared/descriptions/endpoints/getDeviceData'
import resetDeviceData from 'root/src/shared/descriptions/endpoints/resetDeviceData'
import getUserList from 'root/src/shared/descriptions/endpoints/getUserList'
import getUserData from 'root/src/shared/descriptions/endpoints/getUserData'
import getBoardData from 'root/src/shared/descriptions/endpoints/getBoardData'
import updateUserData from 'root/src/shared/descriptions/endpoints/updateUserData'
import updateBeltSpeed from 'root/src/shared/descriptions/endpoints/updateBeltSpeed'
import updateLedBrightness from 'root/src/shared/descriptions/endpoints/updateLedBrightness'
import updateBoardAlias from 'root/src/shared/descriptions/endpoints/updateBoardAlias'

const allEndpoints = {
  ...getDeviceData,
  ...resetDeviceData,
  ...getUserList,
  ...getUserData,
  ...getBoardData,
  ...updateUserData,
  ...updateBeltSpeed,
	...updateLedBrightness,
	...updateBoardAlias
}

export default map(
  endpoint => ({
    ...endpoint
  }),
  allEndpoints
)
