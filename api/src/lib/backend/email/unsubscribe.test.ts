import { unsubscribeFooter, unsubscribeLink } from './unsubscribe'

describe('unsubscribeLink', () => {
  it('builds the signed unsubscribe link for an email address', () => {
    expect(unsubscribeLink('angela@ecorp.tk')).toEqual(`https://example.com/unsubscribe?` + `email=angela%40ecorp.tk&` + `token=z0YHlLya22BB1T_zpvaVCjRMOClavI4w5OkX6T2uMHE`)
  })
})

describe('unsubscribeFooter', () => {
  it('builds the footer with the signed unsubscribe link', () => {
    expect(unsubscribeFooter('angela@ecorp.tk')).toEqual(`To unsubscribe from all Freevite emails forever, click here:\n` + `https://example.com/unsubscribe?` + `email=angela%40ecorp.tk&` + `token=z0YHlLya22BB1T_zpvaVCjRMOClavI4w5OkX6T2uMHE`)
  })
})
