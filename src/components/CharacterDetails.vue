<template>
  <div v-if="character" class="box">
    <h2 class="title is-4">{{ character.firstName }} {{ character.lastName }}</h2>
    <div class="content">
      <p><strong>Age: </strong>{{ character.age }}</p>
      <p><strong>Gender: </strong>{{ character.gender }}</p>
      <p><strong>Birthday: </strong>{{ character.birthday }}</p>
      <p><strong>Marital Status: </strong>{{ character.isMarried ? 'Married' : 'Single' }}</p>
      <p v-if="character.spouse">
        <strong>Spouse: </strong>{{ character.spouse.firstName }} {{ character.spouse.lastName }}
      </p>
      <p><strong>Family: </strong>{{ character.family.name }}</p>
      <p><strong>Health: </strong>{{ character.physiology.health }}</p>
      <p><strong>Fertility: </strong>{{ character.physiology.fertility }}</p>
      <p>
        <strong>Status: </strong>
        <span v-if="character.status.length > 0">
          {{ character.status.join(', ') }}
          <span v-if="character.pregnancyCountdown !== null">
            ({{ character.pregnancyCountdown }} days until birth)
          </span>
        </span>
        <span v-else>None</span>
      </p>
      <p>
        <strong>Father: </strong>
        <span v-if="character.father">{{ character.father.firstName }} {{ character.father.lastName }}</span>
        <span v-else>Unknown</span>
      </p>
      <p>
        <strong>Mother: </strong>
        <span v-if="character.mother">{{ character.mother.firstName }} {{ character.mother.lastName }}</span>
        <span v-else>Unknown</span>
      </p>
      <p>
        <strong>Siblings: </strong>
        <span v-if="character.siblings.length > 0">
          {{ character.siblings.map(sibling => `${sibling.firstName} ${sibling.lastName}`).join(', ') }}
        </span>
        <span v-else>None</span>
      </p>
      <p>
        <strong>Children: </strong>
        <span v-if="character.children.length > 0">
          {{ character.children.map(child => `${child.firstName} ${child.lastName}`).join(', ') }}
        </span>
        <span v-else>None</span>
      </p>
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