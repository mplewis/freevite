import chromium from '@sparticuz/chromium'
import type { APIGatewayEvent, Context } from 'aws-lambda'
import Handlebars from 'handlebars'
import puppeteer from 'puppeteer-core'

const ogImageSize = { width: 1200, height: 630 }

const indexHbs = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://unpkg.com/bulma@0.9.4/css/bulma.min.css">
    <title>My Preview Page</title>
    {{{style}}}
  </head>
  <body>
    <h1>This is a preview page</h1>
    <p>And here is some preview text!</p>
    <p>Today is {{date}}</p>
  </body>
</html>
`

const style = `
<style>
  body {
    color: red;
  }
</style>
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
  return Handlebars.compile(indexHbs)({ ...values, style })
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
