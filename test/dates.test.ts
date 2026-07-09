import { describe, expect, test } from 'vitest'

import { getIsoWeekStart } from '../src/dates'

describe('date helpers', () => {
  test('rejects malformed week keys', () => {
    expect(() => getIsoWeekStart('2026-28' as never)).toThrow('Invalid week key: 2026-28')
    expect(() => getIsoWeekStart('W28_2026' as never)).toThrow('Invalid week key: W28_2026')
    expect(() => getIsoWeekStart('2026_W00')).toThrow('Invalid week key: 2026_W00')
    expect(() => getIsoWeekStart('2026_W54')).toThrow('Invalid week key: 2026_W54')
  })
})
