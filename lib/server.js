const pretty = require('pretty')
const loader = require('conficurse')
const Sirloin = require('sirloin')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

module.exports = function (options = {}) {
  const server = new Sirloin({ port: 5000, files: 'app/assets', ...options })

  const layouts = loader.load('app/layouts') || {}
  const pages = loader.load('app/pages') || {}

  server.get('*', async function (req, res) {
    const pathname = req.pathname === '/' ? '/home.html' : req.pathname
    if (!(/\.html$/).test(pathname)) return
    res.setHeader('content-type', 'text/html')
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
