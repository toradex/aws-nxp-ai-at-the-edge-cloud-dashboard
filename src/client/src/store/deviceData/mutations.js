/* eslint-disable no-case-declarations */
import {
  mutationIds
} from './allIds'
import {
  propOr,
  keys,
  prop,
  head,
  split,
  map,
  contains,
  last,
  equals,
  includes,
  pathOr,
  uniq
} from 'ramda'

// Merge Device Datas from AWS with Local Device Data
const updateState = (state, data) => {
  const {
    pk,
    sk
  } = data
  const boardID = `Board-${last(split('-', sk))}`
  const nextMqttData = JSON.stringify(data, null, 4) + '\n\n' + propOr('', boardID, state.mqttDatas)

  state.mqttDatas = {
    ...state.mqttDatas,
    [boardID]: nextMqttData.slice(0, 10000)
  }

  const dataType = head(split('-', sk))
  if (contains('-', pk)) { // it means that it is pasta detect data
    const pastaType = last(split('-', pk))
    if (equals(dataType, 'average')) {
      state.averagePastaData = {
        ...state.averagePastaData,
        [boardID]: {
          ...state.averagePastaData[boardID],
          [pastaType]: data,
        }
      }
    } else {
      state.lastPastaData = {
        ...state.lastPastaData,
        [boardID]: {
          ...state.lastPastaData[boardID],
          [pastaType]: data,
        }
      }

    }
  } else {
    const deviceType = pk
    if (equals(dataType, 'average')) {
      state.averageDeviceData = {
        ...state.averageDeviceData,
        [boardID]: {
          ...state.averageDeviceData[boardID],
          [deviceType]: data
        }
      }
      // Check if we need device history
      if (includes(deviceType, keys(state.needHistoryDevices))) {
        addStatusHistory(state, data, deviceType, boardID)
      }
    } else {
      state.lastDeviceData = {
        ...state.lastDeviceData,
        [boardID]: {
          ...state.lastDeviceData[boardID],
          [deviceType]: data
        }
      }
    }

  }
}

const updateBoardData = (state, newBoardData) => {
  map((board) => {
    const boardId = board.sk
    if (!state.selectedBoard) {
      state.selectedBoard = boardId
    }
    if (pathOr('0', [boardId, 'last-updated-time'], state.allBoard) >= propOr('0', 'last-updated-time', board)) {
			if (pathOr(0, [boardId, 'last-updated-time'], state.allBoard)){
				state.cntNotReceived = {
          ...state.cntNotReceived,
          [boardId]: 2
				}
			}else {
				state.cntNotReceived = {
					...state.cntNotReceived,
					[boardId]: +(propOr(0, boardId, state.cntNotReceived)) + 1
				}
			}
    } else {
			if (pathOr(0, [boardId, 'last-updated-time'], state.allBoard)){
				state.cntNotReceived = {
          ...state.cntNotReceived,
          [boardId]: 0
				}
			}
		}
		state.allBoard = {
			...state.allBoard,
			[boardId]: board
		}
  }, newBoardData)

}

const getOneDigit = (val) => Math.floor(val * 10) / 10

const addStatusHistory = (state, data, deviceType, boardID) => {

  state.deviceStatusHistory = {
    ...state.deviceStatusHistory,
    [boardID]: {
      ...state.deviceStatusHistory[boardID],
      [deviceType]: [...uniq(pathOr([], [boardID, deviceType], state.deviceStatusHistory)).slice(-11, Infinity), {
        x: prop('log-count', data),
        y: getOneDigit(prop(state.needHistoryDevices[deviceType], data) / prop('log-count', data))
      }]
    }
  }
}

export default {
  [mutationIds.UPDATE_DEVICE_DATA](state, {
    body
  }) {
    const {
      deviceData,
      allBoards
    } = body
    map((newData) => {
      updateState(state, newData)
    }, deviceData)
    updateBoardData(state, allBoards)
  },

  [mutationIds.SELECT_BOARD](state, val) {
    state.selectedBoard = val
  }
}
