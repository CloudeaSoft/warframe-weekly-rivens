import type { Platform, WeekKey } from './common'
import type { CoverageIndex, DatesIndex, WeeklyRiven } from './data'
import type { FetchLike } from './transport'

export interface ClientOptions {
  baseUrl?: string
  fetch?: FetchLike
}

export interface WeeklyRivensClient {
  getDates: {
    (): Promise<DatesIndex>
    (platform: Platform): Promise<WeekKey[]>
  }
  getCoverage: () => Promise<CoverageIndex>
  getWeeklyRivens: (platform: Platform, week: WeekKey) => Promise<WeeklyRiven[]>
  getLatestWeek: (platform: Platform) => Promise<WeekKey>
  getLatestWeeklyRivens: (platform: Platform) => Promise<WeeklyRiven[]>
}
