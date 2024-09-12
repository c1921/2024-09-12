<template>
  <div class="box">
    <h3 class="title is-4">{{ character.name }}</h3>
    <div class="content">
      <p>Age: {{ character.age }}</p>
      <p>Gender: {{ character.gender }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Character } from '../types/Character';

export default defineComponent({
  name: 'CharacterCard',
  props: {
    character: {
      type: Object as PropType<Character>,
      required: true,
    },
  },
});
</script>