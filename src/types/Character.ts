import { Family } from './Family';
import { CONFIG } from '../config';

/**
 * 角色生理属性接口
 */
export interface Physiology {
    health: number;      // 健康值
    fertility: number;   // 生育能力值
}

/**
 * 角色基础接口
 * 定义了角色的所有基本属性
 */
export interface Character {
    id: string;                     // 角色唯一标识
    firstName: string;              // 名
    lastName: string;               // 姓
    age: number;                    // 年龄
    gender: 'Male' | 'Female';      // 性别
    birthday: string;               // 生日（MM-DD格式）
    isMarried: boolean;             // 婚姻状态
    spouse: Character | null;       // 配偶
    family: Family;                 // 所属家族
    physiology: Physiology;         // 生理属性
    status: string[];              // 状态列表（如：怀孕、生病等）
    pregnancyCountdown: number | null;  // 怀孕倒计时（天数）
    father: Character | null;       // 父亲
    mother: Character | null;       // 母亲
    children: Character[];          // 子女列表
    siblings: Character[];          // 兄弟姐妹列表
    isDead: boolean;               // 是否死亡
    pregnancyCooldown: number;     // 生育冷却期（天数）
}

/**
 * 角色实现类
 * 包含了角色的所有属性和方法
 */
export class CharacterImpl implements Character {
    public isMarried: boolean = false;
    public spouse: Character | null = null;
    public family: Family;
    public physiology: Physiology;
    public status: string[] = [];
    public pregnancyCountdown: number | null = null;
    public father: Character | null = null;
    public mother: Character | null = null;
    public children: Character[] = [];
    public siblings: Character[] = [];
    public isDead: boolean = false;
    public pregnancyCooldown: number = 0;

    /**
     * 构造函数
     * @param id 角色ID
     * @param firstName 名
     * @param lastName 姓
     * @param age 年龄
     * @param gender 性别
     * @param birthday 生日
     * @param health 初始健康值
     * @param fertility 初始生育能力值
     */
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

    /**
     * 增加年龄
     * 在角色生日时调用
     */
    incrementAge(): void {
        this.age += 1;
    }

    /**
     * 添加状态
     * @param newStatus 新状态
     */
    addStatus(newStatus: string): void {
        if (!this.status.includes(newStatus)) {
            this.status.push(newStatus);
        }
    }

    /**
     * 移除状态
     * @param statusToRemove 要移除的状态
     */
    removeStatus(statusToRemove: string): void {
        this.status = this.status.filter(status => status !== statusToRemove);
    }

    /**
     * 开始怀孕
     * 设置怀孕状态和倒计时
     */
    startPregnancy() {
        this.addStatus('Pregnant');
        this.pregnancyCountdown = 270; // 假设怀孕期为270天
    }

    /**
     * 推进怀孕进度
     * @returns 是否应该生育
     */
    advancePregnancy() {
        if (this.pregnancyCountdown !== null) {
            this.pregnancyCountdown--;
            if (this.pregnancyCountdown <= 0) {
                return true; // 表示应该生育
            }
        }
        return false;
    }

    /**
     * 添加子女
     * @param child 子女角色
     */
    addChild(child: Character) {
        this.children.push(child);
    }

    /**
     * 添加兄弟姐妹
     * 双向关系：同时将自己添加为对方的兄弟姐妹
     * @param sibling 兄弟姐妹角色
     */
    addSibling(sibling: Character) {
        if (!this.siblings.includes(sibling)) {
            this.siblings.push(sibling);
            sibling.siblings.push(this);
        }
    }

    /**
     * 处理角色死亡
     * 1. 设置死亡状态
     * 2. 添加死亡标记
     * 3. 解除婚姻关系
     */
    die(): void {
        this.isDead = true;
        this.status.push('Deceased');
        if (this.spouse) {
            this.spouse.spouse = null;
            this.spouse.isMarried = false;
        }
    }

    /**
     * 更新生育能力
     * 基于年龄计算生育能力的衰减
     * 使用抛物线函数模拟生育能力随年龄的变化
     */
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

        // 使用抛物线函数：y = -(x^2) + 1
        // 这会产生一个从1开始，缓慢下降然后快速下降的曲线
        const fertilityFactor = -(x * x) + 1;

        // 应用衰减因子到初始生育能力
        this.physiology.fertility = Math.max(0, Math.floor(initialFertility * fertilityFactor));
    }

    /**
     * 处理分娩后的状态更新
     * 1. 移除怀孕状态
     * 2. 重置怀孕倒计时
     * 3. 设置生育冷却期
     */
    giveBirth(): void {
        this.removeStatus('Pregnant');
        this.pregnancyCountdown = null;
        this.pregnancyCooldown = CONFIG.PREGNANCY_COOLDOWN;
    }

    /**
     * 更新生育冷却期
     * 每天减少一天的冷却时间
     */
    updatePregnancyCooldown(): void {
        if (this.pregnancyCooldown > 0) {
            this.pregnancyCooldown--;
        }
    }
}