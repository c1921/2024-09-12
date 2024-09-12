import { Family } from './Family';
import surnamesData from '../data/surnames.json';
import maleNamesData from '../data/maleNames.json';
import femaleNamesData from '../data/femaleNames.json';

const surnames = surnamesData.surnames;
const maleNames = maleNamesData.maleNames;
const femaleNames = femaleNamesData.femaleNames;

export interface Character {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: 'Male' | 'Female';
    isMarried: boolean;
    spouse: Character | null;
    birthday: string;
    family: Family;
    incrementAge(): void;
}

export class CharacterImpl implements Character {
    public isMarried: boolean = false;
    public spouse: Character | null = null;
    public family: Family;

    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public age: number,
        public gender: 'Male' | 'Female',
        public birthday: string
    ) {
        this.family = new Family(this);
    }

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
            CharacterImpl.generateRandomBirthday()
        );
    }

    marry(partner: CharacterImpl) {
        this.isMarried = true;
        this.spouse = partner;
        partner.isMarried = true;
        partner.spouse = this;

        if (this.gender === 'Male') {
            // 将伴侣加入到这个角色的家庭
            this.family.addMember(partner);
            // 从伴侣原来的家庭中移除伴侣
            partner.family.removeMember(partner);
            // 更新伴侣的家庭引用
            partner.family = this.family;
        } else {
            // 将这个角色加入到伴侣的家庭
            partner.family.addMember(this);
            // 从这个角色原来的家庭中移除它
            this.family.removeMember(this);
            // 更新这个角色的家庭引用
            this.family = partner.family;
        }
    }

    // 新增的生成随机生日的静态方法
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

    incrementAge(): void {
        this.age += 1;
    }
}