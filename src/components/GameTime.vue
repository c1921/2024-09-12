<template>
  <div class="box">
    <p class="subtitle is-5">{{ gameStore.formattedDate }}</p>
    <button 
      class="button" 
      :class="{ 'is-danger': gameStore.isPaused }"
      @click="gameStore.togglePause"
    >
      {{ gameStore.isPaused ? 'Continue' : 'Pause' }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore'

export default defineComponent({
  name: 'GameTime',
  setup() {
    const gameStore = useGameStore()
    let intervalId: number | null = null

    const startTimer = () => {
      intervalId = setInterval(() => {
        gameStore.advanceDay()
      }, 1000)
    }

    const stopTimer = () => {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    onMounted(() => {
      startTimer()
    })

    onUnmounted(() => {
      stopTimer()
    })

    return {
      gameStore
    }
  }
})
</script>