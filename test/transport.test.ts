import { afterEach, describe, expect, test, vi } from 'vitest'

import { fetchJson } from '../src/http'

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

  test('throws a clear error when JSON parsing fails', async () => {
    const request = vi.fn(async () => new Response('{', {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }))

    await expect(fetchJson('https://example.test/invalid.json', { fetch: request })).rejects.toThrow(
      'Failed to parse JSON from https://example.test/invalid.json:',
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

  test('rejects when no fetch implementation is available', async () => {
    vi.stubGlobal('fetch', undefined)

    await expect(fetchJson('https://example.test/dates.json')).rejects.toThrow(
      'No fetch implementation is available.',
    )
  })
})
