<template>
  <v-app>
    <v-navigation-drawer class="elevation-2" app v-model="navbar">
      <v-card flat>
        <v-card-title class="mb-2">
          {{room.room_title}}
        </v-card-title>
        <v-card-subtitle>
          <v-chip class="mr-2 mt-2" color="#4623c3" dark pill>
            <v-icon class="mr-2">mdi-atom</v-icon>
            {{get_room_category_name}}
          </v-chip>

          <v-chip class="mt-2 mr-2" dark color="#9f3131" pill>
            <v-icon class="mr-2">mdi-brain</v-icon>
            {{get_room_difficulty}}
          </v-chip>

          <v-chip class="mt-2" dark color="#178961" pill>
            <v-icon class="mr-2">mdi-check</v-icon>
            {{get_room_type}}
          </v-chip>
        </v-card-subtitle>
      </v-card>
      <v-list>
        <v-list-item v-for="user in room.users" :key="user._id">
          <v-list-item-avatar>
            <v-img :src="`/img/avatar/${user.avatar}`"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="user.username"></v-list-item-title>
            <v-list-item-subtitle>{{user.points}} pontos</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-3">
          <v-btn color="#1677f2" depressed block dark class="pa-6"><v-icon class="mr-2">mdi-facebook</v-icon> Compartilhar</v-btn>
          <v-btn color="#00acee" depressed block dark class="mt-2 pa-6"><v-icon class="mr-2">mdi-twitter</v-icon>Compartilhar</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-progress-linear
      :value="question_time_value"
      color="#2d1e53">
    </v-progress-linear>

    <v-app-bar color="transparent" flat app absolute class="">
      <v-app-bar-nav-icon @click.stop="navbar = !navbar" color="white"/>
      <v-spacer />
      <v-toolbar-title class="pt-3"><v-img max-width="70" src="@/assets/desafiados-icone-branco.png"></v-img></v-toolbar-title>
      <v-spacer />
    </v-app-bar>

    <v-content class="base-main-color" style="background: #2d1e53">
      <v-container class="fill-height">
        <div class="game-container">
          <v-row class="fill-height" justify="center" align="center">
            <v-icon size="90" color="#00ffa0" v-if="round.correct">mdi-check-outline</v-icon>
            <v-icon v-if="round.wrong" size="90" color="#ff4d66">mdi-close-outline</v-icon>
            <v-card v-if="round.render" max-width="500" class="text-center ml-5 mr-5 mt-10" dark flat color="transparent">
              <div class="headline mb-5">
                <h1 class="headline" v-html="`${round.code} - ${round.question}`"></h1>
              </div>
              <div>
                <v-btn
                  v-for="(item, index) in round.answers"
                  :key="index"
                  color="white"
                  light
                  large
                  class="mt-4 mr-4"
                  width="100%"
                  @click="ReplyRoundQuestion(item)">{{item}}</v-btn>
              </div>
            </v-card>
            <v-progress-circular
              v-if="countdown"
              size="150"
              width="20"
              :value="countdown_value"
              color="white"
            ><h1>{{countdown_text_value}}</h1></v-progress-circular>

            <v-btn v-if="render_start_button" x-large @click="StartRoom()">Começar</v-btn>
            <h1 class="pl-5 pr-5 headline text-center white--text font-weight-bold" v-if="render_waiting_text">AGUARDANDO ADMINISTRADOR...</h1>
          </v-row>
        </div>

        <div class="mt-10 chat-global-container">
          <div class="chat-scroll" ref="chat">
            <v-list>
              <v-list-item v-for="(item, index) in roomMessages" :key="index">
                <v-list-item-avatar>
                  <v-img :src="item.avatar"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.from"></v-list-item-title>
                  <v-list-item-subtitle style="white-space: unset !important" v-text="item.message"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>

          <div class="chat-text-field">
            <v-text-field v-model="messageTextfield" color="transparent" flat solo label="Digite algo aqui">
              <template slot="append">
                <v-icon @click="SendMessage()" color="#9525b6">mdi-send</v-icon>
              </template>
            </v-text-field>
          </div>
        </div>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Ws from '@adonisjs/websocket-client'
import '@babel/polyfill'
import config from '@/config'
import { mapActions } from 'vuex'

export default {
  name: 'RoomComponent',
  data: () => ({
    question_time_value: 0,
    countdown_value: 0,
    countdown: false,
    round: {
      render: false,
      question: '',
      answers: [],
      code: 0,
      correct: false,
      wrong: false
    },
    countdown_text_value: 0,
    navbar: true,
    processor: null,
    socket: null,
    processorChannel: null,
    messageTextfield: ''
  }),
  watch: {
    question_time_value (newValue, oldValue) {
      // console.log('mudou')
      if (this.question_time_value > 0) {
        setTimeout(() => {
          this.question_time_value = this.question_time_value - 10
        }, 1000)
      }
    },
    countdown_value (newValue, oldValue) {
      if (this.countdown_value !== 0) {
        setTimeout(() => {
          this.countdown_value = this.countdown_value - 10
          this.countdown_text_value = this.countdown_text_value - 1
        }, 1000)
      } else {
        this.countdown = false
      }
    },
    roomMessages (newMessages, oldMessages) {
      this.$nextTick(() => {
        const chat = this.$refs.chat
        chat.scrollTo(chat.scrollHeight, chat.scrollHeight)
      })
    }
  },
  computed: {
    room: function () {
      return this.$store.state.room.roomData
    },
    roomMessages: function () {
      return this.$store.state.room.RoomMessages
    },
    get_room_category_name: function () {
      return config.game.categorys[this.room.room_category]
    },
    get_room_difficulty: function () {
      return config.game.difficults[this.room.room_difficulty]
    },
    get_room_type: function () {
      return config.game.types[this.room.room_type]
    },
    render_start_button: function () {
      if (this.room.me.is_admin && !this.room.room_started) {
        return true
      } else {
        return false
      }
    },
    render_waiting_text: function () {
      if (!this.room.me.is_admin && !this.room.room_started) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.processorChannel = `processor:${this.room.room_channel}`

    const ws = Ws(config.socket.base)
    ws.withJwtToken(JSON.parse(localStorage.getItem('login')).token).connect()

    ws.on('open', () => {
      const processor = ws.subscribe(this.processorChannel)

      ws.getSubscription(this.processorChannel).emit('message', {
        subEvent: 'user:new'
      })

      // console.log(ws)

      processor.on('user:disconnected', (users) => {
        for (let i = 0; i < users.length; i++) {
          this.RemoveUser(users[i])
        }
      })

      processor.on('user:new', (user) => {
        this.ActionAddNewMessage({
          avatar: `${config.client.url}img/avatar/robot.png`,
          from: 'Sistema',
          sound: 'new.ogg',
          message: `${user.username} entrou na sala.`
        })

        this.newUserProcess(user)
      })

      processor.on('room:started', (a) => {
        this.RoomStarted()
      })

      processor.on('message:new', (message) => {
        this.ActionAddNewMessage({
          avatar: `/img/avatar/${message.avatar}`,
          from: message.from,
          message: message.text
        })
      })

      processor.on('room:question', (message) => {
        this.RoomNewQuestion(message)
      })

      processor.on('room:correct', (message) => {
        this.NewCorrectAnswer(message)
      })

      processor.on('room:me:correct', (message) => {
        this.round.correct = true
      })

      processor.on('room:me:wrong', (message) => {
        this.round.wrong = true

        this.ActionAddNewMessage({
          avatar: `${config.client.url}img/avatar/robot.png`,
          from: 'Sistema',
          sound: 'wrong.mp3',
          message: `Desculpe ${this.room.me.username}, essa não é a resposta correta.`
        })
      })

      processor.on('message', (message) => {
        if (message.type === 'new_user') {
          this.newUserProcess(message)
        }
      })

      this.processor = processor
    })

    this.socket = ws
  },
  mounted () {
    this.ActionAddNewMessage({
      avatar: `${config.client.url}img/avatar/robot.png`,
      from: 'Sistema',
      sound: 'new.ogg',
      message: `Oi ${this.room.me.username}. As mensagens da sala não são armazenadas em nosso servidor.`
    })

    this.$nextTick(() => {
      const chat = this.$refs.chat
      chat.scrollTop = chat.scrollHeight
    })
  },
  methods: {
    ...mapActions('room', ['ActionAddNewUser']),
    ...mapActions('room', ['ActionRemoveUser']),
    ...mapActions('room', ['ActionAddNewMessage']),
    ...mapActions('room', ['ActionUserExists']),
    ...mapActions('room', ['ActionUpdateUser']),
    ...mapActions('room', ['ActionUpdateAdminData']),
    ...mapActions('room', ['ActionUpdateRoomXData']),
    newUserProcess (user) {
      this.ActionAddNewUser(user)
    },
    SendMessage () {
      if (this.messageTextfield.length > 0) {
        this.socket.getSubscription(this.processorChannel).emit('message', {
          subEvent: 'message:new',
          text: this.messageTextfield
        })
      }
    },
    async RemoveUser (data) {
      try {
        // 1. Verificar se o usuário desconectado está no state
        // 2. Verificar se foi designado um novo admin
        // Se sim, primeiro verificar se o novo admin está no state

        // Verifica se o usuário existe
        const CheckUserExists = await this.ActionUserExists({
          where: {
            id: data.user
          }
        })

        if (!data.new_admin) {
          this.ActionRemoveUser(CheckUserExists.index)
        } else {
          const CheckNewAdminExists = await this.ActionUserExists({
            where: {
              id: data.new_admin_id
            }
          })

          await this.ActionUpdateUser({
            user_index: CheckNewAdminExists.index,
            update: [
              { key: 'is_admin', value: true }
            ]
          })

          this.ActionRemoveUser(CheckUserExists.index)

          if (data.new_admin_id === this.room.me._id) {
            this.ActionUpdateAdminData({ key: 'is_admin', value: true })
          }

          this.ActionAddNewMessage({
            avatar: `${config.client.url}img/avatar/robot.png`,
            sound: 'new.ogg',
            from: 'Sistema',
            message: `${CheckNewAdminExists.user_data.username} agora é o administrador da sala.`
          })
        }

        this.ActionAddNewMessage({
          avatar: `${config.client.url}img/avatar/robot.png`,
          sound: 'new.ogg',
          from: 'Sistema',
          message: `${CheckUserExists.user_data.username} saiu da sala.`
        })
      } catch (e) {
        this.ActionAddNewMessage({
          avatar: `${config.client.url}img/avatar/robot.png`,
          sound: 'new.ogg',
          from: 'Sistema',
          message: 'Ocorreu um erro ao definir um novo administrador ou ao remover um usuário.'
        })
      }
    },
    async NewCorrectAnswer (m) {
      try {
        const user = await this.ActionUserExists({
          where: {
            id: m.id
          }
        })

        await this.ActionUpdateUser({
          user_index: user.index,
          update: [
            { key: 'points', value: user.user_data.points + m.inc }
          ]
        })

        this.ActionAddNewMessage({
          avatar: `${config.client.url}img/avatar/robot.png`,
          sound: 'correct.wav',
          from: 'Sistema',
          message: `${user.user_data.username} acertou a resposta!`
        })
      } catch (e) {
        // statements
        // console.log(e)
      }
    },
    RoomNewQuestion (m) {
      this.round.wrong = false
      this.round.correct = false
      this.question_time_value = 150
      this.round.question = m.question
      this.round.answers = m.answers
      this.round.code = m.round
      this.round.render = true
    },
    async StartRoom () {
      this.socket.getSubscription(this.processorChannel).emit('message', {
        subEvent: 'room:start'
      })
    },
    async RoomStarted () {
      this.ActionUpdateRoomXData({ key: 'room_started', value: true })
      new Audio('/sound/start_1.wav').play()
      this.StartCountdown(10)
    },
    ReplyRoundQuestion (r) {
      this.round.render = false
      this.socket.getSubscription(this.processorChannel).emit('message', {
        subEvent: 'room:reply',
        reply: r,
        round: this.round.code
      })
    },
    StartCountdown (to) {
      this.ActionAddNewMessage({
        avatar: `${config.client.url}img/avatar/robot.png`,
        sound: 'new.ogg',
        from: 'Sistema',
        message: 'O jogo será iniciado em 10 segundos.'
      })

      this.countdown = true
      this.countdown_value = 100
      this.countdown_text_value = to
    }
  }
}
</script>

<style>
.game-container {
  width: 100%;
  height: calc(100% - 333px);
}

.chat-global-container {
  width: 100%;
  padding: 10px;
  max-height: 293px;
  overflow: hidden;
}

.chat-scroll {
  word-break: break-all;
  overflow-y: auto;
  border-radius: 5px;
  background: #FFF;
  min-height: 222px;
  max-height: 222px;
}
.chat-text-field {
  margin-top: 13px;
}
::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #ffffff;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}
::-webkit-scrollbar-thumb:active {
  background: #828282;
}
::-webkit-scrollbar-track {
  background: #969696;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-track:hover {
  background: #666666;
}
::-webkit-scrollbar-track:active {
  background: #333333;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
