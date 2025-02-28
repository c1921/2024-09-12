<template>
  <!-- 主容器 -->
  <div class="container">
    <!-- 游戏时间控制区域 -->
    <GameTime class="mb-4" />
    
    <!-- 游戏日志显示区域 -->
    <GameLog class="mb-4" />
    
    <!-- 主要内容区域：使用列布局 -->
    <div class="columns">
      <!-- 左侧列：家族列表（占据1/3宽度） -->
      <div class="column is-one-third">
        <FamilyList 
          :families="gameStore.families"
          :selectedFamilyId="selectedFamily?.id"
          @addCharacter="gameStore.addCharacter"
          @selectFamily="selectFamily"
        />
      </div>
      
      <!-- 右侧列：家族和角色详情（占据2/3宽度） -->
      <div class="column is-two-thirds">
        <!-- 选中家族的详细信息 -->
        <FamilyDetails 
          :family="selectedFamily" 
          @selectCharacter="selectCharacter" 
        />
        <!-- 选中角色的详细信息 -->
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

/**
 * 应用程序根组件
 * 负责：
 * 1. 整体布局管理
 * 2. 组件间的状态协调
 * 3. 用户交互的处理
 */
export default defineComponent({
  name: 'App',
  
  // 注册子组件
  components: {
    GameTime,        // 游戏时间控制
    GameLog,         // 游戏日志显示
    FamilyList,      // 家族列表
    FamilyDetails,   // 家族详情
    CharacterDetails // 角色详情
  },

  setup() {
    // 获取游戏状态管理器
    const gameStore = useGameStore()
    
    // 当前选中的家族和角色
    const selectedFamily = ref<Family | null>(null)
    const selectedCharacter = ref<CharacterImpl | null>(null)

    /**
     * 处理家族选择
     * 1. 更新选中的家族
     * 2. 清空选中的角色
     * @param family 被选中的家族
     */
    function selectFamily(family: Family) {
      selectedFamily.value = family
      selectedCharacter.value = null
    }

    /**
     * 处理角色选择
     * 更新选中的角色
     * @param character 被选中的角色
     */
    function selectCharacter(character: CharacterImpl) {
      selectedCharacter.value = character
    }

    // 导出需要的状态和方法
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