import { promises as fs } from 'fs'
import { join } from 'path'

import chromium from '@sparticuz/chromium'
import type { APIGatewayEvent, Context } from 'aws-lambda'
import puppeteer from 'puppeteer-core'

import indexHtml from './assets/index.html'

const ogImageSize = { width: 1200, height: 630 }

export const handler = async (_event: APIGatewayEvent, _context: Context) => {
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

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'image/png' },
    body: screenshot.toString('base64'),
    isBase64Encoded: true,
  }
}
