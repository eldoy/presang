const cookie = require('wcookie').browser
const { q, qa, m } = require('haka')
const markup = require('./lib/markup.js')
const server = require('./lib/server.js')
module.exports = { q, qa, m, markup, server, cookie }
