<template>
  <div v-if="character" class="box">
    <h2 class="title is-4">{{ character.firstName }} {{ character.lastName }}</h2>
    <div class="content">
      <p><strong>Age:</strong> {{ character.age }}</p>
      <p><strong>Gender:</strong> {{ character.gender }}</p>
      <p><strong>Birthday:</strong> {{ character.birthday }}</p>
      <p><strong>Marital Status:</strong> {{ character.isMarried ? 'Married' : 'Single' }}</p>
      <p v-if="character.spouse">
        <strong>Spouse:</strong> {{ character.spouse.firstName }} {{ character.spouse.lastName }}
      </p>
      <p><strong>Family:</strong> {{ character.family.name }}</p>
      <p><strong>Health:</strong> {{ character.physiology.health }}</p>
      <p><strong>Fertility:</strong> {{ character.physiology.fertility }}</p>
    </div>
  </div>
  <div v-else class="box">
    <p>Select a character to view details</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Character } from '../types/Character'

export default defineComponent({
  name: 'CharacterDetails',
  props: {
    character: {
      type: Object as PropType<Character | null>,
      required: false,
      default: null
    }
  }
})
</script>