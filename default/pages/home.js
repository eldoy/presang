var { h } = require('../../main.js')

module.exports = {
  layout: 'default',
  title: 'Home',
  init: async function () {
    return [
      h('h1', 'Home'),
      h('p', 'This is your shiny new blazing fast ', {}, [
        h('a', 'Presang app!', { target: '_blank', href: 'https://github.com/fugroup/presang' })
      ])
    ]
  }
}
