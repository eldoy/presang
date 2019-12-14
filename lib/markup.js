const pretty = require('pretty')

module.exports = function(req, res, options = {}) {
  let path = req.pathname
  if (path.endsWith('/')) path += 'index.html'

  return async function($) {
    function getValue(obj, path) {
      const keys = path.split('/')
      for (let i = 0; i < keys.length; i++) {
        if (!(obj = obj[keys[i]])) return
      }
      return obj
    }
    if (!(/\.html$/).test(path)) return
    const [name, ext] = path.slice(1).split('.')
    const dirs = name.split('/')
    let pages = $.app.pages
    let query = {}
    let trail = []
    let page
    for (let i = 0; i < dirs.length; i++) {
      const key = dirs[i]
      let dir = pages[key]

      if (!dir) {
        const [any, value] = Object.entries(pages).find(([k, v]) => k[0] === '_') || []
        if (any) {
          dir = value
          query[any.slice(1)] = key
        }
        trail.push(any || key)

        // Check if we have mapping in routemap
        if (!dir && options.routemap) {
          const mapping = options.routemap[`/${trail.join('/')}.html`]
          if (mapping) {
            dir = getValue($.app.pages, mapping.page || mapping)
          }
        }
      }

      if (dir) {
        if (typeof dir === 'function') {
          page = dir
          break
        } else {
          pages = dir
        }
      }
    }

    for (const key in query) {
      req.query[key] = query[key]
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
