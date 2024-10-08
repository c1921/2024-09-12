import { CharacterImpl } from '../types/Character';

export class SexualBehaviorService {
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