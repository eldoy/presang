const util = require('util')
const _ = require('lodash')

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
      return util.format(value, ...args)
    } catch (e) {
      return key
    }
  }
}

i18n.link = function(routes = {}) {
  return function(page, ...args) {
    const last = args.slice(-1)[0]
    const options = typeof last === 'object' ? last : {}
    let result = `/${page}.html`
    if (routes.routemap) {
      const entries = Object.entries(routes.routemap).filter(function([link, mapping]) {
        return mapping.page === page || mapping === page
      })
      if (entries.length) {
        // Find language match or return first
        const [link, mapping] = options.lang
          ? entries.find(([link, mapping]) => mapping.lang === options.lang)
          : entries[0]
        result = link
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

// Get language from path
i18n.getLang = function(path, m) {
  if (m = path.match(/^\/([a-z]{2})\//)) {
    return m[1]
  }
}

module.exports = i18n
