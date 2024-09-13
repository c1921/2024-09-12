<template>
  <div class="box" style="height: 150px; overflow-y: auto;">
    <p v-for="(log, index) in logs" :key="index" class="mb-2">
      {{ log }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useGameStore } from '../stores/gameStore'

export default defineComponent({
  name: 'GameLog',
  setup() {
    const gameStore = useGameStore()
    return {
      logs: gameStore.logs
    }
  }
})
</script>