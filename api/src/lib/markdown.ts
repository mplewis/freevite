import { marked } from 'marked'
import sanitize from 'sanitize-html'

const allowedTags = [
  'a',
  'blockquote',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'li',
  'ol',
  'p',
  'pre',
  'strong',
  'ul',
]

/**
 * Convert a Markdown document to HTML, sanitizing the content and opening links in a new window.
 * @param markdown The Markdown document
 * @returns The converted HTML
 */
export function markdownToHTML(markdown: string): string {
  const html = marked.parse(markdown)
  const clean = sanitize(html, { allowedTags })
  const newWindows = clean.replace(/<a /g, '<a target="_blank" ')
  return newWindows
}
