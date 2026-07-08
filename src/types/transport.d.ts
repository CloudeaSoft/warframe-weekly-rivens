export type FetchLike = (url: string) => Promise<Response>

export interface FetchJsonOptions {
  fetch?: FetchLike
}
