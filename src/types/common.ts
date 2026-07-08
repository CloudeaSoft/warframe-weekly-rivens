/**
 * Supported Warframe platform identifier used by the CDN dataset.
 */
export type Platform = 'PC' | 'PS4' | 'XB1' | 'SWI'

/**
 * Four-digit year string used in a week key.
 */
export type YearString = `${number}${number}${number}${number}`

/**
 * One- or two-digit ISO week string used in a week key.
 */
export type WeekString = `${number}` | `${number}${number}`

/**
 * Year/week key used by the weekly Riven history dataset.
 *
 * Week keys follow `<year>_W<week>`.
 *
 * @example "2026_W27" "2025_W1"
 */
export type WeekKey = `${YearString}_W${WeekString}`
