/* eslint-disable */

const ELLIPSIS = '…'
const elems = ['.title', '.desc']

function analyzeLineBreaks(el, suffix = '') {
  const content = el.textContent
  lastHeight = 0
  breakpoints = []
  for (let i = 1; i <= content.length; i++) {
    const inText = content.slice(0, i)
    const text = inText + suffix
    el.textContent = text
    const { height } = el.getBoundingClientRect()
    if (height > lastHeight) {
      breakpoints.push(inText.length)
      lastHeight = height
    }
  }
  el.textContent = content
  return breakpoints
}

function ellipsize(parent, el, params = {}) {
  const { suffix, maxLines } = { suffix: ELLIPSIS, maxLines: null, ...params }
  const { bottom: parentBottom } = parent.getBoundingClientRect()
  const { bottom: elBottom } = el.getBoundingClientRect()
  withinBounds = elBottom <= parentBottom

  if (!withinBounds) {
    // element doesn't fit within parent, so trim by character with ellipsis
    const content = el.textContent
    for (let i = content.length; i > 0; i--) {
      el.textContent = content.slice(0, i) + suffix // TODO: Break on word
      const { bottom: elBottom } = el.getBoundingClientRect()
      if (elBottom <= parentBottom) return
    }
    return
  }

  if (maxLines) {
    const breaksAt = analyzeLineBreaks(el, ELLIPSIS)
    withinLines = breaksAt.length <= maxLines
    if (!withinLines) {
      // element has too many lines, so trim by line
      const content = el.textContent
      const oneCharTooLong = breaksAt[maxLines]
      el.textContent = content.slice(0, oneCharTooLong - 1) + suffix // TODO: Break on word
      return
    }
  }
}

const parent = document.querySelector('.container')

ellipsize(parent, document.querySelector('.title'), { maxLines: 2 })
ellipsize(parent, document.querySelector('.desc'))
