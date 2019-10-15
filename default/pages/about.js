var { h } = require('../../main.js')

module.exports = {
  layout: 'default',
  title: 'About',
  init: async function () {
    return [
      h('h1', 'About'),
      h('p', 'This application is ultra light weight and does SSR!'),
    ]
  }
}
