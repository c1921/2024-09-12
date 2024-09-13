export const CONFIG = {
    INITIAL_CHARACTERS: 500,
    INITIAL_CHARACTER_MIN_AGE: 18, // 新增：初始角色的最小年龄
    INITIAL_CHARACTER_MAX_AGE: 30, // 新增：初始角色的最大年龄
    DAY_DURATION_MS: 1,
    INITIAL_DATE: new Date(2023, 0, 1),
    MARRIAGE_PROBABILITY: 0.1,
    SEXUAL_BEHAVIOR_PROBABILITY: 0.1, // 每天每对夫妇发生性行为的概率为10%
    MINIMUM_MARRIAGE_AGE: 18, // 设置最低结婚年龄为18岁
    DEATH_AGE: 80,
    FERTILITY_PEAK_AGE: 20, // 新增：生育能力峰值年龄
    FERTILITY_END_AGE: 50   // 新增：生育能力结束年龄
};