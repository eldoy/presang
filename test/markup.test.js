const loader = require('conficurse')
const markup = require('../lib/markup.js')

const req = { pathname: '/' }
const res = {
  setHeader: function () {}
}

async function layout($) {
  return `
    <!doctype html>
    <html>
      <body>
        ${ $.page.content }
      </body>
    </html>`
}

const home = {
  title: 'home',
  render: async function ($) {
    return `<div>Home</div>`
  }
}

const about = {
  title: 'about',
  render: async function about ($) {
    return `<div>About</div>`
  }
}

const deep = {
  title: 'deep',
  render: async function deep ($) {
    return `<div>Deep</div>`
  }
}

const app = {
  pages: {
    layouts: {
      default: layout
    },
    home,
    about,
    docs: {
      deep
    }
  }
}

const $ = { app, req, res }

describe('markup', () => {
  beforeEach(() => {
    req.pathname = '/'
  })
  it('should load some HTML', async () => {
    const result = await markup(req, res)($)
    expect(result.split('\n').map(x => x.trim()).join('')).toBe(
      '<!doctype html><html><body><div>Home</div></body></html>'
    )
  })

  it('should load some HTML', async () => {
    req.pathname = '/about.html'
    const result = await markup(req, res)($)
    expect(result.split('\n').map(x => x.trim()).join('')).toBe(
      '<!doctype html><html><body><div>About</div></body></html>'
    )
  })

  it('should load some deep HTML', async () => {
    req.pathname = '/docs/deep.html'
    const result = await markup(req, res)($)
    expect(result.split('\n').map(x => x.trim()).join('')).toBe(
      '<!doctype html><html><body><div>Deep</div></body></html>'
    )
  })
})