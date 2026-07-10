import { createRequire } from 'node:module'
import { describe, expect, test } from 'vitest'

import * as sdk from '../src'

const require = createRequire(import.meta.url)
const packageJson = require('../package.json') as {
  exports?: unknown
  main?: unknown
  module?: unknown
}

describe('public API', () => {
  test('does not expose internal transport helpers from the package root', () => {
    expect(sdk).not.toHaveProperty('fetchJson')
  })

  test('publishes only the package root entry point', () => {
    expect(packageJson.exports).toEqual({
      '.': {
        import: './lib/index.js',
        require: './lib/index.cjs',
        types: './lib/index.d.ts',
      },
    })
    expect(packageJson.main).toBe('./lib/index.cjs')
    expect(packageJson.module).toBe('./lib/index.js')
  })
})
