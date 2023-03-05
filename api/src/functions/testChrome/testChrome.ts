import { promises as fs } from 'fs'
import { join } from 'path'

import chromium from '@sparticuz/chromium'
import type { APIGatewayEvent, Context } from 'aws-lambda'
import puppeteer from 'puppeteer-core'
// import { chromium as playwright } from 'playwright'

const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>My Preview Page</title>
</head>
<body>
	<h1>This is a preview page</h1>
	<p>And here is some preview text</p>
</body>
</html>
`

const ogImageSize = { width: 1200, height: 630 }

export const handler = async (_event: APIGatewayEvent, _context: Context) => {
  const executablePath =
    process.env.LOCAL_CHROMIUM || (await chromium.executablePath())
  const browser = await puppeteer.launch({
    executablePath,
    args: chromium.args,
    defaultViewport: ogImageSize,
    headless: true,
    // dumpio: true,
  })

  const page = await browser.newPage()
  await page.setContent(indexHtml, { waitUntil: 'domcontentloaded' })
  // await page.goto('https://example.com', { waitUntil: 'domcontentloaded' })
  const screenshot = await page.screenshot({ path: '/tmp/screenshot.png' })
  const title = await page.title()
  await browser.close()

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'image/png' },
    body: screenshot.toString('base64'),
    isBase64Encoded: true,
    // headers: { 'Content-Type': 'text/plain' },
    // body: title,
  }
}
