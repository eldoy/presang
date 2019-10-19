const pretty = require('pretty')

module.exports = function (req, res, options = {}) {
  const path = req.pathname === '/' ? '/home.html' : req.pathname
  return async function ($) {
    if (!(/\.html$/).test(path)) return
    const [name, ext] = path.slice(1).split('.')
    $.page = ($.app.pages || {})[name]
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
