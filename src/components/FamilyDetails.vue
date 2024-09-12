<template>
  <div v-if="family" class="box">
    <h2 class="title is-4">{{ family.name }} Family</h2>
    <div class="content">
      <h3 class="subtitle is-5">Members:</h3>
      <ul>
        <li v-for="member in family.members" :key="member.id">
          <a @click="selectCharacter(member)">
            {{ member.firstName }} {{ member.lastName }} ({{ member.age }}, {{ member.gender }})
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div v-else class="box">
    <p>Select a family to view details</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Family } from '../types/Family'
import { CharacterImpl } from '../types/Character'

export default defineComponent({
  name: 'FamilyDetails',
  props: {
    family: {
      type: Object as PropType<Family | null>,
      required: false,
      default: null
    }
  },
  emits: ['selectCharacter'],
  setup(_, { emit }) {  // 移除未使用的 props 参数
    const selectCharacter = (character: CharacterImpl) => {
      emit('selectCharacter', character)
    }

    return { selectCharacter }
  }
})
</script>