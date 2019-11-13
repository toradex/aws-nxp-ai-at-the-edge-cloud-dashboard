import {
  mutationIds
} from './allIds'

export default {
  [mutationIds.SET_PAGE_ERROR](state, data) {
    state.error = data
  },
  [mutationIds.SET_PAGE_LOADING](state, data) {
    state.loading = data
  },
  [mutationIds.SET_PAGE_TITLE](state, data) {
    state.title = data
  }

}
