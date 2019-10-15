const loader = require('conficurse')
const Sirloin = require('sirloin')
const request = require('./request.js')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

const app = {
  layouts: loader.load('app/layouts') || {},
  pages: loader.load('app/pages') || {}
}

module.exports = function (options = {}) {
  const server = new Sirloin({ port: 5000, files: 'app/assets', ...options })
  server.get('*', request(app))
}
