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
    pregnancyCountdown: number | null;
    father: Character | null;
    mother: Character | null;
    children: Character[];
    siblings: Character[];
    isDead: boolean;
}

export class CharacterImpl implements Character {
    public isMarried: boolean = false;
    public spouse: Character | null = null;
    public family: Family;
    public physiology: Physiology;
    public status: string[] = []; // 初始化为空数组
    public pregnancyCountdown: number | null = null;
    public father: Character | null = null;
    public mother: Character | null = null;
    public children: Character[] = [];
    public siblings: Character[] = [];
    public isDead: boolean = false;

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

    startPregnancy() {
        this.addStatus('Pregnant');
        this.pregnancyCountdown = 270; // 假设怀孕期为270天
    }

    advancePregnancy() {
        if (this.pregnancyCountdown !== null) {
            this.pregnancyCountdown--;
            if (this.pregnancyCountdown <= 0) {
                return true; // 表示应该生育
            }
        }
        return false;
    }

    addChild(child: Character) {
        this.children.push(child);
    }

    addSibling(sibling: Character) {
        if (!this.siblings.includes(sibling)) {
            this.siblings.push(sibling);
            sibling.siblings.push(this);
        }
    }

    die(): void {
        this.isDead = true;
        this.status.push('Deceased');
        if (this.spouse) {
            this.spouse.spouse = null;
            this.spouse.isMarried = false;
        }
    }
}