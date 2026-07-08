import type { Server } from 'node:http'

import { createServer } from 'node:http'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { createClient } from '../src/client'

describe('weekly rivens history client integration', () => {
  let server: Server
  let baseUrl: string
  const requests: string[] = []

  beforeAll(async () => {
    server = createServer((request, response) => {
      requests.push(request.url ?? '')
      response.setHeader('Content-Type', 'application/json')

      if (request.url === '/dates.json') {
        response.end(JSON.stringify({
          PC: ['2026_W27'],
          PS4: [],
          SWI: [],
          XB1: [],
        }))
        return
      }

      if (request.url === '/coverage.json') {
        response.end(JSON.stringify({
          platforms: {
            PC: {
              fileCount: 1,
              latestWeek: '2026_W27',
              missingWeeks: [],
            },
            PS4: {
              fileCount: 0,
              latestWeek: '2026_W27',
              missingWeeks: [],
            },
            SWI: {
              fileCount: 0,
              latestWeek: '2026_W27',
              missingWeeks: [],
            },
            XB1: {
              fileCount: 0,
              latestWeek: '2026_W27',
              missingWeeks: [],
            },
          },
        }))
        return
      }

      if (request.url === '/PC/2026_W27_weeklyRivensPC.json') {
        response.end(JSON.stringify([{ compatibility: 'Braton' }]))
        return
      }

      response.statusCode = 404
      response.statusMessage = 'Not Found'
      response.end(JSON.stringify({ error: 'not found' }))
    })

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', resolve)
    })

    const address = server.address()
    if (!address || typeof address === 'string') {
      throw new TypeError('Expected HTTP server to listen on a TCP address.')
    }

    baseUrl = `http://127.0.0.1:${address.port}/`
  })

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error)
          return
        }

        resolve()
      })
    })
  })

  test('fetches indexes and weekly data from an HTTP endpoint', async () => {
    const client = createClient({ baseUrl })

    await expect(client.getDates()).resolves.toEqual({
      PC: ['2026_W27'],
      PS4: [],
      SWI: [],
      XB1: [],
    })
    await expect(client.getCoverage()).resolves.toEqual({
      platforms: {
        PC: {
          fileCount: 1,
          latestWeek: '2026_W27',
          missingWeeks: [],
        },
        PS4: {
          fileCount: 0,
          latestWeek: '2026_W27',
          missingWeeks: [],
        },
        SWI: {
          fileCount: 0,
          latestWeek: '2026_W27',
          missingWeeks: [],
        },
        XB1: {
          fileCount: 0,
          latestWeek: '2026_W27',
          missingWeeks: [],
        },
      },
    })
    await expect(client.getWeeklyRivens('PC', '2026_W27')).resolves.toEqual([
      { compatibility: 'Braton' },
    ])

    expect(requests).toEqual([
      '/dates.json',
      '/coverage.json',
      '/PC/2026_W27_weeklyRivensPC.json',
    ])
  })
})
