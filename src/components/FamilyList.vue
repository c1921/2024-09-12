<template>
  <div>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <th>Family Name</th>
          <th>Living Members</th>
          <th>Total Members</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="family in familiesWithLivingMembers" :key="family.id" 
            :class="{ 'is-selected': selectedFamilyId === family.id }"
            @click="$emit('selectFamily', family)"
            style="cursor: pointer;">
          <td>{{ family.name }} (ID: {{ family.id.slice(0, 4) }})</td>
          <td>{{ getLivingMembersCount(family) }}</td>
          <td>{{ family.members.length }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
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
  emits: ['selectFamily'],
  setup(props) {
    const familiesWithLivingMembers = computed(() => {
      return props.families.filter(family => getLivingMembersCount(family) > 0);
    });

    function getLivingMembersCount(family: Family): number {
      return family.members.filter(member => !member.isDead).length;
    }

    return {
      familiesWithLivingMembers,
      getLivingMembersCount
    }
  }
})
</script>
