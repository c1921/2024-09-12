import { CharacterImpl } from '../types/Character';
import { Family } from '../types/Family';
import { useGameStore } from '../stores/gameStore';
import { CONFIG } from '../config';

/**
 * 婚姻服务类
 * 处理游戏中所有与婚姻相关的逻辑
 */
export class MarriageService {
    /**
     * 执行婚姻
     * @param character1 第一个角色
     * @param character2 第二个角色
     * @returns 婚姻是否成功
     */
    static marry(character1: CharacterImpl, character2: CharacterImpl): boolean {
        if (this.canMarry(character1, character2)) {
            this.performMarriage(character1, character2);
            this.handleFamilyChanges(character1, character2);
            this.updateGameState(character1, character2);
            return true;
        }
        return false;
    }

    /**
     * 检查两个角色是否可以结婚
     * 条件：
     * 1. 双方都未婚
     * 2. 性别不同
     * 3. 双方年龄都达到最低结婚年龄
     */
    private static canMarry(character1: CharacterImpl, character2: CharacterImpl): boolean {
        return !character1.isMarried && 
               !character2.isMarried && 
               character1.gender !== character2.gender &&
               character1.age >= CONFIG.MINIMUM_MARRIAGE_AGE &&
               character2.age >= CONFIG.MINIMUM_MARRIAGE_AGE;
    }

    /**
     * 执行婚姻关系绑定
     * 将两个角色的婚姻状态更新，并互相设置为配偶
     */
    private static performMarriage(character1: CharacterImpl, character2: CharacterImpl): void {
        character1.isMarried = true;
        character2.isMarried = true;
        character1.spouse = character2;
        character2.spouse = character1;
    }

    /**
     * 处理婚后家族变更
     * 1. 女性加入男性的家族
     * 2. 如果女性原家族没有成员了，则移除该家族
     * 注：不再更改女性角色的姓氏，保留原姓
     */
    private static handleFamilyChanges(character1: CharacterImpl, character2: CharacterImpl): void {
        const maleCharacter = character1.gender === 'Male' ? character1 : character2;
        const femaleCharacter = character1.gender === 'Female' ? character1 : character2;

        if (femaleCharacter.family !== maleCharacter.family) {
            const oldFamily: Family = femaleCharacter.family;
            oldFamily.removeMember(femaleCharacter);
            maleCharacter.family.addMember(femaleCharacter);
            femaleCharacter.family = maleCharacter.family;

            // 不再更改女性角色的姓氏
            // femaleCharacter.lastName = maleCharacter.lastName;

            if (oldFamily.members.length === 0) {
                const gameStore = useGameStore();
                gameStore.removeFamily(oldFamily);
            }
        }
    }

    /**
     * 更新游戏状态
     * 将已婚角色从未婚人口池中移除
     */
    private static updateGameState(character1: CharacterImpl, character2: CharacterImpl): void {
        const gameStore = useGameStore();
        gameStore.removeFromUnmarried(character1);
        gameStore.removeFromUnmarried(character2);
    }
}