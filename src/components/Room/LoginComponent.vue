<template>
  <v-app>
    <v-content class="base-main-color" style="background: #2d1e53;">
      <v-container class="fill-height">
        <v-row justify="center" align="center">
          <v-card color="transparent" flat>
            <v-card flat max-width="500" color="transparent">
              <v-row justify="center" align="center">
                <img
                  class="mx-auto pl-10 pr-10"
                  src="@/assets/desafiados-icone-branco.png"
                  alt="Logo Cerebrado"
                  style="max-width: 150px;"
                />
              </v-row>
            </v-card>

            <v-card dark flat class="pa-11" color="transparent">
              <h1 class="title mb-3">Entrar em {{room_title}}</h1>
              <v-chip
                class="mr-2 mt-2 elevation-1"
                color="#4623c3"
                pill
              >
                <v-icon class="mr-2">mdi-atom</v-icon>
                {{get_room_category_name}}
              </v-chip>

              <v-chip
                class="mt-2 mr-2 elevation-1"
                color="#9f3131"
                pill
              >
                <v-icon class="mr-2">mdi-brain</v-icon>
                {{get_room_difficulty}}
              </v-chip>

              <v-chip
                class="mt-2 mr-2 elevation-1"
                color="#178961"
                pill
              >
                <v-icon class="mr-2">mdi-check</v-icon>
                {{get_room_type}}
              </v-chip>

              <div class="mt-5">
                <v-avatar @click="ModalSelectAvatar=true" class="float-left mr-3">
                  <v-img :src="`/img/avatar/${selected_avatar}`"></v-img>
                </v-avatar>
                <v-text-field v-model="login_username" class="mt-4" label="Apelido" outlined flat dark>
                </v-text-field>
              </div>

              <v-btn
                width="100%"
                :disabled="login_username.length < 3"
                outlined
                dark
                x-large
                @click="Login()"
              >Entrar <v-icon class="ml-3">mdi-arrow-right</v-icon>
              </v-btn>
            </v-card>
          </v-card>
        </v-row>

        <v-overlay :value="ModalSelectAvatar">
          <v-card class="pa-0" color="white" light max-width="320">
            <v-card-title class="ml-5" light>Escolha um avatar</v-card-title>
            <div class="pa-5 pl-8 avatars-scroll-box">
              <v-avatar class="mr-4 mt-4" v-for="(item, index) in get_avatars" :key="index" @click="SelectAvatar(item)">
                <v-img :src="`/img/avatar/${item}`"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-overlay>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
import config from '@/config'

export default {
  name: 'LoginComponent',
  computed: {
    get_room_category_name: function () {
      return this.categorys[this.room_category]
    },
    get_room_difficulty: function () {
      return this.difficults[this.room_difficulty]
    },
    get_room_type: function () {
      return this.types[this.room_type]
    },
    get_avatars: function () {
      return config.game.avatars
    }
  },
  data: () => ({
    ModalSelectAvatar: false,
    selected_avatar: '021-man.png',
    room_title: '',
    login_username: '',
    room_category: 9,
    room_difficulty: '',
    room_type: 'boolean',
    room_users_connected: 0,
    room_data: {},
    categorys: {
      9: 'Geral',
      27: 'Animais',
      25: 'Arte',
      10: 'Livros',
      11: 'Filmes',
      13: 'Músicais e Teatro',
      14: 'Televisão',
      15: 'Jogos',
      16: 'Jogos de tabuleiro',
      17: 'Ciência e Natureza',
      18: 'Computadores',
      19: 'Matemática',
      20: 'Mitologia',
      21: 'Esportes',
      22: 'Geografia',
      23: 'História',
      24: 'Política',
      26: 'Celebridades',
      28: 'Veículos',
      29: 'Quadrinhos',
      30: 'Gadgets',
      31: 'Animes e Mangás',
      32: 'Animações'
    },
    difficults: {
      medium: 'Normal',
      easy: 'Fácil',
      hard: 'Difícil'
    },
    types: {
      boolean: 'Verdadeiro/Falso',
      multiple: 'Múltiplas'
    }
  }),
  metaInfo () {
    return {
      title: `${this.room_data.room_title} - Desafiados`
    }
  },
  async created () {
    axios.get(`${config.api.base}room/${this.$route.params.code}`).then(r => {
      this.room_data = r.data.get_room
      this.room_title = r.data.get_room.room_title
      this.room_users_connected = r.data.get_room.users.length
      this.room_category = r.data.get_room.room_category
      this.room_difficulty = r.data.get_room.room_difficulty
      this.room_type = r.data.get_room.room_type
    }).catch(e => {
      this.$router.push('/')
    })
  },
  methods: {
    async Login () {
      try {
        const token = await axios.post(`${config.api.base}room/${this.$route.params.code}`, {
          avatar: this.selected_avatar,
          username: this.login_username
        })
        localStorage.setItem('login', JSON.stringify(token.data.login))

        this.$emit('OnLogin', true)
      } catch (e) {
        // statements
      }
    },
    SelectAvatar (a) {
      this.ModalSelectAvatar = false
      this.selected_avatar = a
    }
  }
}
</script>
<style>
  .avatars-scroll-box {
    max-height: 300px;
    overflow-y: auto;
}
</style>
