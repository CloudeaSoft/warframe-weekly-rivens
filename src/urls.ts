import type { Platform, WeekKey } from './types'

/**
 * Default CDN base URL for the weekly Riven history dataset.
 */
export const DEFAULT_CDN_BASE_URL = 'https://warframe-weekly-rivens-history.pages.dev/'

const platforms = ['PC', 'PS4', 'XB1', 'SWI'] as const

/**
 * Check whether a string is one of the supported Warframe platforms.
 *
 * @param platform - Platform value to check.
 * @returns `true` when the value is a supported platform.
 */
export function isPlatform(platform: string): platform is Platform {
  return platforms.includes(platform as Platform)
}

/**
 * Assert that a string is one of the supported Warframe platforms.
 *
 * @param platform - Platform value to validate.
 * @throws When the platform is not supported by the CDN dataset.
 */
export function assertPlatform(platform: string): asserts platform is Platform {
  if (!isPlatform(platform)) {
    throw new Error(`Unsupported platform: ${platform}`)
  }
}

/**
 * Build the CDN URL for the dates index.
 *
 * @param baseUrl - CDN base URL. Defaults to the official weekly Riven history CDN.
 * @returns Absolute URL for `dates.json`.
 */
export function buildDatesUrl(baseUrl: string = DEFAULT_CDN_BASE_URL): string {
  return joinUrl(baseUrl, 'dates.json')
}

/**
 * Build the CDN URL for the coverage index.
 *
 * @param baseUrl - CDN base URL. Defaults to the official weekly Riven history CDN.
 * @returns Absolute URL for `coverage.json`.
 */
export function buildCoverageUrl(baseUrl: string = DEFAULT_CDN_BASE_URL): string {
  return joinUrl(baseUrl, 'coverage.json')
}

/**
 * Build the CDN URL for one platform/week weekly Riven file.
 *
 * @param platform - Platform whose weekly Riven data should be fetched.
 * @param week - Year/week key such as `2026_W28`.
 * @param baseUrl - CDN base URL. Defaults to the official weekly Riven history CDN.
 * @returns Absolute URL for the weekly Riven JSON file.
 * @throws When the platform is not supported.
 */
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
