const cookie = require('wcookie').browser
const { q, qa } = require('./lib/query.js')
const markup = require('./lib/markup.js')
const server = require('./lib/server.js')
module.exports = { q, qa, markup, server, cookie }
