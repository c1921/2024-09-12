import { CharacterImpl } from '../types/Character';
import { Family } from '../types/Family';
import { useGameStore } from '../stores/gameStore';

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
        return !character1.isMarried && !character2.isMarried && character1.gender !== character2.gender;
    }

    private static performMarriage(character1: CharacterImpl, character2: CharacterImpl): void {
        character1.isMarried = true;
        character2.isMarried = true;
        character1.spouse = character2;
        character2.spouse = character1;
    }

    private static handleFamilyChanges(character1: CharacterImpl, character2: CharacterImpl): void {
        if (character1.family !== character2.family) {
            const oldFamily: Family = character2.family;
            oldFamily.removeMember(character2);
            character1.family.addMember(character2);
            character2.family = character1.family;

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