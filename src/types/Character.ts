import { Family } from './Family';

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

    incrementAge(): void {
        this.age += 1;
    }
}