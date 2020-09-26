const _ = require('lodash')
const loader = require('conficurse')
const sass = require('node-sass')
const fs = require('fs')

/** Load and configure app */
module.exports = async function(options = {}) {
  if (!options.path) options.path = process.env.WAVEORB_APP || 'app'
  const { path } = options
  const config = loader.load(`${path}/config`)
  const mail = loader.load(`${path}/mail`)
  const middleware = loader.load(`${path}/middleware`)
  const plugins = loader.load(`${path}/plugins`)

  let locales = loader.load(`${path}/locales`)
  locales = _.merge({}, options.locales, locales)

  const filters = loader.load(`${path}/filters`)
  const actions = loader.load(`${path}/actions`)
  const layouts = loader.load(`${path}/layouts`)
  const pages = loader.load(`${path}/pages`)
  const app = { config, mail, middleware, plugins, locales, filters, actions, layouts, pages }

  // Load plugins
  for (const key in plugins) {
    if (typeof plugins[key] === 'function') {
      await plugins[key](app)
    }
  }

  // Build scss
  const scss = loader.tree(`${path}/assets/css`).filter(file => file.endsWith('scss'))
  for (const file of scss) {
    const data = fs.readFileSync(file, 'utf8')
    const result = sass.renderSync({ data })
    const out = file.replace(/scss$/, 'css')
    fs.writeFileSync(out, result.css)
  }
  return app
}
