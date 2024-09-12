export interface Character {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female';
    isMarried: boolean;
    spouse: Character | null;
}

export class CharacterImpl implements Character {
    public isMarried: boolean = false;
    public spouse: Character | null = null;

    constructor(
        public id: string,
        public name: string,
        public age: number,
        public gender: 'Male' | 'Female'
    ) { }

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

    marry(partner: Character) {
        this.isMarried = true;
        this.spouse = partner;
        partner.isMarried = true;
        partner.spouse = this;
    }
}