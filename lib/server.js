const loader = require('conficurse')
const Sirloin = require('sirloin')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

const markup = require('./markup.js')

module.exports = function(options = {}) {
  const server = new Sirloin({ port: 5000, files: 'app/assets', ...options })

  const app = {
    layouts: loader.load('app/layouts'),
    pages: loader.load('app/pages')
  }

  server.get('*', async function(req, res) {
    return await markup(req, res)({ app, req, res })
  })
}
