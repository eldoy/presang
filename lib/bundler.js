const fs = require('fs')
const fspath = require('path')
const ASSET_DIR = fspath.join(process.cwd(), 'app', 'assets')

module.exports = function(name, config = {}) {
  const [base, ext] = name.split('.')
  return (config[ext] || []).map(function(file) {
    const path = fspath.join(ASSET_DIR, file)
    try {
      return fs.readFileSync(path, 'utf-8')
    } catch(e) {
      return ''
    }
  }).join('')
}
