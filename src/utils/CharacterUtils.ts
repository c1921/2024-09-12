import { CharacterImpl } from '../types/Character';
import surnamesData from '../data/surnames.json';
import maleNamesData from '../data/maleNames.json';
import femaleNamesData from '../data/femaleNames.json';
import { CONFIG } from '../config';

// 从数据文件中导入姓名库
const surnames = surnamesData.surnames;
const maleNames = maleNamesData.maleNames;
const femaleNames = femaleNamesData.femaleNames;

/**
 * 角色工具类
 * 提供角色创建和相关工具方法
 */
export class CharacterUtils {
    /**
     * 创建随机角色
     * 随机生成：
     * 1. 性别
     * 2. 姓名（基于性别选择）
     * 3. 年龄（在配置的范围内）
     * 4. 生理属性
     * @returns 新创建的角色实例
     */
    static createRandom(): CharacterImpl {
        // 随机确定性别
        const gender: 'Male' | 'Female' = Math.random() < 0.5 ? 'Male' : 'Female';
        
        // 根据性别从对应名字库中随机选择名字
        const firstName = gender === 'Male'
            ? maleNames[Math.floor(Math.random() * maleNames.length)]
            : femaleNames[Math.floor(Math.random() * femaleNames.length)];
        
        // 随机选择姓氏
        const lastName = surnames[Math.floor(Math.random() * surnames.length)];

        // 在配置的年龄范围内随机生成年龄
        const age = Math.floor(Math.random() * (CONFIG.INITIAL_CHARACTER_MAX_AGE - CONFIG.INITIAL_CHARACTER_MIN_AGE + 1)) + CONFIG.INITIAL_CHARACTER_MIN_AGE;

        // 创建并返回新角色
        return new CharacterImpl(
            Math.random().toString(36).substr(2, 9),  // 生成随机ID
            firstName,
            lastName,
            age,
            gender,
            CharacterUtils.generateRandomBirthday(),
            this.generateRandomPhysiologyValue(),     // 生成随机健康值
            this.generateRandomPhysiologyValue()      // 生成随机生育能力值
        );
    }

    /**
     * 生成随机生日
     * 考虑每月实际天数：
     * - 2月：28天
     * - 4,6,9,11月：30天
     * - 其他月份：31天
     * @returns 生日字符串（格式：MM-DD）
     */
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

    /**
     * 生成随机生理属性值
     * 范围：80-100之间的整数
     * 用于初始化角色的健康值和生育能力值
     * @returns 随机生成的属性值
     */
    private static generateRandomPhysiologyValue(): number {
        return Math.floor(Math.random() * 21) + 80;
    }

    /**
     * 创建新生儿
     * @param mother 母亲角色
     * @param father 父亲角色（可能为null）
     * @param lastName 新生儿姓氏
     * @returns 新创建的婴儿角色
     * 
     * 处理：
     * 1. 随机确定性别和名字
     * 2. 设置父母关系
     * 3. 建立与现有兄弟姐妹的关系
     */
    static createBaby(mother: CharacterImpl, father: CharacterImpl | null, lastName: string): CharacterImpl {
        // 随机确定性别和名字
        const gender: 'Male' | 'Female' = Math.random() < 0.5 ? 'Male' : 'Female';
        const firstName = gender === 'Male' 
            ? maleNames[Math.floor(Math.random() * maleNames.length)]
            : femaleNames[Math.floor(Math.random() * femaleNames.length)];

        // 创建新生儿实例
        const baby = new CharacterImpl(
            Math.random().toString(36).substr(2, 9),
            firstName,
            lastName,
            0,  // 初始年龄为0
            gender,
            CharacterUtils.generateRandomBirthday(),
            this.generateRandomPhysiologyValue(),
            this.generateRandomPhysiologyValue()
        );

        // 设置父母关系
        baby.mother = mother;
        baby.father = father;

        // 建立与现有兄弟姐妹的关系
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