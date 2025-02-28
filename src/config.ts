/**
 * 游戏核心配置参数
 */
export const CONFIG = {
    /**
     * 游戏初始角色数量
     * 游戏开始时生成的角色总数
     */
    INITIAL_CHARACTERS: 500,

    /**
     * 初始角色最小年龄
     * 游戏开始时生成的角色的最小年龄限制
     */
    INITIAL_CHARACTER_MIN_AGE: 18,

    /**
     * 初始角色最大年龄
     * 游戏开始时生成的角色的最大年龄限制
     */
    INITIAL_CHARACTER_MAX_AGE: 30,

    /**
     * 游戏日期推进间隔（毫秒）
     * 控制游戏时间流逝的速度
     */
    DAY_DURATION_MS: 1,

    /**
     * 游戏初始日期
     * 游戏开始时的起始日期
     */
    INITIAL_DATE: new Date(2023, 0, 1),

    /**
     * 结婚概率
     * 符合条件的角色每次检查时结婚的概率（10%）
     */
    MARRIAGE_PROBABILITY: 0.1,

    /**
     * 性行为概率
     * 已婚夫妇每天发生性行为的概率（10%）
     */
    SEXUAL_BEHAVIOR_PROBABILITY: 0.1,

    /**
     * 最低结婚年龄
     * 角色必须达到此年龄才能结婚
     */
    MINIMUM_MARRIAGE_AGE: 18,

    /**
     * 死亡年龄
     * 角色达到此年龄时会自然死亡
     */
    DEATH_AGE: 80,

    /**
     * 生育能力峰值年龄
     * 角色在此年龄时具有最高的生育能力
     */
    FERTILITY_PEAK_AGE: 20,

    /**
     * 生育能力结束年龄
     * 角色达到此年龄后失去生育能力
     */
    FERTILITY_END_AGE: 50,

    /**
     * 生育冷却期（天数）
     * 角色生育后需要等待的恢复期
     * 在此期间无法再次怀孕
     */
    PREGNANCY_COOLDOWN: 120,
};