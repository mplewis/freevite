import { diffObject } from './diff'

describe('diffObject', () => {
  it('diffs as expected', () => {
    expect(
      diffObject(
        {
          numSame: 42,
          numDiff: 42,
          strSame: 'same',
          strDiff: 'same',
          boolSame: true,
          boolDiff: true,
          dateSame: new Date('2023-01-01'),
          dateDiff: new Date('2023-01-01'),
        },
        {
          numSame: 42,
          numDiff: 43,
          strSame: 'same',
          strDiff: 'different',
          boolSame: true,
          boolDiff: false,
          dateSame: new Date('2023-01-01'),
          dateDiff: new Date('2023-01-02'),
        },
        'America/Denver'
      )
    ).toMatchInlineSnapshot(`
{
  "boolDiff": [
    "true",
    "false",
  ],
  "dateDiff": [
    "Sat Dec 31, 5:00 PM (America/Denver)",
    "Sun Jan 1, 5:00 PM (America/Denver)",
  ],
  "numDiff": [
    "42",
    "43",
  ],
  "strDiff": [
    "same",
    "different",
  ],
}
`)
  })
})
