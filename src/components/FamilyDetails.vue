<template>
  <!-- 家族详情容器 -->
  <div v-if="family" class="box">
    <!-- 家族名称标题 -->
    <h2 class="title is-4">{{ family.name }} Family</h2>
    <div class="content">
      <!-- 家族成员列表 -->
      <h3 class="subtitle is-5">Members:</h3>
      <ul>
        <!-- 遍历显示每个家族成员 -->
        <li v-for="member in family.members" :key="member.id">
          <!-- 可点击的成员链接，点击后查看该成员详情 -->
          <a @click="selectCharacter(member)">
            {{ member.firstName }} {{ member.lastName }} ({{ member.age }}, {{ member.gender }})
          </a>
        </li>
      </ul>
    </div>
  </div>
  <!-- 未选择家族时的提示 -->
  <div v-else class="box">
    <p>Select a family to view details</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Family } from '../types/Family'
import { CharacterImpl } from '../types/Character'

/**
 * 家族详情组件
 * 展示单个家族的信息，包括：
 * - 家族名称
 * - 所有家族成员列表
 * - 成员的基本信息（姓名、年龄、性别）
 * - 允许点击查看成员详情
 */
export default defineComponent({
  name: 'FamilyDetails',
  props: {
    // 接收家族对象作为属性
    family: {
      type: Object as PropType<Family | null>,
      required: false,
      default: null
    }
  },
  // 定义组件可触发的事件
  emits: ['selectCharacter'],
  
  setup(_, { emit }) {  // 移除未使用的 props 参数
    /**
     * 处理成员选择事件
     * 当用户点击家族成员时，触发事件通知父组件
     * @param character 被选中的角色
     */
    const selectCharacter = (character: CharacterImpl) => {
      emit('selectCharacter', character)
    }

    return { selectCharacter }
  }
})
</script>