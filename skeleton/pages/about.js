const { h } = require('presang')

module.exports = {
  layout: 'default',
  title: 'about',
  render: async function ($) {
    return [
      h('h1', 'about'),
      h('p', 'it is ultra light weight and extremely easy to use. ready to code?'),
      $.req.query.status === 'redirected'
        ? h(`div`, `<strong>You've been redirected!</strong>`)
        : ''
    ]
  }
}
