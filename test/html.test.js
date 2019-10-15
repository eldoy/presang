const h = require('../lib/html.js')

describe('html', () => {
  it('should create an html tag', () => {
    let html = h('div')
    expect(html).toBe('<div></div>')
  })

  it('should have text content', () => {
    let html = h('div', 'text content')
    expect(html).toBe('<div>text content</div>')
  })

  it('should not have an ending tag', () => {
    let html = h('input', null)
    expect(html).toBe('<input>')
  })

  it('should have a single attribute', () => {
    let html = h('div', '', { class: 'hello' })
    expect(html).toBe('<div class="hello"></div>')
  })

  it('should have multiple attributes', () => {
    let html = h('div', '', { class: 'hello', id: 'hello' })
    expect(html).toBe('<div class="hello" id="hello"></div>')
  })

  it('should have child content with array', () => {
    let html = h('ul', '', {}, [
      h('li', '1'),
      h('li', '1')
    ])
    expect(html).toBe('<ul><li>1</li><li>1</li></ul>')
  })

  it('should have child content with string', () => {
    let html = h('div', '', {}, 'string')
    expect(html).toBe('<div>string</div>')
  })

  it('should have text content with a function', () => {
    let html = h('script', function () {})
    expect(html).toBe('<script>function () {}</script>')
  })

})