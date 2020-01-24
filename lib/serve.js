const _ = require('lodash')
const loader = require('conficurse')
const Sirloin = require('sirloin')
const i18n = require('./i18n.js')
const markup = require('./markup.js')
const dispatch = require('./dispatch.js')
const tools = require('./tools.js')
const orb = require('./orb.js')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

const app = {
  layouts: loader.load('app/layouts'),
  pages: loader.load('app/pages'),
  config: loader.load('app/config'),
  locales: loader.load('app/locales')
}

module.exports = function(options = {}) {
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
