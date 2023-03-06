/* eslint-disable */

const ELLIPSIS = '…'
const elems = ['.title', '.desc']

function analyzeLineBreaks(el, suffix = '') {
  const content = el.textContent
  const iSpaces = content
    .split('')
    .map((c, i) => (c === ' ' ? i : null))
    .filter((i) => i !== null)
  iSpaces.push(content.length)

  console.log(content, iSpaces)
  const lenHeight = []
  for (let i of iSpaces) {
    const inText = content.slice(0, i)
    let text = inText
    if (i < content.length) text += suffix
    el.textContent = text
    const { height } = el.getBoundingClientRect()
    lenHeight.push({ text, height })
  }

  const bestForHeight = []
  let last = lenHeight[0]
  for (let curr of lenHeight.slice(1)) {
    if (curr.height > last.height) bestForHeight.push(last)
    last = curr
  }
  bestForHeight.push(lenHeight[lenHeight.length - 1])
  for (let x of bestForHeight) console.log(x)

  el.textContent = content
  return bestForHeight
}

function ellipsize(parent, el, params = {}) {
  const { suffix, maxLines } = { suffix: ELLIPSIS, maxLines: null, ...params }
  const { bottom: parentBottom } = parent.getBoundingClientRect()
  const { bottom: elBottom } = el.getBoundingClientRect()
  withinBounds = elBottom <= parentBottom

  const selected = [el.textContent]

  if (!withinBounds) {
    const byLine = analyzeLineBreaks(el, suffix)
    for (let i = byLine.length - 1; i >= 0; i--) {
      const { text } = byLine[i]
      el.textContent = text
      const { bottom } = el.getBoundingClientRect()
      if (bottom <= parentBottom) {
        selected.push(text)
        break
      }
    }
  }

  if (maxLines) {
    const byLine = analyzeLineBreaks(el, suffix)
    selected.push(byLine[maxLines - 1].text)
  }

  const shortest = selected.reduce((a, b) => (a.length < b.length ? a : b))
  el.textContent = shortest
}

const parent = document.querySelector('.container')

ellipsize(parent, document.querySelector('.title'), { maxLines: 2 })
ellipsize(parent, document.querySelector('.desc'))
