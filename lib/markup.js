const pretty = require('pretty')

module.exports = function(req, res, options = {}) {
  let path = req.pathname
  if (path.endsWith('/')) path += 'index.html'
  if (options.routemap) {
    const route = options.routemap[path]
    if (route) {
      path = `/${route.page || route}.html`
    }
  }
  return async function($) {
    if (!(/\.html$/).test(path)) return
    const [name, ext] = path.slice(1).split('.')
    const dirs = name.split('/')
    let struct = $.app.pages, query = {}, page
    for (let i = 0; i < dirs.length; i++) {
      const key = dirs[i]
      // TODO: key with _
      let dir = struct[key]
      if (!dir) {
        const any = Object.keys(struct).find(k => k[0] === '_')
        if (any) {
          dir = struct[any]
        }
      }
      if (typeof dir === 'function') {
        page = dir
        break
      }
      struct = dir
    }
    if (page) {
      $.page = { name }
      $.page.content = await page($)
      if (Array.isArray($.page.content)) {
        $.page.content = $.page.content.join('')
      }

      if ($.page.layout || options.layout !== false) {
        const layout = ($.app.layouts || {})[$.page.layout || 'default']
        if (layout) {
          $.page.content = await layout($)
        }
      }

      if (options.compile) {
        const re = /\$.([a-zA-Z]+?)\((.+?)\)/
        let m
        while(m = re.exec($.page.content)) {
          if (m) {
            const args = m[2].split(',').map(x => x.trim().slice(1, -1))
            if (typeof $[m[1]] === 'function') {
              let result = $[m[1]](...args)
              if (typeof result === 'string') {
                result = "'" + result + "'"
              }
              $.page.content = $.page.content.replace(m[0], result)
            }
          }
        }
      }
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
