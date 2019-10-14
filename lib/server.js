const pretty = require('pretty')
const loader = require('conficurse')
const Sirloin = require('sirloin')
const DEFAULT_LAYOUT = require('./layout.js')

module.exports = function (options = {}) {
  const server = new Sirloin({ port: 5000, files: 'assets', ...options })

  const layouts = loader.load('layouts') || {}
  const pages = loader.load('pages') || {}

  server.get('*', async function (req, res) {
    if ((/\..+$/).test(req.pathname)) return
    res.setHeader('content-type', 'text/html')
    const name = (req.pathname === '/' ? '/home' : req.pathname).slice(1)
    const page = pages[name]
    if (page) {
      const layout = layouts[page.layout || 'default'] || DEFAULT_LAYOUT
      const html = pretty(await layout(page))
      console.log(html)
      return html
    } else {
      res.statusCode = 404
      return 'Not found'
    }
  })
}
