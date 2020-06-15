<template>
  <v-app>
    <v-overlay color="#341845" opacity="1" :value="loading">
      <v-row align="center" justify="center">
        <v-img src="@/assets/loading.svg" max-width="50px"></v-img>
      </v-row>
    </v-overlay>

    <LoginComponent @OnLogin="ProcessLogin" v-if="login"></LoginComponent>
    <RoomComponent v-if="!login"></RoomComponent>
  </v-app>
</template>

<script>
import LoginComponent from '@/components/Room/LoginComponent'
import RoomComponent from '@/components/Room/RoomComponent'

import { mapActions } from 'vuex'

export default {
  name: 'Room',
  components: {
    LoginComponent,
    RoomComponent
  },
  data: () => ({
    login: true,
    loading: true
  }),
  async created () {
    const storage = localStorage.getItem('login')

    if (storage) {
      this.ProcessLogin()
    } else {
      this.loading = false
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions('room', ['ActionGetRoomData']),
    async ProcessLogin (e) {
      this.loading = true
      try {
        await this.ActionGetRoomData()
        // console.log(debug)
        this.loading = false
        this.login = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>
