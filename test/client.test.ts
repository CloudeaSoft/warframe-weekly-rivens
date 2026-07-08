import { describe, expect, test, vi } from 'vitest'

import { createClient } from '../src'

describe('client', () => {
  test('fetches dates, coverage, and weekly riven data', async () => {
    const request = vi.fn(async (url: string) => new Response(JSON.stringify({ url }), {
      status: 200,
    }))
    const client = createClient({
      baseUrl: 'https://cdn.example.test',
      fetch: request,
    })

    await expect(client.getDates()).resolves.toEqual({ url: 'https://cdn.example.test/dates.json' })
    await expect(client.getCoverage()).resolves.toEqual({ url: 'https://cdn.example.test/coverage.json' })
    await expect(client.getWeeklyRivens('PC', '2026_W28')).resolves.toEqual({
      url: 'https://cdn.example.test/data/PC/2026_W28_weeklyRivensPC.json',
    })
  })

  test('returns platform dates when a platform is provided', async () => {
    const request = vi.fn(async () => new Response(JSON.stringify({
      PC: ['2026_W27', '2026_W28'],
      PS4: ['2026_W28'],
      SWI: [],
      XB1: [],
    }), {
      status: 200,
    }))
    const client = createClient({ fetch: request })

    await expect(client.getDates('PC')).resolves.toEqual(['2026_W27', '2026_W28'])
  })

  test('gets latest week and latest weekly rivens from the dates index', async () => {
    const request = vi.fn(async (url: string) => {
      if (url.endsWith('/dates.json')) {
        return new Response(JSON.stringify({
          PC: ['2026_W27', '2026_W28'],
          PS4: [],
          SWI: [],
          XB1: [],
        }), { status: 200 })
      }

      return new Response(JSON.stringify([{ itemType: 'Rifle', compatibility: 'Braton' }]), { status: 200 })
    })
    const client = createClient({
      baseUrl: 'https://cdn.example.test/',
      fetch: request,
    })

    await expect(client.getLatestWeek('PC')).resolves.toBe('2026_W28')
    await expect(client.getLatestWeeklyRivens('PC')).resolves.toEqual([
      { itemType: 'Rifle', compatibility: 'Braton' },
    ])
    expect(request).toHaveBeenCalledWith('https://cdn.example.test/data/PC/2026_W28_weeklyRivensPC.json')
  })

  test('gets recent weekly rivens by calendar week range without backfilling missing weeks', async () => {
    const request = vi.fn(async (url: string) => {
      if (url.endsWith('/dates.json')) {
        return new Response(JSON.stringify({
          PC: ['2026_W24', '2026_W25', '2026_W27', '2026_W28'],
          PS4: [],
          SWI: [],
          XB1: [],
        }), { status: 200 })
      }

      const week = url.includes('2026_W27') ? '2026_W27' : '2026_W28'
      return new Response(JSON.stringify([{ itemType: `Rifle ${week}` }]), { status: 200 })
    })
    const client = createClient({
      baseUrl: 'https://cdn.example.test/',
      fetch: request,
    })

    await expect(client.getRecentWeeklyRivens('PC', 3)).resolves.toEqual([
      {
        rivens: [{ itemType: 'Rifle 2026_W27' }],
        week: '2026_W27',
      },
      {
        rivens: [{ itemType: 'Rifle 2026_W28' }],
        week: '2026_W28',
      },
    ])
    expect(request).toHaveBeenCalledWith('https://cdn.example.test/data/PC/2026_W27_weeklyRivensPC.json')
    expect(request).toHaveBeenCalledWith('https://cdn.example.test/data/PC/2026_W28_weeklyRivensPC.json')
    expect(request).not.toHaveBeenCalledWith('https://cdn.example.test/data/PC/2026_W25_weeklyRivensPC.json')
  })

  test('rejects invalid recent weekly riven range sizes', async () => {
    const client = createClient()

    await expect(client.getRecentWeeklyRivens('PC', 0)).rejects.toThrow(
      'weeks must be a positive integer.',
    )
  })
})
