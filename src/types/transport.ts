/**
 * Minimal fetch-compatible function used internally by the SDK.
 *
 * The SDK only passes a URL string and expects a `Response` promise.
 */
export type FetchLike = (url: string) => Promise<Response>

/**
 * Options for the internal JSON transport helper.
 */
export interface FetchJsonOptions {
  /**
   * Fetch-compatible function to use instead of `globalThis.fetch`.
   */
  fetch?: FetchLike
}
