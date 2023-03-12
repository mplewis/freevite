import chromium from '@sparticuz/chromium'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import timezone from 'dayjs/plugin/timezone'
import Handlebars from 'handlebars'
import puppeteer from 'puppeteer-core'

import { markdownToText } from 'src/lib/markdown'

dayjs.extend(advancedFormat)
dayjs.extend(timezone)

const ogImageSize = { width: 1200, height: 630 }

const style = `
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600");

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.date {
  width: 598px;
  height: 598px;
  flex-shrink: 0;
  text-align: center;
  border-radius: 48px;
  overflow: hidden;
  color: white;
}

.month {
  height: 148px;
  padding-top: 68px;
  line-height: 0px;
  font-size: 100px;
  font-weight: 600;
  color: white;
  background-color: #e74c3c;
  text-transform: uppercase;
}

.rest {
  background-color: #363636;
}

.day {
  line-height: 0px;
  padding-top: 170px;
  font-size: 300px;
  margin-top: -12px;
  margin-bottom: -8px;
  color: #ffffff;
}

.time {
  line-height: 0px;
  padding-top: 210px;
  font-size: 60px;
  padding-bottom: 590px;
  color: #eeeeee;
}

.summary {
  display: flex;
  justify-content: space-between;
  gap: 32px;
  max-height: 598px;
}

.title {
  font-family: "Josefin Sans", sans-serif;
  font-size: 80px;
  line-height: 0.9;
  color: black;
}

.desc {
  font-size: 60px;
  line-height: 1;
  overflow: hidden;
  padding-bottom: 12px;
}
`

const body = `
<div class="summary">
  <div class="date">
    <div class="month">{{month}}</div>
    <div class="rest">
      <div class="day">{{day}}</div>
      <div class="time">{{time}}</div>
    </div>
  </div>
  <div class="details">
    <h1 class="title mt-3 mb-0">{{title}}</h1>
    <p class="desc">{{details}}</p>
  </div>
</div>
`

const script = `
const ELLIPSIS = '…'

function analyzeLineBreaks(el, suffix = '') {
  const content = el.textContent
  const iSpaces = content
    .split('')
    .map((c, i) => (c === ' ' ? i : null))
    .filter((i) => i !== null)
  iSpaces.push(content.length)

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
    selected.push(byLine[Math.min(maxLines - 1, byLine.length - 1)].text)
  }

  const shortest = selected.reduce((a, b) => (a.length < b.length ? a : b))
  el.textContent = shortest
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.summary')
  const title = document.querySelector('.title')
  const desc = document.querySelector('.desc')

  ellipsize(container, title, { maxLines: 3 })
  ellipsize(container, desc)
})
`

const indexHbs = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://unpkg.com/bulma@0.9.4/css/bulma.min.css">
    <title>My Preview Page</title>
    <style>${style}</style>
  </head>
  <body>
    <div class="m-4">${body}</div>
    <script>${script}</script>
  </body>
</html>
`

function renderTemplate(values: Record<string, string>): string {
  return Handlebars.compile(indexHbs)(values)
}

async function renderImage(values: Record<string, string>): Promise<Buffer> {
  const indexHtml = renderTemplate(values)

  const executablePath =
    process.env.LOCAL_CHROMIUM || (await chromium.executablePath())
  const browser = await puppeteer.launch({
    executablePath,
    args: chromium.args,
    defaultViewport: ogImageSize,
    headless: true,
  })

  const page = await browser.newPage()
  await page.setContent(indexHtml, { waitUntil: 'networkidle0' })
  const screenshot = await page.screenshot()
  await browser.close()

  return screenshot
}

/**
 * Render a preview image for an event.
 * @param event The event to render
 * @returns The bytes for a PNG preview image
 */
export async function renderEventPreview(event: {
  start: string | Date
  end: string | Date
  title: string
  description: string
}): Promise<Buffer> {
  const s = dayjs(event.start)
  const e = dayjs(event.end)
  const month = s.format('MMM')
  const day = s.format('D')
  // TODO: store event timezone
  let time = s.format('H:mm z')
  if (s.isSame(e, 'day')) time = `${s.format('H:mm')}-${e.format('H:mm z')}`

  return renderImage({
    month,
    day,
    time,
    title: event.title,
    details: markdownToText(event.description),
  })
}
