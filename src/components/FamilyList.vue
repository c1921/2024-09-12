<template>
  <div>
    <div class="buttons mb-4">
      <button class="button is-primary" @click="$emit('addCharacter')">Add Random Character</button>
    </div>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <th>Family Name</th>
          <th>Members</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="family in families" :key="family.id" 
            :class="{ 'is-selected': selectedFamilyId === family.id }"
            @click="$emit('selectFamily', family)"
            style="cursor: pointer;">
          <td>{{ family.name }} (ID: {{ family.id.slice(0, 4) }})</td>
          <td>{{ family.members.length }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Family } from '../types/Family'

export default defineComponent({
  name: 'FamilyList',
  props: {
    families: {
      type: Array as PropType<Family[]>,
      required: true
    },
    selectedFamilyId: {
      type: String,
      default: ''
    }
  },
  emits: ['addCharacter', 'selectFamily']
})
</script>
