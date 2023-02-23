import { convertToDateArray } from './date'

describe('convertToDateArray', () => {
  it('converts dates as expected', () => {
    const examples = [
      { in: '2020-01-01T00:00:00Z', out: [2020, 1, 1, 0, 0] },
      { in: '2020-01-01T00:00:00.000Z', out: [2020, 1, 1, 0, 0] },
      { in: '2020-01-01T00:00:00-06:00', out: [2020, 1, 1, 6, 0] },
    ]
    for (const e of examples)
      expect(convertToDateArray(new Date(e.in))).toEqual(e.out)
  })
})
