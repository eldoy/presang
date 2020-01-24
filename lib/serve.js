const Sirloin = require('sirloin')
const loader = require('../lib/loader.js')
const i18n = require('../lib/i18n.js')
const orb = require('../lib/orb.js')
const markup = require('../lib/markup.js')
const dispatch = require('../lib/dispatch.js')
const tools = require('../lib/tools.js')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

module.exports = async function(options = {}) {
  const app = await loader()
  const server = new Sirloin({
    port: process.env.PRESANG_PORT || 5000,
    files: 'app/assets',
    ...options
  })

  server.get('*', async function(req, res) {
    const params = {}
    const client = { req, res }
    const $ = orb(app, params, client, tools)
    return dispatch($, markup)
  })
}
