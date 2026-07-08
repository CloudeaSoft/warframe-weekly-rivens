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

function getIsoWeekStart(week: WeekKey): Date {
  const match = /^(\d{4})_W(\d{1,2})$/.exec(week)

  if (!match) {
    throw new Error(`Invalid week key: ${week}`)
  }

  const year = Number(match[1])
  const weekNumber = Number(match[2])
  const januaryFourth = new Date(Date.UTC(year, 0, 4))
  const januaryFourthDay = januaryFourth.getUTCDay() || 7
  const firstIsoWeekStart = new Date(januaryFourth)
  firstIsoWeekStart.setUTCDate(januaryFourth.getUTCDate() - januaryFourthDay + 1)

  return addWeeks(firstIsoWeekStart, weekNumber - 1)
}

function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + weeks * 7)
  return result
}
