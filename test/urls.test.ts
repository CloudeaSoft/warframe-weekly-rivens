import { describe, expect, test } from 'vitest'

import {
  buildCoverageUrl,
  buildDatesUrl,
  buildWeeklyRivensUrl,
} from '../src'

describe('url builders', () => {
  test('builds index URLs from the default CDN base URL', () => {
    expect(buildDatesUrl()).toBe('https://warframe-weekly-rivens-archive.pages.dev/dates.json')
    expect(buildCoverageUrl()).toBe('https://warframe-weekly-rivens-archive.pages.dev/coverage.json')
  })

  test('builds weekly riven URLs by platform and week', () => {
    expect(buildWeeklyRivensUrl('PC', '2026_W28')).toBe(
      'https://warframe-weekly-rivens-archive.pages.dev/data/PC/2026_W28_weeklyRivensPC.json',
    )
  })

  test('normalizes custom base URLs', () => {
    expect(buildDatesUrl('https://cdn.example.test/root')).toBe('https://cdn.example.test/root/dates.json')
    expect(buildWeeklyRivensUrl('SWI', '2026_W28', 'https://cdn.example.test/root/')).toBe(
      'https://cdn.example.test/root/data/SWI/2026_W28_weeklyRivensSWI.json',
    )
  })

  test('rejects unsupported platforms', () => {
    expect(() => buildWeeklyRivensUrl('IOS', '2026_W28')).toThrow('Unsupported platform: IOS')
  })
})
