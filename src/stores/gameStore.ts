import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CharacterImpl } from '../types/Character';
import { CharacterUtils } from '../utils/CharacterUtils'
import { Family } from '../types/Family'
import { CONFIG } from '../config'
import { MarriageService } from '../services/MarriageService';
import { SexualBehaviorService } from '../services/SexualBehaviorService';

/**
 * 游戏核心状态管理
 * 使用 Pinia 管理游戏的全局状态
 */
export const useGameStore = defineStore('game', () => {
    // 核心状态定义
    const characters = ref<CharacterImpl[]>([])      // 所有角色列表
    const families = ref<Family[]>([])               // 所有家族列表
    const currentDate = ref(CONFIG.INITIAL_DATE)     // 当前游戏日期
    const isPaused = ref(false)                      // 游戏是否暂停
    const unmarriedCharacters = ref<CharacterImpl[]>([])  // 未婚角色列表
    const logs = ref<string[]>([])                   // 游戏日志记录

    /**
     * 添加游戏日志
     * 新日志会被添加到列表开头，并保持最多100条记录
     */
    function addLog(message: string) {
        logs.value.unshift(`${formattedDate.value}: ${message}`)
        if (logs.value.length > 100) {
            logs.value.pop()
        }
    }

    /**
     * 创建新角色
     * 1. 生成随机角色
     * 2. 创建新的家族
     * 3. 将角色加入家族
     */
    function addCharacter() {
        const newCharacter = CharacterUtils.createRandom()
        characters.value.push(newCharacter)
        
        const newFamily = new Family(newCharacter)
        families.value.push(newFamily)
        newCharacter.family = newFamily

        addLog(`New character ${newCharacter.firstName} ${newCharacter.lastName} added`)
    }

    /**
     * 清理空家族
     * 移除没有成员的家族
     */
    function removeEmptyFamilies() {
        families.value = families.value.filter(family => family.members.length > 0)
    }

    /**
     * 检查并处理可能的婚姻
     * 1. 筛选出符合结婚条件的角色
     * 2. 随机配对
     * 3. 根据概率决定是否结婚
     */
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

    /**
     * 检查已婚夫妇的性行为
     * 根据概率触发性行为，可能导致怀孕
     */
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

    /**
     * 推进游戏时间
     * 每天执行以下操作：
     * 1. 检查生日
     * 2. 处理婚姻
     * 3. 清理空家族
     * 4. 处理性行为
     * 5. 检查怀孕状态
     * 6. 处理死亡事件
     * 7. 更新生育冷却期
     */
    function advanceDay() {
        if (!isPaused.value) {
            currentDate.value.setDate(currentDate.value.getDate() + 1)
            currentDate.value = new Date(currentDate.value) // 触发响应性
            checkBirthdays()
            checkMarriages()
            removeEmptyFamilies() // 在每天结束时检查并移除空家庭
            checkSexualBehavior();
            checkPregnancies();
            checkDeaths();
            updatePregnancyCooldowns();
        }
    }

    /**
     * 更新所有角色的生育冷却期
     */
    function updatePregnancyCooldowns() {
        characters.value.forEach((character: CharacterImpl) => {
            character.updatePregnancyCooldown();
        });
    }

    /**
     * 检查角色生日
     * 在生日时：
     * 1. 增加年龄
     * 2. 更新生育能力
     * 3. 记录日志
     */
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

    /**
     * 切换游戏暂停状态
     */
    function togglePause() {
        isPaused.value = !isPaused.value
    }

    /**
     * 格式化当前日期
     * 返回格式：YYYY-MM-DD
     */
    const formattedDate = computed(() => {
        const year = currentDate.value.getFullYear()
        const month = (currentDate.value.getMonth() + 1).toString().padStart(2, '0')
        const day = currentDate.value.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    })

    /**
     * 初始化游戏角色
     * 根据配置创建初始角色数量
     */
    function initializeCharacters() {
        for (let i = 0; i < CONFIG.INITIAL_CHARACTERS; i++) {
            addCharacter()
        }
    }

    // 初始化游戏
    initializeCharacters()

    /**
     * 移除指定家族
     */
    function removeFamily(family: Family) {
        families.value = families.value.filter(f => f !== family);
    }

    /**
     * 从未婚人口池中移除角色
     */
    function removeFromUnmarried(character: CharacterImpl) {
        unmarriedCharacters.value = unmarriedCharacters.value.filter(c => c !== character);
    }

    /**
     * 为角色添加状态
     * 例如：怀孕、生病等
     */
    function addStatusToCharacter(characterId: string, status: string) {
        const character = characters.value.find(c => c.id === characterId);
        if (character) {
            character.addStatus(status);
            addLog(`${character.firstName} ${character.lastName} is now ${status}`);
        }
    }

    /**
     * 移除角色状态
     */
    function removeStatusFromCharacter(characterId: string, status: string) {
        const character = characters.value.find(c => c.id === characterId);
        if (character) {
            character.removeStatus(status);
            addLog(`${character.firstName} ${character.lastName} is no longer ${status}`);
        }
    }

    /**
     * 执行两个角色间的性行为
     * 返回是否导致怀孕
     */
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

    /**
     * 检查所有怀孕状态的角色
     * 推进怀孕进度，必要时触发分娩
     */
    function checkPregnancies() {
        characters.value.forEach((character: CharacterImpl) => {
            if (character.status.includes('Pregnant')) {
                if (character.advancePregnancy()) {
                    giveBirth(character);
                }
            }
        });
    }

    /**
     * 处理分娩事件
     * 1. 创建新生儿
     * 2. 设置家族关系
     * 3. 更新父母状态
     */
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

    /**
     * 检查死亡事件
     * 1. 处理达到死亡年龄的角色
     * 2. 更新家族关系
     * 3. 移除死亡角色
     */
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

    // 导出方法和状态
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