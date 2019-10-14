var { h } = require('../main.js')

module.exports = {
  title: 'About',
  render: async function () {
    return [
      h('h1', 'About'),
      h('p', 'We are making apps.')
    ]
  }
}
