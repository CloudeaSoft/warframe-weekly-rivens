export type Platform = 'PC' | 'PS4' | 'XB1' | 'SWI'

export type YearString = `${number}${number}${number}${number}`
export type WeekString = `${number}` | `${number}${number}`

/**
 * Year week key.
 * @example "2026_W27" "2025_W1"
 */
export type WeekKey = `${YearString}_W${WeekString}`
