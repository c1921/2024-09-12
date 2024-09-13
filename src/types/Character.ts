import { Family } from './Family';

export interface Physiology {
    health: number;
    fertility: number;
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
    status: string[]; // 新增状态属性
}

export class CharacterImpl implements Character {
    public isMarried: boolean = false;
    public spouse: Character | null = null;
    public family: Family;
    public physiology: Physiology;
    public status: string[] = []; // 初始化为空数组

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

    addStatus(newStatus: string): void {
        if (!this.status.includes(newStatus)) {
            this.status.push(newStatus);
        }
    }

    removeStatus(statusToRemove: string): void {
        this.status = this.status.filter(status => status !== statusToRemove);
    }
}