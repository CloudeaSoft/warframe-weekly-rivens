import type {
  ClientOptions,
  CoverageIndex,
  DatesIndex,
  Platform,
  WeekKey,
  WeeklyRiven,
  WeeklyRivensClient,
} from './types'
import { fetchJson } from './http'
import {
  assertPlatform,
  buildCoverageUrl,
  buildDatesUrl,
  buildWeeklyRivensUrl,
} from './urls'

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

  return {
    getCoverage,
    getDates,
    getLatestWeek,
    getLatestWeeklyRivens,
    getWeeklyRivens,
  }
}
