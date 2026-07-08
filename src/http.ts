import type { FetchJsonOptions } from './types'

export async function fetchJson<T = unknown>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const request = options.fetch ?? globalThis.fetch

  if (!request) {
    throw new Error('No fetch implementation is available.')
  }

  const response = await request(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch JSON from ${url}: ${response.status} ${response.statusText}`)
  }

  try {
    return await response.json() as T
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to parse JSON from ${url}: ${message}`)
  }
}
