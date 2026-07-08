import type { Platform, WeekKey } from './types'

export const DEFAULT_CDN_BASE_URL = 'https://warframe-weekly-rivens-history.pages.dev/'

const platforms = ['PC', 'PS4', 'XB1', 'SWI'] as const

export function isPlatform(platform: string): platform is Platform {
  return platforms.includes(platform as Platform)
}

export function assertPlatform(platform: string): asserts platform is Platform {
  if (!isPlatform(platform)) {
    throw new Error(`Unsupported platform: ${platform}`)
  }
}

export function buildDatesUrl(baseUrl: string = DEFAULT_CDN_BASE_URL): string {
  return joinUrl(baseUrl, 'dates.json')
}

export function buildCoverageUrl(baseUrl: string = DEFAULT_CDN_BASE_URL): string {
  return joinUrl(baseUrl, 'coverage.json')
}

export function buildWeeklyRivensUrl(
  platform: string,
  week: WeekKey,
  baseUrl: string = DEFAULT_CDN_BASE_URL,
): string {
  assertPlatform(platform)

  return joinUrl(baseUrl, `data/${platform}/${week}_weeklyRivens${platform}.json`)
}

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}
