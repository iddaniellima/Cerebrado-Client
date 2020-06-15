import * as types from './mutations-types'
import api from '@/modules/api'
// import config from '@/config'

export const ActionGetRoomData = ({ dispatch }) => {
  return api.get('v1/room').then(r => {
    dispatch('ActionUpdateRoomData', r.data)
  })
}

export const ActionUpdateRoomData = ({ commit }, payload) => {
  commit(types.UPDATE_ROOM_DATA, payload)
}

export const ActionAddNewUser = ({ commit }, payload) => {
  commit(types.ADD_NEW_USER, payload)
}

export const ActionRemoveUser = ({ commit }, payload) => {
  commit(types.REMOVE_USER, payload)
}

export const ActionAddNewMessage = ({ commit }, payload) => {
  var audio = new Audio(`/sound/${payload.sound}`)
  commit(types.ADD_NEW_MESSAGE, payload)
  audio.play()
}

export const ActionUpdateUser = ({ dispatch, state, commit }, payload) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < payload.update.length; i++) {
      commit(types.UPDATE_USER, {
        user_index: payload.user_index,
        key: payload.update[i].key,
        new_value: payload.update[i].value
      })
    }

    resolve()
  })
}

export const ActionUserExists = ({ dispatch, state }, payload) => {
  return new Promise((resolve, reject) => {
    const index = state.roomData.users.findIndex(x => x._id === payload.where.id)

    if (index === -1) {
      throw new Error('User not found')
    } else {
      resolve({ index: index, user_data: state.roomData.users[index] })
    }
  })
}

export const ActionUpdateAdminData = ({ commit }, payload) => {
  commit(types.UPDATE_ADMIN_DATA, payload)
}

export const ActionUpdateRoomXData = ({ commit }, payload) => {
  commit(types.UPDATE_ROOM_X_DATA, payload)
}
