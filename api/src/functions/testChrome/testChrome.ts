import chromium from '@sparticuz/chromium'
import type { APIGatewayEvent, Context } from 'aws-lambda'
import Handlebars from 'handlebars'
import puppeteer from 'puppeteer-core'

const ogImageSize = { width: 1200, height: 630 }

const style = `
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600");

.date {
  width: 598px;
  height: 598px;
  flex-shrink: 0;
  text-align: center;
  border-radius: 48px;
  overflow: hidden;
  margin-left: -12px; /* HACK to fix excessive left side margin */
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
  font-size: 50px;
  padding-bottom: 590px;
  color: #eeeeee;
}

.summary {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}

.title {
  font-family: "Josefin Sans", sans-serif;
  font-size: 100px;
  line-height: 0.9;
}

.desc {
  font-size: 60px;
  line-height: 1.1;
  text-overflow: ellipsis;
}
`

const body = `
<div class="summary m-4">
  <div class="date">
    <div class="month">Dec</div>
    <div class="rest">
      <div class="day">10</div>
      <div class="time">16:00-22:00 MST</div>
    </div>
  </div>
  <div class="details">
    <h1 class="title mt-2 mb-0">{{title}}</h1>
    <p class="desc">{{details}}</p>
  </div>
</div>
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jQuery.dotdotdot/4.1.0/dotdotdot.min.js">
    </script>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        let wrapper = document.querySelector(".desc");
        new Dotdotdot(wrapper);
      });
    </script>
  </body>
</html>
`

export const handler = async (_event: APIGatewayEvent, _context: Context) => {
  const lorem =
    'Come to my birthday party! It will be a lot of fun and there will be such and such. ' +
    'Lorem ipsum dolor sit amet, etc., etc., etc.'
  const title = 'My Cool Event'
  const screenshotData = await renderImage({
    date: new Date().toString(),
    title,
    details: lorem,
  })
  return {
    headers: { 'Content-Type': 'image/png' },
    body: screenshotData,
    isBase64Encoded: true,
  }
}

function renderTemplate(values: Record<string, string>): string {
  return Handlebars.compile(indexHbs)(values)
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
  await page.setContent(indexHtml, { waitUntil: 'networkidle0' })
  const screenshot = await page.screenshot()
  await browser.close()

  return screenshot.toString('base64')
}
