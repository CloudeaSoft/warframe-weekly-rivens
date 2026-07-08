# warframe-weekly-rivens

A lightweight TypeScript SDK for reading Warframe weekly Riven history from the
[warframe-weekly-rivens-history](https://github.com/CloudeaSoft/warframe-weekly-rivens-history)
Cloudflare Pages CDN.

This package does not ship the history data. It only builds CDN URLs, fetches JSON, and returns the CDN payloads with conservative TypeScript types.

## Install

```sh
pnpm add warframe-weekly-rivens
```

```sh
npm install warframe-weekly-rivens
```

## Quick Start

```ts
import { createClient } from 'warframe-weekly-rivens'

const client = createClient()

const weeks = await client.getDates('PC')
const latestWeek = await client.getLatestWeek('PC')
const latestRivens = await client.getLatestWeeklyRivens('PC')

console.log(weeks.length, latestWeek, latestRivens[0])
```

## Client API

```ts
import { createClient } from 'warframe-weekly-rivens'

const client = createClient({
  baseUrl: 'https://warframe-weekly-rivens-archive.pages.dev',
})
```

`baseUrl` is optional. It can point to a mirror or test server.

```ts
await client.getDates()
await client.getDates('PC')
await client.getCoverage()
await client.getWeeklyRivens('PC', '2026_W28')
await client.getLatestWeek('PC')
await client.getLatestWeeklyRivens('PC')
await client.getRecentWeeklyRivens('PC', 4)
```

`getRecentWeeklyRivens(platform, weeks)` uses calendar-week range semantics. For example, if the latest week is `2026_W28` and `weeks` is `4`, the method considers `2026_W25` through `2026_W28`. It fetches only files that exist in that range and does not backfill older weeks when a week is missing.

Supported platforms are:

```ts
type Platform = 'PC' | 'PS4' | 'XB1' | 'SWI'
```

## Fetch Injection

The SDK uses `globalThis.fetch` by default. You can inject a compatible fetch implementation for tests, custom runtimes, or request instrumentation:

```ts
const client = createClient({
  fetch: async url => fetch(url),
})
```

## URL Helpers

URL construction is exported separately for users who want to fetch or inspect paths themselves:

```ts
import {
  buildCoverageUrl,
  buildDatesUrl,
  buildWeeklyRivensUrl,
} from 'warframe-weekly-rivens'

buildDatesUrl()
buildCoverageUrl()
buildWeeklyRivensUrl('PC', '2026_W28')
```

Weekly Riven files use this CDN path format:

```text
data/<platform>/<week>_weeklyRivens<platform>.json
```

## Types

The exported types describe the current CDN payload shape while allowing additional fields where the upstream data may grow.

```ts
import type {
  CoverageIndex,
  DatesIndex,
  Platform,
  RivenPlatformCoverage,
  WeekKey,
  WeeklyRiven,
  WeeklyRivensByWeek,
} from 'warframe-weekly-rivens'
```

`WeeklyRiven` includes the common fields:

```ts
interface WeeklyRiven {
  itemType: string
  compatibility: string | null
  rerolled: boolean
  avg: number
  stddev: number
  min: number
  max: number
  pop: number
  median?: number
  [key: string]: unknown
}
```

## Scope

This package is intentionally limited to CDN data access.

Included:

- internal transport: fetch JSON and surface clear errors through the client
- URL/CDN helpers: build known CDN paths and validate platforms
- data access: read dates, coverage, weekly Riven files, and latest-week data
- types: conservative TypeScript declarations for CDN payloads

Not included:

- price trend analysis
- week-to-week comparison
- weapon search
- ranking or recommendations
- anomaly detection
- chart data generation
- local caching
- CLI commands

Those can be added later as examples, separate packages, or user-land code.
