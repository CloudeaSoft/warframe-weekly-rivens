import { describe, expect, test } from 'vitest'

import * as sdk from '../src'

describe('public API', () => {
  test('does not expose internal transport helpers from the package root', () => {
    expect(sdk).not.toHaveProperty('fetchJson')
  })
})
