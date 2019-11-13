import {
  actionIds,
  mutationIds
} from './allIds'
import invokeApiLambda from '~/utils/server/invokeApiLambda'
import {
  Loading,
  QSpinnerHourglass
} from 'quasar'
import {
  last,
  split
} from 'ramda'
import {
  GET_DEVICE_DATA,
  RESET_DEVICE_DATA
} from '@shared/descriptions/endpoints/endpointIds'

export default {
  async [actionIds.GET_DEVICE_DATA]({
    commit
  }) {
    const result = await invokeApiLambda(GET_DEVICE_DATA)
    commit(mutationIds.UPDATE_DEVICE_DATA, result)
  },
  async [actionIds.RESET_DEVICE_DATA]({
    commit,
    state
  }) {
    Loading.show({
      spinner: QSpinnerHourglass
    })
    await invokeApiLambda(RESET_DEVICE_DATA, {
      boardId: last(split('-', state.selectedBoard))
    })
    const result = await invokeApiLambda(GET_DEVICE_DATA)
    commit(mutationIds.UPDATE_DEVICE_DATA, result)
    Loading.hide()
  }
}
