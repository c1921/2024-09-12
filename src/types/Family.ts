import { CharacterImpl } from './Character';

/**
 * 家族类
 * 管理游戏中的家族系统，包括家族成员的添加和移除
 */
export class Family {
    /**
     * 家族唯一标识
     * 使用随机生成的9位字符串
     */
    public id: string;

    /**
     * 家族名称
     * 使用创建者（第一个成员）的姓氏作为家族名
     */
    public name: string;

    /**
     * 家族成员列表
     * 存储所有属于该家族的角色
     */
    public members: CharacterImpl[];

    /**
     * 构造函数
     * @param firstMember 家族创建者/第一个成员
     * 1. 生成随机ID
     * 2. 使用成员姓氏作为家族名
     * 3. 将创建者添加为首位成员
     */
    constructor(firstMember: CharacterImpl) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = firstMember.lastName; // 使用姓氏作为家庭名称
        this.members = [firstMember];
    }

    /**
     * 添加家族成员
     * @param character 要添加的角色
     * 用于：
     * 1. 新生儿加入家族
     * 2. 婚姻关系导致的家族合并
     */
    addMember(character: CharacterImpl) {
        this.members.push(character);
    }

    /**
     * 移除家族成员
     * @param character 要移除的角色
     * 用于：
     * 1. 角色死亡
     * 2. 婚姻关系导致的家族转移
     * 通过ID查找并移除指定成员
     */
    removeMember(character: CharacterImpl) {
        const index = this.members.findIndex(member => member.id === character.id);
        if (index !== -1) {
            this.members.splice(index, 1);
        }
    }
}