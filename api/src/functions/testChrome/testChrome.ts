import chromium from '@sparticuz/chromium'
import type { APIGatewayEvent, Context } from 'aws-lambda'
import pug from 'pug'
import puppeteer from 'puppeteer-core'

const ogImageSize = { width: 1200, height: 630 }

const indexPug = `
doctype html
html(lang='en')
  head
    meta(charset='UTF-8')
    meta(http-equiv='X-UA-Compatible', content='IE=edge')
    meta(name='viewport', content='width=device-width, initial-scale=1.0')
    title My Preview Page
  body
    h1 This is a preview page
    p And here is some preview text!
    p Today is #{date}
`

export const handler = async (_event: APIGatewayEvent, _context: Context) => {
  const screenshotData = await renderImage({ date: new Date().toString() })
  return {
    headers: { 'Content-Type': 'image/png' },
    body: screenshotData,
    isBase64Encoded: true,
  }
}

function renderTemplate(values: Record<string, string>): string {
  return pug.compile(indexPug)(values)
}

async function renderImage(values: Record<string, string>): Promise<string> {
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
  await page.setContent(indexHtml, { waitUntil: 'domcontentloaded' })
  const screenshot = await page.screenshot()
  await browser.close()

  return screenshot.toString('base64')
}
