const pretty = require('pretty')
const loader = require('conficurse')
const Sirloin = require('sirloin')
const server = new Sirloin({ port: 5000, files: 'assets' })

const layouts = loader.load('layouts')
const pages = loader.load('pages')

const LAYOUT_NOT_FOUND = async function(page) { return 'Layout ' + (page.layout || 'default') + ' not found' }

server.get('*', async function (req, res) {
  if ((/\..+$/).test(req.pathname)) return
  res.setHeader('content-type', 'text/html')
  const name = req.pathname === '/' ? 'home' : req.pathname
  const page = pages[name]
  if (page) {
    const layout = layouts[page.layout || 'default'] || LAYOUT_NOT_FOUND
    const html = await layout(page)
    console.log(html)
    return html
  } else {
    res.statusCode = 404
    console.log('ERROR')
    return ''
  }
})
