const haka = require('haka')
const markup = require('./lib/markup.js')
const server = require('./lib/server.js')
module.exports = { markup, server, ...haka }
