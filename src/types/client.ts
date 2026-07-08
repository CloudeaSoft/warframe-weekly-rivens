import type { Platform, WeekKey } from './common'
import type { CoverageIndex, DatesIndex, WeeklyRiven, WeeklyRivensByWeek } from './data'
import type { FetchLike } from './transport'

/**
 * Configuration for `createClient`.
 */
export interface ClientOptions {
  /**
   * CDN base URL used to build all dataset requests.
   *
   * Omit this to use the official weekly Riven history CDN. Provide a custom
   * value for mirrors, tests, or local fixture servers.
   */
  baseUrl?: string

  /**
   * Fetch-compatible request function used by the client.
   *
   * Omit this to use `globalThis.fetch`. Inject a function for tests, custom
   * runtimes, or request instrumentation.
   */
  fetch?: FetchLike
}

/**
 * Data-access client for the weekly Riven history CDN.
 *
 * Methods return CDN payloads directly. The client does not perform price
 * analysis, ranking, caching, retries, or recommendations.
 */
export interface WeeklyRivensClient {
  getDates: {
    /**
     * Fetch the full dates index for every supported platform.
     *
     * @returns A mapping from platform to the weeks that have weekly Riven files.
     */
    (): Promise<DatesIndex>

    /**
     * Fetch the dates index and return the available weeks for one platform.
     *
     * @param platform - Platform whose available week keys should be returned.
     * @returns Available week keys for the requested platform, in CDN index order.
     */
    (platform: Platform): Promise<WeekKey[]>
  }

  /**
   * Fetch the coverage index from the CDN.
   *
   * @returns Coverage metadata for every supported platform.
   */
  getCoverage: () => Promise<CoverageIndex>

  /**
   * Fetch one weekly Riven file from the CDN.
   *
   * @param platform - Platform whose weekly Riven data should be fetched.
   * @param week - Year/week key such as `2026_W28`.
   * @returns Weekly Riven records for the requested platform and week.
   */
  getWeeklyRivens: (platform: Platform, week: WeekKey) => Promise<WeeklyRiven[]>

  /**
   * Get the latest available week for one platform.
   *
   * This reads `dates.json` and returns the last week listed for the platform.
   *
   * @param platform - Platform whose latest week should be returned.
   * @returns Latest available week key for the requested platform.
   * @throws When the platform has no available weeks.
   */
  getLatestWeek: (platform: Platform) => Promise<WeekKey>

  /**
   * Fetch the weekly Riven data for the latest available week.
   *
   * @param platform - Platform whose latest weekly Riven data should be fetched.
   * @returns Weekly Riven records for the platform's latest available week.
   * @throws When the platform has no available weeks.
   */
  getLatestWeeklyRivens: (platform: Platform) => Promise<WeeklyRiven[]>

  /**
   * Fetch weekly Riven data within a recent calendar-week range.
   *
   * The range ends at the latest available week in `dates.json`. For example,
   * if the latest week is `2026_W28` and `weeks` is `4`, the method considers
   * `2026_W25` through `2026_W28`. Missing weeks are skipped and older weeks
   * are not used as backfill.
   *
   * @param platform - Platform whose recent weekly Riven data should be fetched.
   * @param weeks - Positive integer number of calendar weeks to include.
   * @returns Existing weekly Riven files within the requested calendar-week range.
   * @throws When `weeks` is not a positive integer or the platform has no available weeks.
   */
  getRecentWeeklyRivens: (platform: Platform, weeks: number) => Promise<WeeklyRivensByWeek[]>
}
