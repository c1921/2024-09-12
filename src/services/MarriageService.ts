import { CharacterImpl } from '../types/Character';
import { Family } from '../types/Family';
import { useGameStore } from '../stores/gameStore';
import { CONFIG } from '../config';

export class MarriageService {
    static marry(character1: CharacterImpl, character2: CharacterImpl): boolean {
        if (this.canMarry(character1, character2)) {
            this.performMarriage(character1, character2);
            this.handleFamilyChanges(character1, character2);
            this.updateGameState(character1, character2);
            return true;
        }
        return false;
    }

    private static canMarry(character1: CharacterImpl, character2: CharacterImpl): boolean {
        return !character1.isMarried && 
               !character2.isMarried && 
               character1.gender !== character2.gender &&
               character1.age >= CONFIG.MINIMUM_MARRIAGE_AGE &&
               character2.age >= CONFIG.MINIMUM_MARRIAGE_AGE;
    }

    private static performMarriage(character1: CharacterImpl, character2: CharacterImpl): void {
        character1.isMarried = true;
        character2.isMarried = true;
        character1.spouse = character2;
        character2.spouse = character1;
    }

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

    private static updateGameState(character1: CharacterImpl, character2: CharacterImpl): void {
        const gameStore = useGameStore();
        gameStore.removeFromUnmarried(character1);
        gameStore.removeFromUnmarried(character2);
    }
}