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
    return `<div>Home</div>`
  }
}

const app = {
  layouts: {
    default: layout
  },
  pages: { home, about }
}

const $ = { app, req, res }

describe('markup', () => {
  it('should load some HTML', async () => {
    const result = await markup(req, res)($)
    expect(result.split('\n').map(x => x.trim()).join('')).toBe(
      '<!doctype html><html><body><div>Home</div></body></html>'
    )
  })
})