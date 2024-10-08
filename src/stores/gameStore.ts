import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CharacterImpl } from '../types/Character';
import { CharacterUtils } from '../utils/CharacterUtils'
import { Family } from '../types/Family'
import { CONFIG } from '../config'
import { MarriageService } from '../services/MarriageService';
import { SexualBehaviorService } from '../services/SexualBehaviorService';

export const useGameStore = defineStore('game', () => {
    const characters = ref<CharacterImpl[]>([])
    const families = ref<Family[]>([])
    const currentDate = ref(CONFIG.INITIAL_DATE)
    const isPaused = ref(false)
    const unmarriedCharacters = ref<CharacterImpl[]>([]);

    const logs = ref<string[]>([])

    function addLog(message: string) {
        logs.value.unshift(`${formattedDate.value}: ${message}`)
        if (logs.value.length > 100) {
            logs.value.pop()
        }
    }

    function addCharacter() {
        const newCharacter = CharacterUtils.createRandom()
        characters.value.push(newCharacter)
        
        const newFamily = new Family(newCharacter)
        families.value.push(newFamily)
        newCharacter.family = newFamily

        addLog(`New character ${newCharacter.firstName} ${newCharacter.lastName} added`)
    }

    function removeEmptyFamilies() {
        families.value = families.value.filter(family => family.members.length > 0)
    }

    function checkMarriages() {
        const eligibleCharacters = characters.value.filter((c: CharacterImpl) => 
            !c.isMarried && c.age >= CONFIG.MINIMUM_MARRIAGE_AGE
        );
        const shuffled = [...eligibleCharacters].sort(() => 0.5 - Math.random());

        for (let i = 0; i < shuffled.length - 1; i += 2) {
            const char1 = shuffled[i];
            const char2 = shuffled[i + 1];

            if (char1.gender !== char2.gender && Math.random() < CONFIG.MARRIAGE_PROBABILITY) {
                MarriageService.marry(char1, char2);
                addLog(`${char1.firstName} ${char1.lastName} married ${char2.firstName} ${char2.lastName}`);
            }
        }
    }

    function checkSexualBehavior() {
        const marriedCharacters = characters.value.filter(c => c.isMarried && c.spouse);
        for (const character of marriedCharacters) {
            if (Math.random() < CONFIG.SEXUAL_BEHAVIOR_PROBABILITY) {
                const spouse = character.spouse as CharacterImpl;
                const result = SexualBehaviorService.performSexualAct(character, spouse);
                if (result) {
                    addLog(`${character.firstName} ${character.lastName} and ${spouse.firstName} ${spouse.lastName} performed a sexual act.`);
                }
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
            checkSexualBehavior();
            checkPregnancies(); // 添加这行
            checkDeaths(); // 添加这行
            updatePregnancyCooldowns(); // 新增这行
        }
    }

    function updatePregnancyCooldowns() {
        characters.value.forEach((character: CharacterImpl) => {
            character.updatePregnancyCooldown();
        });
    }

    function checkBirthdays() {
        const today = `${(currentDate.value.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.value.getDate().toString().padStart(2, '0')}`;
        characters.value.forEach((character: CharacterImpl) => {
            if (character.birthday === today) {
                character.incrementAge();
                character.updateFertility(); // 在生日时更新生育能力
                addLog(`${character.firstName} ${character.lastName} is now ${character.age} years old.`);
            }
        });
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

    function addStatusToCharacter(characterId: string, status: string) {
        const character = characters.value.find(c => c.id === characterId);
        if (character) {
            character.addStatus(status);
            addLog(`${character.firstName} ${character.lastName} is now ${status}`);
        }
    }

    function removeStatusFromCharacter(characterId: string, status: string) {
        const character = characters.value.find(c => c.id === characterId);
        if (character) {
            character.removeStatus(status);
            addLog(`${character.firstName} ${character.lastName} is no longer ${status}`);
        }
    }

    function performSexualAct(character1Id: string, character2Id: string) {
        const character1 = characters.value.find(c => c.id === character1Id);
        const character2 = characters.value.find(c => c.id === character2Id);

        if (character1 && character2) {
            const result = SexualBehaviorService.performSexualAct(character1, character2);
            if (result) {
                addLog(`${character1.firstName} ${character1.lastName} and ${character2.firstName} ${character2.lastName} performed a sexual act.`);
            } else {
                addLog(`Sexual act between ${character1.firstName} ${character1.lastName} and ${character2.firstName} ${character2.lastName} could not be performed.`);
            }
        }
    }

    function checkPregnancies() {
        characters.value.forEach((character: CharacterImpl) => {
            if (character.status.includes('Pregnant')) {
                if (character.advancePregnancy()) {
                    giveBirth(character);
                }
            }
        });
    }

    function giveBirth(mother: CharacterImpl) {
        const father = mother.spouse as CharacterImpl | null;
        // 使用父亲的姓氏，如果父亲不存在则使用母亲的姓氏
        const babyLastName = father ? father.lastName : mother.lastName;
        const baby = CharacterUtils.createBaby(mother, father, babyLastName);
        characters.value.push(baby);
        
        // 使用父亲的家庭（如果存在），否则使用母亲的家庭
        const family = father ? father.family : mother.family;
        family.addMember(baby);
        baby.family = family;
        
        mother.addChild(baby);
        if (father) {
            father.addChild(baby);
        }
        mother.giveBirth(); // 使用新的 giveBirth 方法
        addLog(`${mother.firstName} ${mother.lastName} gave birth to ${baby.firstName} ${baby.lastName}`);
    }

    function checkDeaths() {
        characters.value.forEach((character: CharacterImpl) => {
            if (!character.isDead && character.age >= CONFIG.DEATH_AGE) {
                character.die();
                addLog(`${character.firstName} ${character.lastName} has passed away at the age of ${character.age}.`);
                
                // 从家庭中移除角色
                character.family.removeMember(character);
                
                // 如果家庭中没有其他成员，移除该家庭
                if (character.family.members.length === 0) {
                    removeFamily(character.family);
                }
            }
        });
        
        // 移除已死亡的角色
        characters.value = characters.value.filter(c => !c.isDead);
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
        removeFromUnmarried,
        logs,
        addLog,
        addStatusToCharacter,
        removeStatusFromCharacter,
        performSexualAct,
        checkPregnancies,
        giveBirth,
        checkDeaths,
        updatePregnancyCooldowns
    }
})