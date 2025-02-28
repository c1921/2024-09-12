import { CharacterImpl } from '../types/Character';

/**
 * 性行为服务类
 * 处理游戏中的生育相关逻辑
 */
export class SexualBehaviorService {
    /**
     * 执行性行为并判定是否导致怀孕
     * @param character1 第一个角色
     * @param character2 第二个角色
     * @returns 是否导致怀孕
     * 
     * 怀孕判定规则：
     * 1. 基于双方的生育能力值取较小值作为概率
     * 2. 女性角色必须不在怀孕状态
     * 3. 女性角色必须不在生育冷却期
     */
    static performSexualAct(character1: CharacterImpl, character2: CharacterImpl): boolean {
        const fertilityChance = Math.min(character1.physiology.fertility, character2.physiology.fertility);
        const isPregnant = Math.random() * 100 < fertilityChance;

        if (isPregnant) {
            const femaleCharacter = character1.gender === 'Female' ? character1 : character2;
            if (!femaleCharacter.status.includes('Pregnant') && femaleCharacter.pregnancyCooldown === 0) {
                femaleCharacter.startPregnancy();
                return true;
            }
        }

        return false;
    }
}