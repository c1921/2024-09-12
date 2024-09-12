import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CharacterImpl } from '../types/Character'

export const useGameStore = defineStore('game', () => {
    const characters = ref<CharacterImpl[]>([])
    const currentDate = ref(new Date(2023, 0, 1))
    const isPaused = ref(false)

    function addCharacter() {
        characters.value.push(CharacterImpl.createRandom())
    }

    function advanceDay() {
        if (!isPaused.value) {
            currentDate.value.setDate(currentDate.value.getDate() + 1)
            currentDate.value = new Date(currentDate.value) // 触发响应性
            checkMarriages()
        }
    }

    function checkMarriages() {
        const unmarriedCharacters = characters.value.filter(c => !c.isMarried)
        for (let character of unmarriedCharacters) {
            if (Math.random() < 0.1) { // 10% 结婚概率
                const potentialPartners = unmarriedCharacters.filter(c => c.id !== character.id && c.gender !== character.gender)
                if (potentialPartners.length > 0) {
                    const partner = potentialPartners[Math.floor(Math.random() * potentialPartners.length)]
                    character.marry(partner)
                }
            }
        }
    }

    function togglePause() {
        isPaused.value = !isPaused.value
    }

    const formattedDate = computed(() => currentDate.value.toISOString().split('T')[0])

    return { 
        characters, 
        currentDate, 
        isPaused, 
        formattedDate, 
        addCharacter, 
        advanceDay, 
        checkMarriages, 
        togglePause 
    }
})