const rehypeFilter = import('react-markdown/lib/rehype-filter.js')
const rehypeStringify = import('rehype-stringify')
const remarkParse = import('remark-parse')
const remarkRehype = import('remark-rehype')
const Unified = import('unified')

import { DateArray } from 'ics'

export function convertToDateArray(d: Date): DateArray {
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ]
}

export async function markdownToHTML(markdown: string): Promise<string> {
  const allowedElements = ['a', 'p', 'ul', 'li', 'strong', 'em', 'hr', 'br']
  const unified = (await Unified).unified
  const v = await unified()
    .use((await remarkParse).default)
    .use((await remarkRehype).default)
    .use((await rehypeStringify).default)
    .use((await rehypeFilter).default, { allowedElements })
    .process(markdown)
  return String(v)
}
