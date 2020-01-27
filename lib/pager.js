const _ = require('lodash')

module.exports = function(name, $) {
  function pageLookup(name) {
    return _.get($, `app.pages.${name.split('/').join('.')}`)
  }
  let page
  const options = _.get($, 'app.config.routes') || {}

  // Try routemap first
  if (options.routemap) {
    const routeName = `/${name}.html`.replace('/index.html', '/')
    const mapping = options.routemap[routeName]
    if (mapping) {
      page = pageLookup(name)
    }
  }

  // Look for match on disk
  if (!page) {
    page = pageLookup(name)
  }

  // Assign name to function in $.page.name
  if (typeof page === 'function') {
    Object.defineProperty(page, 'pageName', { value: name })
  }
  return page
}
