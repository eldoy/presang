const _ = require('lodash')
const i18n = require('./i18n.js')

module.exports = function(app, params, client, tools) {
  const path = _.get(params, 'path') || _.get(client, 'req.pathname')

  const cookieLang = client.req && client.req.cookie('lang')
  const defaultLang = _.get(app, 'config.env.lang') || _.get(app, 'config.routes.lang')
  lang = params.lang || i18n.getLang(path) || cookieLang || defaultLang || 'en'

  const routes = _.get(app, 'config.routes') || {}
  const link = i18n.link(routes, lang)
  const locales = _.get(app, 'locales') || {}
  const t = i18n.t({ locales, lang })

  return { app, tools, lang, t, link, params, ...client }
}