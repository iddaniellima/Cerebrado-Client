import * as types from './mutations-types'

export default {
  [types.UPDATE_ROOM_DATA] (state, payload) {
    state.roomData = payload
  },

  [types.ADD_NEW_USER] (state, payload) {
    state.roomData.users.push(payload)
  },

  [types.REMOVE_USER] (state, payload) {
    state.roomData.users.splice(payload, 1)
  },

  [types.ADD_NEW_MESSAGE] (state, payload) {
    state.RoomMessages.push(payload)
  },

  [types.UPDATE_USER] (state, payload) {
    state.roomData.users[payload.user_index][payload.key] = payload.new_value
  },

  [types.UPDATE_ADMIN_DATA] (state, payload) {
    state.roomData.me[payload.key] = payload.value
  },

  [types.UPDATE_ROOM_X_DATA] (state, payload) {
    state.roomData[payload.key] = payload.value
  }
}
