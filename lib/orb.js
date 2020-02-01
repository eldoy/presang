const _ = require('lodash')
const i18n = require('./i18n.js')
const bundler = require('./bundler.js')

module.exports = function(app, params, client, tools) {
  const path = _.get(params, 'path') || _.get(client, 'req.pathname') || '/'

  // Set up language
  const cookieLang = client.req && client.req.cookie('lang')
  const defaultLang = process.env.WAVEORB_LANG || _.get(app, 'config.env.lang') || _.get(app, 'config.routes.lang')
  lang = params.lang || i18n.getLang(path) || cookieLang || defaultLang || 'en'

  // Set up translations
  const routes = _.get(app, 'config.routes') || {}
  const link = i18n.link(routes, lang)
  const locales = _.get(app, 'locales') || {}
  const t = i18n.t({ locales, lang })

  const assets = _.get(app, 'config.assets.bundle')
  const bundle = _.get(client, 'req.headers.x-waveorb-build')
  const { script, style } = bundler(assets, { bundle })

  return { app, tools, lang, link, t, script, style, params, ...client }
}
