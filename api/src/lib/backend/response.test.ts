import { summarize } from './response'

describe('summarize', () => {
  it('generates a summary of the given responses', () => {
    expect(summarize([{ headCount: 1 }, { headCount: 2 }, { headCount: 3 }])).toEqual({
      responseCountTotal: 3,
      headCountTotal: 6,
    })
  })
})
