<template>
  <div>
    <!-- 家族列表表格 -->
    <table class="table is-fullwidth is-hoverable">
      <!-- 表头 -->
      <thead>
        <tr>
          <th>Family Name</th>
          <th>Members</th>
        </tr>
      </thead>
      <!-- 表格内容 -->
      <tbody>
        <!-- 遍历显示每个有存活成员的家族 -->
        <tr v-for="family in familiesWithLivingMembers" :key="family.id" 
            :class="{ 'is-selected': selectedFamilyId === family.id }"
            @click="$emit('selectFamily', family)"
            style="cursor: pointer;">
          <td>{{ family.name }}</td>
          <td>{{ getLivingMembersCount(family) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { Family } from '../types/Family'

/**
 * 家族列表组件
 * 展示所有家族的概览信息，包括：
 * - 家族名称
 * - 存活成员数量
 * - 支持选择和高亮显示
 */
export default defineComponent({
  name: 'FamilyList',
  props: {
    // 所有家族的数组
    families: {
      type: Array as PropType<Family[]>,
      required: true
    },
    // 当前选中的家族ID
    selectedFamilyId: {
      type: String,
      default: ''
    }
  },
  // 定义可触发的家族选择事件
  emits: ['selectFamily'],

  setup(props) {
    /**
     * 计算属性：过滤出有存活成员的家族
     * 用于显示在列表中的家族（不显示无存活成员的家族）
     */
    const familiesWithLivingMembers = computed(() => {
      return props.families.filter(family => getLivingMembersCount(family) > 0);
    });

    /**
     * 计算家族中存活成员的数量
     * @param family 要计算的家族
     * @returns 存活成员数量
     */
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
