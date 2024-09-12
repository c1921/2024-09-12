<template>
  <div class="container">
    <GameTime class="mb-4" />
    <div class="buttons mb-4">
      <button class="button is-primary" @click="gameStore.addCharacter">Add Random Character</button>
    </div>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Birthday</th>
          <th>Marital Status</th>
          <th>Spouse</th>
          <th>Family</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="character in gameStore.characters" :key="character.id">
          <td>{{ character.firstName }}</td>
          <td>{{ character.lastName }}</td>
          <td>{{ character.age }}</td>
          <td>{{ character.gender }}</td>
          <td>{{ character.birthday }}</td>
          <td>{{ character.isMarried ? 'Married' : 'Single' }}</td>
          <td>{{ character.spouse ? `${character.spouse.firstName} ${character.spouse.lastName}` : '-' }}</td>
          <td>{{ character.family.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GameTime from './components/GameTime.vue'
import { useGameStore } from './stores/gameStore'

export default defineComponent({
  name: 'App',
  components: {
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