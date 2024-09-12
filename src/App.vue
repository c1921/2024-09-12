<template>
  <div class="container">
    <GameTime class="mb-4" />
    <div class="columns">
      <div class="column is-one-third">
        <FamilyList 
          :families="gameStore.families"
          :selectedFamilyId="selectedFamily?.id"
          @addCharacter="gameStore.addCharacter"
          @selectFamily="selectFamily"
        />
      </div>
      <div class="column is-one-third">
        <FamilyDetails 
          :family="selectedFamily" 
          @selectCharacter="selectCharacter" 
        />
      </div>
      <div class="column is-one-third">
        <CharacterDetails :character="selectedCharacter" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import GameTime from './components/GameTime.vue'
import FamilyList from './components/FamilyList.vue'
import FamilyDetails from './components/FamilyDetails.vue'
import CharacterDetails from './components/CharacterDetails.vue'
import { useGameStore } from './stores/gameStore'
import { CharacterImpl } from './types/Character'
import { Family } from './types/Family'

export default defineComponent({
  name: 'App',
  components: {
    GameTime,
    FamilyList,
    FamilyDetails,
    CharacterDetails
  },
  setup() {
    const gameStore = useGameStore()
    const selectedFamily = ref<Family | null>(null)
    const selectedCharacter = ref<CharacterImpl | null>(null)

    function selectFamily(family: Family) {
      selectedFamily.value = family
      selectedCharacter.value = null
    }

    function selectCharacter(character: CharacterImpl) {
      selectedCharacter.value = character
    }

    return {
      gameStore,
      selectedFamily,
      selectedCharacter,
      selectFamily,
      selectCharacter
    }
  }
})
</script>

<style scoped>
.is-selected {
  background-color: #e8e8e8;
}
</style>