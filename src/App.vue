<template>
  <div class="container">
    <GameTime class="mb-4" />
    <GameLog class="mb-4" />
    <div class="columns">
      <div class="column is-one-third">
        <FamilyList 
          :families="gameStore.families"
          :selectedFamilyId="selectedFamily?.id"
          @addCharacter="gameStore.addCharacter"
          @selectFamily="selectFamily"
        />
      </div>
      <div class="column is-two-thirds">
        <FamilyDetails 
          :family="selectedFamily" 
          @selectCharacter="selectCharacter" 
        />
        <CharacterDetails 
          :character="selectedCharacter" 
          class="mt-4"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import GameTime from './components/GameTime.vue'
import GameLog from './components/GameLog.vue'
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
    GameLog,
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