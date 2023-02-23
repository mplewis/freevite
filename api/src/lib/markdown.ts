import { Node } from 'unist'

const unistUtilVisit = import('unist-util-visit')
const rehypeFilter = import('react-markdown/lib/rehype-filter.js')
const rehypeStringify = import('rehype-stringify')
const remarkParse = import('remark-parse')
const remarkRehype = import('remark-rehype')
const Unified = import('unified')

interface HTMLNode extends Node {
  tagName: string
  properties: Record<string, string>
}

async function addTargetBlank() {
  const { visit } = await unistUtilVisit
  return (tree: Node) => {
    visit(tree, 'element', (node: HTMLNode) => {
      if (node.tagName !== 'a') return
      node.properties['target'] = '_blank'
    })
  }
}

export async function markdownToHTML(markdown: string): Promise<string> {
  const allowedElements = ['a', 'p', 'ul', 'li', 'strong', 'em', 'hr', 'br']
  const unified = (await Unified).unified
  const v = await unified()
    .use((await remarkParse).default)
    .use((await remarkRehype).default)
    .use((await rehypeStringify).default)
    .use((await rehypeFilter).default, { allowedElements })
    // @ts-expect-error HACK: types don't match here; fix this along with the ESM stuff
    .use(addTargetBlank)
    .process(markdown)
  return String(v)
}
