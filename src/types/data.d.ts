import type { Platform, WeekKey } from './common'

/**
 * Dates index payload from `dates.json`.
 *
 * Each platform maps to the list of week keys that have a corresponding
 * weekly Riven JSON file in the CDN dataset.
 */
export type DatesIndex = Record<Platform, WeekKey[]>

/**
 * Coverage metadata for one platform in `coverage.json`.
 */
export interface RivenPlatformCoverage {
  /**
   * Latest week known for this platform.
   */
  latestWeek: WeekKey

  /**
   * Number of weekly Riven files currently available for this platform.
   */
  fileCount: number

  /**
   * Week keys that are expected in the historical range but do not have files.
   */
  missingWeeks: WeekKey[]

  /**
   * Commit hash from the source history project that last updated this platform.
   */
  lastUpdatedCommit?: string

  /**
   * Timestamp from the source history project for the latest update.
   */
  lastUpdatedTime?: string

  /**
   * Additional upstream metadata fields.
   */
  [key: string]: unknown
}

/**
 * Coverage index payload from `coverage.json`.
 */
export interface CoverageIndex {
  /**
   * Coverage metadata keyed by platform.
   */
  platforms: Record<Platform, RivenPlatformCoverage>

  /**
   * Additional upstream metadata fields.
   */
  [key: string]: unknown
}

/**
 * One weekly Riven market summary record from a weekly Riven JSON file.
 *
 * The interface covers common fields observed in the official data and allows
 * additional upstream fields without treating them as SDK breaking changes.
 */
export interface WeeklyRiven {
  /**
   * Riven item type, such as `Rifle Riven Mod`.
   */
  itemType: string

  /**
   * Compatible weapon or item name. Generic Riven entries may use `null`.
   */
  compatibility: string | null

  /**
   * Whether the market record is for rerolled Rivens.
   */
  rerolled: boolean

  /**
   * Average market value in the source dataset.
   */
  avg: number

  /**
   * Standard deviation of market values in the source dataset.
   */
  stddev: number

  /**
   * Minimum market value in the source dataset.
   */
  min: number

  /**
   * Maximum market value in the source dataset.
   */
  max: number

  /**
   * Observed population/sample count in the source dataset.
   */
  pop: number

  /**
   * Median market value when provided by the source dataset.
   */
  median?: number

  /**
   * Additional upstream record fields.
   */
  [key: string]: unknown
}

/**
 * Weekly Riven records grouped with their source week key.
 */
export interface WeeklyRivensByWeek {
  /**
   * Week key for the grouped records.
   */
  week: WeekKey

  /**
   * Weekly Riven records for the week.
   */
  rivens: WeeklyRiven[]
}
