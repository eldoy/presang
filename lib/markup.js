const pretty = require('pretty')

module.exports = function(req, res, options = {}) {
  let path = req.pathname
  if (path.endsWith('/')) path += 'index.html'

  return async function($) {
    if (!(/\.html$/).test(path)) return

    function getPage(name) {
      function getValue(obj, paths) {
        const keys = paths.split('/')
        for (let i = 0; i < keys.length; i++) {
          if (!(obj = obj[keys[i]])) return
        }
        return obj
      }
      // Look for match in pages
      let page = getValue($.app.pages, name)

      // Try to find match via routemap
      if (!page && options.routemap) {
        const routeName = `/${name}.html`.replace('index.html', '')
        const mapping = options.routemap[routeName]
        if (mapping) {
          name = mapping.page || mapping
          page = getValue($.app.pages, name)
        }
      }
      if (typeof page === 'function') {
        Object.defineProperty(page, 'pageName', { value: name })
      }
      return page
    }

    const [name, ext] = path.slice(1).split('.')

    let page = getPage(name)

    // Look for dynamic routes
    if (!page) {
      let pages = $.app.pages
      const dirs = name.split('/')
      const trail = []

      for (let i = 0; i < dirs.length; i++) {
        const key = dirs[i]
        const [any, value] = Object.entries(pages).find(([k, v]) => k[0] === '_') || []
        if (any) {
          req.query[any.slice(1)] = key
        }
        trail.push(any || key)
        if (!(pages = pages[any])) {
          break
        }
      }
      page = getPage(trail.join('/'))
    }

    if (page) {
      $.page = { name: page.pageName }
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

      if (options.compile !== false) {
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

      if ($.page.content) {
        res.setHeader('content-type', 'text/html')
      }

      return $.page.content
    }
  }
}
