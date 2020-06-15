import * as types from './mutations-types'
import api from '@/modules/api'
// import config from '@/config'

export const ActionGetRoomData = ({ dispatch }) => {
  return api.get('v1/room').then(r => {
    // dispatch('ActionUpdateRoomData', r.data.get_room)
  })
}

export const ActionUpdateRoomData = ({ commit }, payload) => {
  commit(types.UPDATE_ROOM_DATA, payload)
}
