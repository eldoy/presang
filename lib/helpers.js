const html = {
  js: name => `<script src="${name}"></script>`,
  css: name => `<link href="${name}" rel="stylesheet" type="text/css">`
}
module.exports = function(config = {}, options = {}) {
  function assets(names, mode) {
    return names.map(function(name) {
      if (name.endsWith(`bundle.${mode}`) && !options.bundle) {
        return config[mode].map(file => html[mode](file)).join('')
      }
      return html[mode](name)
    }).join('')
  }
  return {
    js: function(...names) {
      return assets(names, 'js')
    },
    css: function(...names) {
      return assets(names, 'css')
    }
  }
}
