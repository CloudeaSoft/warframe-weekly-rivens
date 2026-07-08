import type {
  CoverageIndex,
  DatesIndex,
  Platform,
  RivenPlatformCoverage,
  WeekKey,
  WeeklyRiven,
} from '../src'

import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

const platforms = ['PC', 'PS4', 'XB1', 'SWI'] as const satisfies readonly Platform[]
const weekKeyPattern = /^\d{4}_W\d{1,2}$/

const weeklyRivenFields = [
  'avg',
  'compatibility',
  'itemType',
  'max',
  'median',
  'min',
  'pop',
  'rerolled',
  'stddev',
] as const

const coverageFields = [
  'fileCount',
  'latestWeek',
  'missingWeeks',
] as const satisfies readonly (keyof RivenPlatformCoverage)[]

describe('asset-backed types', () => {
  test('dates index matches dates fixture platform and week fields', () => {
    const dates = readAsset<DatesIndex>('dates.json')

    expect(Object.keys(dates).sort()).toEqual([...platforms].sort())

    for (const platform of platforms) {
      expect(Array.isArray(dates[platform])).toBe(true)

      for (const week of dates[platform]) {
        expectWeekKey(week)
      }
    }
  })

  test('coverage index matches coverage fixture platform fields', () => {
    const coverage = readAsset<CoverageIndex>('coverage.json')

    expect(Object.keys(coverage)).toEqual(['platforms'])
    expect(Object.keys(coverage.platforms).sort()).toEqual([...platforms].sort())

    for (const platform of platforms) {
      const platformCoverage = coverage.platforms[platform]

      expect(Object.keys(platformCoverage).sort()).toEqual([...coverageFields].sort())
      expectWeekKey(platformCoverage.latestWeek)
      expect(typeof platformCoverage.fileCount).toBe('number')
      expect(Array.isArray(platformCoverage.missingWeeks)).toBe(true)

      for (const missingWeek of platformCoverage.missingWeeks) {
        expectWeekKey(missingWeek)
      }
    }
  })

  test('weekly riven matches weekly riven fixture record fields', () => {
    const weeklyRivens = readAsset<WeeklyRiven[]>('weeklyRivensPC.json')

    expect(weeklyRivens.length).toBeGreaterThan(0)

    for (const weeklyRiven of weeklyRivens) {
      expect(Object.keys(weeklyRiven).sort()).toEqual([...weeklyRivenFields].sort())
      expect(typeof weeklyRiven.itemType).toBe('string')
      expect(
        typeof weeklyRiven.compatibility === 'string' || weeklyRiven.compatibility === null,
      ).toBe(true)
      expect(typeof weeklyRiven.rerolled).toBe('boolean')
      expectNumber(weeklyRiven.avg)
      expectNumber(weeklyRiven.stddev)
      expectNumber(weeklyRiven.min)
      expectNumber(weeklyRiven.max)
      expectNumber(weeklyRiven.pop)
      expectNumber(weeklyRiven.median)
    }
  })
})

function readAsset<T>(filename: string): T {
  return JSON.parse(readFileSync(new URL(`./assets/${filename}`, import.meta.url), 'utf8')) as T
}

function expectWeekKey(week: WeekKey): void {
  expect(week).toMatch(weekKeyPattern)
}

function expectNumber(value: number | undefined): void {
  expect(typeof value).toBe('number')
  expect(Number.isFinite(value)).toBe(true)
}
