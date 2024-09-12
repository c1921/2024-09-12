import { defineStore } from 'pinia'
import { CharacterImpl } from '../types/Character'

export const useGameStore = defineStore('game', {
    state: () => ({
        characters: [] as CharacterImpl[],
        currentDate: new Date(2023, 0, 1),
        isPaused: false
    }),
    actions: {
        addCharacter() {
            this.characters.push(CharacterImpl.createRandom())
        },
        advanceDay() {
            if (!this.isPaused) {
                this.currentDate.setDate(this.currentDate.getDate() + 1)
                this.currentDate = new Date(this.currentDate) // 触发响应性
                this.checkMarriages()
            }
        },
        checkMarriages() {
            const unmarriedCharacters = this.characters.filter(c => !c.isMarried)
            for (let character of unmarriedCharacters) {
                if (Math.random() < 0.1) { // 10% 结婚概率
                    const potentialPartners = unmarriedCharacters.filter(c => c.id !== character.id && c.gender !== character.gender)
                    if (potentialPartners.length > 0) {
                        const partner = potentialPartners[Math.floor(Math.random() * potentialPartners.length)]
                        character.marry(partner)
                    }
                }
            }
        },
        togglePause() {
            this.isPaused = !this.isPaused
        }
    },
    getters: {
        formattedDate(): string {
            return this.currentDate.toISOString().split('T')[0] // 格式：YYYY-MM-DD
        }
    }
})