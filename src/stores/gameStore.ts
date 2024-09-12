import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CharacterImpl } from '../types/Character'
import { CONFIG } from '../config'

export const useGameStore = defineStore('game', () => {
    const characters = ref<CharacterImpl[]>([])
    const currentDate = ref(CONFIG.INITIAL_DATE)
    const isPaused = ref(false)

    function initializeCharacters() {
        for (let i = 0; i < CONFIG.INITIAL_CHARACTERS; i++) {
            addCharacter()
        }
    }

    function addCharacter() {
        characters.value.push(CharacterImpl.createRandom())
    }

    function advanceDay() {
        if (!isPaused.value) {
            currentDate.value.setDate(currentDate.value.getDate() + 1)
            currentDate.value = new Date(currentDate.value) // 触发响应性
            checkBirthdays()
            checkMarriages()
        }
    }

    function checkBirthdays() {
        const currentMonth = (currentDate.value.getMonth() + 1).toString().padStart(2, '0')
        const currentDay = currentDate.value.getDate().toString().padStart(2, '0')
        const currentDateString = `${currentMonth}-${currentDay}`

        characters.value.forEach(character => {
            if (character.birthday === currentDateString) {
                character.incrementAge()
            }
        })
    }

    function checkMarriages() {
        const unmarriedCharacters = characters.value.filter(c => !c.isMarried)
        for (let character of unmarriedCharacters) {
            if (Math.random() < CONFIG.MARRIAGE_PROBABILITY) { // 10% 结婚概率
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

    const formattedDate = computed(() => {
        const year = currentDate.value.getFullYear()
        const month = (currentDate.value.getMonth() + 1).toString().padStart(2, '0')
        const day = currentDate.value.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    })

    // 初始化角色
    initializeCharacters()

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