const loader = require('conficurse')
const Sirloin = require('sirloin')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

const markup = require('./markup.js')

module.exports = function (options = {}) {
  const server = new Sirloin({ port: 5000, files: 'app/assets', ...options })

  const app = {
    layouts: loader.load('app/layouts') || {},
    pages: loader.load('app/pages') || {}
  }

  server.get('*', async function (req, res) {
    const html = await markup(req.pathname, { app, req, res })
    if (!html) return
    if (process.env.NODE_ENV === 'dev') console.log(html)
    res.setHeader('content-type', 'text/html')
    return html
  })
}
