export interface Character {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female';
    isMarried: boolean;
    spouse: Character | null;
    birthday: string; // 新增的生日属性
    incrementAge(): void;
}

export class CharacterImpl implements Character {
    public isMarried: boolean = false;
    public spouse: Character | null = null;
    public birthday: string; // 新增的生日属性

    constructor(
        public id: string,
        public name: string,
        public age: number,
        public gender: 'Male' | 'Female'
    ) {
        this.birthday = CharacterImpl.generateRandomBirthday();
    }

    static createRandom(): CharacterImpl {
        const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn'];
        const genders: ('Male' | 'Female')[] = ['Male', 'Female'];

        return new CharacterImpl(
            Math.random().toString(36).substr(2, 9),
            names[Math.floor(Math.random() * names.length)],
            Math.floor(Math.random() * (70 - 18 + 1)) + 18,
            genders[Math.floor(Math.random() * genders.length)]
        );
    }

    marry(partner: CharacterImpl) {
        this.isMarried = true;
        this.spouse = partner;
        partner.isMarried = true;
        partner.spouse = this;
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