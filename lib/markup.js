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
    $.page = _.get($.app.pages || {}, name.replace('/', '.'))
    if ($.page) {
      const layout = ($.page.layout === false || options.layout === false)
        ? null
        : ($.app.pages.layouts || $.app.layouts)[$.page.layout || 'default']
      $.page.content = await $.page.render($)
      if (Array.isArray($.page.content)) {
        $.page.content = $.page.content.join('')
      }
      if (layout) $.page.content = await layout($)
      if (process.env.NODE_ENV === 'dev') {
        $.page.content = pretty($.page.content)
        console.log($.page.content)
      }
      if ($.page.content) res.setHeader('content-type', 'text/html')
      return $.page.content
    }
  }
}
