import { CharacterImpl } from '../types/Character';
import surnamesData from '../data/surnames.json';
import maleNamesData from '../data/maleNames.json';
import femaleNamesData from '../data/femaleNames.json';

const surnames = surnamesData.surnames;
const maleNames = maleNamesData.maleNames;
const femaleNames = femaleNamesData.femaleNames;

export class CharacterUtils {
    static createRandom(): CharacterImpl {
        const gender: 'Male' | 'Female' = Math.random() < 0.5 ? 'Male' : 'Female';
        const firstName = gender === 'Male'
            ? maleNames[Math.floor(Math.random() * maleNames.length)]
            : femaleNames[Math.floor(Math.random() * femaleNames.length)];
        const lastName = surnames[Math.floor(Math.random() * surnames.length)];

        return new CharacterImpl(
            Math.random().toString(36).substr(2, 9),
            firstName,
            lastName,
            Math.floor(Math.random() * (70 - 18 + 1)) + 18,
            gender,
            CharacterUtils.generateRandomBirthday(),
            this.generateRandomPhysiologyValue(),
            this.generateRandomPhysiologyValue()
        );
    }

    static generateRandomBirthday(): string {
        const month = Math.floor(Math.random() * 12) + 1;
        let maxDay;

        switch (month) {
            case 2:  // 二月
                maxDay = 28;  // 简化为28天
                break;
            case 4: case 6: case 9: case 11:  // 30天的月份
                maxDay = 30;
                break;
            default:  // 31天的月份
                maxDay = 31;
        }

        const day = Math.floor(Math.random() * maxDay) + 1;
        return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    private static generateRandomPhysiologyValue(): number {
        // 生成80到100之间的随机整数
        return Math.floor(Math.random() * 21) + 80;
    }

    static createBaby(mother: CharacterImpl, father: CharacterImpl | null, lastName: string): CharacterImpl {
        const gender: 'Male' | 'Female' = Math.random() < 0.5 ? 'Male' : 'Female';
        const firstName = gender === 'Male' 
            ? maleNames[Math.floor(Math.random() * maleNames.length)]
            : femaleNames[Math.floor(Math.random() * femaleNames.length)];

        const baby = new CharacterImpl(
            Math.random().toString(36).substr(2, 9),
            firstName,
            lastName,
            0,
            gender,
            CharacterUtils.generateRandomBirthday(),
            this.generateRandomPhysiologyValue(),
            this.generateRandomPhysiologyValue()
        );

        baby.mother = mother;
        baby.father = father;

        // 设置兄弟姐妹关系
        mother.children.forEach(sibling => {
            if (sibling !== baby) {
                baby.addSibling(sibling);
            }
        });
        if (father) {
            father.children.forEach(sibling => {
                if (sibling !== baby) {
                    baby.addSibling(sibling);
                }
            });
        }

        return baby;
    }
}