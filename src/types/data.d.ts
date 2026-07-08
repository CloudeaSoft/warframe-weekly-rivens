import type { Platform, WeekKey } from './common'

export type DatesIndex = Record<Platform, WeekKey[]>

export interface RivenPlatformCoverage {
  latestWeek: WeekKey
  fileCount: number
  missingWeeks: WeekKey[]
  lastUpdatedCommit?: string
  lastUpdatedTime?: string
  [key: string]: unknown
}

export interface CoverageIndex {
  platforms: Record<Platform, RivenPlatformCoverage>
  [key: string]: unknown
}

export interface WeeklyRiven {
  itemType: string
  compatibility: string | null
  rerolled: boolean
  avg: number
  stddev: number
  min: number
  max: number
  pop: number
  median?: number
  [key: string]: unknown
}

export interface WeeklyRivensByWeek {
  week: WeekKey
  rivens: WeeklyRiven[]
}
