import type { ResponseSummary } from 'types/graphql'

/** Build a response summary for a set of responses. */
export function summarize(responses: { headCount: number }[]): ResponseSummary {
  return {
    responseCountTotal: responses.length,
    headCountTotal: responses.reduce((x, r) => x + r.headCount, 0),
  }
}
