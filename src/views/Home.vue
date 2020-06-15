<template>
  <v-app>
    <v-content class="base-main-color" style="background: #341845;">
      <v-container
        class="fill-height"
      >
        <v-row
          justify="center"
          align="center"
        >
          <v-card flat color="transparent">
            <v-card flat max-width="500" color="transparent">
              <img
                class="mx-auto pl-10 pr-10"
                src="@/assets/desafiados-logo-banner.png"
                alt="Logo Cerebrado"
                style="width: 100%; max-width: 500px;"
              />

              <h1 class="pa-9 title text-center white--text">
              Teste seus conhecimentos junto com seus amigos, em tempo real! O Desafiados possui 3 dificuldades, 23 categorias e 2 modos de resposta.
              </h1>
            </v-card>

            <v-card class="mt-8 text-center" flat color="transparent">
              <div>
                <v-btn dark x-large outlined @click="OverlayCreateRoom=true">CRIAR UMA SALA</v-btn>
              </div>
              <div class="mt-5">
                <v-btn dark x-large outlined>ENTRAR EM UMA SALA</v-btn>
              </div>
            </v-card>
          </v-card>
        </v-row>

        <v-overlay color="#341845" opacity="1" :value="OverlayCreateRoom">
          <v-row style="width: 300px" justify="center" align="center">
            <v-card v-if="CreateRoomStep===1" max-width="300" width="100%" flat color="transparent">
              <v-card-subtitle>
                <v-text-field v-model="roomTitle" outlined dark label="Qual será o titulo da sala?"></v-text-field>
                <v-text-field v-model="username" outlined dark label="Como você será chamado?"></v-text-field>
              </v-card-subtitle>
              <v-card-actions>
                <v-btn :disabled="!StepOneOk" text @click="CreateRoomStep=2">Continuar</v-btn>
                <v-btn text @click="CloseOverlay()">Cancelar</v-btn>
              </v-card-actions>
            </v-card>

            <v-card v-if="CreateRoomStep===2 && CreatingRoom===false" max-width="300" width="100%" flat color="transparent">
              <v-card-subtitle>
                <v-select
                  v-model="roomCategory"
                  :items="categorys"
                  label="Categoria"
                  dark
                  outlined
                ></v-select>
                <v-select
                  v-model="roomDifficulty"
                  :items="difficultys"
                  label="Dificuldade"
                  item-value="value"
                  item-text="text"
                  dark
                  outlined
                ></v-select>
                <v-select
                  item-value="value"
                  item-text="text"
                  v-model="roomMode"
                  :items="modes"
                  label="Modo"
                  dark
                  outlined
                ></v-select>
                <v-select
                  v-model="roomQuestion"
                  :items="questions"
                  outlined
                  label="Perguntas totais"
                  dark
                ></v-select>
                <v-switch
                  v-model="privateRoom"
                  color="white"
                  label="Sala privada?"
                ></v-switch>
              </v-card-subtitle>

              <v-card-actions>
                <v-btn :disabled="!StepTwoOk" text @click="CreateRoom()">Continuar</v-btn>
                <v-btn text @click="CloseOverlay()">Cancelar</v-btn>
              </v-card-actions>
            </v-card>
            <v-row align="center" justify="center">
              <v-img v-if="CreatingRoom===true" src="@/assets/loading.svg" max-width="50px"></v-img>
            </v-row>
          </v-row>
        </v-overlay>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios'
import config from '@/config'

export default {
  name: 'Home',
  data: () => ({
    OverlayCreateRoom: false,
    CreateRoomStep: 1,
    roomQuestion: 20,
    roomCategory: null,
    roomDifficulty: null,
    roomMode: null,
    username: '',
    roomTitle: '',
    CreatingRoom: false,
    privateRoom: false,
    categorys: [
      { text: 'Geral', value: 9 },
      { text: 'Animais', value: 27 },
      { text: 'Arte', value: 25 },
      { text: 'Entretenimento: Livros', value: 10 },
      { text: 'Entretenimento: Filmes', value: 11 },
      { text: 'Entretenimento: Músicais e Teatro', value: 13 },
      { text: 'Entretenimento: Televisão', value: 14 },
      { text: 'Entretenimento: Jogos', value: 15 },
      { text: 'Entretenimento: Jogos de tabuleiro', value: 16 },
      { text: 'Ciência e Natureza', value: 17 },
      { text: 'Computadores', value: 18 },
      { text: 'Matemática', value: 19 },
      { text: 'Mitologia', value: 20 },
      { text: 'Esportes', value: 21 },
      { text: 'Geografia', value: 22 },
      { text: 'História', value: 23 },
      { text: 'Política', value: 24 },
      { text: 'Arte', value: 25 },
      { text: 'Celebridades', value: 26 },
      { text: 'Veículos', value: 28 },
      { text: 'Quadrinhos', value: 29 },
      { text: 'Gadgets', value: 30 },
      { text: 'Animes e Mangás', value: 31 },
      { text: 'Animações', value: 32 }
    ],
    questions: [10, 20, 30, 40, 50],
    difficultys: [
      { text: 'Fácil', value: 'easy' },
      { text: 'Normal', value: 'medium' },
      { text: 'Difícil', value: 'hard' }
    ],
    modes: [
      { text: 'Verdadeiro e Falso', value: 'boolean' },
      { text: 'Múltiplas Opções', value: 'multiple' }
    ]
  }),
  computed: {
    StepOneOk: function () {
      if (this.roomTitle.length > 2 && this.username.length > 2) {
        return true
      } else {
        return false
      }
    },
    StepTwoOk: function () {
      if (this.roomCategory !== null && this.roomMode !== null && this.roomDifficulty !== null) {
        return true
      } else {
        return false
      }
    }
  },
  async created () {
    try {
      await axios.get(`${config.api.base}room`)
      // console.log(rooms)
    } catch (e) {
      // statements
      // console.log(e)
    }
  },
  mounted () {
    // console.log(this.selected_mode)
  },
  methods: {
    CloseOverlay () {
      this.OverlayCreateRoom = false
      this.CreateRoomStep = 1
    },
    async CreateRoom () {
      this.CreatingRoom = true

      try {
        const create = await axios.post(`${config.api.base}room`, {
          difficulty: this.roomDifficulty,
          type: this.roomMode,
          avatar: '021-man.png',
          category: this.roomCategory,
          goal: this.roomQuestion,
          room_title: this.roomTitle,
          room_username: this.username,
          is_private: this.privateRoom
        })

        localStorage.setItem('login', JSON.stringify(create.data.login))

        this.$router.push(`room/${create.data.room_code}`)
      } catch (e) {
        // statements
        // console.log(e)
      }
    }
  }
}
</script>

<style>
</style>
