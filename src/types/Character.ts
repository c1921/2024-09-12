import { Family } from './Family';
import { CONFIG } from '../config';

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
    pregnancyCooldown: number;
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
    public pregnancyCooldown: number = 0;

    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public age: number,
        public gender: 'Male' | 'Female',
        public birthday: string,
        health: number,
        fertility: number
    ) {
        this.family = new Family(this);
        this.physiology = {
            health: health,
            fertility: fertility
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

    updateFertility(): void {
        const { FERTILITY_PEAK_AGE, FERTILITY_END_AGE } = CONFIG;
        const initialFertility = this.physiology.fertility;

        if (this.age <= FERTILITY_PEAK_AGE) {
            // 年龄小于等于峰值年龄时，保持初始生育能力
            return;
        }

        if (this.age >= FERTILITY_END_AGE) {
            // 年龄大于等于结束年龄时，生育能力为0
            this.physiology.fertility = 0;
            return;
        }

        // 计算当前年龄在生育周期中的相对位置（0到1之间）
        const x = (this.age - FERTILITY_PEAK_AGE) / (FERTILITY_END_AGE - FERTILITY_PEAK_AGE);

        // 使用抛物线函数：y = -(x^2)
        // 这会产生一个从(0,0)开始，缓慢下降然后快速下降的曲线
        const fertilityFactor = -(x * x) + 1;

        // 应用衰减因子到初始生育能力
        this.physiology.fertility = Math.max(0, Math.floor(initialFertility * fertilityFactor));
    }

    giveBirth(): void {
        this.removeStatus('Pregnant');
        this.pregnancyCountdown = null;
        this.pregnancyCooldown = CONFIG.PREGNANCY_COOLDOWN;
    }

    updatePregnancyCooldown(): void {
        if (this.pregnancyCooldown > 0) {
            this.pregnancyCooldown--;
        }
    }
}