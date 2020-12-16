const _ = require('lodash')
const Sirloin = require('sirloin')
const markup = require('./markup.js')
const i18n = require('./i18n.js')
const orb = require('./orb.js')
const tools  = require('./tools.js')
const dispatch = require('./dispatch.js')
const loader = require('./loader.js')
const locales = require('./locales.js')
const actions = require('./actions.js')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

const SERVER_OPTIONS = {
  port: parseInt(process.env.WAVEORB_PORT || 5000),
  host: process.env.WAVEORB_HOST,
  files: process.env.WAVEORB_ASSETS || 'app/assets'
}

module.exports = async function(options = {}) {
  // Uncomment to inspect app
  // tools.inspect(app)
  console.log(`Mode: ${process.env.NODE_ENV}`)
  options = _.merge(SERVER_OPTIONS, options)

  const app = await loader({ locales })

  const cert = process.env.WAVEORB_SSL_CERT
  const key = process.env.WAVEORB_SSL_KEY
  if (cert && key) {
    console.log(`Using cert ${cert}`)
    console.log(`Using key ${key}`)
    options.ssl = { key, cert }
  }

  const server = new Sirloin(options)

  // Apply middleware
  for (const m in app.middleware) {
    const fn = app.middleware[m]
    typeof fn === 'function' && server.use(fn)
  }

  // Markup requests
  server.get('*', async function(req, res) {
    if (!(/\.html$/).test(req.pathname) && !req.pathname.endsWith('/')) return
    const params = {}
    const client = { query: req.query, req, res, server }
    const $ = orb(app, params, client, tools)
    return dispatch($, markup)
  })

  // Websocket requests
  server.action('*', async function(params, client) {
    tools.transform(params)
    client = { socket: client, server }
    const $ = orb(app, params, client, tools)
    return dispatch($, actions)
  })

  // HTTP requests
  server.post('*', async function(req, res) {
    const { params, files, query } = req
    tools.transform(params)
    const client = { files, query, req, res, server }
    const $ = orb(app, params, client, tools)
    return dispatch($, actions)
  })
}
