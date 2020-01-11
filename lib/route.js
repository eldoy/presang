const _ = require('lodash')
const i18n = require('./i18n.js')

module.exports = function(app, params, client, tools, lang = 'en') {
  const path = _.get(params, 'path') || _.get(client, 'req.pathname')
  const cookieLang = client.req && client.req.cookie('lang')
  lang = params.lang || i18n.getLang(path) || cookieLang || lang
  const link = i18n.link(app, lang)
  const t = i18n.t({ locales: app.locales, lang })
  return { app, tools, lang, t, link, params, ...client }
}