import { markdownToHTML } from './markdown'

describe('markdownToHTML', () => {
  it('sanitizes the HTML', async () => {
    const input = `
# Hello, world!

This is some prose.

[Link to a website](https://example.com)

Bracket fish: <>< ><>

<script>alert("Uh-oh!")</script>

<img src="shouldnt-render.png">
    `.trim()
    expect(await markdownToHTML(input)).toMatchInlineSnapshot(`
      "<h1>Hello, world!</h1>
      <p>This is some prose.</p>
      <p><a target="_blank" href="https://example.com">Link to a website</a></p>
      <p>Bracket fish: &lt;&gt;&lt; &gt;&lt;&gt;</p>


      "
    `)
  })
})
