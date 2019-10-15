const { h } = require('presang')

module.exports = {
  layout: 'default',
  title: 'home',
  render: async function ($) {
    return [
      h('h1', 'home'),
      h('p', 'this is your shiny new blazing fast ', {}, [
        h('a', 'presang app!', { target: '_blank', href: 'https://github.com/fugroup/presang' })
      ])
    ]
  }
}
