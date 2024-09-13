import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CharacterImpl } from '../types/Character';
import { CharacterUtils } from '../utils/CharacterUtils'
import { Family } from '../types/Family'
import { CONFIG } from '../config'
import { MarriageService } from '../services/MarriageService';

export const useGameStore = defineStore('game', () => {
    const characters = ref<CharacterImpl[]>([])
    const families = ref<Family[]>([])
    const currentDate = ref(CONFIG.INITIAL_DATE)
    const isPaused = ref(false)
    const unmarriedCharacters = ref<CharacterImpl[]>([]);

    function addCharacter() {
        const newCharacter = CharacterUtils.createRandom()
        characters.value.push(newCharacter)
        
        const newFamily = new Family(newCharacter)
        families.value.push(newFamily)
        newCharacter.family = newFamily
    }

    function removeEmptyFamilies() {
        families.value = families.value.filter(family => family.members.length > 0)
    }

    function checkMarriages() {
        const unmarriedCharacters = characters.value.filter((c: CharacterImpl) => !c.isMarried);
        const shuffled = [...unmarriedCharacters].sort(() => 0.5 - Math.random());

        for (let i = 0; i < shuffled.length - 1; i += 2) {
            const char1 = shuffled[i];
            const char2 = shuffled[i + 1];

            if (Math.random() < CONFIG.MARRIAGE_PROBABILITY) {
                MarriageService.marry(char1, char2);
            }
        }
    }

    function advanceDay() {
        if (!isPaused.value) {
            currentDate.value.setDate(currentDate.value.getDate() + 1)
            currentDate.value = new Date(currentDate.value) // 触发响应性
            checkBirthdays()
            checkMarriages()
            removeEmptyFamilies() // 在每天结束时检查并移除空家庭
        }
    }

    function checkBirthdays() {
        const currentMonth = (currentDate.value.getMonth() + 1).toString().padStart(2, '0')
        const currentDay = currentDate.value.getDate().toString().padStart(2, '0')
        const currentDateString = `${currentMonth}-${currentDay}`

        characters.value.forEach((character: CharacterImpl) => {
            if (character.birthday === currentDateString) {
                character.incrementAge()
            }
        })
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
    function initializeCharacters() {
        for (let i = 0; i < CONFIG.INITIAL_CHARACTERS; i++) {
            addCharacter()
        }
    }

    initializeCharacters()

    // 添加这个新方法
    function removeFamily(family: Family) {
        families.value = families.value.filter(f => f !== family);
    }

    function removeFromUnmarried(character: CharacterImpl) {
        unmarriedCharacters.value = unmarriedCharacters.value.filter(c => c !== character);
    }

    return { 
        characters, 
        families,
        currentDate, 
        isPaused, 
        formattedDate, 
        addCharacter, 
        advanceDay, 
        checkMarriages, 
        togglePause,
        removeFamily,
        removeFromUnmarried
    }
})