const pretty = require('pretty')

module.exports = function (app ) {
  return async function (req, res) {
    const pathname = req.pathname === '/' ? '/home.html' : req.pathname
    if (!(/\.html$/).test(pathname)) return
    res.setHeader('content-type', 'text/html')
    const [name, ext] = pathname.slice(1).split('.')
    const page = app.pages[name]
    if (page) {
      const layout = app.layouts[page.layout || 'default']
      if (layout) {
        let html = await layout(page)
        if (process.env.NODE_ENV === 'dev') {
          html = pretty(html)
          console.log(html)
        }
        return html
      }
    }
  }
}