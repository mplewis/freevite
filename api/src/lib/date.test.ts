import { convertToDateArray } from './date'

describe('convertToDateArray', () => {
  it('converts dates as expected', () => {
    const examples = [
      [['2020-01-01T00:00:00Z'], [2020, 1, 1, 0, 0]],
      [['2020-01-01T00:00:00.000Z'], [2020, 1, 1, 0, 0]],
      [['2020-01-01T00:00:00-06:00'], [2020, 1, 1, 6, 0]],
    ]
    for (const example of examples)
      expect(convertToDateArray(new Date(example[0]))).toEqual(example[1])
  })
})
