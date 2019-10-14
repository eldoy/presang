const pretty = require('pretty')
const loader = require('conficurse')
const Sirloin = require('sirloin')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

module.exports = function (options = {}) {
  const server = new Sirloin({ port: 5000, files: 'assets', ...options })

  const layouts = loader.load('layouts') || {}
  const pages = loader.load('pages') || {}

  server.get('*', async function (req, res) {
    if (!(/\.html$/).test(req.pathname)) return
    res.setHeader('content-type', 'text/html')
    const pathname = req.pathname === '/' ? '/home.html' : req.pathname
    const [name, ext] = pathname.slice(1).split('.')
    const page = pages[name]
    if (page) {
      const layout = layouts[page.layout || 'default']
      if (layout) {
        let html = await layout(page)
        if (process.env.NODE_ENV === 'dev') {
          html = pretty(html)
          console.log(html)
        }
        return html
      }
    }
  })
}
