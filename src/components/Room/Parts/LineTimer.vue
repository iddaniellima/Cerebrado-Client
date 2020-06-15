<template>
  <v-progress-linear
    :value="value"
    color="#2d1e53"
  >
  </v-progress-linear>
</template>

<script>
export default {
  name: 'LineTimer',
  props: {
    max: Number,
    start: Boolean
  },
  data () {
    return {
      value: this.max
    }
  },
  watch: {
    value: {
      handler (value) {
        if (this.start) {
          setTimeout(() => {
            if (this.value - 10 === 0) {
              this.start = false
              this.value = this.max
            } else {
              this.value = this.value - 10
            }
          }, 1000)
        }
      },

      immediate: true
    }
  }
}
</script>
