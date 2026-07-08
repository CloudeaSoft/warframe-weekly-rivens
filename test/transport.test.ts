import { afterEach, describe, expect, test, vi } from 'vitest'

import { fetchJson } from '../src'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('transport', () => {
  test('returns parsed JSON for successful responses', async () => {
    const request = vi.fn(async () => new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }))

    await expect(fetchJson('https://example.test/data.json', { fetch: request })).resolves.toEqual({ ok: true })
    expect(request).toHaveBeenCalledWith('https://example.test/data.json')
  })

  test('throws a clear error for failed HTTP responses', async () => {
    const request = vi.fn(async () => new Response('missing', {
      status: 404,
      statusText: 'Not Found',
    }))

    await expect(fetchJson('https://example.test/missing.json', { fetch: request })).rejects.toThrow(
      'Failed to fetch JSON from https://example.test/missing.json: 404 Not Found',
    )
  })

  test('uses global fetch by default', async () => {
    const request = vi.fn(async () => new Response(JSON.stringify(['2026_W28']), {
      status: 200,
    }))
    vi.stubGlobal('fetch', request)

    await expect(fetchJson('https://example.test/dates.json')).resolves.toEqual(['2026_W28'])
    expect(request).toHaveBeenCalledWith('https://example.test/dates.json')
  })
})
