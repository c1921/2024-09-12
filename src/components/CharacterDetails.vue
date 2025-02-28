<template>
  <!-- 角色详情容器 -->
  <div v-if="character" class="box">
    <!-- 角色姓名标题 -->
    <h2 class="title is-4">{{ character.firstName }} {{ character.lastName }}</h2>
    <div class="content">
      <!-- 基本信息区域 -->
      <p><strong>Age: </strong>{{ character.age }}</p>
      <p><strong>Gender: </strong>{{ character.gender }}</p>
      <p><strong>Birthday: </strong>{{ character.birthday }}</p>

      <!-- 婚姻状态区域 -->
      <p>
        <strong>Marital Status: </strong>
        {{ character.isMarried ? 'Married' : character.age >= CONFIG.MINIMUM_MARRIAGE_AGE ? 'Single' : 'Too young to marry' }}
      </p>
      <!-- 配偶信息（如果已婚） -->
      <p v-if="character.spouse">
        <strong>Spouse: </strong>{{ character.spouse.firstName }} {{ character.spouse.lastName }}
      </p>

      <!-- 家族和生理属性区域 -->
      <p><strong>Family: </strong>{{ character.family.name }}</p>
      <p><strong>Health: </strong>{{ character.physiology.health }}</p>
      <p><strong>Fertility: </strong>{{ character.physiology.fertility }}</p>

      <!-- 状态信息区域 -->
      <p>
        <strong>Status: </strong>
        <span v-if="character.status.length > 0">
          {{ character.status.join(', ') }}
          <!-- 怀孕倒计时（如果适用） -->
          <span v-if="character.pregnancyCountdown !== null">
            ({{ character.pregnancyCountdown }} days until birth)
          </span>
        </span>
        <span v-else>None</span>
      </p>

      <!-- 家庭关系区域 -->
      <!-- 父亲信息 -->
      <p>
        <strong>Father: </strong>
        <span v-if="character.father">{{ character.father.firstName }} {{ character.father.lastName }}</span>
        <span v-else>Unknown</span>
      </p>
      <!-- 母亲信息 -->
      <p>
        <strong>Mother: </strong>
        <span v-if="character.mother">{{ character.mother.firstName }} {{ character.mother.lastName }}</span>
        <span v-else>Unknown</span>
      </p>
      <!-- 兄弟姐妹列表 -->
      <p>
        <strong>Siblings: </strong>
        <span v-if="character.siblings.length > 0">
          {{ character.siblings.map(sibling => `${sibling.firstName} ${sibling.lastName}`).join(', ') }}
        </span>
        <span v-else>None</span>
      </p>
      <!-- 子女列表 -->
      <p>
        <strong>Children: </strong>
        <span v-if="character.children.length > 0">
          {{ character.children.map(child => `${child.firstName} ${child.lastName}`).join(', ') }}
        </span>
        <span v-else>None</span>
      </p>

      <!-- 生死状态 -->
      <p><strong>Status: </strong>{{ character.isDead ? 'Deceased' : 'Alive' }}</p>
    </div>
  </div>
  <!-- 未选择角色时的提示 -->
  <div v-else class="box">
    <p>Select a character to view details</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Character } from '../types/Character'
import { CONFIG } from '../config'

/**
 * 角色详情组件
 * 展示单个角色的所有相关信息，包括：
 * - 基本信息（姓名、年龄、性别等）
 * - 婚姻状态
 * - 家族关系
 * - 生理属性
 * - 当前状态
 * - 家庭成员关系
 */
export default defineComponent({
  name: 'CharacterDetails',
  props: {
    // 接收角色对象作为属性
    character: {
      type: Object as PropType<Character | null>,
      required: false,
      default: null
    }
  },
  setup() {
    // 导出配置以供模板使用（主要用于婚姻年龄判断）
    return { CONFIG }
  }
})
</script>