import { Character } from './Character';

export class Family {
    public id: string;
    public name: string;
    public members: Character[];

    constructor(firstMember: Character) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = firstMember.lastName; // 使用姓氏作为家庭名称
        this.members = [firstMember];
    }

    addMember(character: Character) {
        this.members.push(character);
    }

    removeMember(character: Character) {
        const index = this.members.findIndex(member => member.id === character.id);
        if (index !== -1) {
            this.members.splice(index, 1);
        }
    }
}