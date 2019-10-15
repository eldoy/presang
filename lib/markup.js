const pretty = require('pretty')

module.exports = async function (pathname, route = {}) {
  if (pathname === '/') pathname = '/home.html'
  if (!(/\.html$/).test(pathname)) return
  const [name, ext] = pathname.slice(1).split('.')
  const page = route.page = route.app.pages[name]
  if (page) {
    const layout = page.layout !== false
      ? route.app.layouts[page.layout || 'default']
      : null
    let html = layout ? await layout(route) : await page(route)
    if (process.env.NODE_ENV === 'dev') html = pretty(html)
    return html
  }
}