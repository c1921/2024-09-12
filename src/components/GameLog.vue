<template>
  <!-- 游戏日志容器，固定高度，可滚动 -->
  <div class="box" style="height: 150px; overflow-y: auto;">
    <!-- 遍历显示所有日志条目 -->
    <p v-for="(log, index) in logs" :key="index" class="mb-2">
      {{ log }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useGameStore } from '../stores/gameStore'

/**
 * 游戏日志组件
 * 展示游戏中的重要事件记录，包括：
 * - 角色出生
 * - 婚姻关系
 * - 死亡事件
 * - 其他重要状态变化
 */
export default defineComponent({
  name: 'GameLog',
  setup() {
    // 获取游戏状态管理器
    const gameStore = useGameStore()
    
    // 返回日志数组供模板使用
    return {
      logs: gameStore.logs
    }
  }
})
</script>