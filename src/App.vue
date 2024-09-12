<template>
  <div class="container">
    <GameTime class="mb-4" />
    <div class="buttons mb-4">
      <button class="button is-primary" @click="gameStore.addCharacter">Add Random Character</button>
    </div>
    <div class="columns is-multiline">
      <div class="column is-one-third" v-for="character in gameStore.characters" :key="character.id">
        <CharacterCard :character="character" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CharacterCard from './components/CharacterCard.vue'
import GameTime from './components/GameTime.vue'
import { useGameStore } from './stores/gameStore'

export default defineComponent({
  name: 'App',
  components: {
    CharacterCard,
    GameTime,
  },
  setup() {
    const gameStore = useGameStore()

    return {
      gameStore
    }
  }
})
</script>