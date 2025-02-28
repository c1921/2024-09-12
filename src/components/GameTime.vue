<template>
  <div class="box">
    <!-- 显示当前游戏日期 -->
    <p class="subtitle is-5">{{ gameStore.formattedDate }}</p>
    <!-- 游戏暂停/继续按钮 -->
    <button 
      class="button" 
      :class="{ 'is-danger': gameStore.isPaused }"
      @click="gameStore.togglePause"
    >
      {{ gameStore.isPaused ? 'Continue' : 'Pause' }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { CONFIG } from '../config'

/**
 * 游戏时间控制组件
 * 功能：
 * - 显示当前游戏日期
 * - 控制游戏时间的暂停/继续
 * - 自动推进游戏时间
 */
export default defineComponent({
  name: 'GameTime',
  setup() {
    const gameStore = useGameStore()
    let intervalId: number | null = null

    /**
     * 启动时间计时器
     * 按照配置的时间间隔推进游戏日期
     */
    const startTimer = () => {
      intervalId = setInterval(() => {
        gameStore.advanceDay()
      }, CONFIG.DAY_DURATION_MS)
    }

    /**
     * 停止时间计时器
     * 在组件卸载时清理定时器
     */
    const stopTimer = () => {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    // 组件挂载时启动计时器
    onMounted(() => {
      startTimer()
    })

    // 组件卸载时停止计时器
    onUnmounted(() => {
      stopTimer()
    })

    return {
      gameStore
    }
  }
})
</script>