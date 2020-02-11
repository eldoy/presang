const _ = require('lodash')
const tools = require('./tools.js')

const i18n = {}

/** Translation function */
i18n.t = function(options = {}) {
  const locales = _.merge({}, options.locales)
  if (typeof options === 'string') {
    options = { lang: options }
  }
  if (!options.lang) {
    options.lang = 'en'
  }
  return function(path, ...args) {
    try {
      const value = _.get(locales[options.lang], path) || path
      return tools.format(value, ...args)
    } catch (e) {
      return key
    }
  }
}

/** Link function */
i18n.link = function(routes, lang = 'en') {
  return function(link, ...args) {
    if (!link.includes('@')) link = `${lang}@${link}`
    const [currentLang, page] = link.split('@')
    let result = `/${page}.html`
    if (routes && routes.routemap) {
      const entry = Object.entries(routes.routemap).find(function([route, map]) {
        return map === link
      })
      if (entry) {
        result = entry[0]
      }
    }
    // Replace dynamic parts of link
    if (result.includes('/_')) {
      let i = 0
      result = result.split('/').map(function(key) {
        return key[0] === '_' && args[i] ? args[i++] : key
      }).join('/')
    }
    return result.replace('index.html', '')
  }
}

/** Get language from path  */
i18n.getLang = function(path, m) {
  if (m = path.match(/^\/([a-z]{2})\//)) {
    return m[1]
  }
}

module.exports = i18n
