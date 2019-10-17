const { h } = require('../../index.js')

module.exports = {
  layout: 'default',
  title: 'home',
  render: async function ($) {
    const name = $.req.cookie('name') || ''
    return [
      h('h1', name ? 'hello: ' + name : 'hello'),
      h('label', 'What is your name?', {},
        h('input', null, { value: name, onkeyup: 'update(this)' })
      ),
      h('p', 'this is your shiny new blazing fast ', {}, [
        h('a', 'presang app!', { target: '_blank', href: 'https://github.com/fugroup/presang' })
      ]),
      h('script', function update(el) {
        if (el.value) {
          q('h1').textContent = 'hello: ' + el.value
          cookie('name', el.value)
        } else {
          q('h1').textContent = 'hello'
        }
      })
    ]
  }
}
