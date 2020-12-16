const _ = require('lodash')
const Sirloin = require('sirloin')
const { markup, i18n, orb, tools, dispatch, loader, locales, actions } = require('../index.js')

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

// const Sirloin = require('sirloin')
// const loader = require('../lib/loader.js')
// const i18n = require('../lib/i18n.js')
// const orb = require('../lib/orb.js')
// const markup = require('../lib/markup.js')
// const dispatch = require('../lib/dispatch.js')
// const tools = require('../lib/tools.js')

// if (!process.env.NODE_ENV) {
//   process.env.NODE_ENV = 'development'
// }

// module.exports = async function(options = {}) {
//   const app = await loader()
//   const server = new Sirloin({
//     port: process.env.WAVEORB_PORT || 5000,
//     files: 'app/assets',
//     ...options
//   })

//   // Apply middleware
//   for (const m in app.middleware) {
//     const fn = app.middleware[m]
//     typeof fn === 'function' && server.use(fn)
//   }

//   server.get('*', async function(req, res) {
//     const params = {}
//     const client = { req, res }
//     const $ = orb(app, params, client, tools)
//     return dispatch($, markup)
//   })
// }
