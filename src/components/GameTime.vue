<template>
  <div class="box">
    <p class="subtitle is-5">{{ formattedDate }}</p>
    <button 
      class="button" 
      :class="{ 'is-danger': isPaused }"
      @click="togglePause"
    >
      {{ isPaused ? 'Continue' : 'Pause' }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameTime',
  data() {
    return {
      currentDate: new Date(2023, 0, 1), // Starting from January 1, 2023
      isPaused: false,
      intervalId: null as number | null,
    };
  },
  computed: {
    formattedDate(): string {
      return this.currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    }
  },
  methods: {
    startTimer() {
      this.intervalId = setInterval(() => {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.currentDate = new Date(this.currentDate); // Trigger reactivity
      }, 1000);
    },
    stopTimer() {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
    togglePause() {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    }
  },
  mounted() {
    this.startTimer();
  },
  beforeUnmount() {
    this.stopTimer();
  }
});
</script>