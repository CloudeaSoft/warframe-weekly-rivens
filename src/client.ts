import type {
  ClientOptions,
  CoverageIndex,
  DatesIndex,
  Platform,
  WeekKey,
  WeeklyRiven,
  WeeklyRivensByWeek,
  WeeklyRivensClient,
} from './types'
import { addWeeks, getIsoWeekStart } from './dates'
import { fetchJson } from './http'
import {
  assertPlatform,
  buildCoverageUrl,
  buildDatesUrl,
  buildWeeklyRivensUrl,
} from './urls'

/**
 * Create a client for reading Warframe weekly Riven history from the CDN.
 *
 * The client is a thin data-access wrapper. It returns CDN payloads directly
 * and does not perform analysis, caching, retries, or ranking.
 *
 * @param options - Optional client configuration.
 * @param options.baseUrl - Custom CDN base URL. Use this for mirrors, tests, or local fixtures.
 * @param options.fetch - Fetch-compatible function to use instead of `globalThis.fetch`.
 * @returns A weekly Riven history client with data-access methods.
 */
export function createClient(options: ClientOptions = {}): WeeklyRivensClient {
  const fetchOptions = { fetch: options.fetch }

  async function getDates(): Promise<DatesIndex>
  async function getDates(platform: Platform): Promise<WeekKey[]>
  async function getDates(platform?: Platform): Promise<DatesIndex | WeekKey[]> {
    if (platform) {
      assertPlatform(platform)
    }

    const dates = await fetchJson<DatesIndex>(buildDatesUrl(options.baseUrl), fetchOptions)
    return platform ? dates[platform] : dates
  }

  async function getCoverage(): Promise<CoverageIndex> {
    return fetchJson<CoverageIndex>(buildCoverageUrl(options.baseUrl), fetchOptions)
  }

  async function getWeeklyRivens(platform: Platform, week: WeekKey): Promise<WeeklyRiven[]> {
    return fetchJson<WeeklyRiven[]>(buildWeeklyRivensUrl(platform, week, options.baseUrl), fetchOptions)
  }

  async function getLatestWeek(platform: Platform): Promise<WeekKey> {
    const weeks = await getDates(platform)
    const latestWeek = weeks.at(-1)

    if (!latestWeek) {
      throw new Error(`No weekly Riven data is available for platform: ${platform}`)
    }

    return latestWeek
  }

  async function getLatestWeeklyRivens(platform: Platform): Promise<WeeklyRiven[]> {
    return getWeeklyRivens(platform, await getLatestWeek(platform))
  }

  async function getRecentWeeklyRivens(platform: Platform, weeks: number): Promise<WeeklyRivensByWeek[]> {
    if (!Number.isInteger(weeks) || weeks < 1) {
      throw new Error('weeks must be a positive integer.')
    }

    const availableWeeks = await getDates(platform)
    const latestWeek = availableWeeks.at(-1)

    if (!latestWeek) {
      throw new Error(`No weekly Riven data is available for platform: ${platform}`)
    }

    const latestWeekDate = getIsoWeekStart(latestWeek).getTime()
    const earliestWeekDate = addWeeks(getIsoWeekStart(latestWeek), -(weeks - 1)).getTime()
    const weeksInRange = availableWeeks.filter((week) => {
      const weekDate = getIsoWeekStart(week).getTime()
      return weekDate >= earliestWeekDate && weekDate <= latestWeekDate
    })

    return Promise.all(weeksInRange.map(async week => ({
      rivens: await getWeeklyRivens(platform, week),
      week,
    })))
  }

  return {
    getCoverage,
    getDates,
    getLatestWeek,
    getLatestWeeklyRivens,
    getRecentWeeklyRivens,
    getWeeklyRivens,
  }
}
