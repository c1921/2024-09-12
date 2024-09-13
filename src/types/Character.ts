import { Family } from './Family';

export interface Physiology {
    health: number;
    fertility: number;
    // 可以在这里添加更多生理属性
}

export interface Character {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: 'Male' | 'Female';
    birthday: string;
    isMarried: boolean;
    spouse: Character | null;
    family: Family;
    physiology: Physiology;
}

export class CharacterImpl implements Character {
    public isMarried: boolean = false;
    public spouse: Character | null = null;
    public family: Family;
    public physiology: Physiology;

    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public age: number,
        public gender: 'Male' | 'Female',
        public birthday: string
    ) {
        this.family = new Family(this);
        this.physiology = {
            health: 100,
            fertility: 100
        };
    }

    incrementAge(): void {
        this.age += 1;
    }
}