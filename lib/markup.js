const pretty = require('pretty')

module.exports = async function (pathname, $ = {}, options = {}) {
  if (pathname === '/') pathname = '/home.html'
  if (!(/\.html$/).test(pathname)) return
  const [name, ext] = pathname.slice(1).split('.')
  $.page = $.app.pages[name]
  if ($.page) {
    const layout =
      ($.page.layout === false || options.layout === false)
        ? null
        : $.app.layouts[$.page.layout || 'default']
    $.page.content = await $.page.render($)
    if (Array.isArray($.page.content)) {
      $.page.content = $.page.content.join('')
    }
    if (layout) $.page.content = await layout($)
    if (process.env.NODE_ENV === 'dev') {
      $.page.content = pretty($.page.content)
    }
    return $.page.content
  }
}