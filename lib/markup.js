const pretty = require('pretty')

module.exports = async function (pathname, $ = {}) {
  if (pathname === '/') pathname = '/home.html'
  if (!(/\.html$/).test(pathname)) return
  const [name, ext] = pathname.slice(1).split('.')
  $.page = $.app.pages[name]
  if ($.page) {
    const layout = $.page.layout !== false
      ? $.app.layouts[$.page.layout || 'default']
      : null
    let html = $.page.content = await $.page.render($)
    if (layout) html = await layout($)
    if (process.env.NODE_ENV === 'dev') html = pretty(html)
    return html
  }
}