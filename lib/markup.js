const _ = require('lodash')
const pretty = require('pretty')

module.exports = function(req, res, options = {}) {
  let path = req.pathname === '/' ? '/index.html' : req.pathname
  if (options.routemap && options.routemap[path]) {
    path = options.routemap[path]
  }
  return async function($) {
    if (!(/\.html$/).test(path)) return
    const [name, ext] = path.slice(1).split('.')
    const page = _.get($.app.pages || {}, name.replace('/', '.'))
    if (page) {
      $.page = {}
      $.page.content = await page($)
      if (Array.isArray($.page.content)) {
        $.page.content = $.page.content.join('')
      }
      const layout = ($.page.layout === false || options.layout === false)
        ? null
        : ($.app.pages.layouts || $.app.layouts)[$.page.layout || 'default']
      if (layout) $.page.content = await layout($)
      if (options.pretty) {
        $.page.content = pretty($.page.content)
      }
      if (options.print) {
        console.log($.page.content)
      }
      if ($.page.content) res.setHeader('content-type', 'text/html')
      return $.page.content
    }
  }
}
